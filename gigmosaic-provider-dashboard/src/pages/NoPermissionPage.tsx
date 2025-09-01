import { useNavigate } from "react-router-dom";
import CustomButton from "../components/ui/CustomButton";

const NoPermissionPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] ">
      <h1 className="text-2xl font-bold text-yellow-600 text-center mt-10">
        No Permission
      </h1>
      <p className="text-center mt-4">
        You do not have permission to access this page.
      </p>
      <p className="text-center mt-4">
        Please contact your administrator if you believe this is an error.
      </p>
      <CustomButton
        className="mt-6 px-4 py-2 bg-primary"
        onPress={goBack}
        size="md"
        label=" Go Back"
      ></CustomButton>
    </div>
  );
};

export default NoPermissionPage;
