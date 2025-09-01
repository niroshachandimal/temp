import { Card, Divider } from "@heroui/react";
import { LuLockKeyhole } from "react-icons/lu";
import CustomButton from "../../components/ui/CustomButton";
import CustomChip from "../../components/ui/CustomChip";
import { SiFusionauth } from "react-icons/si";
import { VscAccount } from "react-icons/vsc";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserSecurity = () => {
  const navigate = useNavigate();
  const [isEmalVerify, setIsEmailVerify] = useState(false);
  const [isAccountVerify, setIsAccountVerify] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    if (auth) {
      const emailStatus = auth.user?.profile?.email_verified;
      const providerStatus = auth.user?.profile[
        "custom:providerStatus"
      ] as string;

      const isPending = providerStatus === "pending";

      setIsEmailVerify(!!emailStatus);
      setIsAccountVerify(isPending);
    }
  }, []);

  console.log("isEmalVerify: ", isEmalVerify);

  return (
    <>
      <Card radius="none" shadow="none" className="">
        <div className="m-5 ">
          <div className="flex flex-col mb-5">
            <p className="text-subtitle3 ">Security</p>
          </div>
          <Divider className="my-1 mb-4" />

          <div>
            {/* ACCOUNT VERIFY  */}
            <div className="flex flex-initial justify-between items-center">
              <div>
                <div className="flex items-center rounded-xl py-4 w-full max-w-md">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <VscAccount className="text-2xl text-black/60" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-subtitle1 font-semibold text-gray-900">
                      Account Verification
                    </h4>
                    <p className="text-caption2 text-gray-300 mt-[2px]">
                      Verified on 22 Sep 2023 at 10:30:55
                    </p>
                  </div>

                  {/* Chip */}
                  {/* True == pending */}
                  <div className="ml-5">
                    {isAccountVerify ? (
                      <CustomChip label="Not verified" color="danger" />
                    ) : (
                      <CustomChip label="Verified" color="success" />
                    )}
                  </div>
                </div>
              </div>
              <div>
                {/* True == pending */}
                {isAccountVerify ? (
                  <CustomButton
                    variant="ghost"
                    label="Verify"
                    color="secondary"
                    className="border-gray-500"
                    onPress={() =>
                      navigate("/user/profile/general-information")
                    }
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <Divider className="my-3" />
            {/* PASSWORD */}
            <div className="flex flex-initial justify-between items-center">
              <div>
                <div className="flex items-center rounded-xl py-4 w-full max-w-md">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <LuLockKeyhole className="text-2xl text-black/60" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-subtitle1 font-semibold text-gray-900">
                      Password
                    </h4>
                    <p className="text-caption2 text-gray-300 mt-[2px]">
                      Last Changed 22 Sep 2023, 10:30:55 AM
                    </p>
                  </div>

                  {/* Chip */}
                  {/* <div className="ml-5">
                    <CustomChip label="Connected" color="success" />
                  </div> */}
                </div>
              </div>
              <div>
                <CustomButton
                  variant="ghost"
                  label="Change Password"
                  color="secondary"
                  className="border-gray-500"
                />
              </div>
            </div>
            <Divider className="my-3" />
            {/* TWO FACTOR AUTHENDICATION*/}
            <div className="flex flex-initial justify-between items-center">
              <div>
                <div className="flex items-center rounded-xl py-4 w-full max-w-md">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <SiFusionauth className="text-2xl text-black/60" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-subtitle1 font-semibold text-gray-900">
                      Two Factor Authentication
                    </h4>
                    <p className="text-caption2 text-gray-300 mt-[2px]">
                      Verified on 22 Sep 2023 at 10:30:55
                    </p>
                  </div>

                  {/* Chip */}
                  <div className="ml-5">
                    <CustomChip label="Connected" color="success" />
                  </div>
                </div>
              </div>
              <div>
                <CustomButton
                  variant="ghost"
                  label="Disable"
                  color="danger"
                  size="sm"
                  className="border-red-400 bg-opacity-10"
                />
              </div>
            </div>
            <Divider className="my-3" />
            {/* PPHONE NUMBER VERIFIY   */}
            <div className="flex flex-initial justify-between items-center">
              <div>
                <div className="flex items-center rounded-xl py-4 w-full max-w-md">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <MdOutlinePhoneInTalk className="text-2xl text-black/60" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-subtitle1 font-semibold text-gray-900">
                      Phone Number Verification
                    </h4>
                    <p className="text-caption2 text-gray-300 mt-[2px]">
                      Verified on 22 Sep 2023 at 10:30:55
                    </p>
                  </div>

                  {/* Chip */}
                  <div className="ml-5">
                    <CustomChip label="Verified" color="success" />
                  </div>
                </div>
              </div>
              <div>
                <CustomButton
                  variant="ghost"
                  label="Change"
                  color="secondary"
                  className="border-gray-500"
                />
              </div>
            </div>
            <Divider className="my-3" />
            {/* EMAIL VERIFIY   */}
            <div className="flex flex-initial justify-between items-center">
              <div>
                <div className="flex items-center rounded-xl py-4 w-full max-w-md">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <AiOutlineMail className="text-2xl text-black/60" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-subtitle1 font-semibold text-gray-900">
                      Email Verification
                    </h4>
                    <p className="text-caption2 text-gray-300 mt-[2px] ">
                      Verified on 22 Sep 2023 at 10:30:55
                    </p>
                  </div>

                  {/* Chip */}
                  <div className="ml-5">
                    {isEmalVerify ? (
                      <CustomChip label="Verified" color="success" />
                    ) : (
                      <CustomChip label="Not Verified" color="danger" />
                    )}
                  </div>
                </div>
              </div>
              <div>
                {isEmalVerify ? (
                  <CustomButton
                    variant="ghost"
                    label="Change"
                    color="secondary"
                    className="border-gray-500"
                  />
                ) : (
                  <CustomButton
                    variant="ghost"
                    label="Verify"
                    color="secondary"
                    className="border-gray-500"
                  />
                )}
              </div>
            </div>
            <Divider className="my-3" />
          </div>
        </div>
      </Card>
    </>
  );
};

export default UserSecurity;
