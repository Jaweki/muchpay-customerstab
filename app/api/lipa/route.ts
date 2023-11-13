import { ConfirmDataProps, OrderData } from "@/utils/Interface";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const {order, customer}: OrderData = await req.json();

        let total_bill = 0;
        order.forEach((food) => {
            total_bill += food.price;
        })

        const mpesaNumber = editMpesaNumber(customer.contact);

        if (!mpesaNumber) {
            throw new Error("Invalid Mpesa Number");
        }

        console.log(timeStamp());

        const BSshortcode = 174379;

        const payment_request = await requestMpesaPayment(BSshortcode, mpesaNumber, total_bill);

        console.log(payment_request);


        const response: ConfirmDataProps = {
            message: "Success",
            receipt_no: "#SampleReceipt...",
            mpesa_refNo: "#SampleRefno..."
        }

        return new NextResponse(JSON.stringify(response), { status: 201});
    } catch (error) {
        console.log(error);
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
        return null;
    }
    
}