import { ConfirmDataProps, MPESA_CALLBACK_DOCS_STORE_TYPE, OrderData } from "@/utils/Interface";
import { editMpesaNumber, requestMpesaPayment} from "@/utils/lipa_na_mpesa";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;
type MpesaApiResponseType = {
    status: string,
    resultData?: MPESA_CALLBACK_DOCS_STORE_TYPE;
    error_message?: string;
    error_code?: number;
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
                error_message: "Invalid Mpesa Number",
                error_code: 400
            }
            throw new Error(response);
        }

        const BSshortcode = 174379;

        const mpesa_api_response: MpesaApiResponseType = await requestMpesaPayment(BSshortcode, mpesaNumber, total_bill);

        if (mpesa_api_response.error_message && mpesa_api_response.status === 'error') {
            const payload: ConfirmDataProps = {
                message: mpesa_api_response.error_message,
                error_code: mpesa_api_response.error_code
            }
            return new NextResponse(JSON.stringify({ fail_message: payload }), { status: 200});
        }


        

        const payload: ConfirmDataProps = {
            message: mpesa_api_response.resultData?.ResultDesc ?? "Transaction Successfull",
            receipt_no: mpesa_api_response.resultData?.MerchantRequestID,
            mpesa_refNo: mpesa_api_response?.resultData?.CallbackMetadata?.mpesaReceiptNumber
        }
        return new NextResponse(JSON.stringify({ success: payload }), { status: 201});

    } catch (error: any) {
        return new NextResponse("Internal System Error!", { status : 500});
    }
        
    
}


