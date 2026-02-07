import { api } from "../../app/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 🔐 Google Login
    googleLogin: builder.mutation({
      query: (token) => ({
        url: "/auth/google",
        method: "POST",
        body: { token },
      }),
    }),
  }),
});

export const { useGoogleLoginMutation } = authApi;
