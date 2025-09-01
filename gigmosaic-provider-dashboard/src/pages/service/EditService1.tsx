import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
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
  useFetchServiceDataById,
  useFetchStaff,
  useFetchSubCategory,
  useFetchUserDetailsById,
} from "../../hooks/queries/useFetchData";
import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
import {
  availabilityFormatForDisplay,
  convertStaffStringToArray,
  createSlug,
  formateDataForDropdown,
  processAdditionalServices,
  processAvailability,
} from "../../utils/serviceUtils";
import { useEffect, useRef, useState } from "react";
import {
  IAdditionalServicesResponse,
  IGallaryProps,
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
  convertReadableTimeToTimeObject,
  convertToInternationalizedDateTimeToReadble,
  convertToInternationalizedTimeToReadble,
} from "../../utils/convertTime";
import { yupResolver } from "@hookform/resolvers/yup";
import { serviceSchema } from "../../validation/serviceSchema";
import CustomDivider from "../../components/ui/CustomDivider";
import LocationInputs from "../../components/LocationInputs";
import LocationPin from "../../assets/location-pin.png";
import L from "leaflet";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import CustomPoporver from "../../components/ui/CustomPoporver";
import { useParams } from "react-router-dom";
import { generateS3Path } from "../../utils/s3FileUploader";
import FullLoading from "../../components/ui/FullLoading";
import { multipleFileUplaodHelper } from "../../utils/common";
import { useAuth } from "react-oidc-context";
import { useUpdateServiceMutation } from "../../hooks/mutations/useUpdateData";
import PackageSection from "../../components/ui/PackageSection";
import { FaUser } from "react-icons/fa";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

interface IDropdownData {
  label: string;
  id: string;
}

