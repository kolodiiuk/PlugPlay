import {baseApi} from "./baseApi.ts";
import {User} from "../models/User.ts";
import {Address} from "../models/Address.ts"

export const userInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserByToken: builder.query<User, string>({
      query: (token) => ({
        url: `userinfo/${token}`,
        method: 'GET',
      }),
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: `userinfo/`,
        method: 'GET',
      }),
    }),
    updateUserByToken: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: ({token, ...body}) => ({
        url: `userinfo/${token}`,
        method: 'PUT',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useGetUserByTokenQuery,
  useUpdateUserByTokenMutation,
  useGetAllUsersQuery,
} = userInfoApi;

interface UpdateProfileRequest {
  token: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  addresses: Address[];
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
}
