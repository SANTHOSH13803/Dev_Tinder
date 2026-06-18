import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery =   fetchBaseQuery(
        {
        baseUrl : 'http://localhost:3000/',
        credentials : 'include'
        }
    );
const baseQueryWithErrorHandling = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  const result = await baseQuery(args, api, extraOptions);
  if(result.data){
    return {data : result.data as any}.data
  }
  if (result.error) {
    return {
      error :(result.error.data as any)?.error,
    };
  }

  return result
};
const commonApiSlice= createApi({
    reducerPath : 'commonApi',
    baseQuery : baseQueryWithErrorHandling,
    endpoints : () =>({}),
    
    
})

export default commonApiSlice