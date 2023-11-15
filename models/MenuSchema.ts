import { Schema, model, models } from "mongoose";

const NewMenuSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    qty: {
        type: Number
    },
    price: {
        type: Number
    },
});

const MenuSchema = models.MenuSchema || model('MenuSchema', NewMenuSchema, 'dekut_mess_menu');

export default MenuSchema;