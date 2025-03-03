import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";
import axios from "axios";

const initialState: CustomerReducerInitialState = {
  customers: [], // ALL CUSTOMERS ARRAY
  selectedCustomer: null, // SINGLE CUSTOMER
  loading: true,
  error: null,
};

// GET ALL CUSTOMER
export const getCustomer = createAsyncThunk(
  "customerReducer/getCustomer",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/user/all?id=${id}`
      );
      console.log("customer RESPONSE", res.data); // User data from backend -> customer RESPONSE {success: true, users: Array(2)}
      return res.data.users; // Return the user object to pass to userExist
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// delete customer
export const deleteCustomer = createAsyncThunk(
  "customerReducer/deleteCustomer",
  async (
    {
      customerId,
      adminId,
    }: { customerId: string; adminId: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/v1/user/${customerId}?id=${adminId}`
      );

      console.log("delete RESPONSE", res.data); // res.data -> {success: true, message: 'John Doe Deleted successfully'}
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// GET SINGLE CUSTOMER DETAIL
export const getSingleCustomer = createAsyncThunk(
  "customerReducer/getSingleCustomer",
  async (
    {
      customerId,
      adminId,
    }: { customerId: string; adminId: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/user/${customerId}?id=${adminId}`
      );

      console.log("single customer RESPONSE", res.data); // single customer RESPONSE// {success: true, user: {…}}
      return res.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const customerReducer = createSlice({
  name: "customerReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCustomer.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.error = null;
          state.customers = action.payload;
          // state.user = action.payload; // Store the user object(data) and not res.data now : // Save the user data sent in the payload
        }
      )
      .addCase(getCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        //   state.customers = action.payload;
        // state.user = action.payload; // Store the user object(data) and not res.data now : // Save the user data sent in the payload
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSingleCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedCustomer = action.payload
        //   state.customers = action.payload;
        // state.user = action.payload; // Store the user object(data) and not res.data now : // Save the user data sent in the payload
      })
      .addCase(getSingleCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
