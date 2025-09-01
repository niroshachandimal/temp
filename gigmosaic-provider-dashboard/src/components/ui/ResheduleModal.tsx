import CustomButton from "./CustomButton";
import {
  addToast,
  Alert,
  Calendar,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
  User,
} from "@heroui/react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import CustomChip from "./CustomChip";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useFetchServiceDataById } from "../../hooks/queries/useFetchData";
import {
  IBookingProps,
  IReshedulePostData,
  IServiceProps,
  iStaffGetProps,
  ITimeslotResponse,
} from "../../types";
import { getStaffById } from "../../api/service/apiStaff";
import {
  checkBookingAvailableStaff,
  getTimeSlotRelatedStaff,
} from "../../api/service/apiBooking";
import { convertDateToReadble } from "../../utils/convertTime";
import CustomTextArea from "./CustomTextArea";
import { useBookingReshedule } from "../../hooks/mutations/usePostData";
import CustomAlert from "./CustomAlert";
import Loading from "./Loading";

interface ResheduleModalProps {
  data: IBookingProps;
}

interface StaffResponse {
  staff: iStaffGetProps;
}

interface IAlreadySelectedTimeAndDate {
  date: string;
  timeSlot: string;
}

interface ITimeslotResp {
  start: string;
  to: string;
}

