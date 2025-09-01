import {
  Alert,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from "@heroui/react";
import EditUserDetails from "./EditUserDetails";
import { RiContactsBook3Line, RiErrorWarningLine } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import CustomChip from "../../components/ui/CustomChip";
import { IoLockClosedOutline } from "react-icons/io5";
import CustomButton from "../../components/ui/CustomButton";
import visaCard from "../../assets/visaCars.png";
import { useAuth } from "react-oidc-context";
import { useFetchUserDetailsById } from "../../hooks/queries/useFetchData";
import Loading from "../../components/ui/Loading";
import CommonErrorPage from "../error/CommonErrorPage";

const UserProfile = () => {
  const auth = useAuth();

  const { data, isFetching, isError, error } = useFetchUserDetailsById(
    auth.user?.profile?.preferred_username || ""
  );

  const userData = data?.user || {};
  // console.log("User Data: ", userData);

  if (isError) {
    console.log("Error fetching user data:", error);
    return (
      <>
        <CommonErrorPage
          title="Something went wrong!"
          description={
            error?.response?.data?.errors[0]?.message ||
            error?.response?.data?.message ||
            "Sorry, we can't load the profile page."
          }
          errorCode={error?.status || 500}
        />
      </>
    );
  }

  if (!auth.user) {
    return <div></div>;
  }
  const providerId = auth.user?.profile?.preferred_username || "Error!";
  const email = auth.user?.profile?.email || "Error!";
  const isEmmailVerified = auth.user?.profile?.email_verified || false;
  const isMobileVerified = auth.user?.profile?.phone_number_verified || false;
  const istwoFactorEnabled = auth.user?.profile?.two_factor_enabled || false;
  // const profilePicture = auth.user?.profile?.profilePicture || "Error!";

  const addressParts = [
    userData?.address?.postalCode,
    userData?.address?.addressLine1,
    userData?.address?.addressLine2,
    userData?.address?.city,
    userData?.address?.state,
    userData?.address?.country,
  ];

  const address = addressParts.filter(Boolean).join(", ");

  const title = "Account not verified";
  const description =
    "Your account is not verified yet. Please verify your account to access all features.";

  return (
    <>
      {isFetching ? (
        <Loading label="Loading..." />
      ) : (
        <div className="grid grid-cols-1  xl:grid-cols-3 gap-4 md:gap-12 xl:gap-3 justify-center items-center  max-w-[1680px] mx-auto">
          <Card
            shadow="none"
            radius="none"
            className="md:col-span-1 p-5  bg-transparent"
          >
            <div className="flex flex-col justify-center items-center my-4">
              <Image
                alt="Profile picture"
                src={
                  userData?.profilePicture ||
                  "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                }
                className="lg:w-48 lg:h-48 w-32 h-32 rounded-full object-cover"
              />
              <p className="text-heading3 mt-2">
                {userData?.name || "Error!"}{" "}
              </p>
              <p className="text-body1  ">Provider ({providerId})</p>
            </div>

            {/* Plan */}
            <div className="lg:px-7">
              <Alert
                title={title}
                description={description}
                color="warning"
                className="max-w-4xl  mb-4  md:hidden"
                endContent={<CustomButton label="Verify" color="warning" />}
              />
              <Card radius="md" shadow="sm" className="  mt-5 ">
                <CardHeader className="px-6 py-4 bg-gradient-to-r from-gray-700 to-primary">
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-semibold text-yellow-500">
                      Pro Plan
                    </h2>
                    <p className="text-sm text-white ">
                      Up to 3 staff members and Up to 10 services in total.
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="px-5 py-3">
                    <div className="text-3xl font-bold text-gray-800  dark:text-white">
                      $19
                      <span className="text-lg text-gray-600 dark:text-gray-300">
                        /month
                      </span>
                    </div>
                    <p className="text-body1 text-gray-600">Billed annually</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Your plan will renew on Jul 20, 2025
                    </p>
                  </div>
                </CardBody>
                <CardFooter>
                  <CustomButton
                    label="Subscription Cancell"
                    className="w-full"
                    variant="light"
                    color="danger"
                  />
                </CardFooter>
              </Card>
            </div>

            <div className="lg:px-7 mb-5">
              <Card radius="md" shadow="sm" className=" mt-5">
                <CardHeader className=" ">
                  <div className="flex flex-col">
                    <p className="text-body1 text-gray-600">
                      Active Payment Method
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="px-5 py-3 flex justify-between items-center -mt-8 -mb-3 -ml-5">
                    <div className="flex flex-initial gap-3 items-center">
                      <Image
                        src={visaCard}
                        className="w-full object-cover h-[55px]"
                        radius="sm"
                      />
                      <p className="text-lg font-semibold text-gray-500">
                        5372
                      </p>
                    </div>

                    <CustomButton
                      label="Edit"
                      variant="flat"
                      color="secondary"
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          </Card>
          <div className="md:col-span-2 md:pr-5 lg:pr-20 ">
            <div className="flex justify-end items-end sm:max-w-4xl md:max-w-full mb-2">
              {userData?.ISVerified && <EditUserDetails />}
            </div>
            {!userData?.ISVerified && (
              <Alert
                title={title}
                description={description}
                color="warning"
                className="max-w-4xl  mb-4 hidden md:flex"
                endContent={<EditUserDetails />}
              />
            )}
            <div className="flex flex-initial items-center gap-1">
              <RiErrorWarningLine className="text-gray-500" />
              <p className="text-sm font-semibold text-gray-500">About</p>
            </div>
            <div className="border-t-1 border-gray-300 dark:border-gray-700"></div>
            <div className="sm:max-w-4xl md:max-w-full mb-8 mt-4">
              <p className="text-body3 ">
                {userData?.bio || "No bio available."}
              </p>
            </div>

            <div className="flex flex-initial items-center gap-1">
              <RiContactsBook3Line className="text-gray-500" />
              <p className="text-sm font-semibold text-gray-500">
                Contact Information
              </p>
            </div>
            <div className="sm:max-w-4xl md:max-w-full ">
              <div className="border-t-1 border-gray-300 dark:border-gray-700"></div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Email:</p>
                <p className=" text-body3 text-end">{email}</p>
              </div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Mobile No:</p>
                <p className="text-body3 text-end">
                  {userData?.mobile || "No "}
                </p>
              </div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Address:</p>
                <p className="text-body3"> {address || "No "} </p>
              </div>
            </div>

            <div className="flex flex-initial items-center gap-1 ">
              <FaRegCircleUser className="text-gray-500" />
              <p className="text-sm font-semibold text-gray-500">
                Basic Information
              </p>
            </div>
            <div className="sm:max-w-4xl md:max-w-full">
              <Divider className="sm:max-w-4xl md:max-w-full" />
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Account status :</p>
                <CustomChip
                  label={userData?.IsActive ? "Active" : "Disabled"}
                  color={userData?.IsActive ? "success" : "danger"}
                />
              </div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Birthday:</p>
                <p className=" text-body3 text-end">
                  {userData?.dateOfBirth || "No"}
                </p>
              </div>
              {/* <div className="flex flex-initial justify-between items-center my-4">
              <p className="text-body3">Gender:</p>
              <p className=" text-body3 text-end">{userData?.}</p>
            </div> */}

              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Join Date:</p>
                <p className=" text-body3 text-end">2024 Mar 04</p>
              </div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Language:</p>
                <p className=" text-body3 text-end">
                  {userData?.language || "No"}
                </p>
              </div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Currancy:</p>
                <p className=" text-body3 text-end">
                  {userData?.currencyCode || "No"}
                </p>
              </div>
            </div>

            <div className="flex flex-initial items-center gap-1">
              <IoLockClosedOutline className="text-gray-500" />
              <p className="text-sm font-semibold text-gray-500">Security</p>
            </div>
            <div className="sm:max-w-4xl md:max-w-full ">
              <div className="border-t-1 border-gray-300 dark:border-gray-700"></div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Two Factor Authentication:</p>
                <CustomChip
                  label={istwoFactorEnabled ? "Connected" : "Not connected"}
                  color={istwoFactorEnabled ? "success" : "danger"}
                />
              </div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Phone Number Verification:</p>
                <CustomChip
                  label={isMobileVerified ? "Verified" : "Not Verified"}
                  color={isMobileVerified ? "success" : "danger"}
                />
              </div>
              <div className="flex flex-initial justify-between items-center my-4">
                <p className="text-body3">Email Verification:</p>
                <CustomChip
                  label={isEmmailVerified ? "Verified" : "Not Verified"}
                  color={isEmmailVerified ? "success" : "danger"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
