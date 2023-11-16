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
            "CallBackURL": "https://muchpay-customerstab.vercel.app/api/callback",
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
        const startTime = Date.now();
        const timeout = Date.now() - startTime < 40 * 1000;
        let matchedTransaction = {} as any;
        while(timeout) {
            await redis.get(`${MerchantRequestID}-${CheckoutRequestID}`).then(
                data => {
                    if (data !== null) {
                        matchedTransaction = data as MPESA_CALLBACK_DOCS_STORE_TYPE;
                    }
                }
            )
            if (Object.keys(matchedTransaction).length > 0) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        if (matchedTransaction.CallbackMetadata && Object.keys(matchedTransaction.CallbackMetadata).length > 0) {
            let amount;
            let mpesaReceiptNumber;
            let phoneNumber;
            let transactionDate;
            matchedTransaction.CallbackMetadata.Item.forEach(
                (obj: any) => { 
                    if (obj.Name === "Amount") { amount = obj.Value } 
                    if (obj.Name === "MpesaReceiptNumber") { mpesaReceiptNumber = obj.Value }
                    if (obj.Name === "PhoneNumber") { phoneNumber = obj.Value }
                    if (obj.Name === "TransactionDate") { transactionDate = obj.Value }
                }
            );

            const payload = {...matchedTransaction, CallbackMetadata: {
                amount, mpesaReceiptNumber, phoneNumber, transactionDate,
            } } as MPESA_CALLBACK_DOCS_STORE_TYPE

            return {
                status: 'success',
                resultData: payload,
            }
        } else if (Object.keys(matchedTransaction).find(key => key !== 'CallbackMetadata')) {
            const response: any =  {
                status: 'error',
                error_message: `${matchedTransaction.ResultDesc}`,
                error_code: 400,
            }
            console.log("error response: ", response);
            return response;
        } else if (Object.keys(matchedTransaction).length <= 0) {
            const response: any =  {
                status: 'error',
                error_message: "System timeout. If you have paid, report to the manager.",
                error_code: 400,
            }
            console.log("error response: ", response);
            return response;
        }
    } catch (error: any) {
        console.log("Caught Error: ", error.message);

        if (error.response) {
            // If error is from within mpesa API:
            console.log("Error at requestMpesaPayment() axios post: ", error.response.data);
            // If the error has a response property
            const error_message = error.response.data.errorMessage;
            
            const response: any =  { 
                status: 'error',
                error_message,
                error_code: 400
            }
            return response;
        } else if (retries > 0) {
            console.log("Retring...");
            // posiblly not connected to internet or network
            await new Promise(resolve => setTimeout(resolve, 10000));
            return requestMpesaPayment(BSshortcode, phoneNumber, amount, retries - 1);
        } else {
            const response: any =  { 
                status: 'error',
                error_message: "internal Server Error!",
                error_code: 400
            }
            return response;
        }
    }
    
}



export async function mpesa_api_callback_endpoint(mpesa_api_callback: MPESA_CALLBACK_DOCS_STORE_TYPE) {
    
    const data_key = `${mpesa_api_callback.MerchantRequestID}-${mpesa_api_callback.CheckoutRequestID}`;
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
            ResultDesc: "Mpesa cannot reach given mpesa-pay number",
        }

        const data_value = JSON.stringify(closedTransacrionDoc);
        await redis.set(data_key, data_value );
    } else if (mpesa_api_callback.ResultCode === 1001) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "a transaction is already in process for the current subscriber. Wait for 2-3 minutes try again",
        }

        const data_value = JSON.stringify(closedTransacrionDoc);
        await redis.set(data_key, data_value );
    } else if (mpesa_api_callback.ResultCode === 1032) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "stk-push cancelled. Transaction failed",
        }

        const data_value = JSON.stringify(closedTransacrionDoc);
        await redis.set(data_key, data_value );
    } else if (mpesa_api_callback.ResultCode === 1025 || mpesa_api_callback.ResultCode === 1019 || mpesa_api_callback.ResultCode === 9999 || mpesa_api_callback.ResultCode === 1 || mpesa_api_callback.ResultCode === 2001 ) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
        }

        const data_value = JSON.stringify(closedTransacrionDoc);
        await redis.set(data_key, data_value );
    } else {
        throw new Error(`Unhandles error: ${JSON.stringify(mpesa_api_callback)}`);
    }
    await redis.expire(data_key, 60);
}