import axios from "axios";
import { ConfirmDataProps, MPESA_CALLBACK_DOCS_STORE_TYPE, MpesaAcceptedPendingCallbackType } from "./Interface";

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
            "CallBackURL": "https://munchpay-customerstab.jaweki.com/api/callback",
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

        let flag = true;
        let matchedTransaction: MPESA_CALLBACK_DOCS_STORE_TYPE | null= null;
        while(flag) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            MPESA_CALLBACK_DOCS_STORE.find(confirmDoc => {
                if(confirmDoc.MerchantRequestID === MerchantRequestID && confirmDoc.CheckoutRequestID === CheckoutRequestID) {
                    flag = false;
                    matchedTransaction = confirmDoc;
                }
            });
        }
        
        if (matchedTransaction) {
            return {
                status: 'success',
                resultData: matchedTransaction,
            }
        } else {
            throw new Error("Internal server error!");
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
        } else {
            
            if (retries > 0) {
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
    
}



export async function mpesa_api_callback_endpoint(mpesa_api_callback: MPESA_CALLBACK_DOCS_STORE_TYPE) {
    if (mpesa_api_callback.ResultCode === 0) {
        // now send a success confirmation to the meals customer...
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
            CallbackMetadata: mpesa_api_callback.CallbackMetadata
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 1037) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "Mpesa cannot reach given mpesa pay number",
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 1025) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 9999) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 1032) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "stk-push cancelled. Transaction failed",
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 1) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 2001) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 1019) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: mpesa_api_callback.ResultDesc,
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    } else if (mpesa_api_callback.ResultCode === 1001) {
        const closedTransacrionDoc: MPESA_CALLBACK_DOCS_STORE_TYPE = {
            MerchantRequestID: mpesa_api_callback.MerchantRequestID,
            CheckoutRequestID: mpesa_api_callback.CheckoutRequestID,
            ResultDesc: "a transaction is already in process for the current subscriber. Wait for 2-3 minutes try again",
        }

        MPESA_CALLBACK_DOCS_STORE.push(closedTransacrionDoc);
    }
}