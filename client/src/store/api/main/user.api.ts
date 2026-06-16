import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const commonApiSlice= createApi({
    reducerPath : 'commonApi',
    baseQuery : fetchBaseQuery(
        {
        baseUrl : 'http://localhost:5173/',
        credentials : 'include'
        }
    ),
    endpoints : () =>({})
})

export default commonApiSlice