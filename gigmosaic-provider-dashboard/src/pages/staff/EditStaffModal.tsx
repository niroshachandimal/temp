// import { useEffect, useState } from "react";
// import {
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   useDisclosure,
// } from "@heroui/react";
// import { FaRegEdit } from "react-icons/fa";
// import CustomButton from "../../components/ui/CustomButton";
// import CustomInput from "../../components/ui/CustomInput";
// import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
// import { useForm, SubmitHandler, Controller } from "react-hook-form";
// import { useFetchStaffById } from "../../hooks/queries/useFetchData";
// import { useUpdateStaffMutation } from "../../hooks/mutations/useUpdateData";
// import Loading from "../../components/ui/Loading";
// import CustomCheckbox from "../../components/ui/CustomCheckbox";

// type FormValues = {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
//   country: string;
//   state: string;
//   city: string;
//   zipCode: string;
//   description: string;
//   status: boolean;
// };

// const EditStaffModal = ({ id }) => {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();
//   const [selectedId, setSelectedId] = useState(null);
//   const { data, isLoading: isFetchingStaff } = useFetchStaffById(selectedId);
//   const { mutate } = useUpdateStaffMutation();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     control,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       fullName: "",
//       email: "",
//       phoneNumber: "",
//       address: "",
//       country: "",
//       state: "",
//       city: "",
//       zipCode: "",
//       description: "",
//       status: false,
//     },
//   });

// const state = [
//   { label: "Ontario", id: "ontario" },
//   { label: "Quebec", id: "quebec" },
//   { label: "Nova Scotia", id: "novaScotia" },
//   { label: "New Brunswick", id: "newBrunswick" },
//   { label: "Manitoba", id: "manitoba" },
//   { label: "British Columbia", id: "britishColumbia" },
//   { label: "Saskatchewan", id: "saskatchewan" },
//   { label: "Alberta", id: "alberta" },
//   { label: "Newfoundland and Labrador", id: "newfoundlandandLabrador" },
// ];

// const country = [{ label: "Canada", id: "canada" }];

//   useEffect(() => {
//     if (data) {
//       let count = 1;
//       console.log("Data received: ", data);
//       console.log("Count Useeffect: ", ++count);
//       setValue("fullName", data.staff.fullName || "");
//       setValue("email", data.staff.email || "");
//       setValue("phoneNumber", data.staff.phoneNumber || "");
//       setValue("address", data.staff.address || "");
//       setValue("city", data.staff.city || "");
//       setValue("zipCode", data.staff.zipCode || "");
//       setValue("description", data.staff.description || "");
//       setValue("status", data.staff.status || "");

//       const findState = state.find((item) => item.label === data.staff.state);
//       const findCountry = country.find(
//         (item) => item.label === data.staff.country
//       );

//       // console.log("Found Country: ", findCountry?.id);
//       // console.log("Found State: ", findState?.id);

//       if (findState) setValue("state", findState.id);
//       if (findCountry) setValue("country", findCountry.id);
//     }
//   }, [data, setValue]);

//   const handleOpen = () => {
//     setSelectedId(id);
//     onOpen(); // Open modal immediately
//   };

//   useEffect(() => {
//     if (isOpen && id) {
//       setSelectedId(id);
//     }
//   }, [isOpen, id]);

//   const onSubmit: SubmitHandler<FormValues> = (formData) => {
//     console.log("Final Updating Staff data: ", formData);
//     mutate({ id: selectedId, staffData: formData });
//     onOpenChange(false);
//   };

//   let count = 1;
//   console.log("Count Outside: ", ++count);

//   return (
//     <>
//       <CustomButton
//         isIconOnly
//         className="bg-transparent"
//         endContent={
//           <FaRegEdit size={18} className="hover:text-blue-500 text-gray-500" />
//         }
//         onPress={handleOpen}
//       />
//       <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <ModalContent>
//             {(onClose) => (
//               <>
//                 <ModalHeader>Edit Staff</ModalHeader>
//                 <ModalBody>
//                   {isFetchingStaff ? (
//                     // <Loading label="Fetching..." />
//                     <></>
//                   ) : (
//                     <div className="grid grid-cols-2 gap-5">
//                       <CustomInput
//                         label="Name"
//                         type="text"
//                         isRequired
//                         value={data.staff.fullName || ""}
//                         placeholder="Enter name"
//                         {...register("fullName", {
//                           required: "Name is required",
//                         })}
//                         isInvalid={!!errors?.fullName}
//                         errorMessage={errors?.fullName?.message}
//                       />
//                       <CustomInput
//                         label="Email"
//                         type="email"
//                         value={data.staff.email || ""}
//                         isRequired
//                         placeholder="Enter email"
//                         {...register("email", {
//                           required: "Email is required",
//                         })}
//                         isInvalid={!!errors?.email}
//                         errorMessage={errors?.email?.message}
//                       />
//                       <CustomInput
//                         label="Phone No"
//                         type="text"
//                         value={data.staff.phoneNumber || ""}
//                         isRequired
//                         placeholder="Enter mobile no"
//                         {...register("phoneNumber", {
//                           required: "Phone number is required",
//                         })}
//                         isInvalid={!!errors?.phoneNumber}
//                         errorMessage={errors?.phoneNumber?.message}
//                       />
//                       <CustomInput
//                         label="Address"
//                         type="text"
//                         isRequired
//                         value={data.staff.address || ""}
//                         placeholder="Enter address"
//                         {...register("address", {
//                           required: "Address is required",
//                         })}
//                         isInvalid={!!errors?.address}
//                         errorMessage={errors?.address?.message}
//                       />
// {/* <CustomAutocomplete
//   label="Country"
//   isRequired
//   placeholder="Enter country"
//   defaultItems={country}
//   selectedKey={
//     watch("country") || data?.staff?.country || null
//   }
//   onSelectionChange={(id) =>
//     setValue("country", id, { shouldValidate: true })
//   }
//   isInvalid={!!errors?.country}
//   errorMessage={errors?.country?.message}
// /> */}
//                       <Controller
//                         name="country"
//                         control={control} // control is from useForm
//                         rules={{ required: "Country is required" }}
//                         render={({ field }) => (
//                           <CustomAutocomplete
//                             label="Country"
//                             isRequired
//                             placeholder="Enter country"
//                             defaultItems={country}
//                             selectedKey={
//                               field.value || data?.staff?.country || null
//                             }
//                             onSelectionChange={(id) => field.onChange(id)}
//                             isInvalid={!!errors?.country}
//                             errorMessage={errors?.country?.message}
//                           />
//                         )}
//                       />

