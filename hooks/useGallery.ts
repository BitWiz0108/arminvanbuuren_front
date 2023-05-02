import { useState } from "react";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { useAuthValues } from "@/contexts/contextAuth";

import { IGallery } from "@/interfaces/IGallery";

const useGallery = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPageContent = async () => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/gallery`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as IGallery;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  return { isLoading, fetchPageContent };
};

export default useGallery;
