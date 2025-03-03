export interface User {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
  }
  
  export interface Product {
    name: string;
    price: number;
    stock: number;
    category: string;
    photo: string;
    _id: string;
  }
  
  
  export type CartItem = {
    // _id: string;
    productId: string;
    name: string;
    photo: string;
    price: number;
    quantity: number;
    stock: number;
  }
  
  export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  }
  
  
  export type OrderItem = {
    _id: string;
    name: string;
    photo: string;
    price: number;
    quantity: number;
    // stock: number;
  }