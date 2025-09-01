import {
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  DateRangePicker,
  Radio,
  RadioGroup,
  RangeValue,
  Switch,
} from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";
import CustomInput from "./CustomInput";
import CustomNumberInput from "./CustomNumberInput";
import { BiDollar } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { convertToInternationalizedDateTimeToReadble } from "../../utils/convertTime";
import { memo } from "react";

type FormData = {
  isDiscount?: boolean;
  discountType: "general-discount" | "promo-code";
  valueType: "amount" | "percentage";
  durationType: "life-time" | "time-base";
  amount: number;
  duration: {
    start: string;
    end?: string;
  };
  maxCount?: number;
  promoCode?: string;
};

const DiscountSection = memo(() => {
  const {
    register,
    resetField,
    watch,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<FormData>();

  const isSelectDiscount = watch("isDiscount");
  const selectDiscountType = watch("discountType");
  const selectValueType = watch("valueType");
  const selectDurationType = watch("durationType");
  const inputPromoCode = watch("promoCode");

  return (
    <>
      {/* <Card radius="none" className="px-3 py-3 mb-5">
        <CardHeader> */}
      <div className="flex items-center flex-initial gap-4 ">
        <p className="text-md font-medium mt-3 mb-5">Discount</p>
        <Controller
          name="isDiscount"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              isSelected={isSelectDiscount}
              onValueChange={(val: boolean) => {
                field.onChange(val);
                setValue("isDiscount", val);
                // if (!val) {
                //   resetField("discount");
                // }
                // trigger("discount.isDiscount");
              }}
              size="sm"
              className="mb-2"
            />
          )}
        />
      </div>
      {/* </CardHeader>
        <CardBody> */}
      {/* DISCOUNT  */}
      <div className="">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div className="flex flex-col">
            {/* DISCOUNT DURATION TYPE */}
            <div
              className={`${
                errors?.discountType
                  ? "border-red-500 bg-red-50 dark:border-red-500"
                  : ""
              } border-1 rounded-lg p-3 dark:border-gray-600/50  bg-cyan-100 dark:bg-neutral-800`}
            >
              <Controller
                name="discountType"
                control={control}
                defaultValue="general-discount"
                render={({ field }) => (
                  <>
                    <RadioGroup
                      label="Discount Type"
                      orientation="horizontal"
                      classNames={{
                        label: "text-body1",
                      }}
                      defaultValue="general-discount"
                      value={selectDiscountType}
                      onValueChange={(val: string) => {
                        field.onChange(val);
                        if (val === "promo-code") {
                          resetField("promoCode");
                        }
                      }}
                      isInvalid={!!errors?.discountType}
                      // isInvalid={true}
                    >
                      <Radio
                        classNames={{
                          label: "text-sm dark:text-gray-300",
                        }}
                        value="general-discount"
                        size="sm"
                        className="mr-3"
                      >
                        General Discount
                      </Radio>
                      <Radio
                        classNames={{
                          label: "text-sm dark:text-gray-300",
                        }}
                        value="promo-code"
                        size="sm"
                      >
                        Promo Code
                      </Radio>
                    </RadioGroup>
                  </>
                )}
              />
            </div>
            {errors?.discountType && (
              <span className="text-error">{errors?.discountType.message}</span>
            )}
          </div>

          {/* DISCOUNT TYPE */}
          <div className=" border-1 rounded-lg p-3 dark:border-gray-600/50 bg-cyan-100 dark:bg-neutral-800">
            <Controller
              name="valueType"
              control={control}
              defaultValue="percentage"
              render={({ field }) => (
                <>
                  <RadioGroup
                    label="Value Type"
                    orientation="horizontal"
                    classNames={{
                      label: "text-body1",
                    }}
                    value={selectValueType}
                    onValueChange={(val: string) => {
                      field.onChange(val);
                    }}
                    isInvalid={!!errors?.valueType}
                  >
                    <Radio
                      classNames={{
                        label: "text-sm dark:text-gray-300",
                      }}
                      value="amount"
                      size="sm"
                      className="mr-3"
                    >
                      Amount
                    </Radio>
                    <Radio
                      classNames={{
                        label: "text-sm dark:text-gray-300",
                      }}
                      value="percentage"
                      size="sm"
                    >
                      Percentage
                    </Radio>
                  </RadioGroup>
                </>
              )}
            />
            {errors?.valueType && (
              <span className="text-error">{errors?.valueType?.message}</span>
            )}
          </div>

          {/* DISCOUNT DURATION TYPE */}
          <div className=" border-1 rounded-lg p-3 dark:border-gray-600/50 bg-cyan-100  dark:bg-neutral-800">
            <Controller
              name="durationType"
              control={control}
              defaultValue="life-time"
              render={({ field }) => (
                <>
                  <RadioGroup
                    label="Duration Type"
                    orientation="horizontal"
                    classNames={{
                      label: "text-body1",
                    }}
                    value={selectDurationType}
                    onValueChange={(val: string) => {
                      field.onChange(val);
                    }}
                    isInvalid={!!errors?.durationType}
                  >
                    <Radio
                      classNames={{
                        label: "text-sm dark:text-gray-300",
                      }}
                      value="life-time"
                      size="sm"
                      className="mr-3"
                    >
                      Life time
                    </Radio>
                    <Radio
                      classNames={{
                        label: "text-sm dark:text-gray-300",
                      }}
                      value="time-base"
                      size="sm"
                    >
                      Time Base
                    </Radio>
                  </RadioGroup>
                </>
              )}
            />
          </div>
        </div>

        <div
          className={`grid ${
            selectDiscountType === "promo-code"
              ? " 2xl:grid-cols-3"
              : "2xl:grid-cols-2"
          }   items-center gap-4 mt-8`}
        >
          {/* AMOUNT */}
          {selectDiscountType === "promo-code" && (
            <CustomInput
              label="Code"
              placeholder="Type code"
              isRequireField={true}
              {...register("promoCode")}
              type="text"
              value={inputPromoCode?.toUpperCase()}
              isInvalid={!!errors?.promoCode}
              errorMessage={errors?.promoCode?.message}
            />
          )}

          {/* AMOUNT */}
          <CustomNumberInput
            label="Amount"
            placeholder="Enter amount"
            {...register("amount")}
            isRequireField={true}
            startContent={<BiDollar className="text-gray-400" />}
            isInvalid={!!errors?.amount?.message}
            errorMessage={errors?.amount?.message}
          />
          {/* MAX COUNT */}
          <CustomNumberInput
            label="Max Count"
            placeholder="Enter count"
            {...register("maxCount")}
            startContent={<FaUser className="text-gray-400" size={14} />}
            isInvalid={!!errors?.maxCount?.message}
            errorMessage={errors?.maxCount?.message}
          />
          {/* TIME RANGE */}
          <div
            className={`w-full ${
              selectDiscountType === "promo-code" ? "2xl:col-span-2" : ""
            }`}
          >
            {selectDurationType === "life-time" ? (
              <Controller
                name={"duration.start"}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Start Date"
                    aria-label="Select Start date"
                    minValue={today(getLocalTimeZone())}
                    variant="bordered"
                    labelPlacement="outside"
                    // value={{
                    //   start:
                    //     convertReadableDateToDateObject(
                    //       field.value?.start
                    //     ) || null,
                    //   end:
                    //     convertReadableDateToDateObject(
                    //       field.value?.end
                    //     ) || null,
                    // }}
                    onChange={(value: CalendarDate) => {
                      console.log(value);
                      if (!value) return;
                      field.onChange(
                        convertToInternationalizedDateTimeToReadble(value)
                      );
                    }}
                    classNames={{
                      label:
                        "after:content-['*'] after:text-red-500 after:ml-1",
                    }}
                    isDisabled={isSelectDiscount}
                    isInvalid={!!errors?.duration?.start}
                    errorMessage={errors?.duration?.start?.message}
                  />
                )}
              />
            ) : (
              // <DateRangePicker
              //   label="Select  Duration"
              //   pageBehavior="single"
              //   visibleMonths={3}
              //   minValue={today(getLocalTimeZone())}
              //   variant="bordered"
              //   labelPlacement="outside"
              //   classNames={{
              //     label:
              //       "after:content-['*'] after:text-red-500 after:ml-1",
              //   }}
              //   isInvalid={!!errors?.discount?.duration?.start}
              //   errorMessage={
              //     errors?.discount?.duration?.start?.message
              //   }
              // />
              <Controller
                name={"duration.start"}
                control={control}
                render={({ field }) => (
                  <DateRangePicker
                    label="Select  Duration"
                    pageBehavior="single"
                    visibleMonths={3}
                    minValue={today(getLocalTimeZone())}
                    variant="bordered"
                    labelPlacement="outside"
                    // value={{
                    //   start:
                    //     convertReadableDateToDateObject(
                    //       field.value?.start
                    //     ) || null,
                    //   end:
                    //     convertReadableDateToDateObject(
                    //       field.value?.end
                    //     ) || null,
                    // }}
                    onChange={(value: RangeValue<CalendarDate>) => {
                      if (!value?.start || !value?.end) return;
                      field.onChange({
                        start: convertToInternationalizedDateTimeToReadble(
                          value.start
                        ),
                        end: convertToInternationalizedDateTimeToReadble(
                          value.end
                        ),
                      });
                    }}
                    classNames={{
                      label:
                        "after:content-['*'] after:text-red-500 after:ml-1",
                    }}
                    isDisabled={!isSelectDiscount}
                    // isInvalid={
                    //   !!errors?.discount?.duration?.start ||
                    //   !!errors?.discount?.duration?.end
                    // }
                    // errorMessage={
                    //   errors?.discount?.duration?.start
                    //     ?.message ||
                    //   !!errors?.discount?.duration?.end?.message
                    // }
                    isInvalid={!!errors?.duration?.start}
                    errorMessage={errors?.duration?.start?.message}
                  />
                )}
              />
            )}
          </div>
        </div>
      </div>
      {/* </CardBody> */}
      {/* </Card> */}
    </>
  );
});
export default DiscountSection;
