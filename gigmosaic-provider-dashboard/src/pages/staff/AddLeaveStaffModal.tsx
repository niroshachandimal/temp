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
} from "../../hooks/queries/useFetchData";
import CustomDateRangePicker from "../../components/ui/CustomDateRangePicker";
import CustomTextArea from "../../components/ui/CustomTextArea";
import { useSumbitStaffHoliday } from "../../hooks/mutations/usePostData";

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

const AddLeaveStaffModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [alreadyHiliday, setAlreadyHiliday] = useState<string[]>([]);
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
  const { data: staffDataById } = useFetchHolidayByStaffId(selectedStaffId);
  const { mutate } = useSumbitStaffHoliday();

  console.log("staffData staffData: ", staffData);
  useEffect(() => {
    if (staffDataById) {
      const staffLeave = staffDataById?.holidays?.map((leave) => {
        return {
          startDate: leave.startDate,
          endDate: leave.endDate,
        };
      });

      setAlreadyHiliday(staffLeave);
    }
  }, [staffDataById]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!selectedStaffId) {
      addToast({
        title: " Error",
        description: "Staff ID not selected. try again!",
        radius: "md",
        color: "danger",
      });
    }

    const payload = {
      id: selectedStaffId,
      data: {
        startDate: selectDateRange.startDate,
        endDate: selectDateRange.endDate,
        reason: data.reason,
        notes: data.notes,
        approved: true,
      },
    };

    mutate(payload);
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
        label="Add Holiday"
        type="button"
        size="sm"
        color="primary"
        startContent={<MdAddCircleOutline size={20} />}
        onPress={onOpen}
        className="-mt-6 sm:mt-0"
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
                      data={staffData?.staff}
                      //   displayValue={"3"}
                      selectedValue={setSelectedStaffId}
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

export default AddLeaveStaffModal;
