import commonApiSlice from "../main/user.api";
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
    reviewConnections: builder.mutation<any, SendRequestPayload>({
      query: ({ status, requestId }) => ({
        url: `request/review/${status}/${requestId}`,
        method: "POST"
      }),
      invalidatesTags: ["Connections"]
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
  useReviewConnectionsMutation
} = userApiSlice;
