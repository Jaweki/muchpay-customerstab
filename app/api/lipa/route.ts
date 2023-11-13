import { ConfirmDataProps, OrderData } from "@/utils/Interface";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest, res: NextResponse) => {
    const incomingRequest = await req.json() || null;
    const mpesa_api_callback = incomingRequest.Body.stkCallback || null;

    console.log('\n\n', incomingRequest || mpesa_api_callback);

    if (incomingRequest.order && incomingRequest.customer) {
        const response = await client_payment_request(incomingRequest);
        return response;
    } else if (mpesa_api_callback) {
        const response = await mpesa_api_callback_endpoint(mpesa_api_callback);
        return response;
    }
    
}

async function mpesa_api_callback_endpoint(mpesa_api_callback: any) {
    try {
        if (mpesa_api_callback.ResultDesc.includes('successfully')) {
            const mpesa_refNo = mpesa_api_callback.CallbackMetadata.Item.find((item: any) => item.Name === 'MpesaReceiptNumber');
            
            const response: ConfirmDataProps = {
                message: mpesa_api_callback.ResultDesc,
                receipt_no: timeStamp(),
                mpesa_refNo
            }

            return new NextResponse(JSON.stringify(response), { status: 201});
        } else if (mpesa_api_callback.ResultDesc.includes('cancelled') || mpesa_api_callback.ResultDesc.includes('insufficient') || mpesa_api_callback.ResultDesc.includes('timeout')) {
            const response: ConfirmDataProps = {
                message: mpesa_api_callback.ResultDesc,
            }
            return new NextResponse(JSON.stringify({ response }), { status: 201 });
        } else if (mpesa_api_callback.ResultDesc.includes('invalid')) {
            const response: ConfirmDataProps = {
                message: "M-pesa claims invalid pin. Transaction Cancelled!",
            }
            return new NextResponse(JSON.stringify({ response }), { status: 201 });
        } else {
            throw new Error("Error. Undefined callback request from mpesa...");
        }
    } catch (error) {
        console.log("Error at lipa endpoint during callback: ", error);
        return new NextResponse(JSON.stringify({ error: `${error}` }), { status: 500});
    }
}

async function client_payment_request(incomingRequest: any) {
    try {
        const {order, customer}: OrderData = incomingRequest;

        let total_bill = 0;
        order.forEach((food) => {
            total_bill += food.price;
        })

        const mpesaNumber = editMpesaNumber(customer.contact);

        if (!mpesaNumber) {
            return new NextResponse(JSON.stringify({ error: "Invalid Mpesa Number"}), { status: 400});
        }

        const BSshortcode = 174379;

        const mpesa_api_response: any = await requestMpesaPayment(BSshortcode, mpesaNumber, total_bill);

        if (mpesa_api_response.ResponseDescription.toLowerCase().includes("success")) {
            console.log("Payment Via Mpesa, Request accepted for processing... await confirmation.");
        } else if (mpesa_api_response.payload_error) {
            return new NextResponse(JSON.stringify({ error: mpesa_api_response.payload_error}));
        } else {
            return new NextResponse(JSON.stringify({ error: "Mpesa service unavailable..."}), { status: 503 });
        }


    } catch (error) {
        console.log("Error at lipa endpoint: ", error);
        return new NextResponse(JSON.stringify({ error: "Internal server error..." }), { status: 500});
    }
}


function editMpesaNumber(contact: string) {
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

function timeStamp() {
    const time_today = new Date();

    return `${time_today.getFullYear()}${time_today.getMonth()+1}${time_today.getDate()}${time_today.getHours()}${time_today.getMinutes()}${time_today.getSeconds()}`
}

function encodePassword(BSshortcode: number, passKey: string, timeStamp: string) {
   return Buffer.from(`${BSshortcode}${passKey}${timeStamp}`).toString('base64');
}

async function gen_access_token() {
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

async function requestMpesaPayment(BSshortcode: number ,phoneNumber: string, amount: number) {
    
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
            "CallBackURL": "https://munchpay-customerstab.jaweki.com/api/lipa",
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

        return await response.data;

    } catch (error: any) {
        console.log("Error at lipa endpoint, in requestMpesaPayment(): ", error.response);
        console.log("Error message: ", error.message);
        if (error.response) {
            // If the error has a response property
            const error_message = error.response.data.errorMessage;

            return { payload_error: error_message }
        } else {
            return null;
        }
    }
    
}