import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderReducerInitialState } from "../../types/reducer-types";
import axios from "axios";

const initialState: OrderReducerInitialState = {
  loading: false,
  error: null,
  // orders: [], // This will store an array of orders
  orders: [], // Stores multiple orders
  order: null, // Stores a single order
};

// CREATE (CART-PRODUCT) ORDER API
export const newOrder = createAsyncThunk(
  "order/newOrder",
  async (data: any, { rejectWithValue }) => {
    try {
      const {
        orderItems,
        shippingInfo,
        user,
        subtotal,
        tax,
        total,
        shippingCharges,
        discount,
      } = data;
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/order/new`,
        {
          orderItems,
          shippingInfo,
          user,
          subtotal,
          tax,
          total,
          shippingCharges,
          discount,
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// GET MY ORDER ONLY
export const myOrder = createAsyncThunk(
  "order/myOrder",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/order/my?id=${userId}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ALL USERS ORDER : ADMIN CAN SEE THIS TRANSACTION
export const allOrder = createAsyncThunk(
  "order/allOrder",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/order/all?id=${userId}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// GET SINGLE ORDER DETAIL USING ORDER ID
export const getSingleOrder = createAsyncThunk(
  "order/getSingleOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/order/${orderId}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// delete single order using order id
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  // async(orderId: string, userId: string, {rejectWithValue} ) => {
  async (
    { orderId, userId }: { orderId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/v1/order/${orderId}?id=${userId}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// PROCESS ORDER
export const processOrder = createAsyncThunk(
  "order/processOrder",
  // async(orderId: string, userId: string, {rejectWithValue} ) => {
  async (
    { orderId, userId }: { orderId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/v1/order/${orderId}?id=${userId}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// create payment -> it will return the client secret when we give total amount of product user want to order
export const createPayment = createAsyncThunk(
  "order/createPayment",
  async (amount: number, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/create`,
        {
          amount,
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const orderReducer = createSlice({
  name: "orderReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(newOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(newOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(newOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(myOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        myOrder.fulfilled,
        (state, action: PayloadAction<OrderReducerInitialState>) => {
          state.loading = false;
          state.orders = action.payload.orders; // Store the array of orders
        }
      )
      .addCase(myOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // all order
      .addCase(allOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        allOrder.fulfilled,
        (state, action: PayloadAction<OrderReducerInitialState>) => {
          state.loading = false;
          state.orders = action.payload.orders; // Store the array of orders
        }
      )
      .addCase(allOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSingleOrder.fulfilled,
        (state, action: PayloadAction<OrderReducerInitialState>) => {
          state.loading = false;
          state.order = action.payload.order; // Store the array of orders
        }
      )
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(processOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// export const { addToCart, removeFromCart, calculateTotal, calculateDiscount } = orderReducer.actions;
