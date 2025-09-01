import CustomInput from "../../components/ui/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  AutocompleteItem,
  Divider,
  Textarea,
  Select,
  Avatar,
  SelectItem,
  Calendar,
  addToast,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  RadioGroup,
  Radio,
  cn,
} from "@heroui/react";
import CustomButton from "../../components/ui/CustomButton";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import {
  useFetchAllServiceByProvider,
  useFetchServiceDataById,
} from "../../hooks/queries/useFetchData";
import { canadaProvincesAndTerritories } from "../../data/sampleData";
import {
  IServiceProps,
  ITimeslotAvailabilityFetchProps,
  ITimeslotResponse,
} from "../../types";
import {
  useCheckTimesSlotAvailability,
  useCreateBookingMutation,
} from "../../hooks/mutations/usePostData";
import { convertToInternationalizedDateTimeToReadble } from "../../utils/convertTime";
import CustomChip from "../../components/ui/CustomChip";
import SmallLoadingSpinner from "../../components/ui/SmallLoadingSpinner";
import CustomDivider from "../../components/ui/CustomDivider";
import moment from "moment";
// import { IoLocationOutline } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { useAuth } from "react-oidc-context";
import { bookingSchema } from "../../validation/bookingSchema";
import { firstLetterUpperCase } from "../../utils/common";
import NotFoundData from "../../components/ui/NotFoundData";
import NoDataFound from "../NoDataFound";

type FormData = {
  providerId: string;
  staffId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTimeFrom: string;
  appointmentTimeTo: string;
  additionalServiceIds?: string[];
  timeSlotId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    bookingNotes?: string;
    address: {
      street: string;
      state: string;
      city: string;
      postalCode: string;
    };
  };
  paymentMethod: string;
  isPaid: boolean;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
};

interface IAmmountProps {
  subtotal: number;
  total: number;
  tax: number;
}

