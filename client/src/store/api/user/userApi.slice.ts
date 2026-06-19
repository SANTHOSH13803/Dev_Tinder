import commonApiSlice from "../main/user.api";

const userApiSlice = commonApiSlice.injectEndpoints({
   endpoints : (builder) =>({
    loginUser : builder.mutation({
        query : ({body}) =>({
            url : '/login',
            method : "POST",
            body
        })
    }),
    signUp : builder.mutation({
        query : ({body}) =>({
            url : '/signUp',
            method : "POST",
            body
        })
    }),
    logout : builder.mutation<{success: true}, void>({
        query : () =>({
            url : '/logout',
            method : "POST",
        })
    }),
    getUser : builder.query<any, void>({
        query : () =>({
            url : '/profile/view',
        })
    }),
    getFeed: builder.query<any, {params : any}>({
        query : ({params}) =>({
            url : '/user/feed',
            params
        })
    }),
    sendRequest: builder.mutation<any, {data : {status : string, requestId : string}}>({
        query : ({data}) =>({
            url :   `request/send/${data.status}/${data.requestId}`,
            method : 'POST'
        })
    }),
   }),
}
)

export const {useLoginUserMutation,useSignUpMutation, useLogoutMutation, useGetUserQuery,useGetFeedQuery,useSendRequestMutation}  = userApiSlice;