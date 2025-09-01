import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import CustomInput from "../../components/ui/CustomInput";
import FileInput from "../../components/ui/FileInput";
import {
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "../../hook/useMutationData";
import { useCategoryQuery, useSubCategoryQuery } from "../../hook/useQueryData";
import { SubCategory, EditSubCategoryData } from "../../types";
import { uploadToS3 } from "../../utils/aws/s3FileUpload";

interface SubCategoryFormData {
  categoryId: string;
  subCategoryName: string;
  subCategorySlug: string;
  subCategoryImage?: string;
}

interface SubCategoryProps {
  editSubCategoryData?: EditSubCategoryData;
  onSuccess?: () => void;
  isModal?: boolean;
}

const AddSubcategory: React.FC<SubCategoryProps> = ({
  editSubCategoryData,
  onSuccess,
  isModal,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SubCategoryFormData>({
    mode: "onChange",
  });
  const addMutation = useAddSubCategoryMutation();
  const updateMutation = useUpdateSubCategoryMutation();
  const [subCategoryImage, setSubCategoryImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoryQuery();
  const { data: subCategoriesData } = useSubCategoryQuery();
  const categories = categoriesData?.categories || [];

  const watchSubCategoryName = watch("subCategoryName");
  const watchSubCategorySlug = watch("subCategorySlug");
  const watchCategoryId = watch("categoryId");

  // Validate unique name and trigger validation on name or category change
  useEffect(() => {
    if (watchSubCategoryName && watchCategoryId) {
      trigger("subCategoryName");
    }
  }, [watchSubCategoryName, watchCategoryId, trigger]);

  // Validate unique slug and trigger validation on slug change
  useEffect(() => {
    if (watchSubCategorySlug) {
      trigger("subCategorySlug");
    }
  }, [watchSubCategorySlug, trigger]);

  const validateUniqueName = (value: string) => {
    if (!value || !watchCategoryId) return true;
    const exists = (subCategoriesData?.subCategories || []).some(
      (subCat) =>
        subCat.subCategoryName.toLowerCase() === value.toLowerCase() &&
        subCat.categoryId === watchCategoryId &&
        subCat.subCategoryId !== editSubCategoryData?.id,
    );
    return !exists || "Subcategory name already exists in this category";
  };

  const validateUniqueSlug = (value: string) => {
    if (!value) return true;
    const exists = (subCategoriesData?.subCategories || []).some(
      (subCat) =>
        subCat.subCategorySlug.toLowerCase() === value.toLowerCase() &&
        subCat.subCategoryId !== editSubCategoryData?.id,
    );
    return !exists || "Subcategory slug already exists";
  };

  useEffect(() => {
    if (editSubCategoryData) {
      setValue("categoryId", editSubCategoryData.categoryId);
      setValue("subCategoryName", editSubCategoryData.subCategory);
      setValue("subCategorySlug", editSubCategoryData.subCategorySlug);
      setSubCategoryImage(editSubCategoryData.subCategoryImage || null);
    }
  }, [editSubCategoryData, setValue]);

  const fileUpload = async (file: File) => {
    try {
      setError(null); // Clear any existing error
      setIsUploading(true);
      console.log("Starting file upload in AddSubcategory:", file.name);
      const url = await uploadToS3(file);
      console.log("Upload successful, received URL:", url);
      setSubCategoryImage(url);
    } catch (err) {
      console.error("File upload failed in AddSubcategory:", err);
      setError(
        "Failed to upload image: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = () => {
    setSubCategoryImage(null);
    setError(null); // Clear error when image is deleted
  };

  const isFormValid =
    watch("categoryId") &&
    watch("subCategoryName") &&
    watch("subCategorySlug") &&
    subCategoryImage &&
    !isUploading &&
    !Object.keys(errors).length;

  const onSubmit: SubmitHandler<SubCategoryFormData> = async (data) => {
    try {
      const selectedCategory = categories.find(
        (c) => c.categoryId === data.categoryId,
      );

      const payload: Partial<SubCategory> = {
        subCategoryId: editSubCategoryData?.id || "",
        categoryId: data.categoryId,
        subCategoryName: data.subCategoryName,
        subCategorySlug: data.subCategorySlug,
        categoryName: selectedCategory?.categoryName || "",
        subCategoryImage: subCategoryImage || "",
        createdAt: editSubCategoryData?.createdAt || new Date().toISOString(),
      };

      if (editSubCategoryData?.id) {
        await updateMutation.mutateAsync({
          id: editSubCategoryData.id,
          data: payload,
        });
      } else {
        await addMutation.mutateAsync(payload as SubCategory);
      }
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save subcategory",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-center"
    >
      <Card className="px-3 py-3 mb-5 w-full max-w-xl" radius="none">
        {!isModal && (
          <CardHeader>
            <p className="text-md font-medium">
              {editSubCategoryData ? "Edit Subcategory" : "Add Subcategory"}
            </p>
          </CardHeader>
        )}
        <CardBody className="gap-6">
          {!isModal && <Divider className="-my-2" />}

          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Category selection is required" }}
            render={({ field }) => (
              <div className="mb-3">
                <label
                  className="text-sm font-medium mb-1 block"
                  id="category-label"
                >
                  Select Category
                </label>
                <Select
                  radius="none"
                  aria-labelledby="category-label"
                  placeholder="Select a category"
                  selectedKeys={field.value ? [field.value] : []}
                  isLoading={isCategoriesLoading}
                  isRequired={true}
                  className="w-full"
                  isInvalid={!!errors.categoryId}
                  errorMessage={errors.categoryId?.message}
                  onChange={(value) => field.onChange(value)}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
          />

          <Controller
            name="subCategoryName"
            control={control}
            rules={{
              required: "Subcategory name is required",
              validate: validateUniqueName,
            }}
            render={({ field }) => (
              <CustomInput
                label="Subcategory Name"
                type="text"
                placeholder="Enter subcategory name"
                isRequired={true}
                isInvalid={!!errors.subCategoryName}
                errorMessage={errors.subCategoryName?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="subCategorySlug"
            control={control}
            rules={{
              required: "Subcategory slug is required",
              validate: validateUniqueSlug,
            }}
            render={({ field }) => (
              <CustomInput
                label="Subcategory Slug"
                type="text"
                placeholder="Enter subcategory slug"
                isRequired={true}
                isInvalid={!!errors.subCategorySlug}
                errorMessage={errors.subCategorySlug?.message}
                {...field}
              />
            )}
          />

          <div className="mb-3">
            <label className="text-sm font-medium mb-1 block">
              Subcategory Image
            </label>
            <FileInput
              onChange={fileUpload}
              onDelete={handleImageDelete} // Add this prop
              accept="image/*"
              required={!subCategoryImage}
              title="Upload Subcategory Image"
              description="Drag & drop image or click to browse. Supported formats: JPEG, PNG"
              initialPreview={
                editSubCategoryData?.subCategoryImage || undefined
              }
              isUploading={isUploading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              color="secondary"
              radius="none"
              onPress={() => onSuccess?.()}
            >
              Cancel
            </Button>
            <Button
              radius="none"
              type="submit"
              color="primary"
              disabled={
                !isFormValid ||
                addMutation.isPending ||
                updateMutation.isPending
              }
            >
              {addMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editSubCategoryData
                  ? "Update"
                  : "Save"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default AddSubcategory;
