// components/NestedInput.tsx
import React, { memo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import CustomInput from "../components/ui/CustomInput";

const NestedInput = memo(() => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const val = useWatch({ name: "test" });

  console.log("val: ", val);

  return (
    <div>
      <CustomInput
        label="Test"
        type="text"
        isRequireField={true}
        placeholder="Enter title"
        isInvalid={!!errors?.test}
        errorMessage={errors?.test?.message}
        {...register("test")}
      />
      {/* {isDirty && <p className="text-red-500">This field is dirty</p>} */}
    </div>
  );
});

export default NestedInput;
