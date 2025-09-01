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
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { memo, useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import CustomNumberInput from "./CustomNumberInput";
import { FaUser } from "react-icons/fa";
import { BiDollar } from "react-icons/bi";
import { BsWatch } from "react-icons/bs";
import CustomDivider from "./CustomDivider";
import CustomButton from "./CustomButton";
import { RiDeleteBin4Line } from "react-icons/ri";
import CustomInput from "./CustomInput";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IPackageProps, IServiceSubmitProps } from "../../types";
import {
  convertReadableDateToDateObject,
  convertToInternationalizedDateTimeToReadble,
} from "../../utils/convertTime";
// import CustomInput from "../components/ui/CustomInput";

const PackageSection = memo(() => {
  const {
    register,
    resetField,
    watch,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<IServiceSubmitProps>();

  const {
    fields: packaegField,
    append: appendPackage,
    remove: removePackage,
  } = useFieldArray({
    name: "packages",
    control,
  });

  const discountType = watch("discount.discountType");
  const discountDurationType = watch("discount.durationType");
  const isPackageSelect = watch("isPackage");
  const isDiscount = watch("discount.isDiscount");
  const isDiscountd = watch("packages.1.isDiscount");
  const isDiscountde = watch("packages.1.discount.durationType");
  // console.log("DISCOUNT: ", isDiscountde);

  console.log("All Value: ", watch());

  useEffect(() => {
    if (packaegField.length === 0)
      appendPackage({
        isDiscount: false,
        packageName: "",
        price: 0,
        includes: {
          input1: "",
          input2: "",
          input3: "",
          input4: "",
        },
        discount: {
          discountType: "general-discount",
          valueType: "percentage",
          durationType: "life-time",
          amount: 0,
          duration: {
            start: "",
            end: "",
          },
          maxCount: 0,
        },
      });
  }, [appendPackage, packaegField]);

  return (
    <>
      <Card radius="none" className="px-3 py-3 mb-5">
        <CardHeader>
          <p className="text-md font-medium">Price and Discount</p>
        </CardHeader>
        <CardBody>
          <div>
            <div className="flex items-center flex-initial gap-4 ">
              <p className="text-md font-medium  mb-5">Package</p>
              <Controller
                name="isPackage"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Switch
                    isSelected={watch("isPackage")}
                    onValueChange={(val: boolean) => {
                      field.onChange(val);
                      // if (!val) {
                      //   resetField("packages");
                      //   // trigger("packages");
                      // }
                      if (val) {
                        if (
                          !watch("packages") ||
                          watch("packages").length === 0
                        ) {
                          setValue("packages", [
                            {
                              isDiscount: false,
                              packageName: "",
                              price: 0,
                              includes: {
                                input1: "",
                                input2: "",
                                input3: "",
                                input4: "",
                              },
                              discount: {
                                discountType: "general-discount",
                                valueType: "percentage",
                                durationType: "life-time",
                                amount: 0,
                                duration: { start: "", end: "" },
                                maxCount: 0,
                              },
                            },
                          ]);
                        }
                      } else {
                        setValue("packages", []);
                      }
                    }}
                    size="sm"
                    className="mb-5"
                  />
                )}
              />
            </div>
            {isPackageSelect ? (
              <div>
                {packaegField.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-rows-2 gap-4 border-2 border-gray-300 shadow-md bg-gray-50 dark:bg-neutral-800 dark:border-gray-600/50  mb-4 px-3  pb-5 rounded-xl"
                  >
                    <div className="flex gap-5 flex-inline justify-center items-center -mt-4 ">
                      <CustomInput
                        label="Package Name"
                        type="text"
                        placeholder="Enter name"
                        isDisabled={!isPackageSelect}
                        {...register(`packages.${index}.packageName` as const)}
                        // {...register(`packages.` )}
                        isInvalid={
                          !!errors.packages?.[index]?.packageName?.message
                        }
                        errorMessage={
                          errors.packages?.[index]?.packageName?.message
                        }
                      />

                      <CustomInput
                        label="Price"
                        type="text"
                        placeholder="Enter amount"
                        isDisabled={!isPackageSelect}
                        {...register(`packages.${index}.price` as const)}
                        isInvalid={!!errors.packages?.[index]?.price?.message}
                        errorMessage={errors.packages?.[index]?.price?.message}
                      />

                      {packaegField.length > 1 && (
                        <div className="mt-6 cursor-pointer">
                          <CustomButton
                            isIconOnly={true}
                            isDisabled={!isPackageSelect}
                            variant="light"
                            onPress={() => removePackage(index)}
                          >
                            <RiDeleteBin4Line
                              size={20}
                              className="text-red-400"
                            />
                          </CustomButton>
                        </div>
                      )}
                    </div>

                    {/* PACKAGE INCLUDE */}
                    <div>
                      <p className="text-body1 -mt-10  mb-5">Package Include</p>

                      <div className="grid sm:grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-4 gap-3">
                        <CustomInput
                          label="Title"
                          type="text"
                          placeholder="Enter title"
                          isDisabled={!isPackageSelect}
                          {...register(
                            `packages.${index}.includes.input1` as const
                          )}
                          isInvalid={
                            !!errors.packages?.[index]?.includes?.input1
                              ?.message
                          }
                          errorMessage={
                            errors.packages?.[index]?.includes?.input1?.message
                          }
                        />
                        <CustomInput
                          label="Title"
                          type="text"
                          placeholder="Enter title"
                          isDisabled={!isPackageSelect}
                          {...register(
                            `packages.${index}.includes.input2` as const
                          )}
                          isInvalid={
                            !!errors.packages?.[index]?.includes?.input2
                              ?.message
                          }
                          errorMessage={
                            errors.packages?.[index]?.includes?.input2?.message
                          }
                        />
                        <CustomInput
                          label="Title"
                          type="text"
                          placeholder="Enter title"
                          isDisabled={!isPackageSelect}
                          {...register(
                            `packages.${index}.includes.input3` as const
                          )}
                          isInvalid={
                            !!errors.packages?.[index]?.includes?.input3
                              ?.message
                          }
                          errorMessage={
                            errors.packages?.[index]?.includes?.input3?.message
                          }
                        />
                        <CustomInput
                          label="Title"
                          type="text"
                          placeholder="Enter title"
                          isDisabled={!isPackageSelect}
                          {...register(
                            `packages.${index}.includes.input4` as const
                          )}
                          isInvalid={
                            !!errors.packages?.[index]?.includes?.input4
                              ?.message
                          }
                          errorMessage={
                            errors.packages?.[index]?.includes?.input4?.message
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center flex-initial gap-4 ">
                      <p className="text-md font-medium mt-3 mb-5">Discount</p>
                      <Controller
                        name={`packages.${index}.isDiscount`}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <Switch
                            isSelected={watch(`packages.${index}.isDiscount`)}
                            onValueChange={(val: boolean) => {
                              field.onChange(val);
                              console.log("P: input: ", val);
                              setValue(
                                `packages.${index}.discount.isDiscount`,
                                val
                              );
                              if (!val) {
                                setValue(
                                  `packages.${index}.discount`,
                                  {
                                    discountType: "general-discount",
                                    valueType: "percentage",
                                    durationType: "life-time",
                                    amount: 0,
                                    duration: { start: "", end: "" },
                                    maxCount: 0,
                                  },
                                  { shouldValidate: false, shouldDirty: false }
                                );
                                trigger(`packages.${index}.discount`);
                              }
                            }}
                            isDisabled={!isPackageSelect}
                            size="sm"
                            className="mb-2"
                          />
                        )}
                      />
                    </div>

                    <div className="">
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {/* DISCOUNT TYPE */}
                        <div className=" border-1 rounded-lg p-3 dark:border-gray-600/50 bg-cyan-100 dark:bg-neutral-800">
                          <Controller
                            name={`packages.${index}.discount.valueType`}
                            control={control}
                            defaultValue="percentage"
                            render={({ field, fieldState }) => (
                              <>
                                <RadioGroup
                                  label="Value Type"
                                  orientation="horizontal"
                                  classNames={{
                                    label: "text-body1",
                                  }}
                                  value={watch(
                                    `packages.${index}.discount.valueType`
                                  )}
                                  onValueChange={(val: string) => {
                                    field.onChange(val);
                                  }}
                                  isInvalid={!!fieldState.error}
                                  isDisabled={
                                    !watch(`packages.${index}.isDiscount`)
                                  }
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
                          {errors.discount?.valueType && (
                            <span className="text-error">
                              {errors.discount?.valueType?.message}
                            </span>
                          )}
                        </div>
                        {/* <p>
                      {" "}
                      tag:{" "}
                      {watch(`packages.${index}.isDiscount`) ? "true" : "false"}
                    </p> */}

                        {/* DISCOUNT DURATION TYPE */}
                        <div className=" border-1 rounded-lg p-3 dark:border-gray-600/50 bg-cyan-100  dark:bg-neutral-800">
                          <Controller
                            name={`packages.${index}.discount.durationType`}
                            control={control}
                            defaultValue="life-time"
                            render={({ field, fieldState }) => (
                              <>
                                <RadioGroup
                                  label="Duration Type"
                                  orientation="horizontal"
                                  classNames={{
                                    label: "text-body1",
                                  }}
                                  value={watch(
                                    `packages.${index}.discount.durationType`
                                  )}
                                  onValueChange={(val: string) => {
                                    field.onChange(val);
                                  }}
                                  isInvalid={!!fieldState.error}
                                  isDisabled={
                                    !watch(`packages.${index}.isDiscount`)
                                  }
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
                          discountType === "promo-code"
                            ? " 2xl:grid-cols-3"
                            : "2xl:grid-cols-2"
                        }   items-center gap-4 mt-8`}
                      >
                        {/* AMOUNT */}
                        {/* {discountType === "promo-code" && (
                      <CustomInput
                        label="Code"
                        placeholder="Type code"
                        isRequireField={true}
                        {...register("discount.promoCode")}
                        type="text"
                        value={watch("discount.promoCode")?.toUpperCase()}
                        isInvalid={!!errors?.discount?.promoCode}
                        errorMessage={errors?.discount?.promoCode?.message}
                      />
                    )} */}

                        {/* AMOUNT */}
                        <CustomNumberInput
                          label="Amount"
                          placeholder="Enter amount"
                          {...register(`packages.${index}.discount.amount`)}
                          isRequireField={true}
                          startContent={<BiDollar className="text-gray-400" />}
                          isInvalid={
                            !!errors?.packages?.[index]?.discount?.amount
                              ?.message
                          }
                          errorMessage={
                            errors?.packages?.[index]?.discount?.amount?.message
                          }
                          isDisabled={!watch(`packages.${index}.isDiscount`)}
                        />
                        {/* MAX COUNT */}
                        <CustomNumberInput
                          label="Max Count"
                          placeholder="Enter count"
                          {...register(`packages.${index}.discount.maxCount`)}
                          startContent={
                            <FaUser className="text-gray-400" size={14} />
                          }
                          isInvalid={
                            !!errors?.packages?.[index]?.discount?.maxCount
                              ?.message
                          }
                          errorMessage={
                            errors?.packages?.[index]?.discount?.maxCount
                              ?.message
                          }
                          isDisabled={!watch(`packages.${index}.isDiscount`)}
                        />
                        {/* TIME RANGE */}
                        <div
                          className={`w-full ${
                            discountType === "promo-code"
                              ? "2xl:col-span-2"
                              : ""
                          }`}
                        >
                          {watch(`packages.${index}.discount.durationType`) ===
                          "life-time" ? (
                            <DatePicker
                              label="Start Date"
                              minValue={today(getLocalTimeZone())}
                              variant="bordered"
                              labelPlacement="outside"
                              classNames={{
                                label:
                                  "after:content-['*'] after:text-red-500 after:ml-1",
                              }}
                              isDisabled={
                                !watch(`packages.${index}.isDiscount`)
                              }
                              isInvalid={
                                !!errors?.packages?.[index]?.discount?.duration
                                  ?.start
                              }
                              errorMessage={
                                errors?.packages?.[index]?.discount?.duration
                                  ?.start?.message
                              }
                            />
                          ) : (
                            //                       <Controller
                            // name={`packages.${index}.discount.duration.start`}
                            // control={control}
                            // render={({ field }) => (
                            //     <DatePicker
                            //       {...field}
                            //       value={field.value || null}
                            //       onChange={field.onChange}
                            //       minValue={today(getLocalTimeZone())}
                            //       isDisabled={!watch(`packages.${index}.isDiscount`)}
                            //     />
                            //   )}
                            // />

                            <Controller
                              name={`packages.${index}.discount.duration`} // control whole duration object
                              control={control}
                              render={({ field }) => (
                                <DateRangePicker
                                  label="Select Duration"
                                  aria-label="Select Duration"
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
                                  onChange={(
                                    value: RangeValue<CalendarDate>
                                  ) => {
                                    if (!value?.start || !value?.end) return;
                                    field.onChange({
                                      start:
                                        convertToInternationalizedDateTimeToReadble(
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
                                  isDisabled={
                                    !watch(`packages.${index}.isDiscount`)
                                  }
                                  isInvalid={
                                    !!errors?.packages?.[index]?.discount
                                      ?.duration?.start
                                  }
                                  errorMessage={
                                    errors?.packages?.[index]?.discount
                                      ?.duration?.start?.message
                                  }
                                />
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {packaegField.length < 3 && (
                  <div className="mt-3">
                    <CustomButton
                      label="Add New"
                      className="text-green-600"
                      isDisabled={!isPackageSelect}
                      startContent={
                        <IoIosAddCircleOutline
                          size={20}
                          className="text-green-600 cursor-pointer"
                        />
                      }
                      variant="light"
                      onPress={() =>
                        appendPackage({
                          isDiscount: false,
                          packageName: "",
                          price: 0,
                          includes: {
                            input1: "",
                            input2: "",
                            input3: "",
                            input4: "",
                          },
                          discount: {
                            discountType: "general-discount",
                            valueType: "percentage",
                            durationType: "life-time",
                            amount: 0,
                            duration: {
                              start: "",
                              end: "",
                            },
                            maxCount: 0,
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* ONLY PRICE */}
                <div className="mt-10">
                  <CustomNumberInput
                    label="Price"
                    placeholder="Enter title"
                    {...register("price")}
                    isRequireField={true}
                    startContent={<BiDollar className="text-gray-400" />}
                    isInvalid={!!errors.price?.message}
                    errorMessage={errors.price?.message}
                  />
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
});

export default PackageSection;