//                       <Controller
//                         name="state"
//                         control={control} // control is from useForm
//                         rules={{ required: "State is required" }}
//                         render={({ field }) => (
//                           <CustomAutocomplete
//                             label="State"
//                             isRequired
//                             placeholder="Enter state"
//                             defaultItems={state}
//                             selectedKey={
//                               field.value || data?.staff?.state || null
//                             }
//                             onSelectionChange={(id) => field.onChange(id)}
//                             isInvalid={!!errors?.state}
//                             errorMessage={errors?.country?.message}
//                           />
//                         )}
//                       />

// {/* <CustomAutocomplete
//   label="State"
//   isRequired
//   placeholder="Enter state"
//   defaultItems={state}
//   selectedKey={
//     watch("state") || data?.staff?.state || null
//   }
//   onSelectionChange={(id) =>
//     setValue("state", id, { shouldValidate: true })
//   }
//   isInvalid={!!errors?.state}
//   errorMessage={errors?.state?.message}
// /> */}

//                       <CustomInput
//                         label="City"
//                         type="text"
//                         isRequired
//                         value={data.staff.city || ""}
//                         placeholder="Enter city"
//                         {...register("city", { required: "City is required" })}
//                         isInvalid={!!errors?.city}
//                         errorMessage={errors?.city?.message}
//                       />
//                       <CustomInput
//                         label="Zipcode"
//                         type="text"
//                         isRequired
//                         value={data.staff.zipCode || ""}
//                         placeholder="Enter zipcode"
//                         {...register("zipCode", {
//                           required: "Zipcode is required",
//                         })}
//                         isInvalid={!!errors?.zipCode}
//                         errorMessage={errors?.zipCode?.message}
//                       />

//                       <div className="mt-3">
//                         <CustomCheckbox
//                           label="Active"
//                           onValueChange={(value) =>
//                             setValue("status", value, { shouldValidate: true })
//                           }
//                           size="sm"
//                           isSelected={watch("status")}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </ModalBody>
//                 <ModalFooter>
//                   <CustomButton
//                     color="danger"
//                     variant="light"
//                     onPress={onClose}
//                     label="Close"
//                   />
//                   <CustomButton type="submit" label="Submit" color="primary" />
//                 </ModalFooter>
//               </>
//             )}
//           </ModalContent>
//         </form>
//       </Modal>
//     </>
//   );
// };

// export default EditStaffModal;

import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { FaRegEdit } from "react-icons/fa";
import CustomButton from "../../components/ui/CustomButton";
import CustomInput from "../../components/ui/CustomInput";
import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useUpdateStaffMutation } from "../../hooks/mutations/useUpdateData";
import CustomCheckbox from "../../components/ui/CustomCheckbox";

type FormValues = {
  staffId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  description: string;
  status: boolean;
};

