import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

import X from "@/components/Icons/X";
import TextInput from "@/components/TextInput";
import ButtonSettings from "@/components/ButtonSettings";
import Loading from "@/components/Loading";

import { useSizeValues } from "@/contexts/contextSize";
import { useAuthValues } from "@/contexts/contextAuth";

import useProfile from "@/hooks/useProfile";

type Props = {
  visible: boolean;
  setVisible: Function;
  resetPassword?: boolean;
};

const ChangePasswordModal = ({
  visible,
  setVisible,
  resetPassword = true,
}: Props) => {
  const { isMobile } = useSizeValues();
  const { isLoading, changePassword } = useProfile();
  const { checkAuth, accessToken } = useAuthValues();

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const onChangePassword = async () => {
    if (!oldPassword && resetPassword) {
      toast.warn("Please enter current password.");
      return;
    }
    if (!newPassword) {
      toast.warn("Please enter new password.");
      return;
    }
    if (newPassword == oldPassword && resetPassword) {
      toast.warn("Please enter the new password different from old one.");
      return;
    }
    if (!confirmPassword || newPassword != confirmPassword) {
      toast.warn("Please confirm new password.");
      return;
    }

    changePassword(oldPassword, newPassword).then((value) => {
      if (value) {
        setVisible(false);
        checkAuth(accessToken);
      }
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={twMerge(
            "fixed left-0 top-0 w-screen h-screen px-5 pt-5 bg-[#000000aa] flex justify-center items-center z-50",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[540px] max-h-full px-5 md:px-10 pt-20 pb-5 md:pb-10 bg-background rounded-lg overflow-x-hidden overflow-y-auto pr-5">
            <h1 className="absolute top-5 left-1/2 -translate-x-1/2 text-2xl text-center text-primary font-semibold">
              {resetPassword ? "Change" : "Set"} Password
            </h1>

            {resetPassword && (
              <div className="absolute top-5 right-5 text-primary cursor-pointer">
                <X width={24} height={24} onClick={() => setVisible(false)} />
              </div>
            )}

            <div className="w-full h-fit flex flex-col justify-start items-center">
              <div className="w-full flex flex-row justify-center items-center space-x-2">
                <div className="w-full flex flex-col justify-start items-start space-y-5">
                  {resetPassword && (
                    <TextInput
                      sname="Current Password"
                      label=""
                      placeholder="Current Password"
                      type="password"
                      value={oldPassword}
                      setValue={setOldPassword}
                    />
                  )}
                  <TextInput
                    sname="New Password"
                    label=""
                    placeholder="New Password"
                    type="password"
                    value={newPassword}
                    setValue={setNewPassword}
                  />
                  <TextInput
                    sname="Confirm Password"
                    label=""
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                  />
                  <div className="w-full">
                    <ButtonSettings
                      label="Save"
                      bgColor={"1"}
                      onClick={() => onChangePassword()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="loading">
              <Loading width={64} height={64} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
