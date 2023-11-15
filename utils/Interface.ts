export interface FoodMenu {
    id: number;
    name: string;
    vat: number;
    price: number
}

export interface Checkbox {
    id: string;
    checked: boolean;
    type: string;
    name: string;
}

export interface CheckboxesProps {
    checkbox: Checkbox[];
}
export interface FoodOrdered {
    qty: number;
    foodName: string;
    price: number;
  }

  export interface ConfirmDataProps {
    message: string;
    mpesa_refNo?: string;
    receipt_no?: string;
    error_code?: number;
  }

  export type OrderData = {
    order: FoodOrdered[],
    customer: {
        contact: string;
        regNo: string;
    }
  }

  export type MpesaAcceptedPendingCallbackType = {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string | number;
   ResponseDescription: string;
   CustomerMessage: string;
  }

  export type MPESA_CALLBACK_DOCS_STORE_TYPE = {
    MerchantRequestID: string,          
    CheckoutRequestID: string,
    ResultDesc: string,    
    ResultCode?: number,
    CallbackMetadata?: {
      phoneNumber: string;
      transactionDate: Date;
      mpesaReceiptNumber: string;
      amount: number;
    }
  }