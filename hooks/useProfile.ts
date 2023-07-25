import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IProfile } from "@/interfaces/IProfile";
import { DEFAULT_COUNTRY, ICountry } from "@/interfaces/ICountry";
import { DEFAULT_STATE, IState } from "@/interfaces/IState";
import { ICity } from "@/interfaces/ICity";
import { toast } from "react-toastify";

const useProfile = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/profile?id=${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const profile = data as IProfile;

      setIsLoading(false);
      return profile;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const updateProfile = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    avatarImageFile: File | null,
    gender: string,
    dob: string,
    address: string,
    country: string,
    state: string,
    city: string,
    zipcode: string
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    if (avatarImageFile) {
      formData.append("avatarImageFile", avatarImageFile);
    }
    if (user.id) formData.append("id", user.id.toString());
    else formData.append("id", "");
    formData.append("username", username.toString());
    formData.append("firstName", firstName.toString());
    formData.append("lastName", lastName.toString());
    formData.append("email", email.toString());
    formData.append("gender", gender.toString());
    formData.append("dob", dob.toString());
    formData.append("address", address.toString());
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("zipcode", zipcode.toString());

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      const profile = data as IProfile;

      setIsLoading(false);
      return profile;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: user.id, oldPassword, newPassword }),
      }
    );

    if (response.ok) {
      toast.success("Successfully updated!");
      setIsLoading(false);
      return true;
    } else {
      const data = await response.json();
      toast.error(
        data.message
          ? data.message
          : "We encountered an issue while processing your request."
      );
      setIsLoading(false);
    }
    return false;
  };

  const subscribe = async (planId: number | null) => {
    setIsLoading(true);

    const formData = new FormData();
    if (user.id) formData.append("id", user.id.toString());
    else formData.append("id", "");
    if (planId) formData.append("planId", planId.toString());
    else formData.append("planId", "");

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
    }
    return false;
  };

  const fetchCountries = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/profile/countries`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const countries = data as Array<ICountry>;

      setIsLoading(false);
      return countries;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchStates = async (countryId: number | null) => {
    if (countryId == DEFAULT_COUNTRY.id) return [];

    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/profile/states?countryId=${countryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const states = data as Array<IState>;

      setIsLoading(false);
      return states;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchCities = async (stateId: number | null) => {
    if (stateId == DEFAULT_STATE.id) return [];

    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/profile/cities?stateId=${stateId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const cities = data as Array<ICity>;

      setIsLoading(false);
      return cities;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchLocation = async (zipcode: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zipcode}&key=AIzaSyD1WyLhwNkzGPKEGYK_WJzunFEv94ZC1vY`
      );

      const data = await response.json();
      if (data.results.length > 0) {
        const result = data.results[0];

        const country = result.address_components.find((component: any) =>
          component.types.includes("country")
        )?.long_name;

        const state = result.address_components.find((component: any) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name;

        const city = result.address_components.find((component: any) =>
          component.types.includes("locality")
        )?.long_name;

        setIsLoading(false);
        return { country, state, city };
      }
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
    return null;
  };

  return {
    isLoading,
    fetchProfile,
    subscribe,
    updateProfile,
    fetchCountries,
    fetchStates,
    fetchCities,
    fetchLocation,
    changePassword,
  };
};

export default useProfile;
