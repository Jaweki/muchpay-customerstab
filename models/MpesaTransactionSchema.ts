import { Schema, model, models } from "mongoose";

const MpesaTransactionSchema = new Schema({
    mpesaTransactionId: {
        type: 'string',
        required: [true, 'mpesa_transaction_Id is required to save the mpesaTransaction Doc in db']
    },
    date: {
        type: Date,
        required: [true, 'Date is required to save the mpesaTransaction Doc in db']
    },
    amount: {
        type: 'number',
        required: [true, 'Amount is required to save the mpesaTransaction Doc in db']
    },
    phoneNumber: {
        type: 'string',
        required: [true, 'PhoneNumber is required to save the mpesaTransaction Doc in db']
    },
});

const MpesaTransaction = models.MpesaTransaction || model('MpesaTransaction', MpesaTransactionSchema, 'completed_mpesa_transactions');

export default MpesaTransaction;