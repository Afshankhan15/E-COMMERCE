import { CartItem, ShippingInfo, User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
  error: string | null;
  count: number;
}

export interface CartReducerInitialState {
  loading: boolean;
  error: string | null;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
}

export interface OrderReducerInitialState {
  loading: boolean;
  error: string | null;
  orders: any[];
  order: any;
}

export interface CustomerReducerInitialState {
  customers: User[]; // ALL CUSTOMERS ARRAY
  selectedCustomer: User | null; // SINGLE CUSTOMER
  loading: boolean;
  error: string | null;
}