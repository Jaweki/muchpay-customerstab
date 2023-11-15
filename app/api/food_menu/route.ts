import { NextResponse } from "next/server";

export const GET = ():NextResponse => {

    const foodMenuList = [
        { id: 1, name: "Food1", price: 1, vat: 1 },
        { id: 2, name: "Food2", price: 2, vat: 2 },
        { id: 3, name: "Food3", price: 3, vat: 3 },
        { id: 4, name: "Food4", price: 4, vat: 4 },
        { id: 5, name: "Food5", price: 5, vat: 5 },
        { id: 6, name: "Food6", price: 6, vat: 6 },
        { id: 7, name: "Food7", price: 7, vat: 7 },
    ];

    return NextResponse.json(foodMenuList);
}