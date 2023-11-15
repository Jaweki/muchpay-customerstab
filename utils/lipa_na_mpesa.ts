import axios from "axios";
import { MPESA_CALLBACK_DOCS_STORE_TYPE, MpesaAcceptedPendingCallbackType } from "./Interface";
import { redis } from "./redis_config";

export function editMpesaNumber(contact: string) {

    if (contact.startsWith("+254")) {
        return contact.substring(1);
    } else if (contact.startsWith("254")) {
        return contact;
    } else if (contact.startsWith("07") || contact.startsWith("01")) {
        return "254" + contact.substring(1);
    } else {
        return null;
    }
}

export function timeStamp() {
    const time_today = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);

    return time_today
}

function encodePassword(BSshortcode: number, passKey: string, timeStamp: string) {
   return Buffer.from(`${BSshortcode}${passKey}${timeStamp}`).toString('base64');
}

export async function gen_access_token() {
    try {

        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        const customer_secret = process.env.CUSTOMER_SECRET;
        const customer_key = process.env.CUSTOMER_KEY;
        const base64_credentials = Buffer.from(`${customer_key}:${customer_secret}`).toString('base64');

        const config = {
            headers: {
                'Authorization': `Basic ${base64_credentials}`
            } 
        }
        const response = await axios.get(url, config);

        return response.data.access_token;
        
    } catch (error) {
        console.log("Error at lipa endpoint, in the get Access token function: ", error);
        return null;
    }
    
}

const MPESA_CALLBACK_DOCS_STORE: MPESA_CALLBACK_DOCS_STORE_TYPE[] = [];
export async function requestMpesaPayment(BSshortcode: number ,phoneNumber: string, amount: number, retries = 2) {

    try {
        const passKey = process.env.MPESA_PASSKEY;
        const time_stamp = timeStamp();
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        
        const payload = {
            "BusinessShortCode": BSshortcode,
            "Password": encodePassword(BSshortcode, `${passKey}`, time_stamp),
            "Timestamp": time_stamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": +phoneNumber,
            "PartyB": BSshortcode,
            "PhoneNumber": +phoneNumber,
            "CallBackURL": "https://muchpay-v2-jaweki-dev.vercel.app/api/callback",
            "AccountReference": "Munch_Pay",
            "TransactionDesc": "Food Order" 
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await gen_access_token()}`
            }
        }

        const response = await axios.post(url, payload, config)

        const { MerchantRequestID, CheckoutRequestID} = await response.data as MpesaAcceptedPendingCallbackType;

        console.log({"M_ID": MerchantRequestID, "CH_ID":CheckoutRequestID });
        const timeout = 40; // seconds
        const startTime = Date.now();
        let matchedTransaction = {} as MPESA_CALLBACK_DOCS_STORE_TYPE;
        while(Date.now() - startTime < timeout * 1000) {
            // if (await redis.exists(`${MerchantRequestID}-${CheckoutRequestID}`)) {
            //     const data: any = await redis.get(`${MerchantRequestID}-${CheckoutRequestID}`)
            //     matchedTransaction = JSON.parse(data);
            //     break;
            // }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        console.log("After transaction doc: ", matchedTransaction);
        
        if (matchedTransaction.CallbackMetadata) {
            return {
                status: 'success',
                resultData: matchedTransaction,
            }
        } else if (!matchedTransaction.CallbackMetadata) {
            throw new Error(JSON.stringify({
                status: 'error',
                messsage: matchedTransaction.ResultDesc,
                code: 400,
            }));
        } else {
            throw new Error("Internal system error!");
        }
    } catch (error: any) {
        // If error is from within mpesa API:
        console.log("Error at requestMpesaPayment() axios post: ", error.response.data);
        // Other kinds of errors:
        console.log("Error message: ", error.message);

        if (error.response) {
            // If the error has a response property
            const error_message = error.response.data.errorMessage;

            const response: any =  { 
                status: 'error',
                message: error_message,
                code: 400
            }
            throw new Error(response);
        } else if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            return requestMpesaPayment(BSshortcode, phoneNumber, amount, retries - 1);
        } else {
            const response: any =  { 
                status: 'error',
                message: error.message,
                code: 400
            }
            throw new Error(response);
        }
    }
    
}



export async function mpesa_api_callback_endpoint(mpesa_api_callback: MPESA_CALLBACK_DOCS_STORE_TYPE) {
    
    const data_key = `${mpesa_api_callback.MerchantRequestID}-${mpesa_api_callback.CheckoutRequestID}` as string;
    if (mpesa_api_callback.ResultCode === 0) {
        // now send a success confirmation to the meals customer...
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
            CallbackMetadata: mpesa_api_callback.CallbackMetadata
        }

        const data_value = JSON.stringify(closedTransacrionDoc);
        await redis.set(data_key, data_value );
    } else if (mpesa_api_callback.ResultCode === 1037) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "Mpesa cannot reach given mpesa pay number",
        }

        // const data_value = JSON.stringify(closedTransacrionDoc);
        // await redis.set(data_key, data_value );
    } else if (mpesa_api_callback.ResultCode === 1001) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "a transaction is already in process for the current subscriber. Wait for 2-3 minutes try again",
        }

        // const data_value = JSON.stringify(closedTransacrionDoc);
        // await redis.set(data_key, data_value );
    } else if (mpesa_api_callback.ResultCode === 1032) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "stk-push cancelled. Transaction failed",
        }

        // const data_value = JSON.stringify(closedTransacrionDoc);
        // await redis.set(data_key, data_value );
    } else if (mpesa_api_callback.ResultCode === 1025 || mpesa_api_callback.ResultCode === 1019 || mpesa_api_callback.ResultCode === 9999 || mpesa_api_callback.ResultCode === 1 || mpesa_api_callback.ResultCode === 2001 ) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
        }

        // const data_value = JSON.stringify(closedTransacrionDoc);
        // await redis.set(data_key, data_value );
    } else {
        throw new Error(`Unhandles error: ${JSON.stringify(mpesa_api_callback)}`);
    }
    await redis.expire(data_key, 60);
}