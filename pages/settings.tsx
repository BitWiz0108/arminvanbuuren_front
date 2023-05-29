import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-toastify";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import Select from "@/components/Select";
import DateInput from "@/components/DateInput";
import Profile from "@/components/Icons/Profile";
import Edit from "@/components/Icons/Edit";
import AudioControl from "@/components/AudioControl";
import Switch from "@/components/Switch";
import SubscriptionModal from "@/components/SubscriptionModal";
import DonationModal from "@/components/DonationModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import ShieldLock from "@/components/Icons/ShieldLock";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useProfile from "@/hooks/useProfile";

import { checkContainsSpecialCharacters } from "@/libs/utils";
import {
  ASSET_TYPE,
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  GENDER,
  IMAGE_BLUR_DATA_URL,
} from "@/libs/constants";

import { DEFAULT_PROFILE } from "@/interfaces/IProfile";

export default function Settings() {
  const router = useRouter();
  const avatarImageRef = useRef<HTMLInputElement>(null);

  const { fetchProfile, updateProfile, fetchLocation, subscribe } =
    useProfile();
  const { isSignedIn, accessToken, checkAuth, servertime, user, isMembership } =
    useAuthValues();
  const {
    audioPlayer,
    isSubscriptionModalVisible,
    setIsSubscriptionModalVisible,
  } = useShareValues();
  const { isMobile } = useSizeValues();

  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>(DEFAULT_PROFILE.gender);
  const [dob, setDob] = useState<string>(DEFAULT_PROFILE.dob);
  const [address, setAddress] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [avatarImagePreview, setAvatarImagePreview] = useState<string>(
    DEFAULT_PROFILE.avatarImage
  );
  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null);
  const [isAvatarImageHover, setIsAvatarImageHover] = useState<boolean>(false);
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [isSubscribed, setIsSubScribed] = useState<boolean>(true);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState<boolean>(false);

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
      country,
      state,
      city,
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
        setCountry(data.country ?? "");
        setState(data.state ?? "");
        setCity(data.city ?? "");
        setZipcode(data.zipcode ?? "");

        if (avatarImageFile) {
          checkAuth(accessToken);
        }

        toast.success("Successfully updated!");
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
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
          setCountry(data.country ?? "");
          setState(data.state ?? "");
          setCity(data.city ?? "");
          setZipcode(data.zipcode ?? "");
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  useEffect(() => {
    setIsSubScribed(isMembership);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMembership, isSubscriptionModalVisible]);

  const fullContent = (
    <>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
        <div
          className={twMerge(
            "relative px-5 pt-16 bg-background w-full min-h-screen flex justify-center items-center",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
        >
          <div className="relative w-full flex flex-col md:w-4/5 xl:w-2/3 p-5 bg-third rounded-lg justify-center items-center">
            <div
              className="absolute p-3 rounded-full top-5 right-5 cursor-pointer text-primary bg-bluePrimary  hover:bg-blueSecondary transition-all duration-300"
              onClick={() => setIsChangePasswordModalVisible(true)}
            >
              <ShieldLock width={30} height={30} />
            </div>

            <div className="w-full flex justify-center -mt-16 mb-5">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden border border-secondary cursor-pointer bg-third"
                onMouseEnter={() => setIsAvatarImageHover(true)}
                onMouseLeave={() => setIsAvatarImageHover(false)}
                onClick={() => {
                  if (avatarImageRef && avatarImageRef.current) {
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
                  width={333}
                  height={333}
                  alt=""
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  priority
                />
                {isAvatarImageHover && (
                  <div className="absolute left-0 top-0 w-full h-full bg-[#000000aa] flex justify-center items-center">
                    <Edit width={26} height={26} />
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full flex justify-center items-center mb-5">
              <Switch
                checked={isSubscribed}
                setChecked={(flag: boolean) => {
                  setIsSubScribed(flag);
                  let planId = null;
                  if (flag) {
                    if (user.planStartDate && user.planEndDate) {
                      if (
                        moment(servertime).isAfter(
                          moment(user.planStartDate)
                        ) &&
                        moment(servertime).isBefore(moment(user.planEndDate))
                      ) {
                        planId = 1;
                      } else {
                        // Subscription expired user
                        setIsSubscriptionModalVisible(true);
                        return;
                      }
                    } else {
                      // Newly subscribing user
                      setIsSubscriptionModalVisible(true);
                      return;
                    }
                  }

                  subscribe(planId).then((value) => {
                    if (value) {
                      checkAuth(accessToken);
                    }
                  });
                }}
                label={`Turn ${isSubscribed ? "off" : "on"} your subscription`}
                labelPos="top"
              />
            </div>

            <div className="w-full flex flex-col lg:flex-row mt-5 space-x-0 lg:space-x-5">
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
              <TextInput
                sname="Zip code"
                label=""
                placeholder="Zip code"
                type="text"
                value={zipcode}
                setValue={(zipcode: string) => {
                  setZipcode(zipcode);

                  if (zipcode) {
                    fetchLocation(zipcode).then((value) => {
                      if (value) {
                        setCountry(value.country);
                        setState(value.state);
                        setCity(value.city);
                      }
                    });
                  }
                }}
              />
              <TextInput
                sname="Address"
                label=""
                placeholder="1234 Main St"
                type="text"
                value={address}
                setValue={setAddress}
              />
            </div>
            <div className="w-full flex flex-col xl:flex-row space-x-0 xl:space-x-5">
              <TextInput
                sname="Country"
                label=""
                placeholder="Country"
                type="text"
                value={country}
                setValue={setCountry}
              />
              <TextInput
                sname="State"
                label=""
                placeholder="State"
                type="text"
                value={state}
                setValue={setState}
              />
              <TextInput
                sname="City"
                label=""
                placeholder="City"
                type="text"
                value={city}
                setValue={setCity}
              />
            </div>

            <div className="mt-10 w-full">
              <ButtonSettings
                label="Save"
                bgColor={"blue"}
                onClick={() => updateUserProfile()}
              />
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <SubscriptionModal />

      {isChangePasswordModalVisible && (
        <ChangePasswordModal
          visible={isChangePasswordModalVisible}
          setVisible={setIsChangePasswordModalVisible}
        />
      )}

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/musics")}
      />
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