const ResheduleModal = ({ data }: ResheduleModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [serviceDetails, setServiceDetails] = useState<IServiceProps[]>([]);
  const [timeSlots, setTimeSlot] = useState<ITimeslotResponse[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedTimeSlotId, setSelectedTimeslotId] = useState<string>("");
  const [selectedTimeSlotData, setSelectedTimeslotData] =
    useState<ITimeslotResp>({});
  const [staffDetails, setStaffDetails] = useState<iStaffGetProps[]>([]);
  const [availableStaffInSelectedDate, setAvailableStaffInSelectedDate] =
    useState<iStaffGetProps[]>([]);

  const [value, setValue] = useState<CalendarDate | null>(null);

  const { data: serviceData, isFetched } = useFetchServiceDataById(
    data?.serviceId ?? ""
  );

  const resheduleStatus = data?.auditLogs?.filter(
    (log) => log.action === "Rescheduled Booking"
  );

  const { mutate, isSuccess } = useBookingReshedule();

  const filterStaffIds = useMemo(
    () => serviceData?.serviceInfo?.staff || [],
    [serviceData?.serviceInfo?.staff]
  );

  const handleStaffId = (id: string) => {
    setSelectedStaffId(id);
  };

  const handleTimeSlotId = (id: string, start: string, to: string) => {
    setSelectedTimeslotId(id);
    if (start && to) {
      setSelectedTimeslotData({ start, to });
    }
  };

  //FETCH ALL STAFF
  useEffect(() => {
    const fetchAllStaff = async () => {
      if (filterStaffIds.length === 0) return;

      try {
        const results = await Promise.allSettled(
          filterStaffIds.map((id: string) => getStaffById(id))
        );
        // Only keep fulfilled results
        const allStaff = results
          .filter((res) => res.status === "fulfilled")
          .map(
            (res) => (res as PromiseFulfilledResult<StaffResponse>).value?.staff
          )
          .filter(Boolean);

        setStaffDetails(allStaff);
      } catch (error) {
        console.error("Unexpected error in fetchAllStaff:", error);
      }
    };

    fetchAllStaff();
  }, [filterStaffIds, data]);

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
    if (!serviceDetails?.availability) return [];

    const da = serviceDetails?.availability?.map(
      (a: any) => weekdayToNumber[a.day.toLowerCase()]
    );
    return da;
  }, [serviceDetails]);

  useEffect(() => {
    if (allowedWeekDays.length > 0) {
      const firstValid = getNextAvailableDate();
      setValue(firstValid);
    }
  }, [allowedWeekDays]);

  const getNextAvailableDate = (): CalendarDate => {
    const tz = getLocalTimeZone();
    let date = today(tz);

    for (let i = 0; i < 30; i++) {
      // max 30 days ahead
      const jsDate = date.toDate(tz);
      const day = jsDate.getDay();

      if (allowedWeekDays.includes(day)) return date;

      // go to next day
      date = date.add({ days: 1 });
    }

    return today(tz); // fallback
  };

  useEffect(() => {
    setServiceDetails(serviceData?.serviceInfo || []);
  }, [serviceData]);

  //GET AVAILABLE STAFF SELECT DATE
  useEffect(() => {
    const getAvailableStaff = async () => {
      try {
        //add already selected date to time
        //  const appointmentDate = data.appointmentDate
        //  const appointmenTimeslot = {`${data.appointmentTimeFrom} - ${data.appointmentTimeTo}`}

        if (value == null) return;
        const getFormattedDate = moment(value.toString())
          .format("YYYY-MM-DD")
          .toLocaleLowerCase();

        let payload;

        if (filterStaffIds.length === 0) {
          return;
        } else {
          payload = {
            serviceId: data?.serviceId,
            date: getFormattedDate,
          };
        }
        const res = await checkBookingAvailableStaff(payload);

        const resData = res?.availableStaff;

        if (resData) {
          setAvailableStaffInSelectedDate(resData);
        } else {
          setAvailableStaffInSelectedDate([]);
        }
      } catch (error) {
        addToast({
          title: " Error",
          description: "Error checking available staff. try again!",
          radius: "md",
          color: "danger",
        });
        console.log("Error checking available staff.  ", error);
      }
    };
    getAvailableStaff();
  }, [data, value]);

  useEffect(() => {
    const getTimeSlot = async () => {
      try {
        if (value == null) return;
        const getFormattedDate = moment(value.toString())
          .format("YYYY-MM-DD")
          .toLocaleLowerCase();

        console.log("get: ", getFormattedDate);

        let payload;

        if (filterStaffIds.length === 0) {
          payload = {
            serviceId: data?.serviceId,
            date: getFormattedDate,
            staffId: data.providerId,
          };
        } else {
          payload = {
            serviceId: data?.serviceId,
            date: getFormattedDate,
            staffId: selectedStaffId ? selectedStaffId : filterStaffIds[0],
          };

          if (!selectedStaffId) setSelectedStaffId(filterStaffIds[0]);
        }

        const res = await getTimeSlotRelatedStaff(payload);

        if (res?.timeSlots?.length > 0) {
          setTimeSlot(res.timeSlots);
        } else {
          setTimeSlot([]);
        }
      } catch (error) {
        addToast({
          title: " Error",
          description: "Error checking available Time slot. try again!",
          radius: "md",
          color: "danger",
        });
        console.log("Error checking available Time slot.  ", error);
      }
    };

    getTimeSlot();
  }, [value, selectedStaffId, data]);

  console.log(
    "Available Staff in selected date: ",
    availableStaffInSelectedDate
  );

  const statusColorMap: Record<
    string,
    "success" | "danger" | "warning" | "secondary" | "primary"
  > = {
    Completed: "success",
    Pending: "warning",
    Inprogress: "secondary",
    Cancelled: "danger",
    Confirmed: "primary",
  };

  const handleReschedule = async () => {
    const paylod: IReshedulePostData = {
      bookingId: data.bookingId,
      staffId: selectedStaffId,
      newDate: moment(value?.toString())
        .format("YYYY-MM-DD")
        .toLocaleLowerCase(),
      newFrom: selectedTimeSlotData.start,
      newTo: selectedTimeSlotData.to,
      note: "",
    };
    mutate(paylod);
    onOpenChange(false);
    // console.log("Error checking available Time slot.  ", error);
  };

  const title = "This Booking is already rescheduled";
  const description = "You can only reschedule once";

  // const isSuccessw = true;
  console.log("Is OK: ", isSuccess);

  return (
    <div>
      <CustomButton
        onPress={onOpen}
        label="Reschedule"
        variant="flat"
        color="danger"
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="5xl"
        className="p-5 z-10"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reschedule Booking
              </ModalHeader>
              <ModalBody>
                {/* Booking */}
                <Divider />
                {resheduleStatus.length != 0 && (
                  <CustomAlert
                    variant="faded"
                    color="warning"
                    description={description}
                    title={title}
                  />
                )}
                {isSuccess && (
                  <Spinner
                    label="wait.."
                    className="flex justify-center items-center h-[50%]"
                  />
                )}
                <div className={!isSuccess ? "" : "blur-sm"}>
                  <p className="text-subtitle1 mb-3">Booking Details</p>

                  <div>
                    <Divider />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 mt-[12px]">
                      <div className="">
                        <p className="text-body1  flex justify-between">
                          <span className="text-body2">Booking ID:</span>{" "}
                          {data.referenceCode}
                        </p>
                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">Service Name:</span>{" "}
                          {data.serviceDetails.title}
                        </p>

                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">Booking Price:</span> ${" "}
                          {data?.subtotal || "0.00"}
                        </p>
                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2"> Name:</span>{" "}
                          {`${data.personalInfo.firstName} ${data.personalInfo.lastName} `}
                        </p>

                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2"> Email:</span>{" "}
                          {data.personalInfo.email}
                        </p>
                      </div>

                      <div className="ml-5">
                        <p className="text-body1  flex justify-between ">
                          <span className="text-body2">Package Type:</span>{" "}
                          Basic
                        </p>

                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">Booking Date:</span>{" "}
                          {moment(data.appointmentDate).format("DD-MM-YYYY") ||
                            "No data"}
                        </p>
                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">Time Slot:</span>{" "}
                          {`${data?.appointmentTimeFrom} ${data?.appointmentTimeTo} `}
                        </p>

                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">Paid:</span>{" "}
                          <CustomChip
                            label={data?.isPaid ? "Yes" : "No"}
                            color={data?.isPaid ? "success" : "danger"}
                          />
                        </p>

                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">Date of place</span>{" "}
                          {convertDateToReadble(data.createdAt) || "No data"}
                        </p>
                      </div>

                      <div className="ml-5">
                        <p className="text-body1  flex justify-between ">
                          <span className="text-subtitle1">Reshedule:</span>{" "}
                          <CustomChip
                            label={resheduleStatus.length === 0 ? "No" : "Yes"}
                            color={
                              resheduleStatus.length === 0
                                ? "danger"
                                : "success"
                            }
                          />
                        </p>

                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">
                            Last Reshedule Date:
                          </span>{" "}
                          {resheduleStatus.length === 0
                            ? "No Reschedule"
                            : moment(resheduleStatus[0].timestamp).format(
                                "DD-MM-YYYY [at] hh:mm A"
                              )}
                        </p>

                        <p className="text-body1  mt-[12px] flex justify-between">
                          <span className="text-body2">Booking Status:</span>{" "}
                          <CustomChip
                            label={data.bookingStatus || "No Status"}
                            color={
                              statusColorMap[data.bookingStatus] || "secondary"
                            }
                          />
                        </p>

                        {/* <p className="text-body1 text-red-500 mt-[12px] flex justify-between">
                        <span className="text-body2">
                          Upcoming In:
                        </span>{" "}
                        {moment(data.appointmentDate).diff(
                          moment(data.createdAt),
                          "days"
                        )}{" "}
                        days
                      </p> */}
                      </div>
                    </div>

                    <p className="text-body1   mt-[12px]">
                      <span className="text-body2 ">Address:</span>{" "}
                      {`${data?.personalInfo?.address?.postalCode} ${data?.personalInfo?.address?.street} ${data?.personalInfo?.address?.city} ${data?.personalInfo?.address?.state}`}
                    </p>

                    <p className="text-body1  mt-[12px]">
                      <span className="text-body2">Note:</span>{" "}
                      {data?.personalInfo?.bookingNotes || "-- No Notes --"}
                    </p>
                  </div>

                  <Divider className="mt-4" />
                  <p className="text-subtitle1 mt-3">Reshedule </p>

                  <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Calendar Section */}
                    <div className=" p-4 rounded-md">
                      <Calendar
                        aria-label="Date"
                        minValue={today(getLocalTimeZone())}
                        value={value}
                        onChange={setValue}
                        isDateUnavailable={(date) => {
                          const day = date.toDate(getLocalTimeZone()).getDay();
                          return !allowedWeekDays.includes(day);
                        }}
                        errorMessage="Please select a service available date"
                        maxValue={today(getLocalTimeZone()).add({ days: 30 })}
                      />
                    </div>

                    {/* Time Slots Grid */}
                    <div className="col-span-2">
                      {filterStaffIds?.length > 0 && (
                        <div className="grid grid-cols-1  gap-4">
                          <p className=" -mt-5 text-sm font-medium">Staff</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
                            {staffDetails?.map((staff, index) => (
                              <div
                                key={index}
                                onClick={() => handleStaffId(staff.staffId)}
                                className={`rounded-md border items-end p-1 cursor-pointer transition-all duration-200
  ${
    selectedStaffId === staff.staffId
      ? "bg-sky-200 border-sky-400 dark:bg-secondary dark:border-secondary"
      : "bg-emerald-100 dark:bg-emerald-500 dark:border-emerald-600  border-emerald-200 hover:bg-sky-200 hover:border-sky-300 dark:hover:bg-secondary dark:hover:border-secondary"
  }`}
                              >
                                <User
                                  avatarProps={{
                                    name: `${staff.fullName}`,
                                  }}
                                  description={staff.city || "No email"}
                                  name={staff.fullName}
                                  className="  ml-2 mt-1 wrap-break-word "
                                  classNames={{
                                    name: "dark:text-black",
                                    description: "dark:text-gray-800",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="mb-2  text-sm font-medium mt-4 ">
                        Time slot
                      </p>
                      {timeSlots?.length === 0 && (
                        <p className="text-center text-sm font-light text-gray-500 p-10">
                          No available time slots for this staff on selected
                          date
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {timeSlots?.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleTimeSlotId(
                                slot.timeSlotId,
                                slot.from,
                                slot.to
                              )
                            }
                            className={`rounded-md border px-4 py-2 text-left shadow-sm transition-all duration-200 ${
                              slot.timeSlotId === selectedTimeSlotId
                                ? "bg-sky-200 border-sky-400 dark:bg-secondary dark:border-secondary"
                                : "bg-emerald-100 border-emerald-200 dark:bg-emerald-500 dark:border-emerald-600 hover:bg-sky-200 hover:border-sky-300 dark:hover:bg-secondary dark:hover:border-secondary"
                            }`}
                          >
                            <div className="text-sm font-semibold text-gray-800">
                              {slot.from} - {slot.to}
                            </div>

                            <div className="mt-1 flex flex-col space-y-1 text-xs dark:text-gray-900">
                              <div>{slot.maxBookings} Max Bookings</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* <CustomTextArea
                  label="pPovide a cancelation reason"
                  isRequired
                  onValueChange={}
                /> */}
                </div>
              </ModalBody>

              <ModalFooter>
                <CustomButton
                  label="Cancel"
                  color="danger"
                  variant="bordered"
                  onPress={onClose}
                />
                <CustomButton
                  label="Confirm Reschedule"
                  color="primary"
                  onPress={() => {
                    handleReschedule();
                  }}
                  isLoading={isSuccess}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ResheduleModal;
