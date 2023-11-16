import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import MenuSchema from "@/models/MenuSchema";

export const GET = async (req: NextRequest, res: NextResponse) => {

    try {
        const isConnected = await connectToDB();

        if (!isConnected) {
            throw new Error("Failed to connect to db...");
        }

        const menu = await MenuSchema.find({});

        return NextResponse.json(menu);
    } catch (error) {
        console.log("Error in the fetch food_menu Endpoint: ", error);
        return new NextResponse(JSON.stringify([]), { status: 500});
    }
    
}