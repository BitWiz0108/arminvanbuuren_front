import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";

import {
  API_BASE_URL,
  API_VERSION,
  DATETIME_FORMAT,
  OAUTH_PROVIDER,
  ROLE,
  TAG_ACCESS_TOKEN,
} from "@/libs/constants";

import { IUser } from "@/interfaces/IUser";
import { DEFAULT_USER } from "@/interfaces/IUser";

const useAuth = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken, setAcessToken] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>(DEFAULT_USER);
  const [servertime, setServertime] = useState<string>("");
  const [isMembership, setIsMembership] = useState<boolean>(false);

  useEffect(() => {
    if (window) {
      const accessToken = window.localStorage.getItem(TAG_ACCESS_TOKEN);

      setAcessToken(<string>accessToken);

      if (accessToken) {
        checkAuth(<string>accessToken);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const getServerTime = async () => {
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/servertime`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const time = data.datetime as string;
      setServertime(time);

      return time;
    }

    const now = moment().format(DATETIME_FORMAT);
    setServertime(now);

    return now;
  };

  const checkAuth = async (accessToken: string) => {
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/check-auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Get server time to be synced with backend
    const servertime = await getServerTime();

    if (response.ok) {
      const data = await response.json();
      const user = data.user as IUser;

      if (user.status || user.googleId || user.appleId || user.facebookId) {
        // OAuth users are already verified
        setUser(user);
        setIsSignedIn(true);

        // Check membership
        if (user.planId && user.planStartDate && user.planEndDate) {
          if (
            moment(servertime).isAfter(moment(user.planStartDate)) &&
            moment(servertime).isBefore(moment(user.planEndDate))
          ) {
            setIsMembership(true);
          } else {
            setIsMembership(false);
          }
        } else {
          setIsMembership(false);
        }

        return true;
      } else {
        signOut();
        toast.warn("Your account is deactivated. Please verify your account.");
      }
    } else {
      signOut();
    }

    return false;
  };

  const signUp = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });

    if (response.ok) {
      setIsLoading(false);

      toast.success("Successfully signed up!");
      return true;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.user as IUser;

      setIsLoading(false);

      if (user.status) {
        setUser(user);

        window.localStorage.setItem(TAG_ACCESS_TOKEN, data.accessToken);
        setAcessToken(data.accessToken);

        setIsSignedIn(true);

        // Check membership
        if (user.planId && user.planStartDate && user.planEndDate) {
          if (
            moment(servertime).isAfter(moment(user.planStartDate)) &&
            moment(servertime).isBefore(moment(user.planEndDate))
          ) {
            setIsMembership(true);
          } else {
            setIsMembership(false);
          }
        } else {
          setIsMembership(false);
        }

        toast.success("Successfully signed in!");
        return true;
      } else {
        signOut();
        toast.warn("Your account is deactivated. Please verify your account.");
        return false;
      }
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }

      signOut();
      setIsLoading(false);
    }

    return false;
  };

  const signOut = async () => {
    window.localStorage.setItem(TAG_ACCESS_TOKEN, "");

    setAcessToken("");
    setIsSignedIn(false);
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);

      toast.success(
        "Password reset link is sent to your email. Please check your inbox."
      );
      return true;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);

      toast.success("Password is successfully updated. Please sign in again.");
      return true;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);

      toast.success("Email is successfully verified. Please sign in again.");
      return true;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  const resendVerificationLink = async (email: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/resend-verification-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);

      toast.success("Verification link is resent. Please check your inbox.");
      return true;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  const oauthSignin = async (
    provider: OAUTH_PROVIDER,
    accessToken: string,
    refreshToken: string,
    appleData: any
  ) => {
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/auth/oauth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider,
        accessToken,
        refreshToken,
        appleData,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.user as IUser;

      setIsLoading(false);

      setUser(user);

      window.localStorage.setItem(TAG_ACCESS_TOKEN, data.accessToken);
      setAcessToken(data.accessToken);

      setIsSignedIn(true);

      // Check membership
      if (user.planId && user.planStartDate && user.planEndDate) {
        if (
          moment(servertime).isAfter(moment(user.planStartDate)) &&
          moment(servertime).isBefore(moment(user.planEndDate))
        ) {
          setIsMembership(true);
        } else {
          setIsMembership(false);
        }
      } else {
        setIsMembership(false);
      }

      toast.success("Successfully signed in!");
      return true;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }

      signOut();
      setIsLoading(false);
    }

    return false;
  };

  const isAdmin = () => {
    return user.role?.name == ROLE.ADMIN;
  };

  return {
    servertime,
    isLoading,
    accessToken,
    isSignedIn,
    user,
    checkAuth,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationLink,
    oauthSignin,
    isMembership,
    isAdmin,
  };
};

export default useAuth;
