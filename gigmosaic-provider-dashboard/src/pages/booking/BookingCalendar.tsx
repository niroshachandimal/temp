import { useNavigate } from "react-router-dom";
import { parseDate } from "@internationalized/date";
import CustomButton from "../../components/ui/CustomButton";
import EventCalender from "../../components/ui/EventCalender";
import { LuTable } from "react-icons/lu";
import {
  useFetchAllBookings,
  useFetchStaffById,
} from "../../hooks/queries/useFetchData";
import { useEffect, useState } from "react";
import { IBookingProps } from "../../types";
import moment from "moment";
import Loading from "../../components/ui/Loading";
import {
  Calendar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Image,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { FaRegCopy, FaRegUser } from "react-icons/fa";
import CustomChip from "../../components/ui/CustomChip";
import { PiTimerBold } from "react-icons/pi";
import {
  convertDateToReadble,
  convertTimeTo12ClockWithAmPm,
} from "../../utils/convertTime";
import ResheduleModal from "../../components/ui/ResheduleModal";
import { IoLocationOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { HiOutlineIdentification } from "react-icons/hi2";
import { GrUserWorker } from "react-icons/gr";

const BookingCalendar = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filteredbooking, setFilteredbooking] = useState<IBookingProps>([]);
  const [booking, setBooking] = useState<IBookingProps[]>();
  const [resheduleStatus, setResheduleStatue] = useState();
  const [copied, setCopied] = useState<boolean>(false);
  const [staffId, setStaffId] = useState<string>("");
  const [todayBookings, setTodayBokkings] = useState<IBookingProps[]>([]);

  const { data, isFetching } = useFetchAllBookings();

  const { data: staffData, isFetching: isLoadingStaff } = useFetchStaffById(
    staffId ?? ""
  );

  console.log("Filter staffData: ", staffData);
  console.log("Filter Data: ", filteredbooking);
  console.log("Filter bookings: ", data?.bookings);

  useEffect(() => {
    const BookingDate = data?.bookings?.map((d: IBookingProps) => {
      const start = moment(
        `${d.appointmentDate.split("T")[0]} ${d.appointmentTimeFrom}`,
        "YYYY-MM-DD hh:mm A"
      ).toISOString();

      const end = moment(
        `${d.appointmentDate.split("T")[0]} ${d.appointmentTimeTo}`,
        "YYYY-MM-DD hh:mm A"
      ).toISOString();

      return {
        id: d.bookingId,
        title: `${d.serviceDetails.title} `,
        start: start,
        end: end,
        color: getColor(d.bookingStatus),
        extendedProps: {
          description: `Start: ${d.appointmentTimeFrom} - End: ${d.appointmentTimeTo} | NOTE: ${d.personalInfo.bookingNotes} `,
        },
      };
    });

    // const today = moment().format("YYYY-MM-DD");
    const today = moment().format("2025-07-21");

    const filterTodayBookings = data?.bookings?.filter((d: IBookingProps) => {
      const bookingDate = moment(d.appointmentDate).format("YYYY-MM-DD");
      return bookingDate === today;
    });

    console.log("TODAYL ", filterTodayBookings);

    setBooking(BookingDate);
    setTodayBokkings(filterTodayBookings);
  }, [data?.bookings]);

  const getColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "#FFC107"; // amber/yellow

      case "Confirmed":
        return "#A0C878"; // green

      case "Inprogress":
        return "#5EABD6";

      case "Completed":
        return "#309898";

      case "Cancelled":
        return "#FF4F0F"; // red

      default:
        return "#748873"; // grey for unknown statuses
    }
  };

  const handleDrawerOpen = (bookingId: string) => {
    if (bookingId) {
      const filterBookingDetailsById = data?.bookings?.filter(
        (b: IBookingProps) => b.bookingId === bookingId
      );

      const resheduleStatus = filterBookingDetailsById[0]?.auditLogs?.filter(
        (log) => log.action === "Rescheduled Booking"
      );

      const staffId = filterBookingDetailsById?.[0]?.staffId;

      setStaffId(staffId ? staffId : "");

      setResheduleStatue(resheduleStatus ? resheduleStatus : []);

      setFilteredbooking(
        filterBookingDetailsById ? filterBookingDetailsById[0] : []
      );
      onOpen();
    }
  };

  const handleNavigate = () => {
    navigate("/booking/all");
  };

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

  const handleCopy = () => {
    navigator.clipboard.writeText(data?.referenceCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
    });
  };

  const sampleTodayBooking = [
    {
      data: "Today, 08:00 AM - 09:30 AM",
      titile: "Morning Yoga Session new 1",
    },
    {
      data: "Today, 10:00 AM - 11:00 AM",
      titile: "Business Strategy Meeting2",
    },
    { data: "Today, 11:30 AM - 12:15 PM", titile: "Online Coding Workshop" },
    { data: "Today, 01:00 PM - 02:00 PM", titile: "Team Lunch Reservation" },
    { data: "Today, 02:30 PM - 03:30 PM", titile: "Client Consultation" },
    { data: "Today, 04:00 PM - 05:00 PM", titile: "Marketing Review" },
    { data: "Today, 05:30 PM - 06:30 PM", titile: "Photography Session" },
    { data: "Today, 06:45 PM - 07:45 PM", titile: "Interview with Candidate" },
    {
      data: "Today, 08:00 PM - 09:00 PM",
      titile: "Virtual Networking Event and network Server Maintenance Check",
    },
    { data: "Today, 09:15 PM - 10:15 PM", titile: "Daily Fitness Training" },
    { data: "Today, 10:30 PM - 11:30 PM", titile: "Late Night Study Group" },
    { data: "Today, 11:45 PM - 12:30 AM", titile: "Customer Support Meeting" },
    { data: "Today, 12:45 AM - 01:45 AM", titile: "Backend System Upgrade" },
    { data: "Today, 02:00 AM - 03:00 AM", titile: "Server Maintenance Check" },
    { data: "Today, 03:15 AM - 04:15 AM", titile: "Overseas Client Call" },
    { data: "Today, 04:30 AM - 05:30 AM", titile: "Pre-Dawn DevOps Sync" },
  ];

  // }

  return (
    <div>
      {isFetching && <Loading />}

      <div className="grid grid-cols-4 gap-5 h-[90h]">
        <div className="h-full">
          <Card radius="sm" shadow="sm" className=" h-full ">
            {/* <CardHeader className="flex justify-between items-center bg-[#24d4ab]"> */}
            <CardHeader className="flex justify-between items-center bg-gray-300 ">
              <p className="text-xl font-semibold text-gray-800 ">
                Today Bookings
              </p>
              <CustomButton
                label="Go to Table View"
                color="secondary"
                startContent={<LuTable size={14} />}
                onPress={handleNavigate}
                className="flex"
              />
            </CardHeader>

            <CardBody>
              <div className=" flex  flex-col gap-3 h-[75vh] overflow-y-auto mt-3">
                {/* {todayBookings?.length === 0 && (
                  <p className="text-center text-body1 mt-5">
                    No today booking
                  </p>
                )} */}

                {sampleTodayBooking?.map((booking, idx: number) => (
                  // {todayBookings?.map((booking: IBookingProps, idx: number) => (
                  <>
                    <div
                      // key={booking.bookingId || idx}
                      className="flex flex-col gap-2 cursor-pointer  bg-green-500/30 p-4 mx-3 rounded-lg hover:bg-green-300 dark:hover:bg-green-500/50 transition-colors"
                      // onClick={() => handleDrawerOpen(booking.bookingId)}
                    >
                      <div className="flex flex-initial gap-2">
                        <GoDotFill
                          size={22}
                          color="green"
                          // style={{ color: getColor(booking.bookingStatus) }}
                        />

                        <p className="text-body1 hover:underline ">
                          {" "}
                          {/* Today {booking.appointmentTimeFrom} -{" "}
                          {booking.appointmentTimeTo} */}
                          {booking.data}
                        </p>
                      </div>
                      <p className="text-subtitle1 ml-6 hover:underline line-clamp-1">
                        {/* {booking.serviceDetails?.title || "No Service Title"} */}
                        {booking.titile}
                      </p>
                    </div>
                  </>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-3 calendar-wrapper h-full  dark">
          <EventCalender
            data={booking}
            initialView={"dayGridMonth"}
            isBooking={true}
            handleEventClick={(e) => handleDrawerOpen(e)}
          />
        </div>
      </div>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        radius="sm"
        // placement="bottom"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-inline  gap-5 bg-gray-200 dark:bg-darkModeBackground">
                Booking Details
                <ResheduleModal data={filteredbooking} />
              </DrawerHeader>
              <DrawerBody>
                <div>
                  <Card radius="sm" shadow="none" className="-mt-3">
                    <CardBody>
                      <div>
                        {/* <div className="w-100 h-80 rounded-md overflow-hidden bg-black flex items-center justify-center shadow-lg">
                            <Image
                              src={filteredbooking?.gallery[0].serviceImages[0]}
                              className="max-w-full max-h-full object-contain"
                              alt={
                                filteredbooking?.serviceDetails?.title ||
                                "Service Image"
                              }
                              radius="none"
                            />
                          </div> */}

                        <p className="text-lg font-bold mt-2 mb-1">
                          {filteredbooking?.serviceDetails?.title}
                        </p>
                        <Divider />

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-5 mt-2">
                          <div className="">
                            {/* BOOKING ID */}
                            <div className="flex items-start justify-between my-2">
                              <div className="flex gap-3 items-center">
                                <div className="flex items-center justify-center border-1 border-gray-300 rounded-small w-11 h-11 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                  <HiOutlineIdentification size={20} />
                                </div>
                                <div className="flex flex-col gap-0.5   text-subtitle1 ">
                                  Booking ID
                                  <div className="flex flex-initial items-center mb-2">
                                    <p className=" text-body1">
                                      {filteredbooking?.referenceCode ||
                                        "No Booking ID"}
                                    </p>
                                    <Tooltip
                                      content="Copy"
                                      showArrow={true}
                                      color="foreground"
                                      closeDelay={100}
                                      className="text-white dark:text-black"
                                    >
                                      <FaRegCopy
                                        size={16}
                                        onClick={handleCopy}
                                        className={
                                          copied
                                            ? "text-green-600 cursor-pointer ml-2"
                                            : "text-gray-600 cursor-pointer hover:text-green-600 transition-colors ml-2"
                                        }
                                      />
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Tooltip
                                  content="Booking Status"
                                  showArrow={true}
                                  color="foreground"
                                  closeDelay={100}
                                  className="text-white"
                                >
                                  <p className="text-body1 text-gray-600 ml-10 flex justify-between">
                                    <CustomChip
                                      label={
                                        filteredbooking?.bookingStatus ||
                                        "No Status"
                                      }
                                      color={
                                        statusColorMap[
                                          filteredbooking?.bookingStatus ?? ""
                                        ] || "secondary"
                                      }
                                    />
                                  </p>
                                </Tooltip>

                                <div className="flex flex-initial items-center mt-1 hidden">
                                  {/* <span> */}
                                  <PiTimerBold
                                    size={16}
                                    className="mt-2 mr-2 text-gray-600"
                                  />
                                  {/* </span> */}
                                  <p className="text-md text-red-500 mt-2 flex justify-between">
                                    <p className="text-md text-green-500 font-semibold ">
                                      {(() => {
                                        const appointment = moment(
                                          filteredbooking?.appointmentDate
                                        );
                                        const created = moment(
                                          filteredbooking?.createdAt
                                        );

                                        if (
                                          appointment.isSame(created, "day")
                                        ) {
                                          return "Today";
                                        }

                                        const diffInDays = appointment.diff(
                                          created,
                                          "days"
                                        );

                                        console.log("diffInDays: ", diffInDays);

                                        if (diffInDays <= 30) {
                                          return appointment.from(created); // e.g., "in 3 days"
                                        }
                                      })()}
                                    </p>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* TIME AND DATE */}
                            <div className="flex gap-3 items-cente">
                              <div className="flex-none border-1 border-gray-300 rounded-small text-center w-11 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                                <div className="text-tiny bg-default-100 py-0.5 text-default-500">
                                  {moment(
                                    filteredbooking?.appointmentDate
                                  ).format("MMM")}
                                </div>
                                <div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
                                  {moment(
                                    filteredbooking?.appointmentDate
                                  ).format("DD")}
                                </div>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className=" text-subtitle1 ">
                                  {moment(
                                    filteredbooking?.appointmentDate
                                  ).format("dddd, MMMM DD")}
                                </p>
                                <p className=" text-body1">
                                  {`${filteredbooking?.appointmentTimeFrom} - ${filteredbooking?.appointmentTimeTo} `}
                                </p>
                              </div>
                            </div>

                            {/* ADDRESS */}
                            <div className="flex gap-3 items-center mt-3 mb-2">
                              <div className="flex items-center justify-center border-1 border-gray-300 rounded-small w-11 h-11 bg-gray-50  dark:bg-gray-800 dark:border-gray-700">
                                <IoLocationOutline size={20} />
                              </div>
                              <div className="flex flex-col gap-0.5   text-subtitle1 ">
                                {
                                  filteredbooking?.personalInfo?.address
                                    ?.postalCode
                                }{" "}
                                {filteredbooking?.personalInfo?.address?.street}
                                <p className=" text-body1">
                                  {filteredbooking?.personalInfo?.address?.city}{" "}
                                  {
                                    filteredbooking?.personalInfo?.address
                                      ?.state
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Divider />
                            </div>
                            <p className="text-body1 text-gray-600 mt-[12px] flex justify-between ">
                              <span className="text-body2">
                                Place Booking Time:
                              </span>{" "}
                              {convertDateToReadble(
                                filteredbooking?.createdAt ?? null
                              ) || "No filteredbooking"}{" "}
                              at{" "}
                              {convertTimeTo12ClockWithAmPm(
                                filteredbooking?.createdAt || ""
                              )}
                            </p>

                            <p className="text-body1 text-gray-600 flex justify-between mt-[12px] ">
                              <span className="text-body2">Reshedule:</span>{" "}
                              <CustomChip
                                label={
                                  resheduleStatus.length === 0 ? "No" : "Yes"
                                }
                                color={
                                  resheduleStatus.length === 0
                                    ? "danger"
                                    : "success"
                                }
                              />
                            </p>
                          </div>
                          <div className="-mt-5">
                            <Divider />
                          </div>

                          {/* USER */}
                          <div>
                            <div className="flex gap-3 items-center -mt-7">
                              <div className="flex items-center justify-center border-1 border-gray-300 rounded-small w-11 h-11 bg-gray-50  dark:bg-gray-800 dark:border-gray-700">
                                <FaRegUser
                                  size={16}
                                  className="text-gray-500"
                                />
                              </div>
                              <div className="flex flex-col gap-0.5   text-subtitle1 ">
                                {`${filteredbooking?.personalInfo?.firstName} ${filteredbooking?.personalInfo?.lastName} - Customer`}
                                <p className="text-body1">
                                  {filteredbooking?.personalInfo?.email ||
                                    "No filteredbooking"}
                                </p>
                              </div>
                            </div>
                            <p className="text-body1 mt-[10px] mb-2">
                              <span className="text-body2 mt-2">Note:</span>{" "}
                              {filteredbooking?.personalInfo?.bookingNotes ||
                                "No Notes "}
                            </p>
                          </div>

                          <div className="-mt-5">
                            <Divider />
                          </div>
                          <div className="flex gap-3 items-center -mt-7">
                            <div className="flex items-center justify-center border-1 border-gray-300 rounded-small w-11 h-11 bg-gray-50  dark:bg-gray-800 dark:border-gray-700">
                              <GrUserWorker
                                size={18}
                                className="text-gray-500"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5  text-subtitle1 ">
                              {isLoadingStaff
                                ? "Loading..."
                                : `${staffData?.staff?.fullName} - Staff`}
                              <p className="text-body1 ">
                                {isLoadingStaff
                                  ? "Loading..."
                                  : staffData?.staff?.staffId || "No ID"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* PAYMENT*/}
                  <div className="-mt-2">
                    <Card radius="sm" shadow="sm">
                      <CardHeader className="bg-gray-200 rounded-sm dark:bg-black">
                        <p className="text-subtit">Payment Information</p>
                      </CardHeader>
                      <CardBody>
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 ">
                            <div className="px-2">
                              <p className="text-body1 text-gray-600 mt-[12px] flex justify-between">
                                <span className="text-body2">
                                  Payment Method:
                                </span>{" "}
                                {/* {data?.paymentMethod == "Cash on Delivery"
                                                      ? "Cash"
                                                      : data?.paymentMethod} */}
                                Cash
                              </p>
                              <p className="text-body1 text-gray-600 mt-[12px] flex justify-between  mb-3">
                                <span className="text-body2">Paid:</span>{" "}
                                <CustomChip
                                  label={
                                    filteredbooking?.isPaid ? "Paid" : "Unpaid"
                                  }
                                  color={
                                    filteredbooking?.isPaid
                                      ? "success"
                                      : "danger"
                                  }
                                />
                              </p>
                              {/* 
                                <p className="text-body1 text-gray-600 mt-[12px] flex justify-between mb-3">
                                 <span className="text-body2">
                                    Promo code use:
                                  </span>
                                  No
                                </p> */}
                              <Divider />
                              <p className="text-body1 text-gray-600 mt-[12px] flex justify-between">
                                <span className="text-body2">
                                  Service Price:{" "}
                                  <CustomChip
                                    label="Basic"
                                    color="primary"
                                    className="ml-2"
                                  />
                                </span>{" "}
                                <span className="text-body1">
                                  ${" "}
                                  {filteredbooking.serviceDetails.price.toFixed(
                                    2
                                  ) || "0.00"}
                                </span>
                              </p>
                            </div>

                            <div className=""></div>
                          </div>

                          {filteredbooking?.additionalServices?.length > 0 && (
                            <div className="text-body1 text-gray-600 -mt-3 px-2">
                              <span className="text-body2 mb-1 block">
                                Additional Services
                              </span>
                              <ul className="list-none space-y-2 mt-2">
                                {filteredbooking?.additionalServices?.map(
                                  (service, index) => (
                                    <li
                                      key={index}
                                      className="flex justify-between text-body1 text-gray-600 "
                                    >
                                      <span>
                                        {index + 1}. {service?.serviceItem}
                                      </span>
                                      <span className=" ml-2 ">
                                        ${service?.price?.toFixed(2) || "0.00"}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {/* add a subtotal and above and below add a line  */}
                          <div className="px-2">
                            <p
                              className={`text-body1 text-gray-600 flex justify-between ${
                                filteredbooking?.additionalServices?.length > 0
                                  ? "mt-[16px]"
                                  : "-mt-2"
                              }`}
                            >
                              <span className="text-body2">Subtotal:</span>{" "}
                              <span className=" font-body1 border-t-2 w-[100px] border-gray-400 pt-[5px] text-end">
                                $ {filteredbooking?.total || "0.00"}$
                                {/* 422,212.00 */}
                              </span>
                            </p>
                            <p className="text-body1 text-green-600   mt-[12px] flex justify-between">
                              <span className="text-body2">Discount:</span>{" "}
                              <span className="">
                                - $ {filteredbooking?.discount || "0.00"}
                              </span>
                            </p>
                            <p className="text-body1 text-red-500 mt-[12px] flex justify-between">
                              <span className="text-body2">Tax:</span>{" "}
                              <span className="">
                                + $ {filteredbooking?.tax || "0.00"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </CardBody>
                      <CardFooter className="flex justify-between items-center bg-green-200 dark:bg-green-400 px-5">
                        <p className="text-lg text-green-500 mt-[8px] flex justify-between">
                          <span className="text-md font-semibold text-gray-900">
                            Total
                          </span>{" "}
                        </p>
                        <span className="text-md font-semibold text-gray-900 ">
                          $ {filteredbooking?.total || "0.00"}
                        </span>{" "}
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <CustomButton
                  label="Close"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  size="md"
                />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default BookingCalendar;