const EditService1 = () => {
  const auth = useAuth();
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const myAPIKey = import.meta.env.VITE_GEOLOCATION_API_KEY;

  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<IDropdownData[]>([]);
  const [subcategoryList, setSubcategoryList] = useState<IDropdownData[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Selection>(new Set([]));
  const [isAddtional, setIsAddtional] = useState(false);
  const [isFaq, setIsFaq] = useState(false);
  const [isPackage, setIsPackage] = useState(false);
  const [latitude, setLatitude] = useState<number>(45.390735);
  const [longitude, setLongitude] = useState<number>(-75.72876);
  const [gallaryData, setGallaryData] = useState<IGallaryProps>();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const providerId = auth.user?.profile?.preferred_username;

  //API DATA
  const { data, isFetching } = useFetchServiceDataById(id);
  const { data: apiCategoryData } = useFetchCategory();
  const { data: apiSubCategoryData } = useFetchSubCategory();
  const { data: apiStaffData } = useFetchStaff({ page: 1, limit: 100 });
  const { data: providerDetails } = useFetchUserDetailsById(providerId);
  const { mutateAsync } = useUpdateServiceMutation();

  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   setValue,
  //   resetField,
  //   watch,
  //   reset,
  //   trigger,
  //   formState: { errors },
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
    // context: { isFaq, isAddtional },
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

  const isPackageSelect = watch("isPackage");
  const discountType = watch("discount.discountType");
  const discountDurationType = watch("discount.durationType");

  const formatStaffIdsToDisplay = (staff: string[]) => {
    const allStaff = [...new Set(staff)];
    return allStaff.join(",");
  };

  useEffect(() => {
    setIsPackage(isPackageSelect);
  }, [isPackageSelect]);

  //SET API DATA
  useEffect(() => {
    if (isFetching || !data?.serviceInfo) return;
    console.log("DDDDDDDDDDDDD-------------------");
    const apiData: IServiceProps = data.serviceInfo;

    const formatAvailability = availabilityFormatForDisplay(
      apiData.availability
    );

    console.log("API DATA: ", apiData);
    console.log("formatAvailability: ", formatAvailability);

    setValue("serviceId", apiData.serviceId || "");
    setValue("serviceTitle", apiData.serviceTitle || "");
    setValue("categoryId", apiData.categoryId || "");
    setValue("subCategoryId", apiData.subCategoryId || "");
    setValue("price", apiData.price || 0);

    // setValue("staff", formatStaffIdsToDisplay(apiData.staff || []));
    // selectedStaffIds(apiData.staff || []);
    setSelectedStaff(new Set(apiData.staff));

    setValue("includes", apiData.includes);
    setValue("additionalServices", apiData.additionalServices);
    setValue("serviceOverview", apiData.serviceOverview);
    setValue("gallery.0", apiData.gallery[0] || "");

    setValue("faq", apiData.faq || []);
    setValue("location.0", apiData.location[0] || []);
    setValue("availability", formatAvailability);

    setValue("isActive", apiData.isActive || false);

    setValue("isfaq", Array.isArray(apiData?.faq) && apiData.faq.length > 0);
    setIsFaq(Array.isArray(apiData?.faq) && apiData.faq.length > 0);

    setValue(
      "isAddtional",
      Array.isArray(apiData?.additionalServices) &&
        apiData.additionalServices.length > 0
    );
    setIsAddtional(
      Array.isArray(apiData?.additionalServices) &&
        apiData.additionalServices.length > 0
    );

    // setValue("location.0", apiData.location[0] || "");
    // setValue("location.1", apiData.location[1] || "");
    // setValue("location.2", apiData.location[2] || "");
    // setValue(
    //   "gallery.0.videoLink",
    //   "http://localhost:5173/service/edit-service/SID_26"
    // );

    //Dummy data
    setValue("isPackage", true);
    setValue(`packages.0.packageName`, "this is a package name");
    setValue(`packages.0.price`, 534);
    setValue(`packages.0.includes.input1`, "title1");
    setValue(`packages.0.includes.input2`, "title2");
    setValue(`packages.0.includes.input3`, "title3");
    setValue(`packages.0.includes.input4`, "title4");
    setValue(`packages.0.discount.isDiscount`, true);
    setValue(`packages.0.isDiscount`, true);
    setValue(`packages.0.discount.discountType`, "general-discount");
    setValue(`packages.0.discount.valueType`, "percentage");
    setValue(`packages.0.discount.durationType`, "life-time");
    setValue(`packages.0.discount.amount`, 100);
    setValue(`packages.0.discount.maxCount`, 10);
  }, [data?.serviceInfo, setValue, isFetching]);

  // useEffect(() => {
  //   if (watch("location.0")) {
  //     // trigger("location.0");
  //   }
  // }, [watch("location.0")]);

  // const serviceName = watch("serviceTitle");
  const categoryId = watch("categoryId");
  // const subCategoryId = watch("subCategoryId");
  // const price = watch("price");
  // const selectedStaffIds = watch("staff");
  // const selectIncludes = watch("includes");
  // const selectedAddtionalData = watch("additionalServices");
  // const selectServiceOverview = watch("serviceOverview");
  // const isActiveService = watch("isActive");
  // const selectAvailability = watch("availability");
  const selectCity = watch("location.0.city");
  const selectState = watch("location.0.state");

  // console.log("isActiveService: ", isActiveService);
  console.log("FULL PAYLOD: ", watch());
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
    // setValue("staff", ["STID_8", "STID_10", "STID_11"]);
    console.log("formtedCategory: ", formtedCategory);
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

  //selected Staff data format
  //   useEffect(() => {
  //     const convertToArray = selectedStaffIds?.split(",");
  //     console.log("selectedStaffIds: ", selectedStaffIds);
  //     console.log("convertToArray: ", convertToArray);
  //   }, [selectedStaffIds]);

  // useEffect(() => {
  //   const convertToArray = Array.from(selectedStaff);
  //   console.log("convertToArray: ", convertToArray);
  //   // setValue("staff", convertToArray);
  //   // setValue("availability.0.timeSlots.0.maxBookings", 32);
  // }, [selectedStaff, setValue]);

  //   const convertStaffIsToArray = () => {
  //     const val = new Set(e.target.value.split(","));
  //     console.log("val: ", val);

  //   };

  // useEffect(() => {
  //   console.log("selectedStaffIds: ", selectedStaffIds);

  // useEffect(
  //   const val = ["index11", "index22", "index33"];

  // useEffect(() => {
  //   const apiData = {
  //     availability: [
  //       {
  //         day: "monday",
  //         available: true,
  //         timeSlots: { from: "09:12 am", to: "11:04 am", maxBookings: 564 },
  //       },
  //       {
  //         day: "monday",
  //         available: true,
  //         timeSlots: { from: "10:20 am", to: "11:23 am", maxBookings: 564 },
  //       },
  //       {
  //         day: "friday",
  //         available: true,
  //         timeSlots: { from: "7:34 pm", to: "06:26 pm", maxBookings: 865 },
  //       },
  //       {
  //         day: "monday",
  //         available: true,
  //         timeSlots: { from: "05:12 am", to: "12:04 am", maxBookings: 564 },
  //       },
  //       {
  //         day: "tuesday",
  //         available: true,
  //         timeSlots: { from: "8:34 pm", to: "12:26 pm", maxBookings: 865 },
  //       },
  //     ],
  //   };
  //   setValue("serviceTitle", "test");
  //   removeAvailability();
  //   if (apiData?.availability?.length > 0) {
  //     apiData.availability.forEach((item) => {
  //       appendAvailability({
  //         day: item.day,
  //         available: item.available,
  //         timeSlots: {
  //           from: convertReadableTimeToTimeObject(item?.timeSlots?.from),
  //           to: convertReadableTimeToTimeObject(item?.timeSlots?.to),
  //           maxBookings: item.timeSlots.maxBookings,
  //         },
  //       });
  //     });
  //   }
  // }, []);

  const { fields, append, remove } = useFieldArray({
    name: "includes",
    control,
    // setValue: val,
  });

  // const datime = "4:06 am";

  useEffect(() => {
    if (fields.length === 0) append("");
    if (addtionalServiceField.length === 0)
      appendAddtionalService({
        serviceItem: "",
        price: 0,
        id: "",
        images: "",
      });
  }, [append, fields.length]);

  const {
    fields: addtionalServiceField,
    append: appendAddtionalService,
    remove: removeAdditionalService,
  } = useFieldArray({
    name: "additionalServices",
    control,
    // setValue: val,
  });

  const {
    fields: availabilityField,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    name: "availability",
    control,
    // setValue: apiData.availability,
  });

  const {
    fields: faqField,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    name: "faq",
    control,
    // setValue: apiData.availability,
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const apiData = {
  //       availability: [
  //         {
  //           day: "monday",
  //           available: true,
  //           timeSlots: [{ from: "09:03 am", to: "11:00 am", maxBookings: 100 }],
  //         },
  //         {
  //           day: "tuesday",
  //           available: true,
  //           timeSlots: [{ from: "8:34 pm", to: "12:26 pm", maxBookings: 200 }],
  //         },
  //         {
  //           day: "friday",
  //           available: true,
  //           timeSlots: [{ from: "1:30 am", to: "6:00 pm", maxBookings: 300 }],
  //         },
  //       ],
  //     };

  //     if (apiData?.availability?.length > 0) {
  //       apiData.availability.forEach((item, index) => {
  //         // First, append availability
  //         console.log("Redender count: ", index);
  //         appendAvailability({
  //           day: item.day,
  //           timeSlots: item.timeSlots,
  //         });

  //         // Then, set values for each time slot
  //         item.timeSlots?.forEach((slot, slotIndex) => {
  //           setValue(
  //             `availability.${index}.timeSlots.${0}.from`,
  //             // convertReadableTimeToTimeObject(slot.from)
  //             slot.from
  //           );
  //           setValue(`availability.${index}.timeSlots.${0}.to`, slot.to);
  //           setValue(
  //             `availability.${index}.timeSlots.${0}.maxBookings`,
  //             slot.maxBookings
  //           );
  //         });
  //       });
  //     }
  //   };

  //   fetchData();
  // }, [setValue, appendAvailability]);

  // useEffect(() => {
  //   setValue("gallery.0.serviceImages", [
  //     "https://cdn.staging.gigmosaic.ca/service-addtional-infomation/cacf0d30f3bc423030eed9d020561779.jpg-1753259575022",
  //     "https://cdn.staging.gigmosaic.ca/service-addtional-infomation/cacf0d30f3bc423030eed9d020561779.jpg-1753259575022",
  //     "https://cdn.staging.gigmosaic.ca/service-addtional-infomation/cacf0d30f3bc423030eed9d020561779.jpg-1753259575022",
  //   ]);
  // }, [setValue]);

  //   console.log("categoryId: ", categoryId);
  //   console.log("price: ", price);
  //   console.log("apiStaffData: ", apiStaffData);
  //   console.log("selectedStaff33: ", selectedStaff);
  //   console.log("selected staff in hook: ", selectedStaffIds);
  //   console.log("subCategoryId: ", subCategoryId);
  //   console.log("Subcategory: ", subcategoryList);
  //   console.log("Category formtedCategory: ", categoryList);
  //   console.log("SubCategory: ", apiSubCategoryData);
  // console.log("Includes: ", selectIncludes);
  // console.log("Addtional: ", selectedAddtionalData);
  // console.log("selectServiceOverview: ", selectServiceOverview);

  //HANDLE ADDTIONAL SERVICE SWTICH
  const handleIsAdditionalData = () => {
    setIsAddtional((prev) => !prev);
    if (isAddtional) {
      // removeAdditionalService(0);
      // setValue("additionalServices.0", {
      //   id: "",
      //   images: "",
      //   serviceItem: "",
      //   price: 0,
      // });
      resetField("additionalServices");
    }
  };

  //HANDLE FAQ SWITCH
  // const handleIsFaqData = () => {
  //   setIsFaq((prev) => !prev);
  //   if (isFaq) {
  //     resetField("faq");
  //   }
  // };

  useEffect(() => {
    setValue("isfaq", isFaq);
    if (!isFaq) {
      resetField("faq");
    }
  }, [isFaq, resetField, setValue]);

  useEffect(() => {
    setValue("isAddtional", isAddtional);
    if (!isAddtional) {
      resetField("additionalServices");
    }
  }, [isAddtional, resetField, setValue]);

  //SUBMIT DATA
  const onSubmit = async (data: IServiceSubmitProps) => {
    setIsLoading(true);
    const files = data.gallery?.[0]?.serviceImages;
    const additionalServices = data?.additionalServices;
    const user = providerDetails?.user;
    const nestedFilePath = `${data?.serviceTitle}-${Date.now()}`;
    const generateProviderFolder = `${user.userId}-${user.name}`;
    const staff = data?.staff;
    const availability = data?.availability;
    const serviceId = data?.serviceId;

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

    // Get existing URLs
    const existingUrls = (
      Array.isArray(files)
        ? files.filter((item) => typeof item === "string")
        : []
    ) as string[];

    let galleryImageUrls: string[] = [];

    if (Array.isArray(files)) {
      const realFiles = files.filter(
        (item: File) => item instanceof File
      ) as File[];

      if (realFiles.length > 0) {
        galleryImageUrls = await multipleFileUplaodHelper({
          files: realFiles,
          baseFolder: "provider",
          mainFolder: "service",
          subFolder: generateProviderFolder,
          nestedPath: nestedFilePath,
          errorMessageType: "Image",
        });
      } else {
        galleryImageUrls = [];
      }
    }

    //combine old urls with new urls
    const allGalleryUrls = [...existingUrls, ...galleryImageUrls];

    if (!allGalleryUrls || allGalleryUrls.length === 0) {
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

    // console.log("EXISTING URLS : ", existingUrls);
    // console.log("GALLERY URLS : ", galleryImageUrls);

    // Combine old URLs with new uploaded ones
    // console.log("RUN_________________________________ ", allGalleryUrls);

    //  if (Array.isArray(files)) {
    // const availabilityRealFiles = files.filter(
    //   (item: File) => item instanceof File
    // ) as File[];

    // console.log('availabilityRealFiles: ',)

    //ADDTIONAL SERVIVE IMAGE UPLOAD
    let addtionalServiceResult: IAdditionalServicesResponse[] = [];
    if (additionalServices?.[0].images) {
      addtionalServiceResult = await processAdditionalServices(
        additionalServices,
        generateProviderFolder,
        nestedFilePath
      );
    } else {
      addtionalServiceResult = [];
    }

    console.log("FILE UPLAOD: ", addtionalServiceResult);

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

    const staffArray = await convertStaffStringToArray(staff);
    const processAvilabilityResult = await processAvailability(availability);

    const payload = {
      ...data,
      slug: generatSlug,
      price: Number(data.price),
      staff: staffArray,
      // additionalService: addtionalServiceResult,
      additionalService: addtionalServiceResult,
      gallery: [
        {
          serviceImages: allGalleryUrls,
          videoLink: data?.gallery[0]?.videoLink,
        },
      ],
      availability: processAvilabilityResult,
    };

    console.log("Final Service update payload: ", payload);
    try {
      await mutateAsync({ id: serviceId, serviceData: payload });
      console.log("OK---------");
      // reset();
    } catch (e) {
      console.log("");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("Is Adftional: ", isAddtional);
  console.log("ERROR: ", errors);

  /////////////////////////////////
  // let DEFAULT_LAT = 6.9271; // example for Colombo
  // let DEFAULT_LNG = 79.8612;

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

    console.log("Address suggestion selected: ", suggestion);
    console.log(" selected: ", selected);

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

  // console.log("DEFAULT_LAT: ", DEFAULT_LAT);
  // console.log("DEFAULT_LNG: ", DEFAULT_LNG);

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

  return (
    <>
      {isFetching && <FullLoading label="Loading..." />}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* <form onSubmit={handleSubmit(onSubmit)}> */}
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
                    placeholder="Enter title"
                    value={watch("serviceTitle")}
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
                              // value={watch("categoryId")}
                              selectedKey={watch("categoryId")}
                              // defaultSelectedKey={watch("categoryId")}
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
                              selectedKey={watch("subCategoryId")}
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
                        // selectedKeys={field.value}
                        selectedKeys={selectedStaff}
                        // selectedKeys={watch("staff")}
                        //   defaultSelectedKeys={watch("staff")}
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

              {/* PRICE AND PACKAGE*/}
              <PackageSection />

              {/*  DISCOUNT*/}
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
                  </div>{" "}
                  {/* <Divider className="my-1" /> */}
                  <CustomDivider />
                  {/* Addtional information */}
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
      errors?.additionalServices?.[index]?.images?.message
        ? "border border-red-500 bg-red-100"
        : "bg-gray-200 dark:bg-gray-800"
    }`}
                          >
                            {(() => {
                              const imageData = watch(
                                `additionalServices.${index}.images`
                              );

                              if (
                                imageData instanceof FileList &&
                                imageData[0]
                              ) {
                                //Preview newly selected image
                                return (
                                  <>
                                    <img
                                      src={URL.createObjectURL(imageData[0])}
                                      alt="Preview"
                                      className="rounded-lg object-contain aspect-square w-full h-full relative"
                                    />
                                    <span
                                      className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center cursor-pointer"
                                      onClick={() =>
                                        setValue(
                                          `additionalServices.${index}.images`,
                                          null
                                        )
                                      }
                                    >
                                      <IoMdClose />
                                    </span>
                                  </>
                                );
                              } else if (
                                typeof imageData === "string" &&
                                imageData !== ""
                              ) {
                                // Show existing image URL (e.g., when editing existing service)
                                return (
                                  <img
                                    src={imageData}
                                    alt="Preview"
                                    className="rounded-lg object-contain aspect-square w-full h-full relative"
                                  />
                                );
                              } else {
                                // No image at all yet
                                return <span className="text-gray-500">+</span>;
                              }
                            })()}
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
                            `additionalServices.${index}.images` as const,
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
                            `additionalServices.${index}.serviceItem` as keyof IServiceProps
                            // {
                            //   ...(isAddtional && {
                            //     required: isAddtional
                            //       ? "Title is required"
                            //       : false,
                            //     minLength: {
                            //       value: 3,
                            //       message: "Title must be at least 3 characters",
                            //     },
                            //     maxLength: {
                            //       value: 30,
                            //       message: "Title must be at most 30 characters",
                            //     },
                            //   }),
                            // }
                          )}
                          isInvalid={
                            !!errors?.additionalServices?.[index]?.images
                              ?.message
                          }
                          errorMessage={
                            errors?.additionalServices?.[index]?.images?.message
                          }
                        />

                        {/* Price Input */}
                        <CustomNumberInput
                          label="Price"
                          placeholder="Enter Price"
                          isDisabled={!isAddtional}
                          startContent={<BiDollar className="text-gray-400" />}
                          {...register(
                            `additionalServices.${index}.price` as keyof IServiceProps

                            // {
                            //   ...(isAddtional && {
                            //     required: "Price is required",
                            //     valueAsNumber: true,
                            //     validate: (value) =>
                            //       value > 0
                            //         ? true
                            //         : "Price must be greater than 0",
                            //   }),
                            // }
                          )}
                          isInvalid={
                            !!errors?.additionalServices?.[index]?.price
                              ?.message
                          }
                          errorMessage={
                            errors?.additionalServices?.[index]?.price?.message
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
                            id: "",
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
                  {/* <GallaryInput
                  onChangeValue={(value) =>
                    setGallaryData(value as IGallaryProps)
                  }
                  error={errors.gallery?.[0]?.serviceImages?.message}
                /> */}
                  <Controller
                    name="gallery.0.serviceImages"
                    control={control}
                    defaultValue={[]} // not an object — this should match yup's expected type
                    // rules={{
                    //   validate: (value) =>
                    //     value?.length > 0 || "At least one image is required",
                    // }}
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
                    value={watch("gallery.0.videoLink")}
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
                  <CustomCheckbox
                    label="Active"
                    // isSelected={isActive}
                    // onValueChange={setIsActive}
                    {...register("isActive")}
                  />
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
                        // defaultValue=""
                        //   rules={{ required: "Day is required" }}
                        render={({ field: controllerField, fieldState }) => (
                          <CustomAutocomplete
                            label="Day"
                            placeholder="Select a Day"
                            defaultItems={days}
                            startContent={<CiCalendar size={20} />}
                            defaultSelectedKey={field.day}
                            onSelectionChange={(value) =>
                              controllerField.onChange(value)
                            }
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
                        // defaultValue=""
                        //   rules={{ required: "From is required" }}
                        render={({ field }) => (
                          <TimeInput
                            label="Start Time"
                            labelPlacement="outside"
                            className="min-w-[100px]"
                            variant="bordered"
                            startContent={<IoMdTime />}
                            // value={watch(`availability.${index}.timeSlots.from`)}
                            // defaultValue={convertReadableTimeToTimeObject(
                            //   `availability.${index}.timeSlots.from`
                            // )}
                            // value={field.value}
                            value={convertReadableTimeToTimeObject(
                              watch(`availability.${index}.timeSlots.from`)
                            )}
                            onChange={(val: TimeValue) => {
                              const convertTime =
                                convertToInternationalizedTimeToReadble(val);
                              field.onChange(convertTime);
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

                      {/* <p>{}</p> */}

                      <Controller
                        name={`availability.${index}.timeSlots.to`}
                        control={control}
                        defaultValue={field.timeSlots?.to || ""}
                        // defaultValue={field?.timeSlots?.[0]?.to}
                        // rules={{ required: "To is required" }}
                        render={({ field }) => (
                          <>
                            <TimeInput
                              label="End Time"
                              labelPlacement="outside"
                              className="min-w-[100px]"
                              variant="bordered"
                              startContent={<IoMdTime />}
                              // value={field.value}
                              // value={watch(`availability.${index}.timeSlots.to`)}
                              value={convertReadableTimeToTimeObject(
                                watch(`availability.${index}.timeSlots.to`)
                              )}
                              // defaultValue={convertReadableTimeToTimeObject(
                              //   `availability.${index}.timeSlots.to`
                              // )}
                              // defaultValue={`availability.${index}.timeSlots.to`}

                              onChange={(val: TimeValue) => {
                                console.log("VAL: ", val);
                                const convertTime =
                                  convertToInternationalizedTimeToReadble(val);
                                // return;
                                field.onChange(convertTime);
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
                        // defaultValue={`availability.${index}.timeSlots.maxBookings`}
                        // value={field.timeSlots?.[index]?.maxBookings}
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
                        // defaultValue={`availability.${index}.timeSlots.maxBookings`}
                        // value={field.timeSlots?.[index]?.maxBookings}
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
                    // value={query}
                    value={watch("location.0.address")}
                    className="px-3 py-3"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setValue("location.0.address", e.target.value);
                    }}
                    // {...register("location.0.address")}
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

                  {/* <CustomButton
                  label="Clear"
                  type="button"
                  color="danger"
                  size="md"
                  variant="flat"
                  onPress={() => handleSearch}
                /> */}
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
              size="md"
              variant="flat"
            />
            <CustomButton
              label="Sumbit"
              type="submit"
              color="primary"
              size="md"
              // isDisabled={!isVerifyAccount ? true : false}
              isDisabled={false}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default EditService1;
