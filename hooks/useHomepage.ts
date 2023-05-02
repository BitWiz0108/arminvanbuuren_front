import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IHomepage } from "@/interfaces/IHomepage";

const useHomepage = () => {
  const { accessToken } = useAuthValues();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPageContent = async () => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as IHomepage;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  return { isLoading, fetchPageContent };
};

export default useHomepage;
