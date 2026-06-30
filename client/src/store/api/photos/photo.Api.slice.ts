import type { ApiResponse } from "@/generics/commonGenerics";
import commonApiSlice from "../main/user.api";
import type { PhotoResponse } from "@/types/photo.types";

const photoApiSlice = commonApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPhotos: builder.query<ApiResponse<PhotoResponse[]>, void>({
      query: () => ({
        url: "/photo"
      }),
      providesTags: ["Photo"]
    }),
    savePhoto: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: "/photo/save",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Photo"]
    }),
    deletePhoto: builder.mutation<any, { photoId: String }>({
      query: ({ photoId }) => ({
        url: `/photo/delete/${photoId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Photo"]
    })
  })
});

export const {
  useGetPhotosQuery,
  useLazyGetPhotosQuery,
  useDeletePhotoMutation,
  useSavePhotoMutation
} = photoApiSlice;
