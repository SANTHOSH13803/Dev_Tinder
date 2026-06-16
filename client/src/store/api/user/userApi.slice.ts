import commonApiSlice from "../main/user.api";

const userApiSlice = commonApiSlice.injectEndpoints({
   endpoints : (builder) =>({
    loginUser : builder.mutation({
        query : ({body}) =>({
            url : '/login',
            method : "POST",
            body
        })
    })
   })
}
)

export const {useLoginUserMutation}  = userApiSlice;