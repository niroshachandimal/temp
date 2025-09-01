import DataTable from "../../components/ui/DataTable";
import { IoSearchSharp } from "react-icons/io5";
import CustomInput from "../../components/ui/CustomInput";
import AddStaffModa from "./AddStaffModa";
import { Alert } from "@heroui/react";
import CustomButton from "../../components/ui/CustomButton";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ROLE from "../../Role";

const AllStaff = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [isVerifyAccount, setIsVerifyAccount] = useState<boolean>(false);

  const title = "Account Verification Required";
  const description =
    "You need to verify your provider account to continue. Please complete the verification process to access your dashboard and services.";

  useEffect(() => {
    if (auth?.isAuthenticated) {
      const roles = auth?.user?.profile?.["cognito:groups"] as string[];
      if (roles) {
        const provider = roles?.includes(ROLE.PROVIDER);
        const customer = roles?.includes(ROLE.CUSTOMER);

        if (provider && customer) {
          setIsVerifyAccount(true);
        } else {
          setIsVerifyAccount(false);
        }
        // console.log("CUS: ", customer);
        // console.log("PRO: ", provider);
      }
    } else {
      setIsVerifyAccount(false);
    }
  }, [auth?.isAuthenticated, auth?.user?.profile]);

  // const handleSearchData = async (value:string) => {
  //   console.log("Search Data: ",value)
  // }

  return (
    <>
      {/*VERIFY ALERT  */}
      {/* {!isVerifyAccount && (
        <div className="flex items-center justify-center w-full mb-3 -mt-1">
          <Alert
            variant="faded"
            color="warning"
            description={description}
            title={title}
            endContent={
              <CustomButton
                onPress={() => navigate("/user/profile/security")}
                color="warning"
                size="sm"
                variant="flat"
                label="Verify Account"
              />
            }
          />
        </div>
      )} */}
      <div className="grid sm:grid-cols-2 gap-2 md:gap-5">
        <div className="flex justify-start items-center gap-2 md:gap-4 mb-8 ">
          <CustomInput
            placeholder="Search..."
            type="text"
            size="sm"
            endContent={
              <IoSearchSharp
                size={20}
                className="hover:text-bg-primary cursor-pointer"
              />
            }
            className="sm:max-w-[300px]"
            // onValueChange={(e.value: string) => handleSearchData()}
          />
        </div>

        <div className="flex justify-end items-center gap-4 mb-8 ">
          {isVerifyAccount && <AddStaffModa />}

        </div>
      </div>
      <DataTable />
    </>
  );
};

export default AllStaff;
