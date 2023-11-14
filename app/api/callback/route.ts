import { MPESA_CALLBACK_DOCS_STORE_TYPE } from "@/utils/Interface";
import { mpesa_api_callback_endpoint } from "@/utils/lipa_na_mpesa";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextApiResponse) => {
    try {
        const incomingRequest = await req.json();
        const mpesa_api_callback: MPESA_CALLBACK_DOCS_STORE_TYPE = incomingRequest?.Body?.stkCallback
        await mpesa_api_callback_endpoint(mpesa_api_callback);
        
        res.status(200).send("");
    } catch (error) {
        console.log("Error at callback url: ", error);
        res.status(200).send("");
    }
}

