import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { defaultServiceValues } from "../../utils/defaultValue";
import CustomButton from "../../components/ui/CustomButton";
import { days } from "../../data/sampleData";
import { TimeValue } from "@react-types/datepicker";
import { BiDollar } from "react-icons/bi";
import {
  addToast,
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DatePicker,
  DateRangePicker,
  Divider,
  Radio,
  RadioGroup,
  RangeValue,
  Select,
  SelectedItems,
  Selection,
  SelectItem,
  Switch,
  TimeInput,
} from "@heroui/react";
import CustomInput from "../../components/ui/CustomInput";
import {
  useFetchCategory,
  useFetchStaff,
  useFetchSubCategory,
  useFetchUserDetailsById,
} from "../../hooks/queries/useFetchData";
import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
import {
  convertStaffStringToArray,
  createSlug,
  formateDataForDropdown,
  processAdditionalServices,
  processAvailability,
  processDiscount,
  processPackage,
} from "../../utils/serviceUtils";
import { useEffect, useRef, useState } from "react";
import {
  IAdditionalServicesResponse,
  IDiscountProps,
  IPackageProps,
  IServiceProps,
  IServiceSubmitProps,
  iStaffGetProps,
  ISubcategoryProps,
} from "../../types";
import CustomNumberInput from "../../components/ui/CustomNumberInput";
import CustomChip from "../../components/ui/CustomChip";
import { IoIosAddCircleOutline, IoMdClose, IoMdTime } from "react-icons/io";
import { RiDeleteBin4Line } from "react-icons/ri";
import TextEditor from "../../components/ui/TextEdior";
import GallaryInput from "../../components/ui/GallaryInput";
import { BsLink45Deg } from "react-icons/bs";
import CustomCheckbox from "../../components/ui/CustomCheckbox";
import { CiCalendar } from "react-icons/ci";
import {
  convertToInternationalizedDateTimeToReadble,
  convertToInternationalizedTimeToReadble,
} from "../../utils/convertTime";
import { yupResolver } from "@hookform/resolvers/yup";
import { serviceSchema } from "../../validation/serviceSchema";
import CustomDivider from "../../components/ui/CustomDivider";
import LocationPin from "../../assets/location-pin.png";
import L from "leaflet";
import CustomPoporver from "../../components/ui/CustomPoporver";
import { getFlatOverlapError } from "../../validation/ValidationRules";
import { useAuth } from "react-oidc-context";
import { multipleFileUplaodHelper } from "../../utils/common";
import { useSumbitServiceMutation } from "../../hooks/mutations/usePostData";
import FullLoading from "../../components/ui/FullLoading";

import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import PackageInput from "../../components/ui/PackageSection";
import { FaUser } from "react-icons/fa";
import NestedInput from "../../data/new Input";
import PackageSection from "../../components/ui/PackageSection";
import ServicePreview from "./ServicePreview";

interface IDropdownData {
  label: string;
  id: string;
}