const AddBookingModal = () => {
  const auth = useAuth();
  const [value, setDateValue] = useState<CalendarDate | null>(null);
  const [timeSlots, setTimeSlots] = useState<ITimeslotResponse[]>([]);
  const [ammount, setAmmount] = useState<IAmmountProps>();
  const [availableStaff, setAvailableStaff] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      providerId: "",
      staffId: "",
      serviceId: "",
      appointmentDate: "",
      appointmentTimeFrom: "",
      appointmentTimeTo: "",
      additionalServiceIds: [],
      timeSlotId: "",
      personalInfo: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        bookingNotes: "",
        address: {
          street: "",
          state: "",
          city: "",
          postalCode: "",
        },
      },
      paymentMethod: "Credit/Debit Card",
      isPaid: false,
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    shouldUnregister: false,
    resolver: yupResolver(bookingSchema),
    mode: "onChange", // validate as the user types
    reValidateMode: "onChange", // re-validate after changes
  });

  const serviceId = watch("serviceId");
  const selectedDate = watch("appointmentDate");
  const timeSlotId = watch("timeSlotId");
  const appointmentTimeFrom = watch("appointmentTimeFrom");
  const appointmentTimeTo = watch("appointmentTimeTo");
  const selectedAdditionalServiceIds = watch("additionalServiceIds");
  const selectedstaffId = watch("staffId");
  const cusCity = watch("personalInfo.address.city");
  const cusState = watch("personalInfo.address.state");
  const cusPostalCode = watch("personalInfo.address.postalCode");
  const cusAddress = watch("personalInfo.address.street");
  const cusFirstname = watch("personalInfo.firstName");
  const cusLastname = watch("personalInfo.lastName");
  const cusMobile = watch("personalInfo.phone");
  const cusEmail = watch("personalInfo.email");

  console.log("Full Hook payload: ", watch());

  const { data: serviceData } = useFetchAllServiceByProvider(1, 100);
  const { data: serviceDataById, isFetching: isServiceByIdLoading } =
    useFetchServiceDataById(serviceId ?? "");
  const { mutateAsync } = useCheckTimesSlotAvailability();
  const { mutate } = useCreateBookingMutation();

  const apiServiceDataById: IServiceProps = serviceDataById?.serviceInfo;

  const weekdayToNumber: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const allowedWeekDays = useMemo(() => {
    if (!apiServiceDataById?.availability) return [];

    const da = apiServiceDataById?.availability?.map(
      (a: any) => weekdayToNumber[a.day.toLowerCase()]
    );
    return da;
  }, [serviceDataById]);

  useEffect(() => {
    if (allowedWeekDays.length > 0) {
      const firstValid = getNextAvailableDate();
      setDateValue(firstValid);
    }
  }, [allowedWeekDays]);

  const getNextAvailableDate = (): CalendarDate => {
    const tz = getLocalTimeZone();
    let date = today(tz);

    for (let i = 0; i < 30; i++) {
      const jsDate = date.toDate(tz);
      const day = jsDate.getDay();
      if (allowedWeekDays.includes(day)) return date;
      date = date.add({ days: 1 });
    }
    return today(tz); // fallback
  };

  // CHECK AVAILABILITY TIMESLOT
  useEffect(() => {
    const checkBookingAvailableTimeSlot = async () => {
      if (!serviceId || !selectedDate) return;
      const payload: ITimeslotAvailabilityFetchProps = {
        serviceId,
        date: convertToInternationalizedDateTimeToReadble(
          selectedDate
        ) as string,
      };

      try {
        const response = await mutateAsync(payload);
        if (response.success) {
          setTimeSlots(response.timeSlots);
        } else {
          setTimeSlots([]);
        }

        console.log("response: ", response);
      } catch (error) {
        console.log("Error check timeslot availability: ", error);
      }
    };

    checkBookingAvailableTimeSlot();
  }, [serviceId, value, selectedDate, mutateAsync]);

  // GET AVAILABLE STAFF
  useEffect(() => {
    if (!timeSlots) return;

    const filterStaff = timeSlots.filter(
      (item) => item.timeSlotId === timeSlotId
    );

    console.log("timeslot888: ", filterStaff?.[0]?.availableStaff);

    setAvailableStaff(
      filterStaff?.[0]?.availableStaff ? filterStaff[0].availableStaff : []
    );
  }, [timeSlotId, serviceId, selectedDate]);

  console.log("availableStaff: ", availableStaff);

  // SUBMIT DATA
  const onSubmit = async (data: FormData) => {
    const uid = auth.user?.profile?.preferred_username || "N/A";
    if (!uid) {
      addToast({
        title: "User ID not found",
        description: "Something went wrong.",
        radius: "md",
      });
    }

    const profilePayload = {
      ...data,
      appointmentDate: convertToInternationalizedDateTimeToReadble(
        data.appointmentDate
      ),
      providerId: uid,
      subtotal: ammount?.subtotal || 0,
      tax: ammount?.tax || 0,
      discount: serviceDataById?.serviceInfo?.offerPrice || 0,
      total: ammount?.total || 0,
    };

    console.log("Payload Data:", profilePayload);

    // mutate(profilePayload);
  };

  console.log("Data: ");

  const handleTimeSlotId = (id: string, start: string, to: string) => {
    if (!id || !start || !to) {
      addToast({
        title: "Error",
        description: "Time slot is not select",
        radius: "md",
        color: "danger",
      });
      return;
    }
    setValue("timeSlotId", id);
    setValue("appointmentTimeFrom", start);
    setValue("appointmentTimeTo", to);
  };

  useEffect(() => {
    const calculateSubtotalAndTotal = () => {
      if (!apiServiceDataById) return;
      const serviceprice = apiServiceDataById.price || 0;
      const serviceDiscount = apiServiceDataById?.offerPrice || 0;
      const promoCodeDiscount = 0;
      const tax = 0;
      const addtionalServiceTotal =
        apiServiceDataById?.additionalServices?.reduce((acc, service) => {
          if (selectedAdditionalServiceIds.includes(service.id)) {
            return acc + service.price;
          }
          return acc;
        }, 0);

      const subtotal = serviceprice + (addtionalServiceTotal ?? 0);
      const total = subtotal - serviceDiscount - promoCodeDiscount + tax;

      setAmmount({
        subtotal,
        total,
        tax,
      });
    };

    calculateSubtotalAndTotal();
  }, [apiServiceDataById, selectedAdditionalServiceIds]); // need add tax and promocode discount

  console.log("Errors: ", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="grid grid-cols-3 gap-5 mt-2 mb-6">
          {/* FIRST */}
          <div className="grid col-span-2  ">
            <div className="max-h-[87vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
              {/* GENERAL INFORMATION */}

              <Card shadow="sm" radius="none" className="px-2 ">
                <CardHeader></CardHeader>
                <CardBody>
                  <div className="grid max-w-[550px] gap-5 mt-2 ">
                    <Controller
                      name="serviceId"
                      control={control}
                      rules={{ required: "Service is required" }}
                      render={({ field, fieldState }) => (
                        <Select
                          {...field}
                          isRequired
                          variant="bordered"
                          label="Select Service"
                          labelPlacement="outside"
                          placeholder="Select a service"
                          description="First need to select a service"
                          selectedKeys={[field.value]}
                          onSelectionChange={(val) => {
                            field.onChange(val);
                          }}
                          items={serviceData?.services || []}
                          errorMessage={fieldState.error?.message}
                          renderValue={(items) =>
                            items.map((item) => (
                              <div
                                key={item.data?.serviceId}
                                className="flex items-center gap-2"
                              >
                                <Avatar
                                  alt={item.data?.serviceTitle}
                                  className="flex-shrink-0"
                                  size="sm"
                                  src={
                                    item?.data?.gallery?.[0]?.serviceImages?.[0]
                                  }
                                />
                                <div className="flex flex-col p-2">
                                  <span>{item.data?.serviceTitle}</span>
                                  <span className="text-default-500 text-tiny">
                                    {item.data?.serviceId}
                                  </span>
                                </div>
                              </div>
                            ))
                          }
                        >
                          {(data: IServiceProps) => (
                            <SelectItem
                              key={data?.serviceId}
                              textValue={data?.serviceTitle}
                            >
                              <div className="flex gap-2 items-center">
                                <Avatar
                                  alt={data?.serviceTitle}
                                  className="flex-shrink-0"
                                  size="sm"
                                  src={data?.gallery?.[0]?.serviceImages?.[0]}
                                />
                                <div className="flex flex-col">
                                  <span className="text-small">
                                    {data?.serviceTitle}
                                  </span>
                                  <span className="text-tiny text-default-400">
                                    {data?.serviceId}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          )}
                        </Select>
                      )}
                    />
                  </div>

                  {/* <div className="mt-5 ">
                    <p className="text-subtitle1 my-2">Package Type</p>
                    <CustomDivider />
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 mt-3 mb-5">
                        {apiServiceDataById?.additionalServices?.map(
                          (service, index: number) => {
                            return (
                              <Card
                                key={index}
                                shadow="none"
                                radius="sm"
                                className="bg-gray-200 dark:bg-gray-700"
                              >
                                <CardBody>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center flex-initial gap-3">
                                      <Avatar
                                        className="flex-shrink-0"
                                        size="md"
                                        radius="sm"
                                        src={service?.images}
                                      />
                                      <div>
                                        <p className="text-xs font-medium">
                                          {service?.serviceItem}
                                        </p>
                                        <p className="text-sm text-green-600">
                                          ${service?.price}
                                        </p>
                                      </div>
                                    </div>
                                    <CustomButton type="button" label="Add" />
                                  </div>
                                </CardBody>
                              </Card>
                            );
                          }
                        )}
                      </div>
                    </>
                  </div> */}

                  {/* CALENDAR */}
                  <div>
                    <p className="text-subtitle1 my-2 mt-10">
                      Booking Availability
                    </p>
                    <CustomDivider />
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 mt-5">
                      <div>
                        <div className="min-h-[250px] ">
                          <Controller
                            name="appointmentDate"
                            control={control}
                            rules={{
                              required:
                                "Please select a service available date",
                            }}
                            render={({ field, fieldState }) => (
                              <Calendar
                                minValue={today(getLocalTimeZone())}
                                maxValue={today(getLocalTimeZone()).add({
                                  days: 30,
                                })}
                                onChange={(val) => {
                                  field.onChange(val);
                                  setAvailableStaff([]);
                                  setValue("staffId", "");
                                  setValue("appointmentTimeFrom", "");
                                  setValue("appointmentTimeTo", "");
                                  setValue("timeSlotId", "");
                                }}
                                value={field.value}
                                isDateUnavailable={(date) => {
                                  const day = date
                                    .toDate(getLocalTimeZone())
                                    .getDay();
                                  return !allowedWeekDays.includes(day);
                                }}
                                isRequired
                                errorMessage={fieldState.error?.message}
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* TIMESLOT */}
                      <div className="grid lg:col-span-1 xl:col-span-2  2xl:col-span-3 ">
                        <div>
                          <p className="mb-2  text-body2 ">Time Slot</p>
                          {timeSlots?.length === 0 && (
                            <NotFoundData label="First select a servive and date " />
                          )}
                          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
                            <Controller
                              name="timeSlotId"
                              control={control}
                              render={({ field }) => (
                                <>
                                  {timeSlots?.map((slot, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() =>
                                        handleTimeSlotId(
                                          slot.timeSlotId,
                                          slot.from,
                                          slot.to
                                        )
                                      }
                                      className={`rounded-md border px-2 py-1.5 text-left shadow-sm transition-all duration-200 ${
                                        field.value === slot.timeSlotId
                                          ? "bg-sky-200 border-sky-400 dark:bg-secondary dark:border-secondary"
                                          : "bg-emerald-100 border-emerald-200 dark:bg-emerald-500 dark:border-emerald-600 hover:bg-sky-200 hover:border-sky-300 dark:hover:bg-secondary dark:hover:border-secondary"
                                      }`}
                                    >
                                      <div className="text-sm font-semibold text-gray-800">
                                        {slot.from} - {slot.to}
                                      </div>

                                      <div className="mt-1 flex flex-col spasce-y-1 text-caption dark:text-gray-800">
                                        <div>
                                          {slot.availableStaff?.length} Staff{" "}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </>
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <p className="mb-2  text-body2 ">Staff</p>
                          {availableStaff?.length === 0 && (
                            <NotFoundData label="Select a time slot to check available staff" />
                          )}

                          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
                            <Controller
                              name="staffId"
                              control={control}
                              render={({ field }) => (
                                <>
                                  {availableStaff?.map((slot, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={(val) =>
                                        field.onChange(slot.staffId)
                                      }
                                      className={`rounded-md border px-2 py-1.5 text-left shadow-sm transition-all duration-200 ${
                                        field.value === slot.staffId
                                          ? "bg-sky-200 border-sky-400 dark:bg-secondary dark:border-secondary"
                                          : "bg-emerald-100 border-emerald-200 dark:bg-emerald-500 dark:border-emerald-600 hover:bg-sky-200 hover:border-sky-300 dark:hover:bg-secondary dark:hover:border-secondary"
                                      }`}
                                    >
                                      <div className="text-sm font-semibold text-gray-800">
                                        {slot.fullName}
                                      </div>

                                      <div className="mt-1 flex flex-col space-y-1 text-caption dark:text-gray-800">
                                        <div>Id: {slot.staffId} </div>
                                      </div>
                                    </button>
                                  ))}
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <p className="text-subtitle1 my-2">Additional Service</p>
                      <CustomDivider />
                      {apiServiceDataById?.additionalServices?.length === 0 &&
                        !isServiceByIdLoading && (
                          <NotFoundData label="No Package Found" />
                        )}

                      {isServiceByIdLoading ? (
                        <SmallLoadingSpinner />
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 mt-3 mb-5">
                          <Controller
                            name="additionalServiceIds"
                            control={control}
                            defaultValue={[]} // Important for multi-select
                            render={({ field }) => (
                              <>
                                {apiServiceDataById?.additionalServices?.map(
                                  (service, index) => (
                                    <Card
                                      key={service.id || index}
                                      shadow="none"
                                      radius="sm"
                                      className="bg-gray-200 dark:bg-gray-700"
                                    >
                                      <CardBody>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center flex-initial gap-3">
                                            <Avatar
                                              className="flex-shrink-0"
                                              size="md"
                                              radius="sm"
                                              src={service?.images}
                                            />
                                            <div>
                                              <p className="text-xs font-medium">
                                                {service?.serviceItem}
                                              </p>
                                              <p className="text-sm text-green-600">
                                                ${service?.price}
                                              </p>
                                            </div>
                                          </div>
                                          <CustomButton
                                            label={
                                              field.value?.includes(service.id)
                                                ? "Remove"
                                                : "Add"
                                            }
                                            color={
                                              field.value?.includes(service.id)
                                                ? "danger"
                                                : "primary"
                                            }
                                            variant={
                                              field.value?.includes(service.id)
                                                ? "flat"
                                                : "solid"
                                            }
                                            onPress={() => {
                                              const current = field.value || [];
                                              const exists = current.includes(
                                                service.id
                                              );
                                              const updated = exists
                                                ? current.filter(
                                                    (id) => id !== service.id
                                                  )
                                                : [...current, service.id];
                                              field.onChange(updated);
                                            }}
                                          />
                                        </div>
                                      </CardBody>
                                    </Card>
                                  )
                                )}
                              </>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* CUSTOMER DETAILS */}
              <Card shadow="sm" radius="none" className="px-2 mt-5">
                <CardBody>
                  <div className="">
                    <p className="text-subtitle1 my-2">Customer Details</p>
                    <Divider />
                    {/* Input */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5 mt-5">
                      <div>
                        <CustomInput
                          label="First Name"
                          isRequired
                          radius="sm"
                          variant="bordered"
                          autoComplete="given-name"
                          size="md"
                          placeholder="Enter first name"
                          isInvalid={!!errors?.personalInfo?.firstName}
                          errorMessage={
                            errors?.personalInfo?.firstName?.message
                          }
                          type="text"
                          {...register("personalInfo.firstName")}
                        />
                      </div>

                      <div>
                        <CustomInput
                          label="Last Name"
                          isRequired
                          radius="sm"
                          variant="bordered"
                          size="md"
                          autoComplete="additional-name"
                          placeholder="Enter last name"
                          isInvalid={!!errors?.personalInfo?.lastName}
                          errorMessage={errors?.personalInfo?.lastName?.message}
                          type="text"
                          {...register("personalInfo.lastName")}
                        />
                      </div>

                      <div>
                        <CustomInput
                          label="Email"
                          isRequired
                          radius="sm"
                          variant="bordered"
                          size="md"
                          autoComplete="email"
                          placeholder="Enter email"
                          isInvalid={!!errors?.personalInfo?.email}
                          errorMessage={errors?.personalInfo?.email?.message}
                          type="text"
                          {...register("personalInfo.email")}
                        />
                      </div>

                      <div>
                        <CustomInput
                          type="text"
                          isRequired
                          radius="sm"
                          variant="bordered"
                          size="md"
                          autoComplete="tel-national"
                          label="Mobile Number"
                          placeholder="Enter your phone number"
                          description="Only allowed canadian phone number"
                          {...register("personalInfo.phone")}
                          isInvalid={!!errors?.personalInfo?.phone}
                          errorMessage={errors?.personalInfo?.phone?.message}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS INFORMATION */}
                  <div className="mt-5">
                    <p className="text-subtitle1 my-2">Address details</p>
                    <Divider />
                    <div className="mt-12 mb-6">
                      <CustomInput
                        label="Address"
                        isRequired
                        radius="sm"
                        variant="bordered"
                        autoComplete="address-line1"
                        size="md"
                        placeholder="Enter your address"
                        type="text"
                        {...register("personalInfo.address.street")}
                        isInvalid={!!errors?.personalInfo?.address?.street}
                        errorMessage={
                          errors?.personalInfo?.address?.street?.message
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5 mt-5">
                      <div className="">
                        <Controller
                          name="personalInfo.address.state"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              onSelectionChange={(key) => field.onChange(key)}
                              selectedKey={field.value}
                              radius="sm"
                              isRequired
                              labelPlacement="outside"
                              size="md"
                              autoComplete="address-line1"
                              variant="bordered"
                              label="State"
                              placeholder="select a state"
                              isInvalid={!!errors?.personalInfo?.address?.state}
                              errorMessage={
                                errors?.personalInfo?.address?.state?.message
                              }
                            >
                              {canadaProvincesAndTerritories.map((data) => (
                                <AutocompleteItem key={data.key}>
                                  {data.label}
                                </AutocompleteItem>
                              ))}
                            </Autocomplete>
                          )}
                        />
                      </div>

                      <div>
                        <CustomInput
                          isRequired
                          radius="sm"
                          variant="bordered"
                          size="md"
                          label="City"
                          autoComplete="address-level2"
                          placeholder="Enter your city"
                          type="tel"
                          {...register("personalInfo.address.city")}
                          isInvalid={!!errors?.personalInfo?.address?.city}
                          errorMessage={
                            errors?.personalInfo?.address?.city?.message
                          }
                        />
                      </div>

                      <div>
                        <CustomInput
                          isRequired
                          radius="sm"
                          variant="bordered"
                          size="md"
                          label="Postal Code"
                          autoComplete="postal-code"
                          placeholder="Enter postal code"
                          type="tel"
                          {...register("personalInfo.address.postalCode")}
                          isInvalid={
                            !!errors?.personalInfo?.address?.postalCode
                          }
                          errorMessage={
                            errors?.personalInfo?.address?.postalCode?.message
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mt-6"></div>
                  </div>

                  <div className="mb-5">
                    <Textarea
                      label="Booking Note "
                      isClearable
                      labelPlacement="outside"
                      placeholder="Enter booking note"
                      variant="bordered"
                      {...register("personalInfo.bookingNotes")}
                      isInvalid={!!errors?.personalInfo?.bookingNotes}
                      errorMessage={errors?.personalInfo?.bookingNotes?.message}
                    />
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="flex justify-end items-center mt-10 gap-5 mb-10"></div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* SECOND */}
          <div className=" ">
            {/* PAYMENT */}
            <Card radius="sm" shadow="sm">
              <CardHeader className="bg-gray-200 rounded-sm dark:bg-black">
                <p className="text-subtitle1">Booking Information</p>
              </CardHeader>
              <CardBody>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6 ">
                    <div className="px-2">
                      {/* ADDRESS */}
                      {cusPostalCode && cusAddress && cusCity && cusState && (
                        <div className=" mt-3">
                          <p className="text-caption mb-1">Biil To</p>
                          <p className="text-subtitle1 mb-1">
                            {firstLetterUpperCase(cusFirstname)}{" "}
                            {firstLetterUpperCase(cusLastname)}
                          </p>
                          <p className="text-body1">
                            {" "}
                            {firstLetterUpperCase(cusAddress)}
                          </p>
                          <p className="text-body1">
                            {firstLetterUpperCase(cusCity)},{" "}
                            {firstLetterUpperCase(cusState)}
                          </p>
                          <p className="text-body1">
                            {cusEmail} | {cusMobile}
                          </p>
                          <CustomDivider />
                        </div>
                      )}
                      {/* TIME AND DATE */}
                      <div className="flex justify-between items-center mb-5 mt-2">
                        {selectedDate &&
                          appointmentTimeFrom &&
                          appointmentTimeTo && (
                            <div className="flex gap-3 items-cente">
                              <div className="flex-none border-1 border-gray-300 rounded-small text-center w-11 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                                <div className="text-tiny bg-default-100 py-0.5 text-default-500">
                                  {moment(selectedDate).format("MMM")}
                                </div>
                                <div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
                                  {moment(selectedDate).format("DD")}
                                </div>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className=" text-subtitle1 ">
                                  {moment(selectedDate).format("dddd, MMMM DD")}
                                </p>
                                <p className=" text-body1">
                                  {`${appointmentTimeFrom} - ${appointmentTimeTo} `}
                                </p>
                              </div>
                            </div>
                          )}
                        {/* STAFF */}
                        {selectedDate && selectedstaffId && (
                          <div className="flex gap-3 items-cente mr-5">
                            <div className="flex items-center justify-center border-1 border-gray-300 rounded-small w-11 h-11 bg-gray-50  dark:bg-gray-800 dark:border-gray-700">
                              <GrUserWorker
                                size={18}
                                className="text-gray-500"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <p className=" text-subtitle1 ">
                                {
                                  availableStaff.filter(
                                    (staff) =>
                                      staff?.staffId === selectedstaffId
                                  )[0]?.fullName
                                }
                              </p>
                              <p className=" text-body1">
                                {
                                  availableStaff.filter(
                                    (staff) =>
                                      staff?.staffId === selectedstaffId
                                  )[0]?.staffId
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* <div className="">
                        <CustomDivider />
                        <RadioGroup
                          // label="Plans"
                          orientation="horizontal"
                          className="flex justify-between item-center my-5 text-body1"
                        >
                          <Radio
                            value="Credit/Debit Card"
                            className={cn(
                              "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent bg-gray-100",
                              "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-3 text-body1",
                              " data-[selected=true]:border-primary/50 data-[selected=true]:bg-primary/15 mr-10 text-body1"
                            )}
                          >
                            Credit/Debit Card
                          </Radio>
                          <Radio
                            defaultChecked={true}
                            value="Cash on Delivery"
                            className={cn(
                              "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent bg-gray-100 text-body1",
                              "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-3",
                              "data-[selected=true]:border-primary/50 data-[selected=true]:bg-primary/15 text-body1"
                            )}
                          >
                            Cash on Delivery
                          </Radio>
                        </RadioGroup>
                      </div> */}

                      <CustomDivider />
                      <p className="text-body2 text-gray-600  flex justify-between mt-4">
                        <span className="text-body2">
                          Service Price:{" "}
                          <CustomChip
                            label="Basic"
                            color="primary"
                            className="ml-2"
                          />
                        </span>{" "}
                        <span className="text-body1">
                          $ {apiServiceDataById?.price.toFixed(2) || "0.00"}
                        </span>
                      </p>
                    </div>

                    <div className=""></div>
                  </div>

                  {selectedAdditionalServiceIds?.length > 0 && (
                    <div className="text-body2 text-gray-600 -mt-3 px-2">
                      <span className="text-body2 mb-1 block ">
                        Additional Services
                      </span>
                      <ul className="list-none space-y-2 mt-2">
                        {apiServiceDataById?.additionalServices
                          ?.filter((service) =>
                            selectedAdditionalServiceIds.includes(service.id)
                          )
                          .map((service, index) => (
                            <li
                              key={service.id}
                              className="flex justify-between text-body1 text-gray-600"
                            >
                              <span>
                                {index + 1}. {service?.serviceItem}
                              </span>
                              <span className="ml-2 text-body1">
                                ${service?.price?.toFixed(2) || "0.00"}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* add a subtotal and above and below add a line  */}
                  <div className="px-2">
                    <CustomDivider />
                    <p className="text-body2 text-gray-600 flex justify-between">
                      <span className="text-body2">Subtotal:</span>{" "}
                      <span className=" text-body1  w-[100px]  pt-[5px] text-end">
                        $ {ammount?.subtotal || "0.00"}
                      </span>
                    </p>
                    <p className="text-body2 text-green-600   mt-[12px] flex justify-between">
                      <span className="text-body2">Discount:</span>{" "}
                      <span className="text-body1">
                        {/* - $ {data?.discount || "0.00"} */}- $ 0
                      </span>
                    </p>
                    {/* <p className="text-body2 text-red-500 mt-[15px] flex justify-between">
                      <span className="text-body2">Tax (10%):</span>{" "}
                      <span className="text-sm font-normal text-red-500 dark:text-red-400">
                        + $ {ammount?.tax || "0.00"}
                      </span>
                    </p> */}
                    <CustomDivider />
                    <p className="text-lg text-green-500 mt-[15px] flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {" "}
                        Total Ammount:
                      </span>{" "}
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {/* ${ammount?.total || "0.00"} */}${" "}
                        {ammount?.subtotal || "0.00"}
                      </span>
                    </p>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex flex-col">
                <CustomButton
                  type="submit"
                  size="lg"
                  label="Confirm Booking"
                  color="primary"
                  fullWidth={true}
                  className=" font-semibold text-lg"
                  // isLoading={isSuccess}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddBookingModal;
