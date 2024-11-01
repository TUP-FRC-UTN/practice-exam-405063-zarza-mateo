import { productComponent } from "./product";

export class orderClass{
    id! : number;
    customerName! : string;
    email! : string;
    products! : productComponent[];
    total! : number;
    orderCode! : string;
    timestamp! : Date;
}