const EditStaffModal = ({ itemData }: FormValues) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedData, setSelectedData] = useState<FormValues | null>(null);
  const { mutate } = useUpdateStaffMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      description: "",
      status: false,
    },
  });

  const state = [
    { label: "Ontario", id: "ontario" },
    { label: "Quebec", id: "quebec" },
    { label: "Nova Scotia", id: "novaScotia" },
    { label: "New Brunswick", id: "newBrunswick" },
    { label: "Manitoba", id: "manitoba" },
    { label: "British Columbia", id: "britishColumbia" },
    { label: "Saskatchewan", id: "saskatchewan" },
    { label: "Alberta", id: "alberta" },
    { label: "Newfoundland and Labrador", id: "newfoundlandandLabrador" },
  ];

  const country = [{ label: "Canada", id: "canada" }];

  // Set form values when modal opens
  useEffect(() => {
    if (selectedData) {
      const foundCountryId =
        country.find((item) => item.label === selectedData.country)?.id || "";
      const foundStateId =
        state.find((item) => item.label === selectedData.state)?.id || "";
      reset({
        fullName: selectedData.fullName || "",
        email: selectedData.email || "",
        phoneNumber: selectedData.phoneNumber || "",
        address: selectedData.address || "",
        city: selectedData.city || "",
        zipCode: selectedData.zipCode || "",
        description: selectedData.description || "",
        status: selectedData.status || false,
        country: foundCountryId, // Convert label to ID
        state: foundStateId,
      });
    }
  }, [selectedData, reset]);

  const handleOpen = () => {
    setSelectedData(itemData);
    onOpen();
  };

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const selectedCountryLabel =
      country.find((c) => c.id === formData.country)?.label || "";
    const selectedStateLabel =
      state.find((s) => s.id === formData.state)?.label || "";

    const updatedFormData = {
      ...formData,
      country: selectedCountryLabel, // Convert ID to Label
      state: selectedStateLabel, // Convert ID to Label
    };

    console.log("Final Updating Staff data: ", updatedFormData);

    mutate({ id: selectedData?.staffId || "", staffData: updatedFormData });
    onOpenChange(false);
  };

  // console.log("Data staff: ", selectedData);

  return (
    <>
      <CustomButton
        isIconOnly
        className="bg-transparent"
        endContent={
          <FaRegEdit size={18} className="hover:text-blue-500 text-gray-500" />
        }
        onPress={handleOpen}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Edit Staff</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-5">
                <CustomInput
                  label="Name"
                  type="text"
                  isRequired
                  placeholder="Enter name"
                  {...register("fullName", { required: "Name is required" })}
                  isInvalid={!!errors?.fullName}
                  errorMessage={errors?.fullName?.message}
                />
                <CustomInput
                  label="Email"
                  type="email"
                  isRequired
                  placeholder="Enter email"
                  {...register("email", { required: "Email is required" })}
                  isInvalid={!!errors?.email}
                  errorMessage={errors?.email?.message}
                />
                <CustomInput
                  label="Phone No"
                  type="text"
                  isRequired
                  placeholder="Enter mobile no"
                  // {...register("phoneNumber", {
                  //   required: "Phone number is required",
                  // })}
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers are allowed",
                    },
                    minLength: {
                      value: 7,
                      message: "Phone number must be at least 7 digits",
                    },
                    maxLength: {
                      value: 15,
                      message: "Phone number must be less than 15 digits",
                    },
                  })}
                  isInvalid={!!errors?.phoneNumber}
                  errorMessage={errors?.phoneNumber?.message}
                />
                <CustomInput
                  label="Address"
                  type="text"
                  isRequired
                  placeholder="Enter address"
                  {...register("address", { required: "Address is required" })}
                  isInvalid={!!errors?.address}
                  errorMessage={errors?.address?.message}
                />

                <Controller
                  name="country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => {
                    const selectedCountry = country.find(
                      (item) => item.label === selectedData?.country
                    );
                    return (
                      <CustomAutocomplete
                        label="Country"
                        isRequired
                        placeholder="Enter country"
                        defaultItems={country}
                        // selectedKey={selectedCountry?.id || ""}
                        selectedKey={watch("country") || null}
                        onSelectionChange={field.onChange}
                        isInvalid={!!errors?.country}
                        errorMessage={errors?.country?.message}
                      />
                    );
                  }}
                />

                <Controller
                  name="state"
                  control={control}
                  rules={{ required: "State is required" }}
                  render={({ field }) => {
                    const selectedState = state.find(
                      (item) => item.label === selectedData?.state
                    );
                    return (
                      <CustomAutocomplete
                        label="State"
                        isRequired
                        placeholder="Enter state"
                        defaultItems={state}
                        // selectedKey={
                        //   selectedData?.state ? selectedState?.id : ""
                        // }
                        selectedKey={watch("state") || null}
                        onSelectionChange={field.onChange}
                        isInvalid={!!errors?.state}
                        errorMessage={errors?.state?.message}
                      />
                    );
                  }}
                />

                <CustomInput
                  label="City"
                  type="text"
                  isRequired
                  placeholder="Enter city"
                  {...register("city", { required: "City is required" })}
                  isInvalid={!!errors?.city}
                  errorMessage={errors?.city?.message}
                />
                <CustomInput
                  label="Zipcode"
                  type="text"
                  isRequired
                  placeholder="Enter zipcode"
                  {...register("zipCode", { required: "Zipcode is required" })}
                  isInvalid={!!errors?.zipCode}
                  errorMessage={errors?.zipCode?.message}
                />
                <CustomCheckbox
                  label="Active"
                  onValueChange={(value) =>
                    setValue("status", value, { shouldValidate: true })
                  }
                  size="sm"
                  isSelected={!!watch("status")}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <CustomButton
                color="danger"
                variant="light"
                onPress={onOpenChange}
                label="Close"
              />
              <CustomButton type="submit" label="Submit" color="primary" />
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default EditStaffModal;
