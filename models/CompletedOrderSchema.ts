import { Schema, model, models } from "mongoose";

const CompletedOrderSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'Date is required to save CompletedOrder to db.']
    },
    posTerminal: {
        type: 'string',
        required: [true, 'posTerminal is required to save CompletedOrder to db.']
    },
    orderReceipt: {
        type: 'string',
        required: [true, 'orderReceipt is required to save CompletedOrder to db.']
    },
    foodOrder: {
        type: Array<'string'>,
        required: [true, 'foodOrder is required to save CompletedOrder to db.']
    },
    mpesaTransactionId: {
        type: 'string',
        required: [true, 'mpesaTransactionId is required to save CompletedOrder to db.']
    },
    
})

const CompleteOrder = models.CompleteOrder || model('CompleteOrder', CompletedOrderSchema, 'completed_orders');

export default CompleteOrder;