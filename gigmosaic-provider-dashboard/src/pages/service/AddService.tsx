import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from "../../components/ui/CustomInput";
import CustomNumberInput from "../../components/ui/CustomNumberInput";
import {
  addToast,
  Alert,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Switch,
} from "@heroui/react";
import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
import { IAvailabilityProps, IServiceProps } from "../../types";
import CustomMultiselectDropdown from "../../components/ui/CustomMultiselectDropdown";
import SingleMultipleInput from "../../components/ui/SingleMultipleInput";
import MultipleInput from "../../components/ui/MultipleInput";
import TextEdior from "../../components/ui/TextEdior";
import CustomAvailabilityInput from "../../components/ui/CustomAvailabilityInput";
import CustomTextArea from "../../components/ui/CustomTextArea";
import CustomDubbleInput from "../../components/ui/CustomDubbleInput";
import GallaryInput from "../../components/ui/GallaryInput";
import LocationInputs from "../../components/LocationInputs";
import { ILocationProps, IFaqProps, IGallaryProps } from "../../types";
import {
  convertToTagsArray,
  formateDataForDropdown,
  formatServiceData,
} from "../../utils/serviceUtils";
import { useSumbitServiceMutation } from "../../hooks/mutations/usePostData";
import CustomCheckbox from "../../components/ui/CustomCheckbox";
import { uploadToS3 } from "../../aws/s3FileUpload";
import {
  useFetchAllService,
  useFetchCategory,
  useFetchStaff,
  useFetchSubCategory,
  useFetchSubscriptions,
} from "../../hooks/queries/useFetchData";
import CustomButton from "../../components/ui/CustomButton";
import serviceValidation from "../../validation/serviceValidation";
import { ValidationError } from "yup";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import { useAuth } from "react-oidc-context";
import ROLE from "../../Role";

