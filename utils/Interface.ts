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