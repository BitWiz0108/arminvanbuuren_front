import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-toastify";
import moment from "moment";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import Select from "@/components/Select";
import DateInput from "@/components/DateInput";
import Profile from "@/components/Icons/Profile";
import Edit from "@/components/Icons/Edit";
import AudioControl from "@/components/AudioControl";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";

import useProfile from "@/hooks/useProfile";

import { checkContainsSpecialCharacters } from "@/libs/utils";
import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  GENDER,
  IMAGE_SM_BLUR_DATA_URL,
} from "@/libs/constants";

import { DEFAULT_PROFILE } from "@/interfaces/IProfile";
import { DEFAULT_COUNTRY, ICountry } from "@/interfaces/ICountry";
import { DEFAULT_STATE, IState } from "@/interfaces/IState";
import { DEFAULT_CITY, ICity } from "@/interfaces/ICity";

export default function Settings() {
  const router = useRouter();
  const avatarImageRef = useRef(null);

  const {
    isLoading,
    fetchProfile,
    updateProfile,
    fetchCountries,
    fetchStates,
    fetchCities,
  } = useProfile();
  const { isSignedIn, accessToken, checkAuth } = useAuthValues();
  const { audioPlayer } = useShareValues();

  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>(DEFAULT_PROFILE.gender);
  const [dob, setDob] = useState<string>(DEFAULT_PROFILE.dob);
  const [address, setAddress] = useState<string>("");
  const [country, setCountry] = useState<ICountry>(DEFAULT_COUNTRY);
  const [state, setState] = useState<IState>(DEFAULT_STATE);
  const [city, setCity] = useState<ICity>(DEFAULT_CITY);
  const [zipcode, setZipcode] = useState<string>("");
  const [avatarImagePreview, setAvatarImagePreview] = useState<string>(
    DEFAULT_PROFILE.avatarImage
  );
  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null);
  const [isAvatarImageHover, setIsAvatarImageHover] = useState<boolean>(false);
  const [countries, setCountries] = useState<Array<ICountry>>([]);
  const [states, setStates] = useState<Array<IState>>([]);
  const [cities, setCities] = useState<Array<ICity>>([]);

  const updateUserProfile = () => {
    if (!username || !email) {
      toast.error("Username and email can't be empty.");
      return;
    }

    if (username.includes(" ") || checkContainsSpecialCharacters(username)) {
      toast.error("Username can't contain space or a special character.");
      return;
    }

    updateProfile(
      username.toLowerCase(),
      firstName,
      lastName,
      email,
      avatarImageFile,
      gender,
      dob,
      address,
      country.id,
      state.id,
      city.id,
      zipcode
    ).then((data) => {
      if (data) {
        setUsername(data.username);
        setAvatarImagePreview(data.avatarImage);
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setEmail(data.email ?? "");
        setGender(data.gender ?? GENDER.MALE);
        setDob(data.dob ?? moment().format(DATETIME_FORMAT));
        setAddress(data.address ?? "");
        setCountry(data.country ?? DEFAULT_COUNTRY);
        setState(data.state ?? DEFAULT_STATE);
        setCity(data.city ?? DEFAULT_CITY);
        setZipcode(data.zipcode ?? "");

        if (avatarImageFile) {
          checkAuth(accessToken);
        }

        toast.success("Successfully updated!");
      }
    });
  };

  useEffect(() => {
    fetchStates(country.id).then((value) => {
      setStates(value);
    });
    fetchCities(state.id).then((value) => {
      setCities(value);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, state]);

  useEffect(() => {
    if (isSignedIn) {
      fetchCountries().then((value) => {
        setCountries(value);

        fetchProfile().then((data) => {
          if (data) {
            setUsername(data.username);
            setAvatarImagePreview(data.avatarImage);
            setFirstName(data.firstName ?? "");
            setLastName(data.lastName ?? "");
            setEmail(data.email ?? "");
            setGender(data.gender ?? GENDER.MALE);
            setDob(data.dob ?? moment().format(DATETIME_FORMAT));
            setAddress(data.address ?? "");
            setCountry(data.country ?? DEFAULT_COUNTRY);
            setState(data.state ?? DEFAULT_STATE);
            setCity(data.city ?? DEFAULT_CITY);
            setZipcode(data.zipcode ?? "");
          }
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <Layout>
      <div className="relative px-5 pt-16 pb-36 bg-background w-full min-h-screen flex justify-center items-center">
        <div className="w-full md:w-4/5 xl:w-2/3 p-5 bg-third rounded-lg">
          <div className="w-full flex justify-center -mt-16 mb-10">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden border border-secondary cursor-pointer bg-third"
              onMouseEnter={() => setIsAvatarImageHover(true)}
              onMouseLeave={() => setIsAvatarImageHover(false)}
              onClick={() => {
                if (avatarImageRef) {
                  // @ts-ignore
                  avatarImageRef.current.click();
                }
              }}
            >
              <input
                ref={avatarImageRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    if (files[0]) {
                      setAvatarImageFile(files[0]);

                      const reader = new FileReader();
                      reader.onload = () => {
                        setAvatarImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(files[0]);
                    }
                  }
                }}
                accept="image/*"
              />
              <Image
                className="w-full h-full object-cover"
                src={avatarImagePreview ?? DEFAULT_AVATAR_IMAGE}
                width={200}
                height={200}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_SM_BLUR_DATA_URL}
              />
              {isAvatarImageHover && (
                <div className="absolute left-0 top-0 w-full h-full bg-[#000000aa] flex justify-center items-center">
                  <Edit width={26} height={26} />
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <TextInput
              sname="First name"
              label=""
              placeholder="First Name"
              type="text"
              value={firstName}
              setValue={setFirstName}
            />
            <TextInput
              sname="Last name"
              label=""
              placeholder="Last Name"
              type="text"
              value={lastName}
              setValue={setLastName}
            />
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <div className="w-full flex">
              <TextInput
                sname="Username"
                label=""
                placeholder="Username"
                type="text"
                value={username}
                setValue={setUsername}
                icon={<Profile width={20} height={20} />}
              />
            </div>
            <div className="w-full flex">
              <TextInput
                sname="Email"
                label=""
                placeholder="Email"
                type="text"
                value={email}
                setValue={setEmail}
              />
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <div className="w-full flex">
              <Select
                label="Gender"
                options={[GENDER.MALE, GENDER.FEMALE].map((value) => {
                  return { label: value, value };
                })}
                value={gender}
                setValue={setGender}
              />
            </div>
            <div className="w-full flex">
              <DateInput
                sname="DOB"
                label=""
                placeholder="Date of birth"
                value={dob}
                setValue={setDob}
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row space-x-0 xl:space-x-5">
            <Select
              label="Country"
              options={countries.map((value) => {
                return {
                  label: value.iso,
                  value: value.id ? value.id.toString() : "",
                };
              })}
              value={country.id ? country.id : ""}
              setValue={(value: string) => {
                const id = Number(value);
                const index = countries.findIndex((country) => {
                  return country.id == id;
                });
                if (index >= 0) {
                  setCountry(countries[index]);
                }
              }}
            />
            <Select
              label="State"
              options={[DEFAULT_STATE, ...states].map((value) => {
                return {
                  label: value.name,
                  value: value.id ? value.id.toString() : "",
                };
              })}
              value={state.id ? state.id : ""}
              setValue={(value: string) => {
                const id = Number(value);
                const index = states.findIndex((state) => {
                  return state.id == id;
                });
                if (index >= 0) {
                  setState(states[index]);
                }
              }}
            />
            <Select
              label="City"
              options={[DEFAULT_CITY, ...cities].map((value) => {
                return {
                  label: value.name,
                  value: value.id ? value.id.toString() : "",
                };
              })}
              value={city.id ? city.id : ""}
              setValue={(value: string) => {
                const id = Number(value);
                const index = cities.findIndex((city) => {
                  return city.id == id;
                });
                if (index >= 0) {
                  setCity(cities[index]);
                }
              }}
            />
          </div>
          <div className="w-full flex flex-col xl:flex-row space-x-0 xl:space-x-5">
            <TextInput
              sname="Address"
              label=""
              placeholder="1234 Main St"
              type="text"
              value={address}
              setValue={setAddress}
            />
            <TextInput
              sname="Zip code"
              label=""
              placeholder="Zip code"
              type="text"
              value={zipcode}
              setValue={setZipcode}
            />
          </div>

          <div className="mt-10 w-full">
            <ButtonSettings
              label="Save"
              bgColor={"1"}
              onClick={() => updateUserProfile()}
            />
          </div>
        </div>
      </div>

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/music")}
      />
    </Layout>
  );
}
