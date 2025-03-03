import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";
import axios from "axios";

const initialState: UserReducerInitialState = {
  // by default user -> null and loading -> true
  user: null,
  loading: true,
  error: null,
  count: 0,
};

// CREATE USER
export const newUser = createAsyncThunk(
  "userReducer/newUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const { name, email, photo, gender, role, dob, _id } = data;
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/user/new`,
        {
          name,
          email,
          photo,
          gender,
          role,
          dob,
          _id,
        }
      );
      console.log("RESPONSE", res.data); // RESPONSE {success: true, message: 'welcome Rahul'} // BACKEND RESPONSE
      // DATA ---> //   {
      //     "name": "Rahul",
      //     "email": "rahulpq112233445500@gmail.com",
      //     "photo": "https://lh3.googleusercontent.com/a/ACg8ocKkFnhEAGxoiWhh9oXVAGTzLa92-y-rXepx_iJna25toRtCWA=s96-c",
      //     "gender": "",
      //     "role": "user",
      //     "dob": "",
      //     "_id": "7KFxBcye9EbmTZkCdkXnWmkQPma2"
      // }
      console.log("DATA", data); // the data is the same as above we are sending in payload above
      //   return res.data; // if res.data then then it will be {success: true, message: 'welcome Rahul'} store in action payload
      return data; // now data is saved in action payload : Return the original user data we sent, not just the backend response
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// GET USER details from backed and pass it to userExist reducer in APP.TSX FILE so that's why we didn't add stats.user in fulfilled state of getUserInfo 
export const getUserInfo = createAsyncThunk(
  "userReducer/getUserInfo",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
      );
      console.log("GET USER RESPONSE", res.data); // User data from backend
      return res.data.user; // Return the user object to pass to userExist
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(newUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.error = null;
        // but do not save user detail when new user api call because in APP.TSX we already have userexist reducer to save user detail
        // state.user = action.payload; // Store the user object(data) and not res.data now : // Save the user data sent in the payload
      })
      .addCase(newUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.error = null;
        // state.user = action.payload; // Store the user object(data) and not res.data now : // Save the user data sent in the payload
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { userExist, userNotExist, increment, decrement} = userReducer.actions;
