import {
  Avatar,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { MdAddCircleOutline } from "react-icons/md";
import CustomButton from "../../components/ui/CustomButton";
import CustomInput from "../../components/ui/CustomInput";
import CustomAutocomplete from "../../components/ui/CustomAutocomplete";
import {
  useForm,
  SubmitHandler,
  Controller,
  FormProvider,
} from "react-hook-form";
import { useSumbitStaffMutation } from "../../hooks/mutations/usePostData";
import CustomCheckbox from "../../components/ui/CustomCheckbox";
import {
  IDiscountAddProps,
  IPackageDiscountAddProps,
  IServiceProps,
} from "../../types";
import { useFetchAllServiceByProvider } from "../../hooks/queries/useFetchData";
import { yupResolver } from "@hookform/resolvers/yup";
import { discountAddDefaultValue } from "../../utils/defaultValue";
import DiscountSection from "./DiscountSection";

const AddDiscountModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm<IDiscountAddProps | IPackageDiscountAddProps>({
    defaultValues: discountAddDefaultValue,
    shouldUnregister: true,
    // resolver: yupResolver(serviceSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    //  context: { isFaq, isAddtional, isPackage },
  });

  const {
    register,
    control,
    setValue,
    resetField,
    watch,
    reset,
    getValues,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const { data: serviceData } = useFetchAllServiceByProvider(1, 100);

  const onSubmit = async (
    data: IDiscountAddProps | IPackageDiscountAddProps
  ) => {
    console.log("Final data: ", data);
  };

  return (
    <>
      <CustomButton
        label="Add Discount"
        type="button"
        size="sm"
        color="primary"
        startContent={<MdAddCircleOutline size={20} />}
        onPress={onOpen}
        className="-mt-6 sm:mt-0"
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Add Discount
                  </ModalHeader>
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="grid max-w-[550px] gap-5 mt-2 ">
                        <Controller
                          name="serviceId"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Select
                              {...field}
                              variant="bordered"
                              label="Select Service"
                              labelPlacement="outside"
                              placeholder="Select a service"
                              selectedKeys={[field.value]}
                              onSelectionChange={(val) => {
                                field.onChange(val);
                              }}
                              classNames={{
                                label:
                                  "after:content-['*'] after:text-red-500 after:ml-1",
                              }}
                              items={serviceData?.services || []}
                              errorMessage={fieldState.error?.message}
                              renderValue={(items) =>
                                items.map((item) => (
                                  <div
                                    key={item.data?.serviceId}
                                    className="flex items-center gap-2"
                                  >
                                    <Avatar
                                      alt={item.data?.serviceTitle}
                                      className="flex-shrink-0"
                                      size="sm"
                                      src={
                                        item?.data?.gallery?.[0]
                                          ?.serviceImages?.[0]
                                      }
                                    />
                                    <div className="flex flex-col p-2">
                                      <span>{item.data?.serviceTitle}</span>
                                      <span className="text-default-500 text-tiny">
                                        {item.data?.serviceId}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              }
                            >
                              {(data: IServiceProps) => (
                                <SelectItem
                                  key={data?.serviceId}
                                  textValue={data?.serviceTitle}
                                >
                                  <div className="flex gap-2 items-center">
                                    <Avatar
                                      alt={data?.serviceTitle}
                                      className="flex-shrink-0"
                                      size="sm"
                                      src={
                                        data?.gallery?.[0]?.serviceImages?.[0]
                                      }
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-small">
                                        {data?.serviceTitle}
                                      </span>
                                      <span className="text-tiny text-default-400">
                                        {data?.serviceId}
                                      </span>
                                    </div>
                                  </div>
                                </SelectItem>
                              )}
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                    <DiscountSection />
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
                    <CustomButton
                      type="submit"
                      label="Submit"
                      color="primary"
                    />
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default AddDiscountModal;
