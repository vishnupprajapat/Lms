import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userRegistration } from "./authSlice";
type registrationResponse = {
  message: string;
  activationToken: string;
};

type registrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<registrationResponse, registrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userRegistration({
              token: data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    //activation code
    activation: builder.mutation({
      query: ({ activation_code, activation_token }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_code,
          activation_token,
        },
        credentials: "include" as const,
      }),
    }),
    //login
    login: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: data.activationToken,
              user: data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation } =
  authApi;
