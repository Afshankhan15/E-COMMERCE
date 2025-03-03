import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  // api/v1/user/new -> backend url to add new user
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }), // server URL
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest", // means -> api/v1/product/latest
    }),
  }),
});

export const { useLatestProductsQuery } = productAPI;
