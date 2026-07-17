import type { ApiResponse } from "@/generics/commonGenerics";
import commonApiSlice from "../main/user.api";
import type { User } from "@/types/user.type";
type SendRequestPayload = {
  status: string;
  requestId: string;
};

const userApiSlice = commonApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ body }) => ({
        url: "/login",
        method: "POST",
        body
      })
    }),
    signUp: builder.mutation({
      query: ({ body }) => ({
        url: "/signUp",
        method: "POST",
        body
      })
    }),
    logout: builder.mutation<{ success: true }, void>({
      query: () => ({
        url: "/logout",
        method: "POST"
      })
    }),
    getUser: builder.query<any, void>({
      query: () => ({
        url: "/profile/view"
      }),
      providesTags: ["User"]
    }),
    getUserById: builder.query<ApiResponse<User>, { id: string }>({
      query: ({ id }) => ({
        url: `/user/${id}`
      }),
      providesTags: ["User"]
    }),
    getFeed: builder.query<any, { params: any }>({
      query: ({ params }) => ({
        url: "/user/feed",
        params
      })
    }),
    sendRequest: builder.mutation<any, SendRequestPayload>({
      query: ({ status, requestId }) => ({
        url: `request/send/${status}/${requestId}`,
        method: "POST"
      })
    }),
    updateProfile: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: `profile/edit`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["User"]
    }),
    getPendingConnections: builder.query<any, void>({
      query: () => ({
        url: `user/request/pending`
      }),
      providesTags: ["Connections"]
    }),
    getFriends: builder.query<any, void>({
      query: () => ({
        url: `user/connections`
      })
    }),
    getChat: builder.query<any, { toUserId?: string }>({
      query: ({ toUserId }) => ({
        url: `chat/${toUserId}`
      })
    }),
    reviewConnections: builder.mutation<any, SendRequestPayload>({
      query: ({ status, requestId }) => ({
        url: `request/review/${status}/${requestId}`,
        method: "POST"
      }),
      invalidatesTags: ["Connections"]
    }),
    forgetPassword: builder.mutation<any, { emailId: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body
      })
    }),
    resetPassword: builder.mutation<any, { token: string; password: string }>({
      query: (body) => ({
        url: "profile/password",
        method: "PATCH",
        body
      })
    })
  })
});

export const {
  useLoginUserMutation,
  useSignUpMutation,
  useLogoutMutation,
  useGetUserQuery,
  useGetFeedQuery,
  useLazyGetFeedQuery,
  useSendRequestMutation,
  useUpdateProfileMutation,
  useGetPendingConnectionsQuery,
  useLazyGetPendingConnectionsQuery,
  useReviewConnectionsMutation,
  useForgetPasswordMutation,
  useLazyGetUserQuery,
  useResetPasswordMutation,
  useGetFriendsQuery,
  useLazyGetFriendsQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useGetChatQuery
} = userApiSlice;