const AddService = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isVerifyAccount, setIsVerifyAccount] = useState<boolean>(false);
  const { handleSubmit } = useForm<IServiceProps>({});
  const [staff, setStaff] = useState<string[]>([]);
  const [selectPkg, setSelectPkg] = useState<boolean>(false);
  const [isBasic, setIsBasic] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isPlatinum, setIsPlatinum] = useState<boolean>(false);
  const [validationError, setValidationError] = useState({});
  const [addtionalInfo, setAddtionalInfo] = useState<
    { serviceItem: string; price: number; images: File | null }[]
  >([]);
  const [include, setInclude] = useState<string[]>([]);
  const [displayStaff, setDisplayStaff] = useState<
    { label: string; id: number }[]
  >([]);
  const [faq, setFaq] = useState<IFaqProps[]>([]);
  const [location, setlocation] = useState<ILocationProps>();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [gallaryData, setGallaryData] = useState<IGallaryProps>();
  const [availability, setAvailability] = useState<IAvailabilityProps[]>();
  const [displayCategory, setDisplayCategory] = useState<
    { label: string; id: number }[]
  >([]);
  const [displaySubCategory, setDisplaySubCategory] = useState<
    { label: string; id: number }[]
  >([]);
  const [basicInfo, setBasicInfo] = useState({
    serviceTitle: "",
    slug: "",
    categoryId: "",
    subCategoryId: "",
    serviceOverview: "",
    price: 0,
  });

  const [metaDetails, setMetaDetails] = useState<{
    metaTitle: string;
    metaKeywords: string[];
    metaDescription: string;
  }>({
    metaTitle: "",
    metaKeywords: [],
    metaDescription: "",
  });

  const { mutate } = useSumbitServiceMutation();
  const { data: staffData } = useFetchStaff({ page: 1, limit: 100 });
  const { data: categoryData } = useFetchCategory();
  const { data: subCategoryData } = useFetchSubCategory();

  const { data: userSubs } = useFetchSubscriptions();
    const { data } = useFetchAllService({
      page: 1,
      limit: 1,
    });
  
    const totalServices = data?.totalActiveServicers ?? 0;
    const allowedServices = userSubs?.plan?.limits?.services ?? 0;
    const isFreePlan = userSubs?.plan?.tier === 0;
    const hasReachedLimit = totalServices >= allowedServices;
    const isDisabled = isFreePlan && hasReachedLimit;
    const shouldShowOverLimitModal = !isFreePlan && hasReachedLimit;
    if (isDisabled || shouldShowOverLimitModal) {
      navigate("/user/profile/plan");
    }
  useEffect(() => {
    setApiData();
  }, [staffData]);

  //THIS PART NEED
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
      }
    } else {
      setIsVerifyAccount(false);
    }
  }, [auth?.isAuthenticated, auth?.user?.profile]);

  console.log("VERIFY: ", isVerifyAccount);
  useEffect(() => {
    if (basicInfo.categoryId) {
      const subcategoryList = subCategoryData?.subCategories.filter(
        (subCategory: any) => subCategory.categoryId === basicInfo.categoryId
      );

      const formattedSubCategory = formateDataForDropdown(
        subcategoryList,
        "subCategoryName",
        "subCategoryId"
      );
      setDisplaySubCategory(formattedSubCategory);
    } else {
      setDisplaySubCategory([]);
    }
  }, [basicInfo.categoryId, subCategoryData]);

  const setApiData = async () => {
    const filteredStaff = staffData?.staff?.filter(
      (staff: any) => staff.status === true
    );

    const formtedStaff = await formateDataForDropdown(
      filteredStaff,
      "fullName",
      "staffId"
    );

    setDisplayStaff(formtedStaff);

    const formtedCategory = await formateDataForDropdown(
      categoryData?.categories,
      "categoryName",
      "categoryId"
    );
    setDisplayCategory(formtedCategory);
  };

  // const convertMetaKeyword = async (keyword: string) => {
  //   const convertToMetaKeyword = convertToTagsArray(keyword);
  //   setMetaDetails((prevDetails) => ({
  //     ...prevDetails,
  //     metaKeywords: convertToMetaKeyword,
  //   }));
  //   setValidationError((prevErrors) => ({
  //     ...prevErrors,
  //     metaKeywords: "",
  //   }));
  // };

  const onSubmit: SubmitHandler<IServiceProps> = async () => {
    setLoading(true);
    setValidationError({});

    try {
      await serviceValidation.validate(
        {
          staff,
          basicInfo,
          // metaDetails,
          availability,
          location,
          include,
          faq,
          gallaryData,
          addtionalInfo,
        },
        { abortEarly: false }
      );

      if (!gallaryData?.images || gallaryData.images.length === 0) {
        console.error("No images found in gallery data.");
        setLoading(false);
        return;
      }

      const imageUrls: string[] = await Promise.all(
        (gallaryData?.images ?? []).map((image) => uploadToS3(image, "service"))
      );

      const formatGallary = {
        images: imageUrls,
        videoLink: gallaryData?.videoLink,
      };

      const updatedAdditionalInfo = await Promise.all(
        addtionalInfo.map(async (item, index) => {
          if (item.images) {
            const uploadedImageUrl = await uploadToS3(
              item.images,
              "service-addtional-infomation"
            );
            return { ...item, images: uploadedImageUrl, id: index + 1 };
          }
          return { ...item, images: "", id: index + 1 };
        })
      );
      const formatedData = await formatServiceData(
        basicInfo,
        staff,
        updatedAdditionalInfo,
        include,
        faq,
        // metaDetails,
        location,
        formatGallary,
        availability,
        isActive
      );
      await console.log("FINAL PAYLOAD SUMBIT------: ", formatedData);
      await mutate(formatedData);
    } catch (error) {
      if (error instanceof ValidationError) {
        // console.error("Validation Errors:", error.inner);

        const errors: { [key: string]: string } = {};

        error.inner.forEach((err: ValidationError) => {
          const path = err.path;
          const message = err.message;

          const keys = path.split(".");
          keys.reduce((acc, part, index) => {
            if (index === keys.length - 1) {
              acc[part] = message;
            } else {
              acc[part] = acc[part] || "";
            }
            return acc;
          }, errors);
        });

        addToast({
          title: "Validation Error",
          description: "Fix Validation Errors",
          radius: "md",
          color: "danger",
        });
        // console.error("Transformed errors:", errors);
        setValidationError(errors);
      }
    } finally {
      setLoading(false);
    }
  };
  const title = "Account Verification Required";
  const description =
    "You need to verify your provider account to continue. Please complete the verification process to access your dashboard and services.";

  return (
    <>
      {/* {loading && <Loading label="Submitting..." />} */}
      {loading && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-xl z-[9999]"
          role="status"
          aria-busy="true"
        >
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-t-primary border-gray-300"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
            Submitting...
          </p>
        </div>
      )}

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

      {isDisabled || shouldShowOverLimitModal && (
        <div className="flex items-center justify-center w-full mb-3 -mt-1">
          <Alert
            variant="faded"
            color="warning"
            description="You've exceeded your service limit. Adding more services may
                    incur additional charges"
            title="Service Limit Exceeded"
          />
        </div>
      )}


      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">Basic Information</p>
              </CardHeader>
              {/* Basic Information */}
              <CardBody className="gap-6">
                <Divider className="-my-2" />
                <CustomInput
                  label="Service Title"
                  isRequired={true}
                  type="text"
                  placeholder="Enter title"
                  name="serviceTitle"
                  onValueChange={(e) => {
                    setBasicInfo({
                      ...basicInfo,
                      serviceTitle: e,
                    });
                  }}
                />
                {validationError?.serviceTitle && (
                  <small className="text-error -mt-5">
                    {validationError?.serviceTitle}
                  </small>
                )}
                <CustomInput
                  label="Service Slug"
                  isRequired={true}
                  type="text"
                  placeholder="Enter slug"
                  name={basicInfo.slug}
                  onValueChange={(e) => {
                    setBasicInfo({
                      ...basicInfo,
                      slug: e,
                    });
                  }}
                />
                {validationError?.slug && (
                  <small className="text-error -mt-5">
                    {validationError?.slug}
                  </small>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <CustomAutocomplete
                      label="Category"
                      placeholder="Select category"
                      defaultItems={displayCategory}
                      selectedKey={basicInfo?.categoryId || undefined}
                      width="none"
                      onSelectionChange={(id) => {
                        setBasicInfo({
                          ...basicInfo,
                          categoryId: id,
                        });
                      }}
                      isRequired={true}
                    />
                    {validationError?.categoryId && (
                      <small className="text-error -mt-5">
                        {validationError?.categoryId}
                      </small>
                    )}
                  </div>
                  <div>
                    <CustomAutocomplete
                      label="Sub Category"
                      placeholder="Select subcategory"
                      description="First select category"
                      defaultItems={displaySubCategory}
                      selectedKey={basicInfo?.subCategoryId || undefined}
                      width="none"
                      onSelectionChange={(id) => {
                        setBasicInfo({
                          ...basicInfo,
                          subCategoryId: id,
                        });
                      }}
                      isRequired={true}
                    />
                    {validationError?.subCategoryId && (
                      <small className="text-error -mt-5">
                        {validationError?.subCategoryId}
                      </small>
                    )}
                  </div>
                </div>

                {/* PRICE */}
                <Divider className="my-1" />
                <div className="-mt-3">
                  <Switch
                    size="sm"
                    defaultSelected
                    isSelected={selectPkg}
                    onValueChange={setSelectPkg}
                  >
                    Select package
                  </Switch>
                </div>
                {!selectPkg ? (
                  <>
                    <CustomNumberInput
                      label="Price"
                      isRequired={true}
                      name={basicInfo.price}
                      onValueChange={(e) => {
                        setBasicInfo({
                          ...basicInfo,
                          price: e,
                        });
                      }}
                    />
                    {validationError?.price && (
                      <small className="text-error -mt-5">
                        {validationError?.price}
                      </small>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-body1">Package</p>
                    <div className="grid grid-cols-3 gap-5 -mt-3 ">
                      <div className="flex flex-col gap-5 border border-gray-400 rounded-md p-3 bg-slate-50">
                        <div className="flex flex-initial justify-between items-center">
                          <p className="text-body2 m">Basic</p>
                          <CustomCheckbox
                            label="Select"
                            isSelected={isBasic}
                            onValueChange={setIsBasic}
                          />
                        </div>
                        <CustomNumberInput
                          label="Price"
                          isDisabled={!isBasic}
                          placeholder="Enter price"
                        />
                      </div>
                      <div className="flex flex-col gap-5 border border-gray-400 rounded-md p-3 bg-green-50">
                        <div className="flex flex-initial justify-between items-center">
                          <p className="text-body2 m">Pro</p>
                          <CustomCheckbox
                            label="Select"
                            isSelected={isPro}
                            onValueChange={setIsPro}
                          />
                        </div>
                        <CustomNumberInput
                          label="Price"
                          isDisabled={!isPro}
                          placeholder="Enter price"
                        />
                      </div>
                      <div className="flex flex-col gap-5 border border-gray-400 rounded-md p-3 bg-yellow-50">
                        <div className="flex flex-initial justify-between items-center">
                          <p className="text-body2 m">Platinum</p>
                          <CustomCheckbox
                            label="Select"
                            isSelected={isPlatinum}
                            onValueChange={setIsPlatinum}
                          />
                        </div>
                        <CustomNumberInput
                          label="Price"
                          isDisabled={!isPlatinum}
                          placeholder="Enter price"
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* PKG */}

                {/* Staff */}
                <Divider className="my-1" />
                <p className="text-md font-medium -mt-3">Staffs</p>
                <CustomMultiselectDropdown
                  label="Select Staff"
                  options={displayStaff}
                  handleChangevalue={setStaff}
                />
                {/* {validationError?.serviceTitle && (
                  <small className="text-error -mt-5">
                    {validationError?.serviceTitle}
                  </small>
                )} */}
                {/* Include */}
                <Divider className="my-1" />
                <p className="text-md font-medium -mt-3">Includes</p>
                <SingleMultipleInput
                  onChangeValude={setInclude}
                  error={validationError}
                />
                <Divider className="my-1" />
                {/* Addtional information */}
                <p className="text-md font-medium -mt-3">
                  Addtional information{" "}
                </p>
                <MultipleInput onChangeValude={setAddtionalInfo} />
                {/* Service Overview */}
                <Divider className="my-1" />
                <p className="text-md font-medium -mt-3">Service Overview </p>
                <TextEdior
                  name={basicInfo.serviceOverview}
                  onChangeValue={(value) => {
                    setBasicInfo((prev) => ({
                      ...prev,
                      serviceOverview: value,
                    }));
                  }}
                  value={basicInfo.serviceOverview}
                />
                {validationError?.serviceOverview && (
                  <p className="text-error -mt-5">
                    {validationError?.serviceOverview}
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Gallary */}
            <Card radius="none" className="px-3 py-3 mb-5 rounded-none">
              <CardHeader>
                <p className="text-md font-medium">Gallary</p>
              </CardHeader>

              <CardBody className="gap-6">
                <Divider className="-my-2" />
                <GallaryInput
                  onChangeValue={(value) =>
                    setGallaryData(value as IGallaryProps)
                  }
                  error={validationError}
                />
              </CardBody>
            </Card>

            {/* Active Service */}
            <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">Active Service</p>
              </CardHeader>

              <CardBody>
                <CustomCheckbox
                  label="Active"
                  isSelected={isActive}
                  onValueChange={setIsActive}
                />
              </CardBody>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">Availability</p>
              </CardHeader>

              {/* Availability */}
              <CardBody className="gap-6">
                <Divider className="-my-2" />
                <CustomAvailabilityInput onChangeValue={setAvailability} />
                {validationError?.day && (
                  <small className="text-error -mt-5">
                    {validationError?.day}
                  </small>
                )}
                {validationError?.from && (
                  <small className="text-error -mt-5">
                    {validationError?.from}
                  </small>
                )}
                {validationError?.to && (
                  <small className="text-error -mt-5">
                    {validationError?.to}
                  </small>
                )}
                {validationError?.maxBookings && (
                  <small className="text-error -mt-5">
                    {validationError?.maxBookings}
                  </small>
                )}
              </CardBody>
            </Card>

            {/* FAQ */}
            <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">FAQ</p>
              </CardHeader>

              <CardBody className="gap-6">
                <Divider className="-my-2" />
                <CustomDubbleInput
                  onChangeValue={setFaq}
                  error={validationError?.faq}
                />
                {/* {validationError?.faq && (
                  <small className="text-error -mt-5">
                    {validationError?.faq}
                  </small>
                )} */}
              </CardBody>
            </Card>

            {/* SEO */}
            {/* <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">SEO</p>
              </CardHeader>

              <CardBody className="gap-6">
                <Divider className="-my-2" />
                <CustomInput
                  label="Meta Title"
                  type="text"
                  placeholder="Enter meta title"
                  isRequired={true}
                  name={metaDetails.metaTitle}
                  onValueChange={(e) => {
                    setMetaDetails({
                      ...metaDetails,
                      metaTitle: e,
                    });
                  }}
                />
                {validationError?.metaTitle && (
                  <small className="text-error -mt-5">
                    {validationError?.metaTitle}
                  </small>
                )}
                <CustomInput
                  size="md"
                  label="Meta Tag"
                  type="text"
                  placeholder="Enter Tags"
                  description="Enter comma separated tags (Ex: tag1, tag2, tag3)"
                  isRequired={true}
                  name={metaDetails.metaKeywords}
                  onValueChange={(value) => convertMetaKeyword(value)}
                />
                {validationError?.metaKeywords && (
                  <small className="text-error -mt-5">
                    {validationError?.metaKeywords}
                  </small>
                )}
                <CustomTextArea
                  label="Meta Description"
                  placeholder="Enter meta description"
                  isRequired={true}
                  name={metaDetails.metaDescription}
                  onValueChange={(e) => {
                    setMetaDetails({
                      ...metaDetails,
                      metaDescription: e,
                    });
                  }}
                />
                {validationError?.metaDescription && (
                  <small className="text-error -mt-5">
                    {validationError?.metaDescription}
                  </small>
                )}
              </CardBody>
            </Card> */}

            <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">Location</p>
              </CardHeader>

              <LocationInputs
                errors={validationError}
                onChangeValue={(value) => {
                  setlocation(value);
                }}
              />
            </Card>
          </div>
        </div>

        <div className="flex flex-initial justify-end items-end my-1 gap-5">
          <CustomButton
            label="Clear"
            type="reset"
            color="danger"
            size="md"
            variant="flat"
          />
          <CustomButton
            label="Sumbit"
            type="submit"
            color="primary"
            size="md"
            // isDisabled={!isVerifyAccount ? true : false}
            isDisabled={isDisabled}

          />
        </div>
      </form>
    </>
  );
};

export default AddService;
