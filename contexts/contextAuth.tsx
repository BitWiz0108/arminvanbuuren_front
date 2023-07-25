import { createContext, useContext, ReactNode } from "react";
import PropTypes from "prop-types";

import useAuth from "@/hooks/useAuth";

import { OAUTH_PROVIDER } from "@/libs/constants";

import { DEFAULT_USER } from "@/interfaces/IUser";

export const AuthContext = createContext({
  servertime: "",
  isLoading: false,
  isSignedIn: false,
  accessToken: "",
  user: DEFAULT_USER,
  checkAuth: async (token: string) => {
    return false;
  },
  signIn: async (username: string, password: string) => {
    return false;
  },
  signOut: async () => {},
  signUp: async (
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    return false;
  },
  forgotPassword: async (email: string) => {
    return false;
  },
  resetPassword: async (token: string, password: string) => {
    return false;
  },
  verifyEmail: async (token: string) => {
    return false;
  },
  resendVerificationLink: async (email: string) => {
    return false;
  },
  oauthSignin: async (
    provider: OAUTH_PROVIDER,
    accessToken: string,
    refreshToken: string,
    appleData: any
  ) => {
    return false;
  },
  isMembership: false,
  isAdmin: () => {
    return false as boolean;
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    servertime,
    isLoading,
    isSignedIn,
    accessToken,
    user,
    checkAuth,
    signIn,
    signOut,
    signUp,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationLink,
    oauthSignin,
    isMembership,
    isAdmin,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        servertime,
        isLoading,
        isSignedIn,
        accessToken,
        user,
        checkAuth,
        signIn,
        signOut,
        signUp,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerificationLink,
        oauthSignin,
        isMembership,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthValues = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
