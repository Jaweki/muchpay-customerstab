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
  }

  export type OrderData = {
    order: FoodOrdered[],
    customer: {
        contact: string;
        regNo: string;
    }
  }