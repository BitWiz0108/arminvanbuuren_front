import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IAbout } from "@/interfaces/IAbout";

const useAbout = () => {
  const { accessToken } = useAuthValues();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAboutContent = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/about/images`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as IAbout;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  const sendEmail = async (
    name: string,
    email: string,
    subject: string,
    message: string
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/about/connect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email, subject, message }),
      }
    );
    if (response.ok) {
      toast.success("Successfully sent!");
    } else {
      const data = await response.json();
      toast.error(
        data.message
          ? data.message
          : "We encountered an issue while processing your request."
      );
    }

    setIsLoading(false);
  };

  return { isLoading, fetchAboutContent, sendEmail };
};

export default useAbout;
