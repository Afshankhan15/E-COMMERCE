import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
  loading: false,
  error: null,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
};





export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      console.log("cart----->",action.payload )
      state.loading = true;
      const idx = state.cartItems.findIndex(
        // (item) => item._id === action.payload._id
        (item) => item.productId === action.payload.productId
      );
      if (idx !== -1) {
        console.log("yes")
        // If the item already exists, increment the quantity
        // action.payload.quantity --> for increment/ decrement add to cart handler
        state.cartItems[idx].quantity = action.payload.quantity
          ? action.payload.quantity
          : state.cartItems[idx].quantity + 1;
      } else {
        console.log("yes 2345", action.payload)
        // If the item does not exist, add it to the cart
        // state.cartItems.push(action.payload);
        // intitaill quantity = 1 when user added the product to cart
        state.cartItems.push({ ...action.payload, quantity: 1 });


        // state.cartItems = [...state.cartItems, { ...action.payload, quantity: 1 }];

      }
      state.loading = false;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const id = state.cartItems.findIndex(
        // (item) => item._id === action.payload
        (item) => item.productId === action.payload
      );
      if (id !== -1) {
        state.cartItems.splice(id, 1);
      }
    },
    calculateTotal: (state) => {
      //   const arr= [
      //     {
      //         "_id": "676c4a548610456126b5ee28",
      //         "name": "afshu",
      //         "photo": "uploads\\78aa404f-ec1f-424f-b3ee-f2b378093418.jpg",
      //         "price": 10,
      //         "stock": 7,
      //         "category": "bag",
      //         "createdAt": "2024-12-25T18:09:24.498Z",
      //         "updatedAt": "2024-12-25T18:09:24.498Z",
      //         "__v": 0,
      //         "quantity": 9
      //     },
      //     {
      //         "_id": "676c4a548610456126b5ee28",
      //         "name": "window",
      //         "photo": "uploads\\78aa404f-ec1f-424f-b3ee-f2b378093418.jpg",
      //         "price": 5,
      //         "stock": 7,
      //         "category": "bag",
      //         "createdAt": "2024-12-25T18:09:24.498Z",
      //         "updatedAt": "2024-12-25T18:09:24.498Z",
      //         "__v": 0,
      //         "quantity": 6
      //     }
      // ]
      
      // BOTH FOR LOOP AND REDUCE METHOD DID SAME JOB BUT REDUCE METHOD IS MORE EFFICIENT
      // for(let i=0; i<arr.length; i++) {
      //   sum += arr[i].price * arr[i].quantity;
      // }
      // const sum = arr.reduce((prev, curr) => prev + curr.price * curr.quantity,0);

      // basicall we target allCarts that's wht we did allcarts.cartItems(state.cartItems)
      const subtotal = state.cartItems.reduce((prev, curr) => prev + curr.price*curr.quantity, 0);

      state.subtotal = subtotal;
      state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
      state.tax = Math.round(state.subtotal * 0.18); // 18%
      // state.discount = state.subtotal > 5000 ? 1000 : 0;
      state.total = state.subtotal + state.shippingCharges + state.tax - state.discount;
    },
    calculateDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,
  },
});

export const { addToCart, removeFromCart, calculateTotal, calculateDiscount, saveShippingInfo, resetCart } = cartReducer.actions;
