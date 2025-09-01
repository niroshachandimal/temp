import EventCalender from "../../components/ui/EventCalender";
import {
  addToast,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";
import CustomButton from "../../components/ui/CustomButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddLeaveStaffModal from "./AddLeaveStaffModal";
import { iStaffGetProps, IStaffHolidayResponse } from "../../types";
import {
  useFetchAllStaffHolidays,
  useFetchHolidayByStaffId,
  useFetchStaff,
} from "../../hooks/queries/useFetchData";
import { useEffect, useMemo, useState } from "react";
import { convertDateToReadble } from "../../utils/convertTime";
import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
import CustomPagination from "../../components/ui/CustomPagination";
import ConfirmToast from "../../components/ui/ConfirmToast";
import { useDeleteStaffHoliday } from "../../hooks/mutations/useDeleteData";
import EditLeaveStaffModal from "./EditLeaveStaffModal";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuTable } from "react-icons/lu";
import moment from "moment";

const StaffLeavePage = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [staff, setStaff] = useState<iStaffGetProps>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openEventCalendar, setOpenEventCalendar] = useState<boolean>(true);
  const [holidayDataCalendar, setHolidayDataCalendar] = useState([]);

  const { data: staffData } = useFetchStaff({ page: 1, limit: 100 });
  const { data } = useFetchAllStaffHolidays({ page: 2, limit: 10 });
  const { data: holidayCalender } = useFetchAllStaffHolidays({
    page: 1,
    limit: 1000,
  });
  const { data: holidayData, isFetching } = useFetchHolidayByStaffId(value);
  const { mutate } = useDeleteStaffHoliday();

  const apiData: IStaffHolidayResponse[] = useMemo(
    () => data?.holidays || [],
    [data]
  );
  const totalPage = useMemo(() => data?.pages || 1, [data]);

  console.log("ALL: ", apiData);
  console.log("SINGLE: ", holidayData?.holidays);

  const holidayList = value ? holidayData?.holidays || [] : apiData || [];

  console.log("value: ", staff);
  useEffect(() => {
    setValue(selectedStaffId);
  }, [selectedStaffId]);

  useEffect(() => {
    if (staffData) {
      const staff = staffData?.staff?.map((s) => {
        return {
          label: s.fullName,
          id: s.staffId,
        };
      });

      setStaff(staff);
    }
  }, [staffData]);

  console.log("fdfd: ", selectedStaffId);
  const reset = () => {
    setSelectedStaffId("");
    setValue("");
  };

  const handleDelete = (id: string) => {
    if (!id) {
      addToast({
        title: " Error",
        description: "Holiday id not found. try again!",
        radius: "md",
        color: "danger",
      });
    }
    ConfirmToast({
      title: "Confirm Action",
      message: "Are you sure you want to delete holiday?",
      type: "warning",
      confirmText: "Yes",
      cancelText: "No",
    }).then(async (confirmed) => {
      if (confirmed) {
        mutate(id);
      }
    });
  };

  useEffect(() => {
    const holidayList = value
      ? holidayData?.holidays || []
      : holidayCalender?.holidays || [];

    const holidayDates = holidayList?.map((d: IStaffHolidayResponse) => {
      return {
        id: d.holidayId,
        title: `${d.staffName} |  ${d.staffId} | ${d.reason} `,
        start: moment(d.startDate).format("YYYY-MM-DD"),
        end: moment(d.endDate).format("YYYY-MM-DD"),
        color: getColorByReason(d.reason),
        extendedProps: {
          description: `ID: ${d.staffId} | Note: ${d.notes}`,
        },
      };
    });

    setHolidayDataCalendar(holidayDates);
  }, [holidayCalender, holidayData?.holidays, value]);

  const reasonColorMap: Record<string, string> = {
    "Annual Leave": "#4CAF50", // Green
    "Sick Leave": "#F44336", // Red
    "Unpaid Leave": "#9E9E9E", // Grey
    "Religious Observance Leave": "#3F51B5", // Indigo
    "Study Leave": "#2196F3", // Blue
    "Voting Leave": "#C95792", // Amber
    "Paternity Leave": "#7C4585", // Orange
    "Maternity Leave": "#E91E63", // Pink
  };

  const getColorByReason = (reason: string): string => {
    return reasonColorMap[reason] || "#607D8B"; // Default: Blue Grey
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-2 md:gap-5">
        <div className="flex justify-start items-center gap-2 md:gap-4 mb-8 ">
          <div className="max-w-sm">
            <CustomAutocomplete
              isRequired={true}
              placeholder="Search by staff"
              defaultItems={staff || []}
              selectedKey={value}
              width="none"
              onSelectionChange={(id) => {
                setValue(id);
              }}
            />
          </div>
          <CustomButton label="Filter" color="secondary" onPress={reset} />
        </div>

        <div className="flex justify-end items-center gap-4 mb-8 ">
          {/* {isVerifyAccount && <AddStaffModa />} */}
          <CustomButton
            label={!openEventCalendar ? "Table View" : "Holiday Calender"}
            color="secondary"
            onPress={() => setOpenEventCalendar(!openEventCalendar)}
            startContent={
              openEventCalendar ? (
                <LuTable size={14} />
              ) : (
                <FaRegCalendarAlt size={14} />
              )
            }
          />
          {<AddLeaveStaffModal />}
        </div>
      </div>
      {openEventCalendar ? (
        <>
          <Table
            aria-label="holiday Table"
            color="success"
            isStriped
            shadow="none"
          >
            <TableHeader>
              {[
                "Holiday ID",
                "Name",
                "Start Date",
                "End Date",
                "Type",
                "Note",
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
            <TableBody
              isLoading={isFetching}
              loadingContent={<Spinner />}
              emptyContent={"No data to display"}
            >
              {holidayList?.map((item: IStaffHolidayResponse) => (
                <TableRow className="cursor-pointer">
                  <TableCell>{item.holidayId}</TableCell>
                  <TableCell>
                    <User
                      avatarProps={{
                        name: item.staffId,
                      }}
                      description={item.providerId}
                      name={item.staffName}
                    />
                  </TableCell>
                  <TableCell>{convertDateToReadble(item.startDate)}</TableCell>
                  <TableCell>{convertDateToReadble(item.endDate)}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.notes || "N/A"}</TableCell>
                  <TableCell className="flex flex-initial">
                    <CustomButton
                      type="button"
                      isIconOnly
                      className="bg-transparent"
                      startContent={
                        <RiDeleteBin6Line
                          size={18}
                          className="text-red-500 hover:text-red-700"
                        />
                      }
                      onPress={() => handleDelete(item.holidayId)}
                    />
                    <EditLeaveStaffModal data={item} />
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
            />
          </div>
        </>
      ) : (
        <EventCalender
          data={holidayDataCalendar}
          aspectRatio={3}
          height={"500%"}
          initialView={"dayGridMonth"}
        />
      )}
    </div>
  );
};

export default StaffLeavePage;
