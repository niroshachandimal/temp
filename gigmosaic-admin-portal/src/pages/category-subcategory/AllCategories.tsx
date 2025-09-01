import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { useCategoryQuery } from "../../hook/useQueryData";
import { useDeleteCategoryMutation } from "../../hook/useMutationData";
import CustomButton from "../../components/ui/CustomButton";
import AddCategory from "./AddCategory";
import { Category, CategoriesModalProps } from "../../types";
import { FiEdit, FiFilePlus, FiTrash, FiSearch } from "react-icons/fi";

type EditCategoryData = NonNullable<CategoriesModalProps["editCategoryData"]>;

const AllCategories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<
    EditCategoryData | undefined
  >(undefined);
  const { data: categoriesData, isLoading } = useCategoryQuery();
  const deleteMutation = useDeleteCategoryMutation();
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "categoryName",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const rowsPerPageOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "20", label: "20" },
  ];

  const handleEdit = (category: Category) => {
    setEditCategoryData({
      id: category.categoryId,
      category: category.categoryName,
      categorySlug: category.categorySlug,
      categoryImage: category.categoryImage,
      featured: category.isFeatured,
      certificate: category.isCertificateRequired,
      createdAt: category.createdAt,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(categoryId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditCategoryData(undefined);
  };

  const filteredItems = useMemo(() => {
    const items = categoriesData?.categories || [];
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.categoryName.toLowerCase().includes(query) ||
        item.categorySlug.toLowerCase().includes(query),
    );
  }, [categoriesData?.categories, searchQuery]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Category];
      const second = b[sortDescriptor.column as keyof Category];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);

  const pages = Math.ceil((sortedItems?.length || 0) / rowsPerPage);

  const columns = [
    {
      name: "IMAGE", // Add new column
      uid: "categoryImage",
      sortable: false,
    },
    {
      name: "CATEGORY NAME",
      uid: "categoryName",
      sortable: true,
    },
    {
      name: "SLUG",
      uid: "categorySlug",
      sortable: true,
    },
    {
      name: "FEATURED",
      uid: "isFeatured",
      sortable: true,
    },
    {
      name: "CERTIFICATE",
      uid: "isCertificateRequired",
      sortable: true,
    },
    {
      name: "",
      uid: "actions",
      sortable: false,
    },
  ];

  const renderCell = (category: Category, columnKey: React.Key) => {
    switch (columnKey) {
      case "categoryImage":
        return (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={category.categoryImage}
              alt={category.categoryName}
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "categoryName":
        return category.categoryName;
      case "categorySlug":
        return category.categorySlug;
      case "isFeatured":
        return category.isFeatured ? "Yes" : "No";
      case "isCertificateRequired":
        return category.isCertificateRequired ? "Required" : "Not Required";
      case "actions":
        return (
          <div className="flex justify-end gap-2">
            <CustomButton
              isIconOnly
              variant="light"
              color="primary"
              size="sm"
              onPress={() => handleEdit(category)}
              label="Edit"
            >
              <FiEdit size={20} className="text-primary" />
            </CustomButton>
            <CustomButton
              isIconOnly
              variant="light"
              color="danger"
              size="sm"
              onPress={() => handleDelete(category.categoryId)}
              label="Delete"
            >
              <FiTrash size={20} className="text-danger" />
            </CustomButton>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col mb-5 sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl font-bold">Categories</h1>
      </div>
      <div className="flex flex-col mb-2 sm:flex-row justify-between items-start sm:items-center gap-3">
        <Select
          size="sm"
          label="Rows per page"
          className="w-32"
          placeholder={rowsPerPage.toString()}
          selectedKeys={[rowsPerPage.toString()]}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
          radius="none"
        >
          {rowsPerPageOptions.map((option) => (
            <SelectItem key={option.value} name-value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <div className="flex w-full justify-end gap-3">
          <Input
            isClearable
            radius="none"
            className="w-full sm:max-w-[44%]"
            placeholder="Search categories..."
            startContent={<FiSearch className="text-default-300" />}
            value={searchQuery}
            onClear={() => setSearchQuery("")}
            onValueChange={(value) => setSearchQuery(value)}
          />
          <CustomButton
            size="md"
            variant="solid"
            color="primary"
            onPress={() => setIsModalOpen(true)}
            startContent={<FiFilePlus size={24} />}
            label="Add Category"
            radius="none"
          />
        </div>
      </div>

      <Table
        radius="none"
        aria-label="Categories table"
        className="w-full"
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) =>
          setSortDescriptor({
            ...descriptor,
            column: String(descriptor.column),
          })
        }
        bottomContent={
          <div className="flex justify-between items-center px-2 py-2">
            <span className="text-small text-default-400">
              Total {sortedItems.length} categories
            </span>
            <Pagination
              radius="none"
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.uid}
              align="start"
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {paginatedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="text-center">
                  {searchQuery
                    ? "No categories found matching your search"
                    : "No categories available"}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedItems.map((item: Category) => (
              <TableRow key={item.categoryId}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(item, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
        classNames={{
          base: "rounded-none",
          header: "rounded-none",
          body: "rounded-none",
          footer: "rounded-none",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editCategoryData ? "Edit Category" : "Add Category"}
              </ModalHeader>
              <ModalBody>
                <AddCategory
                  editCategoryData={editCategoryData}
                  onSuccess={() => {
                    onClose();
                    handleCloseModal();
                  }}
                  isModal={true}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AllCategories;
