import { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import CustomNumberInput from "./CustomNumberInput";
import CustomAutocomplete from "./CustomAutocomplete";
import CustomCheckbox from "./CustomCheckbox";
import { days } from "../../data/sampleData";
import { IoIosAddCircleOutline } from "react-icons/io";
import CustomButton from "./CustomButton";
import { IoTrashBin } from "react-icons/io5";
import { IAvailabilityField } from "../../types";
import { formatAvailabilityPayload } from "../../utils/serviceUtils";
import { RiDeleteBin4Line } from "react-icons/ri";

interface AvailabilityInputProps {
  onChangeValue: (value: IAvailabilityField[]) => void;
  value?: IAvailabilityField[];
  isAllDay?: boolean;
}

const convertTo24HourFormat = (time: string): string => {
  // Check if time is already in correct format
  if (!time) return "";

  const [hour, minute] = time.split(":");
  const [minutePart, period] = minute.split(" ");

  let hours = parseInt(hour, 10);
  if (period?.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (period?.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutePart.padStart(2, "0")}`;
};

const CustomAvailabilityInput = ({
  isAllDay,
  value,
  onChangeValue,
}: AvailabilityInputProps) => {
  const [allDay, setAllDay] = useState<boolean>(false);
  const [ww, setww] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [fields, setFields] = useState<IAvailabilityField[]>([
    {
      id: Date.now(),
      day: "",
      from: null,
      to: null,
      maxBookings: null,
    },
  ]);

  useEffect(() => {
    if (!value) return;

    if (value && Array.isArray(value)) {
      const formattedFields = value.flatMap(
        (field) =>
          field.timeSlots?.map((slot) => ({
            id: Date.now() + Math.random(),
            day: field.day,
            available: field.available,
            from: slot.from,
            to: slot.to,
            maxBookings: slot.maxBookings,
          })) || []
      );
      setFields(formattedFields);
      setAllDay(isAllDay);
      setww(true);
    } else {
      setFields([
        {
          id: Date.now(),
          day: "",
          from: null,
          to: null,
          maxBookings: null,
        },
      ]);
    }
  }, [value, isAllDay]);

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: Date.now(),
        day: "",
        from: null,
        to: null,
        maxBookings: null,
      },
    ]);
  };

  const handleRemoveField = (id: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((field) => field.id !== id));
    }
  };

  const handleUpdateField = (
    id: number,
    updatedField: Partial<IAvailabilityField>
  ) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, ...updatedField } : field
      )
    );
  };

  const chnageDatStatus = () => {
    setAllDay(!allDay);
    setFields([
      {
        id: Date.now(),
        day: "",
        from: null,
        to: null,
        maxBookings: null,
      },
    ]);
  };

  const formattedPayload = formatAvailabilityPayload(fields);

  useEffect(() => {
    if (formattedPayload.isValid === false) {
      setErrors(formattedPayload.errors);
      onChangeValue([]);
    } else {
      setErrors("");
      onChangeValue(fields);
    }
  }, [fields]);

  return (
    <>
      <div>
        {/* <CustomCheckbox
          isDisabled={true}
          label="All Day"
          className="cursor-not-allowed"
          isSelected={allDay}
          onValueChange={chnageDatStatus}
        /> */}
      </div>

      {fields.map((field) => (
        <div key={field.id} className="flex flex-initial gap-6">
          {allDay ? (
            <>
              <div className="max-w-sm">
                <CustomAutocomplete
                  label="Day"
                  isRequired={true}
                  placeholder="All Day"
                  defaultItems={[{ label: "All Day", id: "all-date" }]}
                  startContent={<CiCalendar size={20} />}
                  defaultSelectedKey={field.day}
                  onSelectionChange={(value) =>
                    handleUpdateField(field.id, { day: value as string })
                  }
                />
              </div>

              <div className="max-w-[125px]">
                <label className="block text-sm">From</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-1 text-sm mt-1 border-2 rounded-lg focus:ring focus:ring-blue-200"
                  value={field.from ? convertTo24HourFormat(field.from) : ""}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      from: e.target.value,
                    })
                  }
                />
              </div>

              <div className="max-w-[125px]">
                <label className="block text-sm font-medium">To</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-1 text-sm mt-1 border-2 rounded-lg focus:ring focus:ring-blue-200"
                  value={field.to ? convertTo24HourFormat(field.to) : ""}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      to: e.target.value,
                    })
                  }
                />
              </div>

              <div className="max-w-[125px]">
                <CustomNumberInput
                  label="Slot"
                  isRequired={true}
                  value={field.maxBookings}
                  onValueChange={(value) =>
                    handleUpdateField(field.id, { maxBookings: Number(value) })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="max-w-sm">
                <CustomAutocomplete
                  label="Day"
                  isRequired={true}
                  placeholder="Select Days"
                  defaultItems={days}
                  startContent={<CiCalendar size={20} />}
                  defaultSelectedKey={field.day}
                  onSelectionChange={(value) =>
                    handleUpdateField(field.id, { day: value as string })
                  }
                />
              </div>

              <div className="max-w-[125px]">
                <label className="block text-sm font-medium">From</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-1 text-sm mt-1 border-2 rounded-lg focus:ring focus:ring-blue-200 dark:focus:ring-gray-600 dark:focus:ring dark:border-gray-600 dark:bg-transparent"
                  value={field.from ? convertTo24HourFormat(field.from) : ""}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      from: e.target.value,
                    })
                  }
                />
              </div>

              <div className="max-w-[125px]">
                <label className="block text-sm font-medium">To</label>
                <input
                  type="time"
                  required
                  className="w-full px-3 py-1 text-sm mt-1 border-2 rounded-lg focus:ring focus:ring-blue-200 dark:focus:ring-gray-600 dark:focus:ring dark:border-gray-600  dark:bg-transparent"
                  value={field.to ? convertTo24HourFormat(field.to) : ""}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      to: e.target.value,
                    })
                  }
                />
              </div>

              <div className="max-w-[125px]">
                <CustomNumberInput
                  label="Slot"
                  isRequired={true}
                  value={field.maxBookings}
                  onValueChange={(value) =>
                    handleUpdateField(field.id, { maxBookings: Number(value) })
                  }
                />
              </div>
            </>
          )}
          {fields.length > 1 && (
            <div className="mt-6 cursor-pointer">
              <CustomButton
                isIconOnly
                variant="light"
                onPress={() => handleRemoveField(field.id)}
              >
                <RiDeleteBin4Line size={20} className="text-red-400" />
              </CustomButton>
            </div>
          )}
        </div>
      ))}

      {errors && <small className="text-error -mt-4">{errors}</small>}

      {!errors && (
        <div className="-mt-3">
          <CustomButton
            label="Add New"
            className="text-green-600"
            startContent={
              <IoIosAddCircleOutline
                size={20}
                className="text-green-600 cursor-pointer"
              />
            }
            variant="light"
            onPress={handleAddField}
          />
        </div>
      )}
    </>
  );
};

export default CustomAvailabilityInput;
