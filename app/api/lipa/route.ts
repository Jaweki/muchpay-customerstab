import { ConfirmDataProps, MPESA_CALLBACK_DOCS_STORE_TYPE, OrderData } from "@/utils/Interface";
import { editMpesaNumber, requestMpesaPayment, timeStamp } from "@/utils/lipa_na_mpesa";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;
type MpesaApiResponseType = {
    status: string,
    resultData: MPESA_CALLBACK_DOCS_STORE_TYPE;
}

export const POST = async (req: NextRequest, res: NextResponse) => {

    try {
        const {order, customer}: OrderData = await req.json();

        let total_bill = 0;
        order.forEach((food) => {
            total_bill += food.price;
        })

        const mpesaNumber = editMpesaNumber(customer.contact);

        if (!mpesaNumber) {
            const response: any = {
                status: "error",
                message: "Invalid Mpesa Number",
                code: 400
            }
            throw new Error(response);
        }

        const BSshortcode = 174379;

        const mpesa_api_response: MpesaApiResponseType = await requestMpesaPayment(BSshortcode, mpesaNumber, total_bill);

        // const payload: ConfirmDataProps = {
        //     message: mpesa_api_response.resultData.ResultDesc,
        //     receipt_no: mpesa_api_response.resultData.MerchantRequestID,
        //     mpesa_refNo: mpesa_api_response.resultData.CallbackMetadata?.mpesaReceiptNumber
        // }
        return new NextResponse(JSON.stringify({ success: mpesa_api_response }), { status: 201});

    } catch (error: any) {

        console.log("Error at lipa endpoint: ", error);
        if (error.status === "error") {
            return new NextResponse(JSON.stringify({ fail_message: `${error.message}` }), { status: error.code });
        } else {
            return new NextResponse(JSON.stringify({ fail_message: "internal Server Error. Contact developer for technical support" }), { status: 500 });
        }
    }
        
    
}


