import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery =   fetchBaseQuery(
        {
        baseUrl : 'http://localhost:3000/',
        credentials : 'include'
        }
    );

const commonApiSlice= createApi({
    reducerPath : 'commonApi',
    baseQuery : baseQuery,
    endpoints : () =>({}),
    
    
})

export default commonApiSlice