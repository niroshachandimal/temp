import CustomInput from "../../components/ui/CustomInput";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Card,
  DatePicker,
  Divider,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import CustomButton from "../../components/ui/CustomButton";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { parseDate } from "@internationalized/date";
import { MdEditSquare } from "react-icons/md";
import { uploadToS3 } from "../../aws/s3FileUpload";
import { useUpdateUserprofile } from "../../hooks/mutations/useUpdateData";
import { useFetchUserDetailsById } from "../../hooks/queries/useFetchData";
import { IProviderInformationProps } from "../../types";
import { providerDefaultValue } from "../../utils/defaultValue";
import { yupResolver } from "@hookform/resolvers/yup";
import { providerSchema } from "../../validation/providerSchema";
import {
  canadaProvincesAndTerritories,
  countryData,
  currencyCodeData,
  languageData,
} from "../../data/sampleData";

type FormData = {
  name: string;
  mobile: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  profilePicture?: string;
  address: {
    addressLine1: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };
  language: string;
  currencyCode: string;
  status: boolean;
  groupRole: string;
};

const EditUserDetails = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const auth = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File>(null as unknown as File);

  const { data } = useFetchUserDetailsById(
    auth.user?.profile?.preferred_username || ""
  );

  const userData = data?.user || {};

  console.log("Edit get user data: ", data);

  const [date, setDate] = useState<ReturnType<typeof parseDate> | null>(
    parseDate("1990-12-01")
  );

  const { mutate, isSuccess } = useUpdateUserprofile();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const form = useForm<IProviderInformationProps>({
    defaultValues: providerDefaultValue,
    shouldUnregister: true,
    resolver: yupResolver(providerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
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

  const handleRemoveImage = () => setImage(null);

  useEffect(() => {
    const fullAddress = `${userData?.address?.addressLine1 || ""} ${
      userData?.address?.addressLine2 || ""
    }`.trim();
    console.log("run...");
    console.log("Full Address:", fullAddress);
    setValue("name", auth.user?.profile.name || "");
    setValue("email", auth.user?.profile.email || "");
    setValue("mobile", userData?.mobile || "");
    // setValue("gender", userData?.gender || "");
    setValue("dateOfBirth", userData?.dateOfBirth || "");
    setValue("bio", userData?.bio || "");
    setValue("address.addressLine1", fullAddress || "");
    setValue("address.country", userData?.address?.country || "");
    setValue("address.state", userData?.address?.state || "");
    setValue("address.city", userData?.address?.city || "");
    setValue("address.postalCode", userData?.address?.postalCode || "");
    setValue("language", userData?.language?.toLowerCase() || "");
    setImage(userData?.profilePicture || null);

    setValue("currencyCode", userData?.currencyCode?.toLowerCase() || "");
    setDate(
      auth.user?.profile.birthdate
        ? parseDate(auth.user?.profile.birthdate)
        : null
    );
  }, [
    auth.user?.profile.name,
    auth.user?.profile.email,
    auth.user?.profile.birthdate,
    userData,
    setValue,
  ]);

  const onSubmit = async (data: IProviderInformationProps) => {
    let fileUrl = "";
    const uid = auth.user?.profile?.preferred_username || "N/A";
    if (!uid) {
      addToast({
        title: "User ID not found",
        description: "Something went wrong.",
        radius: "md",
      });
    }
    if (uploadFile) {
      fileUrl = await uploadToS3(uploadFile, "profile-images");
    } else {
      // ptoa;
      addToast({
        title: "Image Upload Failed",
        description: "Please upload agian a profile image.",
        radius: "md",
        color: "danger",
      });
    }

    const profilePayload = {
      ...data,
      dateOfBirth: date ? date.toString() : "",
      profilePicture: fileUrl,
    };

    console.log("Profile Data:", profilePayload);
    await mutate({ id: uid, data: profilePayload });
  };

  const language = [
    { label: "English", key: "English" },
    { label: "French", key: "French" },
  ];

  const currencyCode = [
    { label: "USD", key: "USD" },
    { label: "CAD", key: "CAD" },
  ];

  // console.log("Edit User Details: ", image);
  return (
    <>
      <CustomButton
        label={userData?.ISVerified ? "Edit Profile" : "Verify"}
        startContent={userData?.ISVerified ? <MdEditSquare /> : null}
        onPress={onOpen}
        color={userData?.ISVerified ? "secondary" : "warning"}
        variant="flat"
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="outside"
        className="p-5"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader> Edit Personal Information</ModalHeader>
              <ModalBody>
                <Card radius="none" shadow="none" className="">
                  <div className="mx-5 ">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      {/* GENERAL INFORMATION */}
                      <div className="">
                        {/* Profile image */}
                        <div className="flex flex-initial py-5  items-center gap-5">
                          <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
                            {image ? (
                              <img
                                src={image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex flex-initial items-center  gap-2">
                              <label className="text-xs cursor-pointer bg-blue-600 text-white px-2 py-2 rounded-md shadow hover:bg-blue-700 transition">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageChange}
                                />
                              </label>

                              {image && (
                                <CustomButton
                                  label="Remove"
                                  size="sm"
                                  color="danger"
                                  onPress={handleRemoveImage}
                                />
                              )}
                            </div>
                            <small className="text-[10px] text-gray-500">
                              *JPG, PNG, GIF. Max less than size: 5MB.
                            </small>
                          </div>
                        </div>

                        {/* Input */}
                        <div className="grid grid-cols-2 gap-5 mt-2">
                          <div>
                            <CustomInput
                              label="Name"
                              isRequired
                              radius="sm"
                              variant="bordered"
                              size="md"
                              placeholder="Enter your full name"
                              isInvalid={!!errors?.name}
                              errorMessage={errors?.name?.message}
                              type="text"
                              {...register("name", {
                                required: "Name is required",
                                minLength: {
                                  value: 3,
                                  message: "Name must be at least 3 characters",
                                },
                                maxLength: {
                                  value: 50,
                                  message:
                                    "Name must be less than 50 characters",
                                },
                              })}
                            />
                          </div>

                          <div>
                            <CustomInput
                              type="text"
                              isRequired
                              radius="sm"
                              variant="bordered"
                              size="md"
                              label="Mobile Number"
                              placeholder="Enter your phone number"
                              {...register("mobile", {
                                required: "Mobile number is required",
                                pattern: {
                                  value:
                                    /^(?:\+1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
                                  message: "Only numbers are allowed",
                                },
                                minLength: {
                                  value: 10,
                                  message:
                                    "Mobile number must be at least 10 digits",
                                },
                                maxLength: {
                                  value: 20,
                                  message:
                                    "Mobile number must be less than 50 characters",
                                },
                              })}
                              isInvalid={!!errors?.mobile}
                              errorMessage={errors?.mobile?.message}
                            />
                          </div>

                          {/* <div className="">
                            <Controller
                              name="gender"
                              control={control}
                              rules={{ required: "Gender is required" }}
                              render={({ field, fieldState }) => (
                                <Autocomplete
                                  {...field}
                                  onSelectionChange={(key) =>
                                    field.onChange(key)
                                  }
                                  selectedKey={field.value}
                                  radius="sm"
                                  isRequired
                                  labelPlacement="outside"
                                  size="md"
                                  variant="bordered"
                                  label="Gender"
                                  placeholder="Search a gender"
                                  isInvalid={!!fieldState.error}
                                  errorMessage={fieldState.error?.message}
                                >
                                  {gender.map((gen) => (
                                    <AutocompleteItem key={gen.key}>
                                      {gen.label}
                                    </AutocompleteItem>
                                  ))}
                                </Autocomplete>
                              )}
                            />
                          </div> */}

                          <div>
                            <DatePicker
                              radius="sm"
                              variant="bordered"
                              size="md"
                              showMonthAndYearPickers
                              label="Date of Birth"
                              isRequired
                              labelPlacement="outside"
                              value={date}
                              onChange={(date) => {
                                setDate(date);
                              }}
                            />
                          </div>

                          <div className="">
                            <Controller
                              name="language"
                              control={control}
                              rules={{ required: "Language is required" }}
                              render={({ field, fieldState }) => (
                                <Autocomplete
                                  {...field}
                                  onSelectionChange={(key) =>
                                    field.onChange(key)
                                  }
                                  selectedKey={field.value}
                                  radius="sm"
                                  isRequired
                                  labelPlacement="outside"
                                  size="md"
                                  variant="bordered"
                                  label="Language"
                                  placeholder="Select a language"
                                  isInvalid={!!fieldState.error}
                                  errorMessage={fieldState.error?.message}
                                >
                                  {languageData.map((lag) => (
                                    <AutocompleteItem key={lag.key}>
                                      {lag.label}
                                    </AutocompleteItem>
                                  ))}
                                </Autocomplete>
                              )}
                            />
                          </div>
                          <div className="">
                            <Controller
                              name="currencyCode"
                              control={control}
                              rules={{ required: "Currency is required" }}
                              render={({ field, fieldState }) => (
                                <Autocomplete
                                  {...field}
                                  onSelectionChange={(key) =>
                                    field.onChange(key)
                                  }
                                  selectedKey={field.value}
                                  radius="sm"
                                  isRequired
                                  labelPlacement="outside"
                                  size="md"
                                  variant="bordered"
                                  label="Currency"
                                  placeholder="Search an currencyCode"
                                  isInvalid={!!fieldState.error}
                                  errorMessage={fieldState.error?.message}
                                >
                                  {currencyCodeData.map((cur) => (
                                    <AutocompleteItem key={cur.key}>
                                      {cur.label}
                                    </AutocompleteItem>
                                  ))}
                                </Autocomplete>
                              )}
                            />
                          </div>
                        </div>

                        {/* Bio (Textarea) */}
                        <div className="mt-4">
                          <Textarea
                            label="Bio"
                            isRequired
                            isClearable
                            labelPlacement="outside"
                            placeholder="Tell us about yourself"
                            variant="bordered"
                            onClear={() => console.log("Bio cleared")}
                            {...register("bio", {
                              required: "Bio is required",
                              maxLength: {
                                value: 350,
                                message:
                                  "Country must be less than 150 characters",
                              },
                              minLength: {
                                value: 3,
                                message:
                                  "Country must be at least 3 characters",
                              },
                            })}
                            isInvalid={!!errors?.bio}
                            errorMessage={errors?.bio?.message}
                          />
                        </div>
                      </div>

                      {/* ADDRESS INFORMATION */}
                      <div className="mt-8">
                        <div className="flex flex-initial justify-between items-center">
                          <p className="text-subtitle3">Address Information</p>
                        </div>
                        <Divider className="my-3" />
                        <div className="mt-12 mb-6">
                          <CustomInput
                            label="Address"
                            isRequired
                            radius="sm"
                            variant="bordered"
                            size="md"
                            placeholder="Enter your address"
                            type="text"
                            {...register("address.addressLine1", {
                              required: "Address is required",
                              maxLength: {
                                value: 100,
                                message:
                                  "Address must be less than 300 characters",
                              },
                              minLength: {
                                value: 3,
                                message:
                                  "Address must be at least 3 characters",
                              },
                            })}
                            isInvalid={!!errors?.address?.addressLine1}
                            errorMessage={
                              errors?.address?.addressLine1?.message
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-5 mt-2">
                          {/* <div>
                            <CustomInput
                              isRequired
                              radius="sm"
                              variant="bordered"
                              size="md"
                              label="Country"
                              placeholder="Enter your country"
                              type="tel"
                              {...register("address.country", {
                                required: "Country is required",
                                maxLength: {
                                  value: 30,
                                  message:
                                    "Country must be less than 30 characters",
                                },
                                minLength: {
                                  value: 3,
                                  message:
                                    "Country must be at least 3 characters",
                                },
                              })}
                              isInvalid={!!errors?.address?.country}
                              errorMessage={errors?.address?.country?.message}
                            />
                          </div> */}
                          <Controller
                            name="currencyCode"
                            control={control}
                            rules={{ required: "Currency is required" }}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                {...field}
                                onSelectionChange={(key) => field.onChange(key)}
                                selectedKey={field.value}
                                radius="sm"
                                isRequired
                                labelPlacement="outside"
                                size="md"
                                variant="bordered"
                                label="Country"
                                placeholder="Enter your country"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                              >
                                {countryData.map((s) => (
                                  <AutocompleteItem key={s.key}>
                                    {s.label}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>
                            )}
                          />

                          {/* <div>
                            <CustomInput
                              isRequired
                              radius="sm"
                              variant="bordered"
                              size="md"
                              label="State"
                              placeholder="Enter your state"
                              type="tel"
                              {...register("address.state", {
                                required: "State is required",
                                maxLength: {
                                  value: 30,
                                  message:
                                    "State must be less than 30 characters",
                                },
                                minLength: {
                                  value: 3,
                                  message:
                                    "State must be at least 3 characters",
                                },
                              })}
                              isInvalid={!!errors?.address?.state}
                              errorMessage={errors?.address?.state?.message}
                            />
                          </div> */}

                          <Controller
                            name="currencyCode"
                            control={control}
                            rules={{ required: "Currency is required" }}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                {...field}
                                onSelectionChange={(key) => field.onChange(key)}
                                selectedKey={field.value}
                                radius="sm"
                                isRequired
                                labelPlacement="outside"
                                size="md"
                                variant="bordered"
                                label="State"
                                placeholder="Enter your state"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                              >
                                {canadaProvincesAndTerritories.map((s) => (
                                  <AutocompleteItem key={s.key}>
                                    {s.label}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>
                            )}
                          />

                          <div>
                            <CustomInput
                              isRequired
                              radius="sm"
                              variant="bordered"
                              size="md"
                              label="City"
                              placeholder="Enter your city"
                              type="tel"
                              {...register("address.city", {
                                required: "City is required",
                                maxLength: {
                                  value: 30,
                                  message:
                                    "City must be less than 30 characters",
                                },
                                minLength: {
                                  value: 3,
                                  message: "City must be at least 3 characters",
                                },
                              })}
                              isInvalid={!!errors?.address?.city}
                              errorMessage={errors?.address?.city?.message}
                            />
                          </div>

                          <div>
                            <CustomInput
                              isRequired
                              radius="sm"
                              variant="bordered"
                              size="md"
                              label="Postal Code"
                              placeholder="Enter postal code"
                              type="tel"
                              {...register("address.postalCode", {
                                required: "ZipCode is required",
                                maxLength: {
                                  value: 10,
                                  message:
                                    "ZipCode must be less than 10 characters",
                                },
                                minLength: {
                                  value: 5,
                                  message:
                                    "ZipCode must be at least 5 characters",
                                },
                              })}
                              isInvalid={!!errors?.address?.postalCode}
                              errorMessage={
                                errors?.address?.postalCode?.message
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 mt-6"></div>
                      </div>
                      <div className="flex justify-end items-center mt-10 gap-5">
                        {/* <CustomButton size="md" label="Clear" color="danger" /> */}
                        <CustomButton
                          type="submit"
                          size="sm"
                          label="Close"
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        />
                        <CustomButton
                          type="submit"
                          size="sm"
                          label="Submit"
                          color="primary"
                          isLoading={isSuccess}
                        />
                      </div>
                    </form>
                  </div>
                </Card>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditUserDetails;
