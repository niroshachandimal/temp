import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Switch,
  cn,
} from "@heroui/react";
import { Category, CategoriesModalProps } from "../../types";
import CustomInput from "../../components/ui/CustomInput";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../hook/useMutationData";
import FileInput from "../../components/ui/FileInput";
import { useCategoryQuery } from "../../hook/useQueryData";
import { uploadToS3 } from "../../utils/aws/s3FileUpload";

interface AddCategoryProps extends CategoriesModalProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  editCategoryData,
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
  } = useForm<Category>({
    mode: "onChange",
  });

  const addMutation = useAddCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const [categoryImage, setcategoryImage] = useState<string | null>(null); // Changed from fileUrl
  const [error, setError] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(
    editCategoryData?.featured || false,
  );
  const [isCertRequired, setIsCertRequired] = useState(
    editCategoryData?.certificate || false,
  );
  const [isUploading, setIsUploading] = useState(false);

  const { data: categoriesData } = useCategoryQuery();
  const categories = categoriesData?.categories || [];
  const watchCategoryName = watch("categoryName");
  const watchCategorySlug = watch("categorySlug");

  // Validate unique name and trigger validation on name change
  useEffect(() => {
    if (watchCategoryName) {
      trigger("categoryName");
    }
  }, [watchCategoryName, trigger]);

  // Validate unique slug and trigger validation on slug change
  useEffect(() => {
    if (watchCategorySlug) {
      trigger("categorySlug");
    }
  }, [watchCategorySlug, trigger]);

  const validateUniqueName = (value: string) => {
    if (!value) return true;
    const exists = categories.some(
      (cat) =>
        cat.categoryName.toLowerCase() === value.toLowerCase() &&
        cat.categoryId !== editCategoryData?.id,
    );
    return !exists || "Category name already exists";
  };

  const validateUniqueSlug = (value: string) => {
    if (!value) return true;
    const exists = categories.some(
      (cat) =>
        cat.categorySlug.toLowerCase() === value.toLowerCase() &&
        cat.categoryId !== editCategoryData?.id,
    );
    return !exists || "Category slug already exists";
  };

  useEffect(() => {
    if (editCategoryData) {
      setValue("categoryName", editCategoryData.category);
      setValue("categorySlug", editCategoryData.categorySlug);
      setcategoryImage(editCategoryData.categoryImage || null);
      setIsFeatured(editCategoryData.featured || false);
      setIsCertRequired(editCategoryData.certificate || false);
    }
  }, [editCategoryData, setValue]);

  const fileUpload = async (file: File) => {
    try {
      setError(null); // Clear any existing error
      setIsUploading(true);
      console.log("Starting file upload in AddCategory:", file.name);
      const url = await uploadToS3(file);
      console.log("Upload successful, received URL:", url);
      setcategoryImage(url);
    } catch (err) {
      console.error("File upload failed in AddCategory:", err);
      setError(
        "Failed to upload image: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = () => {
    setcategoryImage(null);
    setError(null); // Clear error when image is deleted
  };

  const isFormValid =
    watch("categoryName") &&
    watch("categorySlug") &&
    categoryImage &&
    !isUploading &&
    !Object.keys(errors).length;

  const onSubmit: SubmitHandler<Category> = async (data) => {
    try {
      const payload = {
        categoryName: data.categoryName,
        categorySlug: data.categorySlug,
        categoryImage: categoryImage || "",
        isFeatured,
        isCertificateRequired: isCertRequired,
        categoryId: editCategoryData?.id || "",
        createdAt: editCategoryData?.createdAt || new Date().toISOString(),
      };

      if (editCategoryData?.id) {
        await updateMutation.mutateAsync({
          id: editCategoryData.id,
          data: payload,
        });
      } else {
        await addMutation.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
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
              {editCategoryData ? "Edit Category" : "Add Category"}
            </p>
          </CardHeader>
        )}
        <CardBody className="gap-6">
          {!isModal && <Divider className="-my-2" />}

          <Controller
            name="categoryName"
            control={control}
            rules={{
              required: "Category name is required",
              validate: validateUniqueName,
            }}
            render={({ field }) => (
              <CustomInput
                label="Category Name"
                type="text"
                placeholder="Enter category name"
                isRequired={true}
                isInvalid={!!errors.categoryName}
                errorMessage={errors.categoryName?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="categorySlug"
            control={control}
            rules={{
              required: "Category slug is required",
              validate: validateUniqueSlug,
            }}
            render={({ field }) => (
              <CustomInput
                label="Category Slug"
                type="text"
                placeholder="Enter category slug"
                isRequired={true}
                isInvalid={!!errors.categorySlug}
                errorMessage={errors.categorySlug?.message}
                {...field}
              />
            )}
          />

          <div className="mb-3">
            <label className="text-sm font-medium mb-1 block">
              Category Image
            </label>
            <FileInput
              onChange={fileUpload}
              onDelete={handleImageDelete} // Add this prop
              accept="image/*"
              required={!categoryImage}
              title="Upload Category Image"
              description="Drag & drop image or click to browse. Supported formats: JPEG, PNG"
              initialPreview={editCategoryData?.categoryImage}
              isUploading={isUploading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Is Featured?</span>
                <Switch
                  classNames={{
                    wrapper: "p-2 w-[60px]",
                    thumb: cn(
                      "w-5 h-5 border-2 shadow-lg",
                      "group-data-[hover=true]:border-primary",
                      "group-data-[selected=true]:ms-7",
                      "group-data-[pressed=true]:w-8",
                      "group-data-[selected]:group-data-[pressed]:ms-6",
                    ),
                  }}
                  size="md"
                  endContent={<span className="text-sm">No</span>}
                  startContent={<span className="text-sm">Yes</span>}
                  isSelected={isFeatured}
                  onValueChange={(isSelected) => {
                    setIsFeatured(isSelected);
                    setValue("isFeatured", isSelected); // Changed from featured to isFeatured
                  }}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Is Certificate Required?
                </span>
                <Switch
                  classNames={{
                    wrapper: "p-2 w-[60px]",
                    thumb: cn(
                      "w-5 h-5 border-2 shadow-lg",
                      "group-data-[hover=true]:border-primary",
                      "group-data-[selected=true]:ms-7",
                      "group-data-[pressed=true]:w-8",
                      "group-data-[selected]:group-data-[pressed]:ms-6",
                    ),
                  }}
                  size="md"
                  endContent={<span className="text-sm">No</span>}
                  startContent={<span className="text-sm">Yes</span>}
                  isSelected={isCertRequired}
                  onValueChange={(isSelected) => {
                    setIsCertRequired(isSelected);
                    setValue("isCertificateRequired", isSelected); // Changed from certificate to isCertificateRequired
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              color="secondary"
              radius="none"
              onPress={() => onSuccess?.()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              radius="none"
              color="primary"
              disabled={
                !isFormValid ||
                addMutation.isPending ||
                updateMutation.isPending
              }
            >
              {addMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editCategoryData
                  ? "Update"
                  : "Save"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default AddCategory;
