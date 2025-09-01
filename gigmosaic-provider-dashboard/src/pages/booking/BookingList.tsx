import {
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  addToast,
  Spinner,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import CustomChip from "../../components/ui/CustomChip";
import CustomButton from "../../components/ui/CustomButton";
import CustomerDetailsModal from "../../components/ui/CustomerDetailsModal";
import {
  useFetchAllBookings,
  useFetchBookingByReferenceId,
} from "../../hooks/queries/useFetchData";
import FullDetailsModal from "../../components/ui/FullDetailsModal";
import ConfirmToast from "../../components/ui/ConfirmToast";
import { useUpdateBookingStatus } from "../../hooks/mutations/useUpdateData";
import Loading from "../../components/ui/Loading";
import CustomPagination from "../../components/ui/CustomPagination";
import { BookingStatus, IBookingProps } from "../../types";
import { validateBookingData } from "./bookingStatusValidata";
import InputToast from "../../components/ui/InputToast";
import CustomInput from "../../components/ui/CustomInput";
import { IoSearchSharp } from "react-icons/io5";
import AddBookingModal from "./AddBookingModal";
import { useNavigate } from "react-router-dom";
import { MdEditSquare } from "react-icons/md";

const BookingList = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBooking, setSelectedBooking] = useState<IBookingProps>();
  const [showModal, setShowModal] = useState(false);
  const [searchId, setSearchId] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [viewItemPerPage, setViewItemPerPage] = useState<number>(10);

  const { data, isFetching } = useFetchAllBookings(currentPage, 10);

  const { data: searchData, isError: isSearchError } =
    useFetchBookingByReferenceId(searchId);

  const { mutate } = useUpdateBookingStatus();

  // if (isSearchError) {
  //   addToast({
  //     title: "Booking Not Found",
  //     description: "Please check the booking ID and try again.",
  //     radius: "md",
  //     color: "danger",
  //   });
  // }
  // useEffect(() => {
  //   addToast({
  //     title: "Booking Not Found",
  //     description: "Please check the booking ID and try again.",
  //     radius: "md",
  //     color: "danger",
  //   });
  // }, [isSearchError]);

  const apiData: IBookingProps[] = useMemo(() => {
    if (searchId && searchData?.booking) {
      return [searchData.booking];
    }
    return data?.bookings || [];
  }, [searchId, searchData, data]);

  const totalPage = useMemo(() => data?.pages || 1, [data]);

  console.log("SINGLE: ", searchData?.booking);

  const statusColorMap: Record<
    string,
    "success" | "danger" | "warning" | "secondary" | "primary"
  > = {
    Completed: "success",
    Pending: "warning",
    Confirmed: "primary",
    Inprogress: "secondary",
    Cancelled: "danger",
  };

  const handleStatusChange = async (
    newStatus: string,
    bookingId: string,
    currentStatus: string,
    appointmentDate: string
  ) => {
    const newStatusUpperCase = newStatus.toUpperCase();
    const currentStatusUpperCase = currentStatus.toUpperCase();
    console.log("New status: ", newStatusUpperCase);
    console.log("Current status: ", currentStatusUpperCase);

    if (
      newStatusUpperCase === BookingStatus.CANCELLED.toUpperCase() &&
      currentStatusUpperCase !== BookingStatus.COMPLETED.toUpperCase()
    ) {
      console.log("App: ", appointmentDate);
      const now = moment();
      const appointmentMoment = moment(appointmentDate);

      console.log("Now: ", now);
      console.log("Appointment: ", appointmentMoment);

      if (appointmentMoment.diff(now, "hours") < 24) {
        console.log("Cannot cancel within 24 hours of appointment.");
        // Optionally show a toast to user
        addToast({
          description:
            "Bookings cannot be cancelled within 24 hours of the appointment.",
          radius: "md",
          color: "danger",
        });
        return;
      } else {
        handleCancellationStatus(bookingId, newStatus);
        return;
      }
    }

    console.log("Run....2");
    // return;
    const response = await validateBookingData(
      newStatus,
      bookingId,
      currentStatus
    );

    if (!response) return;

    handleStatusUpdate(
      currentStatusUpperCase,
      newStatusUpperCase,
      bookingId,
      newStatus
    );
  };

  const handleCancellationStatus = (bookingId: string, newStatus: string) => {
    ConfirmToast({
      title: "Confirm Action",
      message: `Are you sure you want to cancel this booking? This action cannot be reverted.`,
      type: "warning",
      confirmText: "Yes",
      cancelText: "No",
    }).then(async (confirmed) => {
      if (confirmed) {
        const newStatusFormatted = formatStatus(newStatus);
        const reason = await InputToast({
          title: "Please provide a cancellation reason",
          placeholder: "Please provide a reason",
          confirmText: "Confirm",
          cancelText: "Cancel",
          showCancelBtn: true,
          minValue: 5,
          maxValue: 100,
        });

        if (reason) {
          mutate({
            id: bookingId,
            newStatus: newStatusFormatted,
            note: reason,
          });
          // console.log("Status: ", newStatus);
        }
      }
    });
  };

  const handleStatusUpdate = (
    currentStatusUpperCase: string,
    newStatusUpperCase: string,
    bookingId: string,
    newStatus: string
  ) => {
    ConfirmToast({
      title: "Confirm Action",
      message: `Are you sure you want to change the status from "${currentStatusUpperCase}" to "${newStatusUpperCase}"? This action cannot be  reverted to the previous status.`,
      type: "warning",
      confirmText: "Yes",
      cancelText: "No",
    }).then(async (confirmed) => {
      if (confirmed) {
        const newStatusFormatted = formatStatus(newStatusUpperCase);
        // const currentStatusFormatted = formatStatus(currentStatusUpperCase);

        // if (newStatus.toLowerCase() === BookingStatus.CANCELLED.toLowerCase()) {
        //   const reason = await InputToast({
        //     title: "Please provide a cancelation reason",
        //     placeholder: "Please provide a reason",
        //     confirmText: "Confirm",
        //     cancelText: "Cancel",
        //     showCancelBtn: true,
        //     minValue: 5,
        //     maxValue: 100,
        //   });
        //   if (reason) {
        //     mutate({
        //       id: bookingId,
        //       newStatus: newStatusFormatted,
        //       note: reason,
        //     });
        //   }
        // } else {

        // }

        // if (!newStatusFormatted || !currentStatusFormatted) {
        //   addToast({
        //     title: "Error",
        //     description: "Error formatting status. Please try again.",
        //     radius: "md",
        //     color: "danger",
        //   });
        //   return;
        // }
        mutate({ id: bookingId, newStatus: newStatusFormatted });
      }
    });
  };

  const formatStatus = (status: string) => {
    if (!status) return false;
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleSearch = async () => {
    if (searchInput) {
      //i want to get first 3 letters
      const startWith =
        searchInput.charAt(0).toUpperCase() + searchInput.slice(1, 3);

      if (startWith === "BK-") {
        setSearchId(searchInput);
      } else {
        addToast({
          title: "Invalid Booking ID",
          description: "Please enter a valid booking ID",
          radius: "md",
          color: "danger",
        });
      }
    } else {
      addToast({
        title: "Booking ID required",
        description: "Please enter a booking ID",
        radius: "md",
        color: "secondary",
      });
    }
  };
  console.log("Currect page: ", currentPage);

  const handleNavigate = () => {
    navigate("/booking/add");
  };

  return (
    <div>
      {isFetching ? <Loading label="Loading..." /> : <></>}

      <div className="flex justify-between items-center">
        <Tabs
          color="secondary"
          variant="underlined"
          selectedKey={status}
          onSelectionChange={(key) => setStatus(key.toString())}
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider ml-5",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0  mr-8",
          }}
        >
          <Tab key="all" title="All Bookings" />
          <Tab key="pending" title="Pending" />
          <Tab key="inprogress" title="Inprogress" />
          <Tab key="completed" title="Completed" />
          <Tab key="cancelled" title="Cancelled" />
        </Tabs>

        <div className="flex flex-initial justify-end items-center">
          <div className="mr-10">
            <CustomButton
              label="Add  booking"
              onPress={handleNavigate}
              startContent={<MdEditSquare />}
              color={"primary"}
              variant="solid"
            />
          </div>

          <CustomInput
            placeholder="Search"
            type="text"
            className="md:w-[350px]"
            endContent={<IoSearchSharp />}
            onValueChange={(e) => setSearchInput(e)}
          />
          <CustomButton
            label="Search"
            className="ml-4"
            color="secondary"
            onPress={handleSearch}
          />
        </div>
      </div>

      <Table
        aria-label="Bookings Table"
        color="success"
        className="mt-4"
        isStriped
        shadow="none"
        isHeaderSticky
        classNames={{
          base: "max-h-[75vh] overflow-scroll",
          table: "min-h-[420px]",
        }}
      >
        <TableHeader>
          {[
            "id",
            "Date",
            "Time",
            "Service",
            "Customer",
            "Location",
            "Amount",
            "Paid",
            "Status",
            // "Reshedule",
            // "Chat",
            "Full Details",
            "Action",
          ].map((col) => (
            <TableColumn
              key={col}
              className="bg-gray-500 text-white font-bold uppercase"
            >
              {col}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent={"No data found"}>
          {apiData?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.referenceCode || "No data"}</TableCell>
              {/* <TableCell>
                {moment(item.appointmentDate).format("DD-MM-YYYY") || "No data"}
              </TableCell> */}
              <TableCell
              // className={
              //   moment(item.appointmentDate).isBefore(moment(), "day")
              //     ? "text-red-500 font-semibold"
              //     : "text-gray-700"
              // }
              >
                {moment(item.appointmentDate).format("DD-MM-YYYY") || "No data"}
              </TableCell>

              <TableCell>{`${item.appointmentTimeTo} - ${item.appointmentTimeFrom} `}</TableCell>

              <TableCell className="truncate max-w-[200px] ">
                {item.serviceName}
              </TableCell>

              <TableCell>
                <CustomerDetailsModal data={item.personalInfo} />
              </TableCell>
              <TableCell>
                {item.personalInfo?.address?.city || "No Data"}
              </TableCell>
              <TableCell>{item.total || 0}</TableCell>
              <TableCell>
                <CustomChip
                  label={item.isPaid ? "Paid" : "Unpaid"}
                  color={item.isPaid ? "success" : "danger"}
                />
              </TableCell>
              <TableCell>
                <CustomChip
                  label={item.bookingStatus || "No Status"}
                  color={statusColorMap[item.bookingStatus] || "secondary"}
                />
                {/* {item.serviceId} */}
              </TableCell>
              {/* <TableCell>
                <CustomButton
                  label="Chat"
                  variant="flat"
                  color="primary"
                  startContent={<MdChatBubble />}
                />
              </TableCell> */}
              <TableCell>
                <CustomButton
                  label="Full Details"
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    setSelectedBooking(item);
                    setShowModal(true);
                    // setSelectedServiceId(item.serviceId);
                  }}
                />
              </TableCell>

              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <CustomButton label="Action" variant="bordered">
                      Actions
                    </CustomButton>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem
                      key="completed"
                      color="success"
                      onPress={() =>
                        handleStatusChange(
                          "completed",
                          item.bookingId,
                          item.bookingStatus.toLowerCase(),
                          item.appointmentDate
                        )
                      }
                    >
                      Complete
                    </DropdownItem>
                    {/* <DropdownItem
                      key="inprogress"
                      color="secondary"
                      onPress={() =>
                        validateBookingData(
                          "inprogress",
                          item.bookingId,
                          item.bookingStatus.toLowerCase()
                        )
                      }
                    >
                      Inprogress
                    </DropdownItem> */}
                    <DropdownItem
                      key="confirmed"
                      color="primary"
                      onPress={() =>
                        handleStatusChange(
                          "confirmed",
                          item.bookingId,
                          item.bookingStatus.toLowerCase(),
                          item.appointmentDate
                        )
                      }
                    >
                      Confirm
                    </DropdownItem>

                    <DropdownItem
                      key="cancelled"
                      color="danger"
                      onPress={() =>
                        handleStatusChange(
                          "cancelled",
                          item.bookingId,
                          item.bookingStatus.toLowerCase(),
                          item.appointmentDate
                        )
                      }
                    >
                      Cancelled
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end items-end py-5 mt-7">
        <CustomPagination
          page={currentPage}
          initialPage={1}
          total={totalPage}
          size="md"
          onChange={setCurrentPage}
          // itemPerPage={viewItemPerPage}
          // onItemPerPageChange={(value) => setViewItemPerPage(value)}
        />
      </div>
      {selectedBooking && (
        <div className="hidden">
          <FullDetailsModal
            data={selectedBooking}
            isOpen={showModal}
            onOpenChange={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default BookingList;
