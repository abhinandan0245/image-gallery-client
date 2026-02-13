import { api } from "../../app/api";

export const imageApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // Public image feed
getImages: builder.query({
  query: ({ sort = "newest", page = 1, limit = 12 }) => ({
    url: "/images",
    params: { sort, page, limit },
  }),
  providesTags: ["Image"],
}),



getImageById: builder.query({
  query: (id) => `/images/${id}`,
  providesTags: (result, error, id) => [{ type: "Image", id }]
}),

  getImagesByUser: builder.query({
      query: ({ userId, excludeId }) => ({
        url: "/images/user-images",
        params: { userId, excludeId }
      }),
      providesTags: ["Image"]
    }),

     getImagesBySameAdmin: builder.query({
      query: (imageId) => `/images/${imageId}/same-admin`, // Uses image ID in path
      providesTags: (result, error, imageId) => [
        { type: "Image", id: imageId },
        { type: "Image", id: "SAME_ADMIN" }
      ]
    }),



    // Like / Unlike image
    likeImage: builder.mutation({
      query: (id) => ({
        url: `/images/${id}/like`,
        method: "PUT"
      }),
      invalidatesTags: ["Image"]
    }),

    // Liked images
    getLikedImages: builder.query({
      query: () => "/images/liked/me",
      providesTags: ["Image"]
    }),

  })
});

export const {
  useGetImagesQuery,
  useLikeImageMutation,
  useGetLikedImagesQuery,
  useGetImageByIdQuery,
  useGetImagesByUserQuery,
  useGetImagesBySameAdminQuery,
} = imageApi;
