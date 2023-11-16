import mongoose from "mongoose";
import { CallbackMetadataType, FoodOrdered,  } from "./Interface";
import CompleteOrder from "@/models/CompletedOrderSchema";
import MpesaTransaction from "@/models/MpesaTransactionSchema";

let isConnected = false;

export const connectToDB = async (retries = 2): Promise<any> => {

    if (isConnected) {
        console.log('MongoDB is aready connected');
        return true;
    }

    try {
        const uri = process.env.MONGODB_URI as string;
        const options = {
            dbName: "dekut_meals",
        }
        const connected = await mongoose.connect(uri, options);

        if (connected.connection.readyState === 1) {
            console.log("Connected to MongoDB");
            isConnected = true;
            return true;
        } else if (retries > 0) {
            console.log("Failed to connect to MongoDB");
            await new Promise(resolve => setTimeout(resolve, 3000));
            return await connectToDB(retries - 1);
        } else {
            throw new Error('Failed to connect to MongoDB');
        }

    } catch (error) {
        console.log("Failed to connect to MongoDB: ", error)
        return false;
    }
}

export const writeDetailsOfCompleteOrderToDB = async (order: FoodOrdered[], customer: CallbackMetadataType, receipt_no: string) => {
    console.log("Receipt No: ", receipt_no);
    console.log("customer Obj: ", customer);
    try {
        const foodOrders = order.map(obj => {
            return `${obj.qty}x ${obj.foodName}`
        })
        const isConnected = await connectToDB();
        const session = await mongoose.startSession();

        if (!isConnected) {
            throw new Error("Failed to connect to db...");
        }

        try {
            console.log("Starting transaction writing...");
            await session.withTransaction(async () => {
                await CompleteOrder.create([{
                date: new Date(),
                posTerminal: "DKUT_MESS-POS1",
                orderReceipt: receipt_no,
                foodOrder: foodOrders,
                mpesaTransactionId: customer.mpesaReceiptNumber,
            }], { session })

            await MpesaTransaction.create([{
                mpesaTransactionId: customer.mpesaReceiptNumber,
                date: new Date(),
                amount: customer.amount,
                phoneNumber: customer.phoneNumber,
            }], { session })

            })

            
            await session.commitTransaction();
            console.log("Done writing order in db sucessfully.");
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
        
        return true;
    } catch (error) {
        console.log('Error while writing Complete order in DB: ', error);
        return false;
    }
}