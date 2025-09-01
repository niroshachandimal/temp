import {
  addToast,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { MdAddCircleOutline } from "react-icons/md";
import CustomButton from "../../components/ui/CustomButton";
import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import CustomSelectorWithUser from "../../components/ui/CustomSelectorWithUser";
import { useEffect, useState } from "react";
import {
  useFetchHolidayByStaffId,
  useFetchStaff,
  useFetchStaffById,
} from "../../hooks/queries/useFetchData";
import CustomDateRangePicker from "../../components/ui/CustomDateRangePicker";
import CustomTextArea from "../../components/ui/CustomTextArea";
import { useSumbitStaffHoliday } from "../../hooks/mutations/usePostData";
import { FaRegEdit } from "react-icons/fa";
import { IStaffHolidayResponse } from "../../types";
import { parseDate } from "@internationalized/date";
import moment from "moment";
import { useUpdateStaffHolidayById } from "../../hooks/mutations/useUpdateData";

type FormValues = {
  startDate: string;
  endDate: string;
  reason: string;
  approved: string;
  notes: string;
};

const reason = [
  { label: "Annual Leave", id: "Annual Leave" },
  { label: "Sick Leave", id: "Sick Leave" },
  { label: "Unpaid Leave", id: "Unpaid Leave" },
  { label: "Religious Observance Leave", id: "Religious Observance Leave" },
  { label: "Study Leave", id: "Study Leave" },
  { label: "Voting Leave", id: "Voting Leave" },
  { label: "Paternity Leave", id: "Paternity Leave" },
  { label: "Maternity Leave", id: "Maternity Leave" },
];

type Holidayprops = {
  data: IStaffHolidayResponse;
};

const EditLeaveStaffModal = ({ data }: Holidayprops) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [alreadyHiliday, setAlreadyHiliday] = useState<string[]>([]);
  const [disableStaff, setDisableStaff] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [selectDateRange, setSelectDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { data: staffData } = useFetchStaff({ page: 1, limit: 100 });
  const { data: staffDataById } = useFetchHolidayByStaffId(data.staffId);
  const { mutate } = useUpdateStaffHolidayById();

  useEffect(() => {
    const staffLeave = staffDataById?.holidays?.map(
      (leave: IStaffHolidayResponse) => {
        return {
          startDate: leave.startDate,
          endDate: leave.endDate,
        };
      }
    );
    const removeCurrectDate = staffLeave?.filter((s: IStaffHolidayResponse) => {
      return s.startDate !== data.startDate && s.endDate !== data.endDate;
    });

    setAlreadyHiliday(removeCurrectDate);
  }, [data.staffId, data.startDate, data.endDate, staffDataById?.holidays]);

  useEffect(() => {
    if (!staffData || !data?.staffId) return;
    console.log("OK: ", data.staffId);
    const disableIds = staffData?.staff
      ?.filter((s: IStaffHolidayResponse) => s.staffId !== data.staffId)
      .map((s: IStaffHolidayResponse) => s.staffId);

    setDisableStaff(disableIds);

    reset({
      reason: data?.reason || "",
      notes: data?.notes || "",
    });

    setSelectDateRange({
      startDate: moment(data?.startDate).format("YYYY-MM-DD"),
      endDate: moment(data?.endDate).format("YYYY-MM-DD"),
    });
  }, [data, staffData, reset]);

  const onSubmit: SubmitHandler<FormValues> = (d) => {
    // console.log("SELECTED STAFF ID: ", selectedStaffId);
    // if (!selectedStaffId) {
    //   addToast({
    //     title: " Error",
    //     description: "Staff ID not selected. try again!",
    //     radius: "md",
    //     color: "danger",
    //   });
    // }

    // console.log("data: ", data);
    // console.log("selectedStaffId: ", selectedStaffId);

    const payload = {
      startDate: selectDateRange.startDate,
      endDate: selectDateRange.endDate,
      reason: d.reason,
      notes: d.notes,
      approved: true,
    };
    // console.log("Payload: ", payload);
    mutate({ id: data.holidayId, data: payload });

    reset();
    setSelectedStaffId("");
    setSelectDateRange({
      startDate: "",
      endDate: "",
    });
    setAlreadyHiliday([]);
    onOpenChange(false);
  };

  const onError: SubmitErrorHandler<FormValues> = (errors) => {
    console.error("Error submit staff holiday: ", errors);
  };

  return (
    <>
      <CustomButton
        isIconOnly
        className="bg-transparent ml-2"
        endContent={
          <FaRegEdit size={18} className="hover:text-blue-500 text-gray-500" />
        }
        onPress={onOpen}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add Holiday
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 gap-5">
                    <CustomSelectorWithUser
                      label="Select Staff"
                      isRequired
                      data={staffData.staff}
                      displayValue={data.staffId}
                      selectedValue={setSelectedStaffId}
                      disabledKeys={disableStaff}
                    />

                    <CustomAutocomplete
                      label="Holiday Type"
                      isRequired={true}
                      placeholder="Select a type"
                      defaultItems={reason}
                      selectedKey={watch("reason") || undefined}
                      width="none"
                      onSelectionChange={(id) => {
                        setValue("reason", id, { shouldValidate: true });
                      }}
                      isInvalid={!!errors?.reason}
                      errorMessage={errors?.reason?.message}
                    />

                    <CustomDateRangePicker
                      label="Select Date Range"
                      isRequired
                      visibleMonths={2}
                      startDate={selectDateRange?.startDate}
                      endDate={selectDateRange?.endDate}
                      alreadyHolidays={alreadyHiliday}
                      onChange={(range) => {
                        setSelectDateRange({
                          startDate: range.start,
                          endDate: range.end,
                        });
                      }}
                    />
                  </div>
                  <CustomTextArea
                    label="Note"
                    placeholder="Enter note"
                    {...register("notes", {
                      maxLength: {
                        value: 100,
                        message: "Note must be less than 100 characters",
                      },
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    isInvalid={!!errors?.notes}
                    errorMessage={errors?.notes?.message}
                  />
                </ModalBody>
                <ModalFooter>
                  <CustomButton
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onClose();
                      reset();
                    }}
                    label="Close"
                  />
                  <CustomButton type="submit" label="Submit" color="primary" />
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default EditLeaveStaffModal;
