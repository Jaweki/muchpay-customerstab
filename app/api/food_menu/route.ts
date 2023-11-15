import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDB";
import MenuSchema from "@/models/MenuSchema";

export const GET = async (req: NextRequest, res: NextResponse) => {

    try {
        const isConnected = await connectToDB();

        if (!isConnected) {
            throw new Error("Failed to connect to db...");
        }

        const menu = await MenuSchema.find({});
    
        if (!menu) {
            return NextResponse.json("Menu is not set");
        }

        return NextResponse.json(menu);
    } catch (error) {
        console.log("Error in the fetch food_menu Endpoint: ", error);
        return new NextResponse(JSON.stringify("System Error, Failed to fetch menu."), { status: 500});
    }
    
}