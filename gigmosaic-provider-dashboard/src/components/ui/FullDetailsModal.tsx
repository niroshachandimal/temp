import CustomButton from "./CustomButton";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import CustomChip from "./CustomChip";
import { useFetchStaffById } from "../../hooks/queries/useFetchData";
import moment from "moment";
import ResheduleModal from "./ResheduleModal";
import { PiTimerBold } from "react-icons/pi";
import { FaRegClock, FaRegCopy } from "react-icons/fa";
import { LuCalendarCheck } from "react-icons/lu";
import { BookingStatus, IBookingProps } from "../../types";
import CustomStepper from "./CustomStepper";
import { useState } from "react";
import {
  convertDateToReadble,
  convertTimeTo12ClockWithAmPm,
} from "../../utils/convertTime";
import CancelledStepper from "./CancelledStepper";
import CustomAlert from "./CustomAlert";

type FullDetailsModalProps = {
  data: IBookingProps;
  isOpen: boolean;
  onOpenChange: () => void;
};

const FullDetailsModal = ({
  data,
  isOpen,
  onOpenChange,
}: FullDetailsModalProps) => {
  const { onOpen } = useDisclosure();

  const [copied, setCopied] = useState<boolean>(false);

  const staffId = data?.staffId;

  const { data: staffData } = useFetchStaffById(staffId ?? "");

  const image = data.gallery[0].serviceImages[0] || "";

  const resheduleStatus = data?.auditLogs?.filter(
    (log) => log.action === "Rescheduled Booking"
  );

  console.log("RESHEDULE STATUS: ", resheduleStatus);

  console.log("LINK: ", image);

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

  const title = "This Booking is already rescheduled";
  const description = "You can only reschedule once";

  return (
    <div>
      <CustomButton
        onPress={onOpen}
        label="Full Details"
        variant="flat"
        color="primary"
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        className="p-5"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-initial justify-between items-center ">
                Full Booking Details
                {data.bookingStatus !== BookingStatus.COMPLETED &&
                  data.bookingStatus !== BookingStatus.CANCELLED && (
                    <ResheduleModal data={data} />
                  )}
              </ModalHeader>
              <ModalBody>
                <Divider />

                <div>
                  <Card
                    shadow="sm"
                    radius="sm"
                    className="mt-3"
                    classNames={{
                      base: " dark:bg-black",
                    }}
                  >
                    <CardBody className="flex justify-center items-center ml-12 ">
                      {data.bookingStatus === BookingStatus.CANCELLED ? (
                        <CancelledStepper auditLogs={data.auditLogs} />
                      ) : (
                        <CustomStepper
                          status={data.bookingStatus}
                          auditLogs={data.auditLogs}
                        />
                      )}
                    </CardBody>
                  </Card>

                  {resheduleStatus.length != 0 && (
                    <div className="mt-3 -mb-2">
                      <CustomAlert
                        variant="faded"
                        color="warning"
                        description={description}
                        title={title}
                      />
                    </div>
                  )}
                </div>

                {/* Booking */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3 ">
                  <div>
                    <Card
                      radius="sm"
                      shadow="sm"
                      className="dark:border-gray-700"
                    >
                      <CardHeader className="bg-gray-200 dark:bg-black rounded-sm">
                        <p className="text-subtitle1 font-bold">
                          Booking Details
                        </p>
                      </CardHeader>
                      <CardBody>
                        <div className="px-2">
                          <p className="text-body1 text-gray-600 mb-1">
                            Booking ID
                          </p>
                          <div className="flex flex-initial items-center mb-2">
                            <p className="flex text-subtitle1 text-gray-600">
                              {data?.referenceCode || "No Booking ID"}
                            </p>
                            <Tooltip
                              content="Copy"
                              showArrow={true}
                              color="foreground"
                              closeDelay={100}
                              className="text-white"
                            >
                              <FaRegCopy
                                size={18}
                                onClick={handleCopy}
                                className={
                                  copied
                                    ? "text-green-600 dark:text-green-700 cursor-pointer ml-2"
                                    : "text-gray-600 dark:text-gray-300  cursor-pointer dark:hover:text-green-600 hover:text-green-600 transition-colors ml-2"
                                }
                              />
                            </Tooltip>
                            {/* </div> */}
                          </div>
                          <Divider />
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-5">
                            <div className="">
                              <div className="flex items-start justify-between my-2">
                                <div>
                                  <p className="text-body1 text-gray-600 mt-1 -mb-2 ">
                                    Date and Time
                                  </p>
                                  <div className="flex flex-initial items-center ">
                                    {/* <span> */}
                                    <FaRegClock
                                      size={18}
                                      className=" mr-2 mt-3 text-gray-600 dark:text-gray-400"
                                    />
                                    {/* </span> */}
                                    <p className="flex text-subtitle1  mt-[12px] ">
                                      {`${data?.appointmentTimeFrom} - ${data?.appointmentTimeTo} `}
                                    </p>
                                  </div>

                                  <div className="flex flex-initial items-center mt-2">
                                    {/* <span> */}
                                    <LuCalendarCheck
                                      size={18}
                                      className=" mr-2 text-gray-600 dark:text-gray-400"
                                    />
                                    {/* </span> */}
                                    <p className="text-subtitle1">
                                      {moment(data.appointmentDate).format(
                                        "DD-MM-YYYY"
                                      ) || "No data"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-body2 text-gray-600 mt-[28px] ml-10 flex justify-between">
                                    <CustomChip
                                      label={data.bookingStatus || "No Status"}
                                      color={
                                        statusColorMap[data.bookingStatus] ||
                                        "secondary"
                                      }
                                    />
                                  </p>

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
                                            data.appointmentDate
                                          );
                                          const created = moment(
                                            data.createdAt
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

                                          console.log(
                                            "diffInDays: ",
                                            diffInDays
                                          );

                                          if (diffInDays <= 30) {
                                            return appointment.from(created); // e.g., "in 3 days"
                                          }
                                        })()}
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Divider />

                              <p className="text-body1  mt-[12px] flex justify-between">
                                <span className="text-body2">
                                  Place Booking Time:
                                </span>{" "}
                                {convertDateToReadble(data.createdAt) ||
                                  "No data"}{" "}
                                at{" "}
                                {convertTimeTo12ClockWithAmPm(data.createdAt)}
                              </p>

                              <p className="text-body1  flex justify-between mt-[12px] ">
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

                              <p className="text-body1 mt-[12px] flex justify-between mb-3">
                                <span className="text-body2">
                                  Reshedule Date:
                                </span>{" "}
                                {resheduleStatus.length === 0
                                  ? "No Reschedule"
                                  : moment(resheduleStatus[0].timestamp).format(
                                      "DD-MM-YYYY [at] hh:mm A"
                                    )}
                              </p>
                              <Divider />
                            </div>

                            <div>
                              <p className="text-body1  flex justify-between -mt-3">
                                <span className="text-body2">
                                  Customer Name:
                                </span>{" "}
                                {`${data?.personalInfo?.firstName} ${data?.personalInfo?.lastName} `}
                              </p>

                              <p className="text-body1 flex justify-between mt-[12px]">
                                <span className="text-body2">
                                  Customer Email:
                                </span>{" "}
                                {data?.personalInfo?.email || "No data"}
                              </p>
                            </div>
                          </div>

                          <p className="text-body1 -mt-2 ">
                            <span className="text-body2 ">Address:</span>{" "}
                            {`${data?.personalInfo?.address?.postalCode} ${data?.personalInfo?.address?.street} ${data?.personalInfo?.address?.city} ${data?.personalInfo?.address?.state}`}
                          </p>

                          <p className="text-body1 mt-[12px]">
                            <span className="text-body2">Note:</span>{" "}
                            {data?.personalInfo?.bookingNotes || "No Notes "}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <div>
                    {/* PAYMENT */}
                    <Card radius="sm" shadow="sm">
                      <CardHeader className="bg-gray-200 rounded-sm dark:bg-black">
                        <p className="text-subtitle1">Payment Information</p>
                      </CardHeader>
                      <CardBody>
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 ">
                            <div className="px-2">
                              <p className="text-body1  mt-[12px] flex justify-between">
                                <span className="text-body2">
                                  Payment Method:
                                </span>{" "}
                                {/* {data?.paymentMethod == "Cash on Delivery"
                                  ? "Cash"
                                  : data?.paymentMethod} */}
                                Cash
                              </p>
                              <p className="text-body1  mt-[12px] flex justify-between ">
                                <span className="text-body2">Paid:</span>{" "}
                                <CustomChip
                                  label={data?.isPaid ? "Paid" : "Unpaid"}
                                  color={data?.isPaid ? "success" : "danger"}
                                />
                              </p>

                              <p className="text-body1 text-gray-600 mt-[12px] flex justify-between mb-3">
                                <span className="text-body2">
                                  Promo code use:
                                </span>{" "}
                                {/* {data?.promoCode ? "Yes" : "No"} */}
                                No
                              </p>
                              <Divider />
                              <p className="text-body2 text-gray-600 mt-[12px] flex justify-between">
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
                                  {data.serviceDetails.price.toFixed(2) ||
                                    "0.00"}
                                </span>
                              </p>
                            </div>

                            <div className=""></div>
                          </div>

                          {data?.additionalServices?.length > 0 && (
                            <div className="text-body2 text-gray-600 -mt-3 px-2">
                              <span className="text-body2 mb-1 block">
                                Additional Services
                              </span>
                              <ul className="list-none space-y-2 mt-2">
                                {data?.additionalServices?.map(
                                  (service, index) => (
                                    <li
                                      key={index}
                                      className="flex justify-between text-body1 text-gray-600 "
                                    >
                                      <span>
                                        {index + 1}. {service?.serviceItem}
                                      </span>
                                      <span className=" ml-2 text-body1">
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
                              className={`text-body2 text-gray-600 flex justify-between ${
                                data?.additionalServices?.length > 0
                                  ? "mt-[16px]"
                                  : "-mt-2"
                              }`}
                            >
                              <span className="text-body2">Subtotal:</span>{" "}
                              <span className=" text-body1 border-t-2 w-[100px] border-gray-400 pt-[5px] text-end">
                                $ {data?.total || "0.00"}${/* 422,212.00 */}
                              </span>
                            </p>
                            <p className="text-body2 text-green-600   mt-[12px] flex justify-between">
                              <span className="text-body2">Discount:</span>{" "}
                              <span className="text-body1">
                                - $ {data?.discount || "0.00"}
                              </span>
                            </p>
                            <p className="text-body2 text-red-500 mt-[12px] flex justify-between">
                              <span className="text-body2">Tax:</span>{" "}
                              <span className="text-body1">
                                + $ {data?.tax || "0.00"}
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
                          $
                          {(
                            (data?.total || 0) -
                            (data?.discount || 0) +
                            (data?.tax || 0)
                          ).toFixed(2)}
                        </span>{" "}
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                <div>
                  {/* Service */}
                  <Card shadow="sm" radius="sm" className="mb-6 mt-2">
                    <CardHeader className="bg-gray-200 rounded-sm dark:bg-black">
                      <div className="flex flex-initial justify-between items-center mb-2">
                        <p className="text-subtitle1 ">
                          Service Information -{" "}
                          <a
                            href={`/service/${data.serviceId}/${
                              data.serviceDetails.title
                            }?returnTo=${encodeURIComponent(
                              window.location.href
                            )}`}
                            className="text-sm font-normal text-blue-400 underline cursor-pointer"
                            // target="_blank"
                          >
                            View full details
                          </a>
                        </p>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
                        <div className=" rounded-md  max-h-[180px] max-w-[180px]">
                          <Image
                            src={image}
                            className="max-w-[180px]  max-h-[180px]  object-contain rounded-lg align-middle"
                            alt={data.serviceDetails.title || "Service Image"}
                          />
                        </div>
                        {data.gallery.serviceImages}
                        <div className="col-span-2 ">
                          <p className="text-body1 text-gray-600 flex justify-between">
                            <span className="text-body2">Service ID:</span>{" "}
                            {data.serviceId}
                          </p>
                          <p className="text-body1 text-gray-600 mt-[12px] flex justify-between">
                            <span className="text-body2">Name:</span>{" "}
                            {data.serviceDetails.title}
                          </p>

                          <p className="text-body1 text-gray-600 mt-[12px] flex justify-between">
                            <span className="text-body2">
                              Addtional service:
                            </span>{" "}
                            {data?.additionalServices ? "Yes" : "No"}
                          </p>
                        </div>

                        <div className="mr-3">
                          <p className="text-body1 text-gray-600 flex justify-between">
                            <span className="text-body2">Price:</span> ${" "}
                            {data.serviceDetails.price}
                          </p>
                          <p className="text-body1 text-gray-600  mt-[12px] flex justify-between">
                            <span className="text-body2">Discount:</span> ${" "}
                            {data.serviceDetails.offerPrice}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Staff */}
                  <Card shadow="sm" radius="sm">
                    <CardHeader className="bg-gray-200 rounded-sm dark:bg-black">
                      <div className="flex flex-initial justify-between items-center mb-2">
                        <p className="text-subtitle1 ">Staff Information</p>
                      </div>
                    </CardHeader>

                    <CardBody>
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  mb-5">
                          <div>
                            <p className="text-body1  mt-[12px] flex justify-between">
                              <span className="text-body2">Staff ID:</span>{" "}
                              {staffData?.staff?.staffId || "No data"}
                            </p>
                            <p className="text-body1  mt-[12px] flex justify-between">
                              <span className="text-body2">Name:</span>{" "}
                              {staffData?.staff?.fullName || "No data"}
                            </p>

                            <p className="text-body1 mt-[12px] flex justify-between">
                              <span className="text-body2">Email:</span>{" "}
                              {staffData?.staff?.email || "No data"}
                            </p>
                          </div>

                          <div className="ml-5">
                            <p className="text-body1  flex justify-between">
                              <span className="text-body2">Mobile:</span>{" "}
                              {staffData?.staff?.phoneNumber || "No data"}
                            </p>
                            <p className="text-body1   mt-[12px] flex justify-between">
                              <span className="text-body2">Register Date:</span>{" "}
                              {moment(staffData?.staff?.createdAt).format(
                                "DD-MM-YYYY"
                              ) || "No"}
                            </p>

                            <p className="text-body1   mt-[12px] flex justify-between">
                              <span className="text-body2">
                                Last Update Date:
                              </span>{" "}
                              {moment(staffData?.staff?.updatedAt).format(
                                "DD-MM-YYYY"
                              ) || "No"}
                            </p>
                          </div>

                          <div className="ml-5">
                            <p className="text-body1 text-gray-600 flex justify-between">
                              <span className="text-body2">Active:</span>{" "}
                              <CustomChip
                                label={staffData?.staff?.status ? "Yes" : "No"}
                                color={
                                  staffData?.staff?.status
                                    ? "success"
                                    : "danger"
                                }
                              />
                            </p>
                            <p className="text-body1 text-gray-600  mt-[12px] flex justify-between">
                              <span className="text-body2">
                                No of assign Service:
                              </span>{" "}
                              {staffData?.staff?.serviceIds?.length ||
                                "No data"}
                            </p>
                            <p className="text-body1 text-gray-600  mt-[12px] flex justify-between">
                              <span className="text-body2">Speciality :</span> -
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start mt-3 ml-0">
                          <span className="text-body2 min-w-[80px]">
                            Address:
                          </span>
                          <span className="ml-10 text-body1">
                            {`${staffData?.staff?.zipCode || ""} ${
                              staffData?.staff?.street || ""
                            } ${staffData?.staff?.city || ""} ${
                              staffData?.staff?.state || ""
                            }`}
                          </span>
                        </div>

                        <p className="text-body1 text-gray-600 mt-[12px]">
                          <span className="text-body2">Description:</span>{" "}
                          {staffData?.staff?.description || "No data"}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <Divider />
              </ModalBody>

              <ModalFooter>
                <CustomButton
                  label="Cancel"
                  color="danger"
                  variant="solid"
                  onPress={onClose}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FullDetailsModal;
