import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/",
  credentials: "include"
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const errorData = result.error.data as { message?: string } | undefined;

    toast.error(errorData?.message ?? "Something went wrong");
  }

  return result;
};

const commonApiSlice = createApi({
  reducerPath: "commonApi",
  tagTypes: ["User", "Connections", "Photo"],
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({})
});

export default commonApiSlice;
