import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import CustomInput from "../../components/ui/CustomInput";
import CustomNumberInput from "../../components/ui/CustomNumberInput";
import { addToast, Card, CardBody, CardHeader, Divider } from "@heroui/react";
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
import Loading from "../../components/ui/Loading";
import {
  useFetchCategory,
  useFetchServiceDataById,
  useFetchStaff,
  useFetchSubCategory,
} from "../../hooks/queries/useFetchData";
import CustomButton from "../../components/ui/CustomButton";
import { serviceInfo } from "../../data/sampleData";
import { IoCodeSlashOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import serviceValidation from "../../validation/serviceValidation";
import { ValidationError } from "yup";
import { useUpdateServiceMutation } from "../../hooks/mutations/useUpdateData";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm<IServiceProps>({});
  const [staff, setStaff] = useState<string[]>([]);
  const [displayStaff, setDisplayStaff] = useState<
    { label: string; id: number }[]
  >([]);
  const [addtionalInfo, setAddtionalInfo] = useState<ItemField[]>([]);
  const [displayAddtionalInfo, setADisplayddtionalInfo] = useState<ItemField[]>(
    []
  );
  const [validationError, setValidationError] = useState({});
  const [include, setInclude] = useState<string[]>([]);
  const [serviceOverview, setServiceOverview] = useState<string>("");
  const [faq, setFaq] = useState<IFaqProps[]>([]);
  const [displayFaq, setDisplayFaq] = useState<IFaqProps[]>([]);
  const [metaKeyword, setMetaKeyword] = useState<string>("");
  const [location, setlocation] = useState<ILocationProps>();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [gallaryData, setGallaryData] = useState<IGallaryProps>();
  const [displayGallaryData, setDisplayGallaryData] = useState<string[]>();
  const [link, setLink] = useState<string | undefined>();
  const [availability, setAvailability] = useState<IAvailabilityProps[]>();
  const [displayAvailability, setDisplayAvailability] =
    useState<IAvailabilityProps[]>();
  const [data, setData] = useState<IServiceProps>();
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [displayCategory, setDisplayCategory] = useState();
  const [displaySubCategory, setDisplaySubCategory] = useState();
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

  const isUpdate = true;

  const { mutate, isPending } = useUpdateServiceMutation();
  const { data: apiData, isLoading } = useFetchServiceDataById(id);

  console.log("Data: ", apiData);

  useEffect(() => {
    if (apiData) {
      (async () => {
        await setApiData();
      })();
    }
  }, [apiData]);

  const { data: staffData } = useFetchStaff({ page: 1, limit: 100 });
  const { data: categoryData } = useFetchCategory();
  const { data: subCategoryData } = useFetchSubCategory();

  interface ItemField {
    id: number;
    serviceItem: string;
    price: number;
    images: string | File | null;
  }

  const handleAdditionalInfoChange = (updatedValues: ItemField[]) => {
    setAddtionalInfo([...updatedValues]);
  };

  useEffect(() => {
    if (apiData) {
      setApiData();
    }
  }, [apiData]);

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
  }, [basicInfo.categoryId]);

  const setApiData = async () => {
    await setLoading(true);
    try {
      setBasicInfo({
        serviceTitle: apiData?.serviceInfo?.serviceTitle,
        slug: apiData?.serviceInfo?.slug,
        categoryId: apiData?.serviceInfo?.categoryId,
        subCategoryId: apiData?.serviceInfo?.subCategoryId,
        serviceOverview: apiData?.serviceInfo?.serviceOverview,
        price: apiData?.serviceInfo?.price,
      });
      setMetaDetails({
        metaTitle: apiData?.serviceInfo?.seo?.[0]?.metaTitle,
        metaDescription: apiData?.serviceInfo?.seo?.[0]?.metaDescription,
        metaKeywords: apiData?.serviceInfo?.seo?.[0]?.metaKeywords,
      });
      setDisplayAvailability(apiData?.serviceInfo?.availability);

      setIsAllDay(false);
      setADisplayddtionalInfo(apiData?.serviceInfo?.additionalServices);
      setData(apiData?.serviceInfo);
      setInclude(apiData?.serviceInfo?.includes);
      setServiceOverview(apiData?.serviceInfo?.serviceOverview);
      setFaq(apiData?.serviceInfo?.faq);
      setDisplayFaq(apiData?.serviceInfo?.faq);
      setMetaKeyword(
        apiData?.serviceInfo?.seo?.[0]?.metaKeywords?.join(", ") || ""
      );
      setlocation(apiData?.serviceInfo?.location);
      setIsActive(apiData?.serviceInfo?.isActive);
      setStaff(apiData?.serviceInfo?.staff);
      const formatStaff = await formateDataForDropdown(
        staffData?.staff,
        "fullName",
        "staffId"
      );
      setDisplayStaff(formatStaff);
      setDisplayGallaryData(apiData?.serviceInfo?.gallery[0]?.serviceImages);
      setLink(apiData?.serviceInfo?.gallery[0]?.videoLink);

      const formtedCategory = formateDataForDropdown(
        categoryData?.categories,
        "categoryName",
        "categoryId"
      );
      setDisplayCategory(formtedCategory);

      const subcategoryList = subCategoryData?.subCategories.filter(
        (subCategory: any) =>
          subCategory.categoryId === apiData?.serviceInfo?.categoryId
      );

      const formtedSubCategory = formateDataForDropdown(
        subCategoryData?.subCategories,
        "subCategoryName",
        "subCategoryId"
      );

      const formtedSubCategory2 = formateDataForDropdown(
        subcategoryList,
        "subCategoryName",
        "subCategoryId"
      );
      setDisplaySubCategory(formtedSubCategory2);
    } catch (error) {
      console.error(
        "Error: Something went wrong while prefilling edit service data"
      );
      addToast({
        title: "Error",
        description: "Something went wrong while prefilling data",
        radius: "md",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const convertMetaKeyword = async (keyword: string) => {
    const convertToMetaKeyword = convertToTagsArray(keyword);
    setMetaDetails((prevDetails) => ({
      ...prevDetails,
      metaKeywords: convertToMetaKeyword,
    }));
  };

  const onSubmit: SubmitHandler<IServiceProps> = async (data) => {
    console.log("RUN");
    setLoading(true);
    try {
      await serviceValidation.validate(
        {
          staff,
          basicInfo,
          metaDetails,
          availability,
          location,
          include,
          faq,
          gallaryData,
          addtionalInfo,
        },
        { abortEarly: false }
      );
      console.log("RUN 2", serviceValidation);
      if (!gallaryData?.images || gallaryData.images.length === 0) {
        console.error("No images found in gallery data.");
        setLoading(false);
        return;
      }
      const formatGallary = await uploadImages(gallaryData);

      console.log("RUN3 ");

      const updatedAdditionalInfo = await Promise.all(
        addtionalInfo.map(async (item, index) => {
          if (typeof item.images === "string") {
            return { ...item, id: index + 1 };
          }

          if (item.images instanceof File) {
            const uploadedImageUrl = await uploadToS3(
              item.images,
              "service-additional-information"
            );
            return { ...item, images: uploadedImageUrl, id: index + 1 };
          }

          return { ...item, images: "", id: index + 1 };
        })
      );
      console.log("RUN4 ");
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
        isActive,
        isUpdate
      );
      await console.log("FINAL PAYLOAD UPDATE------: ", formatedData);
      mutate({ id: id, serviceData: formatedData });
    } catch (error) {
      if (error instanceof ValidationError) {
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

        console.error("Transformed errors:", errors);
        setValidationError(errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (gallaryData: {
    images: (string | File)[];
    videoLink: string;
  }) => {
    if (!gallaryData?.images) return;

    // Separate URLs and Files
    const existingImageUrls = gallaryData.images.filter(
      (img) => typeof img === "string"
    ) as string[];
    const newFiles = gallaryData.images.filter(
      (img) => img instanceof File
    ) as File[];

    // Upload only new files to S3
    const uploadedFileUrls: string[] = await Promise.all(
      newFiles.map((file) => uploadToS3(file, "service"))
    );

    // Merge existing URLs and new uploaded URLs
    const finalImageUrls = [...existingImageUrls, ...uploadedFileUrls];

    return {
      images: finalImageUrls,
      videoLink: gallaryData.videoLink, // Keep video link as it is
    };
  };

  return (
    <>
      {/* {isLoading && <Loading label="Fetching..." />} */}
      {/* {loading && <Loading label="Updating..." />} */}
      {isLoading && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-xl z-[9999]"
          role="status"
          aria-busy="true"
        >
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-t-primary border-gray-300"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
            Fetching...
          </p>
        </div>
      )}
      {loading && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-xl z-[9999]"
          role="status"
          aria-busy="true"
        >
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-t-primary border-gray-300"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
            Updating...
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <form> */}
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
                  name={basicInfo.serviceTitle}
                  value={basicInfo.serviceTitle}
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
                  value={basicInfo.slug}
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
                  <CustomAutocomplete
                    label="Category"
                    placeholder="Select category"
                    defaultItems={displayCategory}
                    // selectedKey={basicInfo?.categoryId}
                    selectedKey={basicInfo?.categoryId}
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
                  <CustomAutocomplete
                    label="Sub Category"
                    placeholder="Select subcategory"
                    defaultItems={displaySubCategory}
                    selectedKey={basicInfo?.subCategoryId}
                    // defaultSelectedKey={basicInfo.subCategoryId}
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
                <CustomNumberInput
                  label="Price"
                  isRequired={true}
                  name={basicInfo.price}
                  value={basicInfo.price}
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

                {/* Staff */}
                <Divider className="my-1" />
                <p className="text-md font-medium -mt-3">Staffs</p>

                <CustomMultiselectDropdown
                  label="Select Staff"
                  options={displayStaff ? displayStaff : []}
                  handleChangevalue={setStaff}
                  isUpdate={true}
                  value={staff}
                />

                {/* Include */}
                <Divider className="my-1" />
                <p className="text-md font-medium -mt-3">Includes</p>
                <SingleMultipleInput
                  value={include}
                  onChangeValude={setInclude}
                />
                {validationError?.include && (
                  <small className="text-error -mt-5">
                    {validationError?.include}
                  </small>
                )}
                <Divider className="my-1" />

                {/* Addtional information */}
                <p className="text-md font-medium -mt-3">
                  Addtional information{" "}
                </p>
                <MultipleInput
                  isUpdate={true}
                  value={displayAddtionalInfo}
                  onChangeValude={handleAdditionalInfoChange}
                />

                {/* Service Overview */}
                <Divider className="my-1" />
                <p className="text-md font-medium -mt-3">Service Overview </p>
                <TextEdior
                  onChangeValue={setServiceOverview}
                  value={serviceOverview}
                  {...register("serviceOverview")}
                />
                {validationError?.serviceOverview && (
                  <p className="text-error -mt-5">
                    {validationError?.serviceOverview}
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Gallary */}
            <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">Gallary</p>
              </CardHeader>

              <CardBody className="gap-6">
                <Divider className="-my-2" />
                <GallaryInput
                  link={link}
                  value={displayGallaryData}
                  onChangeValue={(value) =>
                    setGallaryData({
                      images: value.images as File[],
                      videoLink: value.videoLink,
                    })
                  }
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
                <CustomAvailabilityInput
                  isAllDay={isAllDay}
                  value={displayAvailability}
                  onChangeValue={setAvailability}
                />
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
                  isUpdate={true}
                  value={displayFaq}
                  onChangeValue={setFaq}
                  error={validationError?.faq}
                />
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
                  // value={data?.seo?.[0]?.metaTitle}
                  // {...register("seo.0.metaTitle")}
                  name={metaDetails.metaTitle}
                  value={metaDetails.metaTitle}
                  onValueChange={(e) => {
                    setMetaDetails({
                      ...metaDetails,
                      metaTitle: e,
                    });
                  }}
                />
                <CustomInput
                  size="md"
                  label="Meta Tag"
                  type="text"
                  placeholder="Enter Tags"
                  description="Enter comma separated tags (Ex: tag1, tag2, tag3)"
                  isRequired={true}
                  name={metaDetails.metaKeywords}
                  value={metaDetails.metaKeywords}
                  onValueChange={(value) => convertMetaKeyword(value)}
                  // onValueChange={setMetaKeyword}
                />

                <CustomTextArea
                  label="Meta Description"
                  placeholder="Enter meta description"
                  isRequired={true}
                  // value={data?.seo?.[0]?.metaDescription}
                  // {...register("seo.0.metaDescription")}
                  name={metaDetails.metaDescription}
                  value={metaDetails.metaDescription}
                  onValueChange={(e) => {
                    setMetaDetails({
                      ...metaDetails,
                      metaDescription: e,
                    });
                  }}
                />
              </CardBody>
            </Card> */}
            <Card radius="none" className="px-3 py-3 mb-5">
              <CardHeader>
                <p className="text-md font-medium">Location</p>
              </CardHeader>

              <LocationInputs
                data={data?.location[0]}
                onChangeValue={setlocation}
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
            label="Update"
            type="submit"
            color="primary"
            size="md"
          />
        </div>
      </form>
    </>
  );
};

export default EditService;
