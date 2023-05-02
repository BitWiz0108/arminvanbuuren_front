import { useState } from "react";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { ITermsOfService } from "@/interfaces/ITermsOfService";

const useTermsOfService = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPageContent = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/termsofservice`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as ITermsOfService;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  return { isLoading, fetchPageContent };
};

export default useTermsOfService;
