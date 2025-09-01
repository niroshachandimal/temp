import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { IServiceSubmitProps } from "../types";
import { serviceSchema } from "../validation/serviceSchema";
import CustomInput from "../components/ui/CustomInput";

const Dashboard = () => {
  const form = useForm<IServiceSubmitProps>({
    defaultValues: {
      test: "test",
    },
    shouldUnregister: true,
    resolver: yupResolver(serviceSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    // context: { isFaq, isAddtional },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    resetField,
    watch,
    reset,
    trigger,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = form;

  const onSubmit = (data: IServiceSubmitProps) => {
    console.log(data);
  };

  console.log("Red----------");

  const text = useWatch({ name: "test", control });
  console.log("Data: ", text);

  return (
    <>
      <h1 className="text-body1">Dashboard</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CustomInput
            label="Test"
            type="text"
            isRequireField={true}
            placeholder="Enter title"
            {...register("test")}
          />
          <button type="submit">submit</button>
        </form>
      </FormProvider>

      {text && <h1>Your are al ready type...</h1>}
    </>
  );
};

export default Dashboard;
