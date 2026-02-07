import { api } from "../../app/api";

export const imageApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // Public image feed
    getImages: builder.query({
  query: (params = {}) => ({
    url: "/images",
    params: {
      sort: params.sort || "newest"
    }
  }),
  providesTags: ["Image"]
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
    })

  })
});

export const {
  useGetImagesQuery,
  useLikeImageMutation,
  useGetLikedImagesQuery
} = imageApi;