const AddService1 = () => {
  const myAPIKey = import.meta.env.VITE_GEOLOCATION_API_KEY;
  const auth = useAuth();
  // const { control, handleSubmit, register } = form;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryList, setCategoryList] = useState<IDropdownData[]>([]);
  const [subcategoryList, setSubcategoryList] = useState<IDropdownData[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Selection>(new Set([]));

  const [isAddtional, setIsAddtional] = useState(false);
  const [isFaq, setIsFaq] = useState(false);
  const [isPackage, setIsPackage] = useState(false);
  const [isPackageDiscount, setIsPackageDiscount] = useState(false);
  // const [discountType, setDiscountType] = useState<string>("general-discount");
  const [discountValueType, setDiscountValueType] =
    useState<string>("percentage");
  // const [discountDurationType, setDiscountDurationType] =
  //   useState<string>("life-time");

  const [latitude, setLatitude] = useState<number>(45.390735);
  const [longitude, setLongitude] = useState<number>(-75.72876);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [dayChange, setDayChange] = useState<boolean>(false);
  const [startTimeChange, setStartTimeChange] = useState<boolean>(false);
  const [endTimeChange, setEndTimeChange] = useState<boolean>(false);

  const providerId = auth.user?.profile?.preferred_username;

  //API DATA
  const { data: apiCategoryData } = useFetchCategory();
  const { data: apiSubCategoryData } = useFetchSubCategory();
  const { data: apiStaffData } = useFetchStaff({ page: 1, limit: 100 });
  const { data: providerDetails } = useFetchUserDetailsById(providerId);
  const { mutateAsync } = useSumbitServiceMutation();

  // const {
  // register,
  // handleSubmit,
  // control,
  // setValue,
  // resetField,
  // watch,
  // reset,
  // trigger,
  // setError,
  // clearErrors,
  // formState: { errors },
  // } = useForm<IServiceSubmitProps>({
  //   defaultValues: defaultServiceValues,
  //   shouldUnregister: false,
  //   resolver: yupResolver(serviceSchema),
  //   mode: "onChange", // validate as the user types
  //   reValidateMode: "onChange", // re-validate after changes
  //   context: { isFaq, isAddtional },
  // });

  const form = useForm<IServiceSubmitProps>({
    defaultValues: defaultServiceValues,
    shouldUnregister: true,
    resolver: yupResolver(serviceSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    context: { isFaq, isAddtional, isPackage },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    resetField,
    watch,
    reset,
    getValues,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const categoryId = watch("categoryId");
  const selectCity = watch("location.0.city");
  const selectState = watch("location.0.state");
  const availability = watch("availability");
  const discountType = watch("discount.discountType");
  const discountDurationType = watch("discount.durationType");
  const isPackageSelect = watch("isPackage");

  // const isPackageSelect = getValues("isPackage");
  console.log("discount type: ", discountType);

  const fullData = watch();
  // console.log("isPackageSelect: ", isPackage);

  // console.log("FULL PAYLOD: ", watch());
  // console.log("discountDurationType", discountDurationType);
  console.log("VALIDATION ERROR: ", errors);

  useEffect(() => {
    setIsPackage(isPackageSelect);
  }, [isPackageSelect]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]); // Close suggestions
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Category formating for display value in dropdown
  useEffect(() => {
    const formtedCategory = formateDataForDropdown(
      apiCategoryData?.categories,
      "categoryName",
      "categoryId"
    );
    if (!formtedCategory) return;
    setCategoryList(formtedCategory);
  }, [apiCategoryData?.categories]);

  //SubCategory formating for display value in dropdown
  useEffect(() => {
    const getSubcategorybyCategoryId = apiSubCategoryData?.subCategories.filter(
      (item: ISubcategoryProps) => {
        return item.categoryId === categoryId;
      }
    );
    if (!getSubcategorybyCategoryId) return;

    const formtedSubCategory = formateDataForDropdown(
      getSubcategorybyCategoryId,
      "subCategoryName",
      "subCategoryId"
    );

    setSubcategoryList(formtedSubCategory);
  }, [categoryId, apiSubCategoryData?.subCategories]);

  //include
  const { fields, append, remove } = useFieldArray({
    name: "includes",
    control,
  });

  //addtional service
  const {
    fields: addtionalServiceField,
    append: appendAddtionalService,
    remove: removeAdditionalService,
  } = useFieldArray({
    name: "additionalService",
    control,
  });

  //availability
  const {
    fields: availabilityField,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    name: "availability",
    control,
  });

  //faq
  const {
    fields: faqField,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    name: "faq",
    control,
  });

  //PACKAGE
  // const {
  //   fields: packaegField,
  //   append: appendPackage,
  //   remove: removePackage,
  // } = useFieldArray({
  //   name: "package",
  //   control,
  // });

  useEffect(() => {
    if (fields.length === 0) append("");
    // if (packaegField.length === 0)
    //   appendPackage({
    //     isDiscount: false,
    //     packageName: "",
    //     price: 0,
    //     includes: [],
    //     discount: {
    //       discountType: "general-discount",
    //       valueType: "percentage",
    //       durationType: "life-time",
    //       amount: 0,
    //       duration: {
    //         start: "",
    //         end: "",
    //       },
    //       maxCount: 0,
    //       afterDiscountPrice: 0,
    //     },
    //   });
    if (addtionalServiceField.length === 0)
      appendAddtionalService({
        serviceItem: "",
        price: 0,
        id: "",
        images: "",
      });
  }, [append, fields.length]);

  useEffect(() => {
    setValue("isfaq", isFaq);
    if (!isFaq) {
      resetField("faq");
    }
  }, [isFaq, resetField, setValue]);

  useEffect(() => {
    setValue("isAddtional", isAddtional);
    if (!isAddtional) {
      resetField("additionalService");
    }
  }, [isAddtional, resetField, setValue]);

  useEffect(() => {
    const map = L.map("map").setView([latitude, longitude], 13);

    const customIcon = L.icon({
      iconUrl: LocationPin,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${myAPIKey}`,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
      }
    ).addTo(map);

    const marker = L.marker([latitude, longitude], {
      icon: customIcon,
      draggable: true,
    })
      .addTo(map)
      .bindPopup(
        [selectState, selectCity].filter(Boolean).join(", ") ||
          "Drag me to set latitude and longitude"
      )
      .openPopup();

    marker.on("dragend", function () {
      const latlng = marker.getLatLng();
      setValue("location.0.latitude", Number(latlng.lat.toFixed(6)));
      setValue("location.0.longitude", Number(latlng.lng.toFixed(6)));
    });

    return () => {
      map.remove();
    };
  }, [longitude, latitude]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) return;

      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&limit=5&apiKey=${myAPIKey}`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    };

    const debounce = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(debounce);
  }, [query]);

  const selectAddressSuggestion = (suggestion: any) => {
    const selected = suggestion?.properties;
    if (!selected) return;

    setQuery(selected.formatted || "");

    setValue("location.0.address", selected.address_line1 || "");
    setValue("location.0.country", selected.country || "");
    setValue("location.0.city", selected.city || "");
    setValue("location.0.state", selected.state || "");
    setValue("location.0.pinCode", selected.postcode || "");
    setValue("location.0.latitude", Number(selected.lat) || 0);
    setValue("location.0.longitude", Number(selected.lon) || 0);
    setValue("location.0.googleMapsPlaceId", selected.place_id || "");
    setLongitude(selected.lon);
    setLatitude(selected.lat);
    setSuggestions([]);
    trigger("location.0");
  };

  //SUBMIT DATA
  const onSubmit = async (data: IServiceSubmitProps) => {
    setIsLoading(true);

    const files = data.gallery?.[0]?.serviceImages;
    const addtionalService = data?.additionalService;
    const user = providerDetails?.user;
    const nestedFilePath = `${data?.serviceTitle}-${Date.now()}`;
    const generateProviderFolder = `${user.userId}-${user.name}`;
    const staff = data?.staff;
    const availability = data?.availability;
    const packageData = data?.packages;
    const isPackageData = data?.isPackage;
    const isDiscountHas = data?.isDiscount;
    const discountData = data?.discount;

    // //Image upload
    if (!user || !data?.serviceTitle || !generateProviderFolder) {
      addToast({
        title: "Configuration Error",
        description:
          "Upload configuration parameters are missing. Please contact support if the issue persists.",
        radius: "md",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }

    const galleryImageUrls = await multipleFileUplaodHelper({
      files,
      baseFolder: "provider",
      mainFolder: "service",
      subFolder: generateProviderFolder,
      nestedPath: nestedFilePath,
      errorMessageType: "Image",
    });

    if (!galleryImageUrls || galleryImageUrls.length === 0) {
      addToast({
        title: "Image upload",
        description:
          "Uplaod failed. Please contact support if the issue persists.",
        radius: "md",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }

    //addtional service image upload
    let addtionalServiceResult: IAdditionalServicesResponse[] = [];

    if (addtionalService?.[0].images) {
      addtionalServiceResult = await processAdditionalServices(
        addtionalService,
        generateProviderFolder,
        nestedFilePath
      );
    } else {
      addtionalServiceResult = [];
    }

    const generatSlug = await createSlug(data?.serviceTitle);
    if (!generatSlug) {
      addToast({
        title: "Slug generation",
        description: "Slug generation failed. try again.",
        radius: "md",
        color: "danger",
      });
      setIsLoading(false);
      return;
    }
    console.log("Package data: ", packageData);
    let processPackageData: IPackageProps[] = [];

    if (isPackageData) {
      processPackageData = await processPackage(packageData);
    }
    console.log("Format package data: ", processPackageData);

    let processDiscountData: IDiscountProps | null = null;

    if (isDiscountHas && !isPackage) {
      processDiscountData = await processDiscount(discountData);
    }
    console.log("Format discount data:", processDiscountData);

    const staffArray = await convertStaffStringToArray(staff);
    const processAvilabilityResult = await processAvailability(availability);

    const payload = {
      ...data,
      slug: generatSlug,
      price: Number(data.price),
      staff: staffArray,
      additionalService: addtionalServiceResult,
      gallery: [
        {
          serviceImages: galleryImageUrls,
          videoLink: data?.gallery[0]?.videoLink,
        },
      ],
      availability: processAvilabilityResult,
      package: processPackageData,
      discount: processDiscountData,
    };

    console.log("Final Service Create payload: ", payload);
    try {
      await mutateAsync(payload);
      reset();
    } catch (e) {
      console.log("");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("All Value: ", watch(""));

  const poporverContent = () => {
    return (
      <div className="text-sm space-y-2">
        <div className="font-semibold text-base text-gray-800 dark:text-white">
          Availability Preview
        </div>

        <div className="bg-gray-50 dark:bg-sideBarBackground dark:border-gray-600 p-2 rounded-md border text-gray-700  dark:text-gray-100 space-y-1">
          <div>
            <span className="font-medium">Day:</span> Monday
          </div>
          <div>
            <span className="font-medium">Start Time:</span> 1:00 PM
          </div>
          <div>
            <span className="font-medium">End Time:</span> 5:00 PM
          </div>
          <div>
            <span className="font-medium">Max Slots:</span> 5
          </div>
        </div>

        <CustomDivider />

        <div className="text-gray-800 font-semibold mb-2 dark:text-gray-100">
          Generated Slots:
        </div>

        <p className="text-sm text-gray-700 mb-1 dark:text-gray-200">
          Day: <span className="font-medium">Monday</span>
        </p>

        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
          <li>1:00 PM – 2:00 PM</li>
          <li>2:00 PM – 3:00 PM</li>
          <li>4:00 PM – 5:00 PM</li>
        </ul>

        <div className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
          Note: Gaps may exist due to rest/travel time between slots.
        </div>
      </div>
    );
  };

  useEffect(() => {
    const err = getFlatOverlapError(availability);
    if (err) {
      setError("availability", { type: "manual", message: err });
    } else {
      clearErrors("availability");
    }
  }, [dayChange, startTimeChange, endTimeChange]);

  console.log("---------------------------------------------");

  return (
    <>
      {isLoading && (
        <FullLoading label="Please wait, this may take some time. Submitting..." />
      )}

      <div className="flex justify-end items-center mb-4">
        {/* <ServicePreview data={fullData} cate
  },[watch])

  return (
    <>
      {isLoading && (
        <FullLoading label="Please wait, this may take some time. Submitting..." />
      )}

      <div className="flex justify-end items-center mb-4">
        {/* <ServicePreview data={fullData} category={apiCategoryData} /> */}
        <ServicePreview data={fullData} category={apiCategoryData} />
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    type="text"
                    isRequireField={true}
                    placeholder="Enter title"
                    isInvalid={!!errors?.serviceTitle}
                    errorMessage={errors?.serviceTitle?.message}
                    {...register("serviceTitle")}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Controller
                        name="categoryId"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <CustomAutocomplete
                              label="Category"
                              placeholder="Select category"
                              defaultItems={categoryList}
                              width="none"
                              onSelectionChange={(val) => {
                                field.onChange(val);
                              }}
                              isInvalid={!!errors.categoryId?.message}
                              errorMessage={errors.categoryId?.message}
                            />
                          </>
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        name="subCategoryId"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <CustomAutocomplete
                              label="Sub Category"
                              placeholder="Select sub category"
                              defaultItems={subcategoryList}
                              width="none"
                              onSelectionChange={(val) => {
                                field.onChange(val);
                              }}
                              description="First select a category"
                              isInvalid={!!errors.subCategoryId?.message}
                              errorMessage={errors.subCategoryId?.message}
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  {/* STAFF */}
                  <Controller
                    name="staff"
                    defaultValue={[]}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        variant="bordered"
                        label="Add Staff"
                        labelPlacement="outside"
                        placeholder="Select a service"
                        selectionMode="multiple"
                        selectedKeys={selectedStaff}
                        onSelectionChange={setSelectedStaff}
                        items={apiStaffData?.staff || []}
                        errorMessage={fieldState.error?.message}
                        renderValue={(items: SelectedItems<iStaffGetProps>) => (
                          <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                              <CustomChip
                                key={item.key}
                                label={item?.data?.fullName}
                              />
                            ))}
                          </div>
                        )}
                      >
                        {(data: iStaffGetProps) => (
                          <SelectItem
                            key={data.staffId}
                            textValue={data.fullName}
                          >
                            <div className="flex gap-2 items-center">
                              <Avatar
                                alt={data.fullName}
                                className="shrink-0"
                                size="sm"
                              />
                              <div className="flex flex-col">
                                <span className="text-small">
                                  {data.fullName}
                                </span>
                                <span className="text-tiny text-default-400">
                                  {data.staffId}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />
                </CardBody>
              </Card>

              {/* PRICE AND DISCOUNT*/}
              <PackageSection />

              {!isPackageSelect && (
                <Card radius="none" className="px-3 py-3 mb-5">
                  <CardHeader>
                    <div className="flex items-center flex-initial gap-4 ">
                      <p className="text-md font-medium mt-3 mb-5">Discount</p>
                      <Controller
                        name="discount.isDiscount"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <Switch
                            isSelected={watch("discount.isDiscount")}
                            onValueChange={(val: boolean) => {
                              field.onChange(val);
                              setValue("isDiscount", val);
                              if (!val) {
                                resetField("discount");
                              }
                              trigger("discount.isDiscount");
                            }}
                            size="sm"
                            className="mb-2"
                          />
                        )}
                      />
                    </div>
                  </CardHeader>
                  <CardBody>
                    {/* DISCOUNT  */}
                    <div className="">
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                        <div className="flex flex-col">
                          {/* DISCOUNT DURATION TYPE */}
                          <div
                            className={`${
                              errors.discount?.discountType
                                ? "border-red-500 bg-red-50 dark:border-red-500"
                                : ""
                            } border-1 rounded-lg p-3 dark:border-gray-600/50  bg-cyan-100 dark:bg-neutral-800`}
                          >
                            <Controller
                              name="discount.discountType"
                              control={control}
                              defaultValue="general-discount"
                              render={({ field }) => (
                                <>
                                  <RadioGroup
                                    label="Discount Type"
                                    orientation="horizontal"
                                    classNames={{
                                      label: "text-body1",
                                    }}
                                    defaultValue="general-discount"
                                    value={watch("discount.discountType")}
                                    onValueChange={(val: string) => {
                                      field.onChange(val);
                                      if (val === "promo-code") {
                                        resetField("discount.promoCode");
                                      }
                                    }}
                                    isInvalid={!!errors.discount?.discountType}
                                    // isInvalid={true}
                                  >
                                    <Radio
                                      classNames={{
                                        label: "text-sm dark:text-gray-300",
                                      }}
                                      value="general-discount"
                                      size="sm"
                                      className="mr-3"
                                    >
                                      General Discount
                                    </Radio>
                                    <Radio
                                      classNames={{
                                        label: "text-sm dark:text-gray-300",
                                      }}
                                      value="promo-code"
                                      size="sm"
                                    >
                                      Promo Code
                                    </Radio>
                                  </RadioGroup>
                                </>
                              )}
                            />
                          </div>
                          {errors.discount?.discountType && (
                            <span className="text-error">
                              {errors.discount?.discountType.message}
                            </span>
                          )}
                        </div>

                        {/* DISCOUNT TYPE */}
                        <div className=" border-1 rounded-lg p-3 dark:border-gray-600/50 bg-cyan-100 dark:bg-neutral-800">
                          <Controller
                            name="discount.valueType"
                            control={control}
                            defaultValue="percentage"
                            render={({ field }) => (
                              <>
                                <RadioGroup
                                  label="Value Type"
                                  orientation="horizontal"
                                  classNames={{
                                    label: "text-body1",
                                  }}
                                  value={watch("discount.valueType")}
                                  onValueChange={(val: string) => {
                                    field.onChange(val);
                                  }}
                                  isInvalid={!!errors.discount?.valueType}
                                >
                                  <Radio
                                    classNames={{
                                      label: "text-sm dark:text-gray-300",
                                    }}
                                    value="amount"
                                    size="sm"
                                    className="mr-3"
                                  >
                                    Amount
                                  </Radio>
                                  <Radio
                                    classNames={{
                                      label: "text-sm dark:text-gray-300",
                                    }}
                                    value="percentage"
                                    size="sm"
                                  >
                                    Percentage
                                  </Radio>
                                </RadioGroup>
                              </>
                            )}
                          />
                          {errors.discount?.valueType && (
                            <span className="text-error">
                              {errors.discount?.valueType?.message}
                            </span>
                          )}
                        </div>

                        {/* DISCOUNT DURATION TYPE */}
                        <div className=" border-1 rounded-lg p-3 dark:border-gray-600/50 bg-cyan-100  dark:bg-neutral-800">
                          <Controller
                            name="discount.durationType"
                            control={control}
                            defaultValue="life-time"
                            render={({ field }) => (
                              <>
                                <RadioGroup
                                  label="Duration Type"
                                  orientation="horizontal"
                                  classNames={{
                                    label: "text-body1",
                                  }}
                                  value={watch("discount.durationType")}
                                  onValueChange={(val: string) => {
                                    field.onChange(val);
                                  }}
                                  isInvalid={!!errors.discount?.durationType}
                                >
                                  <Radio
                                    classNames={{
                                      label: "text-sm dark:text-gray-300",
                                    }}
                                    value="life-time"
                                    size="sm"
                                    className="mr-3"
                                  >
                                    Life time
                                  </Radio>
                                  <Radio
                                    classNames={{
                                      label: "text-sm dark:text-gray-300",
                                    }}
                                    value="time-base"
                                    size="sm"
                                  >
                                    Time Base
                                  </Radio>
                                </RadioGroup>
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div
                        className={`grid ${
                          discountType === "promo-code"
                            ? " 2xl:grid-cols-3"
                            : "2xl:grid-cols-2"
                        }   items-center gap-4 mt-8`}
                      >
                        {/* AMOUNT */}
                        {discountType === "promo-code" && (
                          <CustomInput
                            label="Code"
                            placeholder="Type code"
                            isRequireField={true}
                            {...register("discount.promoCode")}
                            type="text"
                            value={watch("discount.promoCode")?.toUpperCase()}
                            isInvalid={!!errors?.discount?.promoCode}
                            errorMessage={errors?.discount?.promoCode?.message}
                          />
                        )}

                        {/* AMOUNT */}
                        <CustomNumberInput
                          label="Amount"
                          placeholder="Enter amount"
                          {...register("discount.amount")}
                          isRequireField={true}
                          startContent={<BiDollar className="text-gray-400" />}
                          isInvalid={!!errors.discount?.amount?.message}
                          errorMessage={errors.discount?.amount?.message}
                        />
                        {/* MAX COUNT */}
                        <CustomNumberInput
                          label="Max Count"
                          placeholder="Enter count"
                          {...register("discount.maxCount")}
                          startContent={
                            <FaUser className="text-gray-400" size={14} />
                          }
                          isInvalid={!!errors.discount?.maxCount?.message}
                          errorMessage={errors.discount?.maxCount?.message}
                        />
                        {/* TIME RANGE */}
                        <div
                          className={`w-full ${
                            discountType === "promo-code"
                              ? "2xl:col-span-2"
                              : ""
                          }`}
                        >
                          {discountDurationType === "life-time" ? (
                            <Controller
                              name={"discount.duration.start"}
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  label="Start Date"
                                  aria-label="Select Start date"
                                  minValue={today(getLocalTimeZone())}
                                  variant="bordered"
                                  labelPlacement="outside"
                                  // value={{
                                  //   start:
                                  //     convertReadableDateToDateObject(
                                  //       field.value?.start
                                  //     ) || null,
                                  //   end:
                                  //     convertReadableDateToDateObject(
                                  //       field.value?.end
                                  //     ) || null,
                                  // }}
                                  onChange={(value: CalendarDate) => {
                                    console.log(value);
                                    if (!value) return;
                                    field.onChange(
                                      convertToInternationalizedDateTimeToReadble(
                                        value
                                      )
                                    );
                                  }}
                                  classNames={{
                                    label:
                                      "after:content-['*'] after:text-red-500 after:ml-1",
                                  }}
                                  isDisabled={!watch("discount.isDiscount")}
                                  isInvalid={
                                    !!errors?.discount?.duration?.start
                                  }
                                  errorMessage={
                                    errors?.discount?.duration?.start?.message
                                  }
                                />
                              )}
                            />
                          ) : (
                            // <DateRangePicker
                            //   label="Select  Duration"
                            //   pageBehavior="single"
                            //   visibleMonths={3}
                            //   minValue={today(getLocalTimeZone())}
                            //   variant="bordered"
                            //   labelPlacement="outside"
                            //   classNames={{
                            //     label:
                            //       "after:content-['*'] after:text-red-500 after:ml-1",
                            //   }}
                            //   isInvalid={!!errors?.discount?.duration?.start}
                            //   errorMessage={
                            //     errors?.discount?.duration?.start?.message
                            //   }
                            // />
                            <Controller
                              name={"discount.duration.start"}
                              control={control}
                              render={({ field }) => (
                                <DateRangePicker
                                  label="Select  Duration"
                                  pageBehavior="single"
                                  visibleMonths={3}
                                  minValue={today(getLocalTimeZone())}
                                  variant="bordered"
                                  labelPlacement="outside"
                                  // value={{
                                  //   start:
                                  //     convertReadableDateToDateObject(
                                  //       field.value?.start
                                  //     ) || null,
                                  //   end:
                                  //     convertReadableDateToDateObject(
                                  //       field.value?.end
                                  //     ) || null,
                                  // }}
                                  onChange={(
                                    value: RangeValue<CalendarDate>
                                  ) => {
                                    if (!value?.start || !value?.end) return;
                                    field.onChange({
                                      start:
                                        convertToInternationalizedDateTimeToReadble(
                                          value.start
                                        ),
                                      end: convertToInternationalizedDateTimeToReadble(
                                        value.end
                                      ),
                                    });
                                  }}
                                  classNames={{
                                    label:
                                      "after:content-['*'] after:text-red-500 after:ml-1",
                                  }}
                                  isDisabled={!watch("discount.isDiscount")}
                                  // isInvalid={
                                  //   !!errors?.discount?.duration?.start ||
                                  //   !!errors?.discount?.duration?.end
                                  // }
                                  // errorMessage={
                                  //   errors?.discount?.duration?.start
                                  //     ?.message ||
                                  //   !!errors?.discount?.duration?.end?.message
                                  // }
                                  isInvalid={
                                    !!errors?.discount?.duration?.start
                                  }
                                  errorMessage={
                                    errors?.discount?.duration?.start?.message
                                  }
                                />
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* INCLUDE AND ADDTIONAL SERVICE */}
              <Card radius="none" className="px-3 py-3 mb-5">
                <CardBody>
                  <div>
                    <p className="text-md font-medium mt-3 mb-5">Includes</p>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-5 flex-inline justify-center items-center my-5"
                      >
                        <CustomInput
                          label="Title"
                          type="text"
                          placeholder="Enter include title"
                          {...register(`includes.${index}`)}
                          isInvalid={!!errors?.includes?.[index]?.message}
                          errorMessage={errors?.includes?.[index]?.message}
                        />

                        {fields.length > 1 && (
                          <div className="mt-6 cursor-pointer">
                            <CustomButton
                              isIconOnly={true}
                              variant="light"
                              onPress={() => remove(index)}
                            >
                              <RiDeleteBin4Line
                                size={20}
                                className="text-red-400"
                              />
                            </CustomButton>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mb-3">
                    <CustomButton
                      label="Add New"
                      className="text-green-600"
                      startContent={
                        <IoIosAddCircleOutline
                          size={20}
                          className="text-green-600 cursor-pointer"
                        />
                      }
                      variant="light"
                      onPress={() => {
                        append();
                      }}
                    />
                  </div>

                  {/* Addtional information */}
                  <CustomDivider />
                  <div className="flex items-center flex-initial gap-4 mt-5 mb-3">
                    <p className="text-md font-medium -mt-3">
                      Addtional Service{" "}
                    </p>
                    <Switch
                      isSelected={isAddtional}
                      onValueChange={setIsAddtional}
                      size="sm"
                      className="mb-2"
                    ></Switch>
                  </div>
                  <>
                    {addtionalServiceField.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-5 flex-inline justify-center items-center my-4"
                      >
                        <div className="relative">
                          <label
                            htmlFor={`images-upload-${index}`}
                            className={`rounded-lg flex justify-center items-center cursor-pointer aspect-square w-[60px] h-[60px] 
    ${
      errors?.additionalService?.[index]?.images?.message
        ? "border border-red-500 bg-red-100"
        : "bg-gray-200 dark:bg-gray-800"
    }`}
                          >
                            {watch(`additionalService.${index}.images`)?.[0] ? (
                              <>
                                <img
                                  src={URL.createObjectURL(
                                    watch(
                                      `additionalService.${index}.images`
                                    )?.[0]
                                  )}
                                  alt="Preview"
                                  className="rounded-lg object-contain aspect-square w-full h-full relative"
                                />

                                <span
                                  className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center cursor-pointer"
                                  onClick={() =>
                                    setValue(
                                      `additionalService.${index}.images`,
                                      ""
                                    )
                                  }
                                >
                                  <IoMdClose />
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-500">+</span>
                            )}
                          </label>
                        </div>

                        <input
                          id={`images-upload-${index}`}
                          type="file"
                          accept="image/*"
                          multiple={false}
                          className="hidden"
                          disabled={!isAddtional}
                          {...register(
                            `additionalService.${index}.images` as const,
                            {
                              ...(isAddtional && {
                                required: "Image is required",
                              }),
                            }
                          )}
                        />

                        {/* Name Input */}
                        <CustomInput
                          label="Name"
                          type="text"
                          placeholder="Enter title"
                          isDisabled={!isAddtional}
                          {...register(
                            `additionalService.${index}.serviceItem` as keyof IServiceSubmitProps
                          )}
                          isInvalid={
                            !!errors?.additionalService?.[index]?.serviceItem
                              ?.message
                          }
                          errorMessage={
                            errors?.additionalService?.[index]?.serviceItem
                              ?.message
                          }
                        />

                        {/* Price Input */}
                        <CustomNumberInput
                          label="Price"
                          placeholder="Enter Price"
                          isDisabled={!isAddtional}
                          startContent={<BiDollar className="text-gray-400" />}
                          {...register(
                            `additionalService.${index}.price` as keyof IServiceProps
                          )}
                          isInvalid={
                            !!errors?.additionalService?.[index]?.price?.message
                          }
                          errorMessage={
                            errors?.additionalService?.[index]?.price?.message
                          }
                        />

                        {/* Remove Button */}
                        {addtionalServiceField.length > 1 && (
                          <div className="mt-6 cursor-pointer">
                            <CustomButton
                              isIconOnly={true}
                              variant="light"
                              onPress={() => removeAdditionalService(index)}
                            >
                              <RiDeleteBin4Line
                                size={20}
                                className="text-red-400"
                              />
                            </CustomButton>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add New Button */}
                    <div className="mt-3">
                      <CustomButton
                        label="Add New"
                        className="text-green-600"
                        isDisabled={!isAddtional}
                        startContent={
                          <IoIosAddCircleOutline
                            size={20}
                            className="text-green-600 cursor-pointer"
                          />
                        }
                        variant="light"
                        onPress={() => {
                          appendAddtionalService({
                            id: Math.floor(Math.random() * 100).toString(),
                            images: "",
                            serviceItem: "",
                            price: 0,
                          });
                        }}
                      />
                    </div>
                  </>
                </CardBody>
              </Card>

              {/* SERVICE ORVERVIEW */}
              <Card radius="none" className="px-3 py-3 mb-5">
                <CardBody>
                  <p className="text-md font-medium mb-3 ">Service Overview </p>
                  <Controller
                    name="serviceOverview"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <TextEditor
                          value={field.value}
                          onChangeValue={(value) => {
                            field.onChange(value);
                          }}
                          isError={!!errors?.serviceOverview?.message}
                        />
                        {errors?.serviceOverview?.message && (
                          <p className="text-error mt-5">
                            {errors?.serviceOverview?.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </CardBody>
              </Card>

              {/* Gallary */}
              <Card radius="none" className="px-3 py-3 mb-5 rounded-none">
                <CardHeader>
                  <p className="text-md font-medium">Gallary</p>
                </CardHeader>

                <CardBody className="gap-6">
                  <Divider className="-my-2" />

                  <Controller
                    name="gallery.0.serviceImages"
                    control={control}
                    defaultValue={[]} // not an object — this should match yup's expected type
                    render={({ field }) => (
                      <GallaryInput
                        value={field.value} // just an array of string | File
                        onChangeValue={(newVal) =>
                          field.onChange(newVal.images)
                        } // extract array only
                        error={errors.gallery?.[0]?.serviceImages?.message}
                      />
                    )}
                  />

                  <CustomInput
                    size="md"
                    label="Video Link"
                    description="Only YouTube link are supported."
                    type="text"
                    placeholder="https://www.example.com"
                    {...register("gallery.0.videoLink")}
                    startContent={<BsLink45Deg />}
                    isInvalid={!!errors?.gallery?.[0]?.videoLink}
                    errorMessage={errors?.gallery?.[0]?.videoLink?.message}
                  />
                </CardBody>
              </Card>

              {/* Active Service */}
              <Card radius="none" className="px-3 py-3 mb-5">
                <CardHeader>
                  <p className="text-md font-medium">Active Service</p>
                </CardHeader>

                <CardBody>
                  <CustomCheckbox label="Active" {...register("isActive")} />
                </CardBody>
              </Card>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <Card radius="none" className="px-3 py-3 mb-5">
                <CardHeader>
                  <div className="flex flex-initial items-center justify-between gap-3">
                    <p className="text-md font-medium">Availability</p>
                    <CustomPoporver content={poporverContent} />
                  </div>
                </CardHeader>

                {/* Availability */}
                <CardBody className="gap-6">
                  {availabilityField.map((field, index) => (
                    <div
                      key={field.id || index}
                      className="flex flex-initial gap-3 items-center"
                    >
                      <Controller
                        name={`availability.${index}.day`}
                        control={control}
                        defaultValue={field.day}
                        rules={{ required: "Day is required" }}
                        render={({ field: controllerField, fieldState }) => (
                          <CustomAutocomplete
                            label="Day"
                            placeholder="Select a Day"
                            defaultItems={days}
                            startContent={<CiCalendar size={20} />}
                            defaultSelectedKey={field.day}
                            onSelectionChange={(value) => {
                              controllerField.onChange(value);
                              setDayChange((prev) => !prev);
                            }}
                            errorMessage={fieldState?.error?.message}
                            isInvalid={!!fieldState?.error}
                            className=" min-w-[200px]"
                          />
                        )}
                      />

                      <Controller
                        name={`availability.${index}.timeSlots.from`}
                        control={control}
                        defaultValue={field.timeSlots?.from}
                        rules={{ required: "From is required" }}
                        render={({ field }) => (
                          <TimeInput
                            label="Start Time"
                            labelPlacement="outside"
                            className="min-w-[100px]"
                            variant="bordered"
                            startContent={<IoMdTime />}
                            onChange={(val: TimeValue) => {
                              const convertTime =
                                convertToInternationalizedTimeToReadble(val);
                              field.onChange(convertTime);
                              setStartTimeChange((prev) => !prev);
                            }}
                            isInvalid={
                              !!errors?.availability?.[index]?.timeSlots?.from
                                ?.message
                            }
                            errorMessage={
                              errors?.availability?.[index]?.timeSlots?.from
                                ?.message
                            }
                          />
                        )}
                      />

                      <Controller
                        name={`availability.${index}.timeSlots.to`}
                        control={control}
                        defaultValue={field.timeSlots?.to || ""}
                        render={({ field }) => (
                          <>
                            <TimeInput
                              label="End Time"
                              labelPlacement="outside"
                              className="min-w-[100px]"
                              variant="bordered"
                              startContent={<IoMdTime />}
                              onChange={(val: TimeValue) => {
                                const convertTime =
                                  convertToInternationalizedTimeToReadble(val);
                                field.onChange(convertTime);
                                setEndTimeChange((prev) => !prev);
                              }}
                              isInvalid={
                                !!errors?.availability?.[index]?.timeSlots?.to
                                  ?.message
                              }
                              errorMessage={
                                errors?.availability?.[index]?.timeSlots?.to
                                  ?.message
                              }
                            />
                          </>
                        )}
                      />

                      <CustomNumberInput
                        label="Max Slot"
                        placeholder="Enter slot"
                        className="min-w-[100px] "
                        {...register(
                          `availability.${index}.timeSlots.maxBookings`
                        )}
                        isInvalid={
                          !!errors?.availability?.[index]?.timeSlots
                            ?.maxBookings?.message
                        }
                        errorMessage={
                          errors?.availability?.[index]?.timeSlots?.maxBookings
                            ?.message
                        }
                      />

                      <CustomNumberInput
                        label="Break/Travel Duration "
                        placeholder="Enter duration"
                        className="min-w-[100px] "
                        {...register(
                          `availability.${index}.timeSlots.restDuration`
                        )}
                        isInvalid={
                          !!errors?.availability?.[index]?.timeSlots
                            ?.restDuration?.message
                        }
                        errorMessage={
                          errors?.availability?.[index]?.timeSlots?.restDuration
                            ?.message
                        }
                      />

                      {availabilityField.length > 1 && (
                        <div className="mt-4">
                          <CustomButton
                            isIconOnly={true}
                            variant="light"
                            onPress={() => removeAvailability(index)}
                          >
                            <RiDeleteBin4Line
                              size={20}
                              className="text-red-400"
                            />
                          </CustomButton>
                        </div>
                      )}
                    </div>
                  ))}
                  {errors?.availability?.message && (
                    <small className="text-red-500 text-xs">
                      {errors?.availability?.message}
                    </small>
                  )}

                  <div className="-mt-3">
                    <CustomButton
                      label="Add New"
                      className="text-green-600"
                      startContent={
                        <IoIosAddCircleOutline
                          size={20}
                          className="text-green-600 cursor-pointer"
                        />
                      }
                      isDisabled={!!errors?.availability}
                      variant="light"
                      onPress={() =>
                        appendAvailability({
                          day: "",
                          available: false,
                          timeSlots: {
                            from: "",
                            to: "",
                            maxBookings: 0,
                            restDuration: 0,
                          },
                        })
                      }
                    />
                  </div>
                </CardBody>
              </Card>

              {/* FAQ */}
              <Card radius="none" className="px-3 py-3 mb-5">
                <CardHeader>
                  <div className="flex items-center flex-initial gap-4">
                    <p className="text-md font-medium">FAQs </p>
                    <Switch
                      isSelected={isFaq}
                      onValueChange={setIsFaq}
                      size="sm"
                      className="mb-2"
                    ></Switch>
                  </div>
                </CardHeader>

                <CardBody className="gap-6 -mt-3">
                  {faqField.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-5 flex-inline justify-center items-center"
                    >
                      <CustomInput
                        label="Question"
                        type="text"
                        placeholder="Enter your question"
                        isDisabled={!isFaq}
                        {...register(`faq.${index}.question` as const)}
                        isInvalid={!!errors.faq?.[index]?.question?.message}
                        errorMessage={errors.faq?.[index]?.question?.message}
                      />

                      <CustomInput
                        label="Answer"
                        type="text"
                        placeholder="Enter your answer"
                        isDisabled={!isFaq}
                        {...register(`faq.${index}.answer` as const)}
                        isInvalid={!!errors.faq?.[index]?.answer?.message}
                        errorMessage={errors.faq?.[index]?.answer?.message}
                      />

                      {faqField.length > 1 && (
                        <div className="mt-6 cursor-pointer">
                          <CustomButton
                            isIconOnly={true}
                            isDisabled={!isFaq}
                            variant="light"
                            onPress={() => removeFaq(index)}
                          >
                            <RiDeleteBin4Line
                              size={20}
                              className="text-red-400"
                            />
                          </CustomButton>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="-mt-3">
                    <CustomButton
                      label="Add New"
                      className="text-green-600"
                      isDisabled={!isFaq}
                      startContent={
                        <IoIosAddCircleOutline
                          size={20}
                          className="text-green-600 cursor-pointer"
                        />
                      }
                      variant="light"
                      onPress={() =>
                        appendFaq({
                          question: "",
                          answer: "",
                        })
                      }
                    />
                  </div>
                </CardBody>
              </Card>

              <Card radius="none" className="px-3 py-3 mb-5">
                <CardHeader>
                  <p className="text-md font-medium">Location</p>
                </CardHeader>

                <div ref={containerRef} className="relative">
                  <CustomInput
                    label="Address"
                    type="text"
                    value={watch("location.0.address")}
                    className="px-3 py-3"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setValue("location.0.address", e.target.value);
                    }}
                    placeholder="Search or type address"
                    isInvalid={!!errors?.location?.[0]?.address}
                    errorMessage={errors?.location?.[0]?.address?.message}
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute z-50 max-w-[1000px] -mt-2 right-1 left-1 bg-gray-100 border-gray-400 dark:bg-gray-900  rounded-md max-h-90 overflow-auto mx-3 shadow-lg border-1 dark:border-gray-800">
                      {suggestions.map((place, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectAddressSuggestion(place)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-400 dark:hover:bg-sideBarBackground text-sm"
                        >
                          {place?.properties?.formatted}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid lg:grid-cols-2 gap-6 px-3 py-3 ">
                  <CustomInput
                    label="Country"
                    type="text"
                    placeholder="Enter country"
                    value={watch("location.0.country")}
                    {...register("location.0.country")}
                    isInvalid={!!errors?.location?.[0]?.country}
                    errorMessage={errors?.location?.[0]?.country?.message}
                  />

                  <CustomInput
                    label="City"
                    type="text"
                    placeholder="Enter city"
                    value={watch("location.0.city")}
                    {...register("location.0.city")}
                    isInvalid={!!errors?.location?.[0]?.city}
                    errorMessage={errors?.location?.[0]?.city?.message}
                  />

                  <CustomInput
                    label="State"
                    type="text"
                    placeholder="Enter state"
                    value={watch("location.0.state")}
                    {...register("location.0.state")}
                    isInvalid={!!errors?.location?.[0]?.state}
                    errorMessage={errors?.location?.[0]?.state?.message}
                  />

                  <CustomInput
                    label="Postal Code"
                    type="text"
                    placeholder="Enter pinCode"
                    value={watch("location.0.pinCode")}
                    {...register("location.0.pinCode")}
                    isInvalid={!!errors?.location?.[0]?.pinCode}
                    errorMessage={errors?.location?.[0]?.pinCode?.message}
                  />

                  <CustomInput
                    label="Google Maps Place ID"
                    type="text"
                    placeholder="Enter maps place id"
                    value={watch("location.0.googleMapsPlaceId")}
                    {...register("location.0.googleMapsPlaceId")}
                    isInvalid={!!errors?.location?.[0]?.googleMapsPlaceId}
                    errorMessage={
                      errors?.location?.[0]?.googleMapsPlaceId?.message
                    }
                  />

                  <CustomNumberInput
                    label="Latitude"
                    placeholder="Enter latitude"
                    formatOptions={{ maximumFractionDigits: 10 }}
                    value={watch("location.0.latitude")}
                    {...register("location.0.latitude")}
                    isInvalid={!!errors?.location?.[0]?.latitude}
                    errorMessage={errors?.location?.[0]?.latitude?.message}
                  />

                  <CustomNumberInput
                    label="Longitude"
                    formatOptions={{ maximumFractionDigits: 10 }}
                    placeholder="Enter longitude"
                    value={watch("location.0.longitude")}
                    {...register("location.0.longitude")}
                    isInvalid={!!errors?.location?.[0]?.longitude}
                    errorMessage={errors?.location?.[0]?.longitude?.message}
                  />
                </div>

                <CardFooter className="mt-4">
                  {/* Map Container */}
                  <div
                    id="map"
                    style={{
                      height: "400px",
                      width: "100%",
                      border: "2px solid #ccc",
                      zIndex: 0,
                    }}
                  ></div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="flex flex-initial justify-end items-end my-1 gap-5">
            <CustomButton
              label="Clear"
              type="reset"
              color="danger"
              size="sm"
              variant="flat"
            />
            <CustomButton
              label="Sumbit"
              type="submit"
              color="primary"
              size="sm"
              // isDisabled={!isVerifyAccount ? true : false}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddService1;
