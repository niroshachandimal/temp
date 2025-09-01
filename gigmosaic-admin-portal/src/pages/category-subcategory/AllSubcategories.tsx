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
  ModalHeader,
  ModalBody,
  Pagination,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { useSubCategoryQuery, useCategoryQuery } from "../../hook/useQueryData";
import { useDeleteSubCategoryMutation } from "../../hook/useMutationData";
import CustomButton from "../../components/ui/CustomButton";
import AddSubcategory from "./AddSubcategory";
import { SubCategory, EditSubCategoryData } from "../../types";
import { FiEdit, FiFilePlus, FiTrash, FiSearch } from "react-icons/fi";

const AllSubcategories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSubCategoryData, setEditSubCategoryData] = useState<
    EditSubCategoryData | undefined
  >(undefined);
  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } =
    useSubCategoryQuery();
  const { data: categoriesData } = useCategoryQuery();
  const deleteMutation = useDeleteSubCategoryMutation();
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "subCategoryName",
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

  // Create a map of categoryId to categoryName
  const categoryMap = useMemo(() => {
    return (categoriesData?.categories || []).reduce(
      (acc, category) => {
        acc[category.categoryId] = category.categoryName;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [categoriesData]);

  const handleEdit = (subcategory: SubCategory) => {
    setEditSubCategoryData({
      id: subcategory.subCategoryId,
      categoryId: subcategory.categoryId,
      subCategory: subcategory.subCategoryName,
      subCategorySlug: subcategory.subCategorySlug,
      subCategoryImage: subcategory.subCategoryImage,
      createdAt: subcategory.createdAt,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (subCategoryId: string) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      deleteMutation.mutate(subCategoryId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditSubCategoryData(undefined);
  };

  const columns = [
    {
      name: "IMAGE", // Add new column
      uid: "subCategoryImage",
      sortable: false,
    },
    { name: "SUBCATEGORY NAME", uid: "subCategoryName", sortable: true },
    { name: "SLUG", uid: "subCategorySlug", sortable: true },
    { name: "CATEGORY", uid: "categoryId", sortable: true },
    { name: "", uid: "actions", sortable: false },
  ];

  const filteredItems = useMemo(() => {
    const items = subCategoriesData?.subCategories || [];
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.subCategoryName.toLowerCase().includes(query) ||
        item.subCategorySlug.toLowerCase().includes(query) ||
        categoryMap[item.categoryId]?.toLowerCase().includes(query),
    );
  }, [subCategoriesData?.subCategories, searchQuery, categoryMap]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof SubCategory];
      const second = b[sortDescriptor.column as keyof SubCategory];
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

  const renderCell = (subcategory: SubCategory, columnKey: React.Key) => {
    switch (columnKey) {
      case "subCategoryImage":
        return (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={subcategory.subCategoryImage}
              alt={subcategory.subCategoryName}
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "subCategoryName":
        return subcategory.subCategoryName;
      case "subCategorySlug":
        return subcategory.subCategorySlug;
      case "categoryId":
        return categoryMap[subcategory.categoryId] || "Unknown";
      case "actions":
        return (
          <div className="flex justify-end gap-2">
            <CustomButton
              isIconOnly
              variant="light"
              color="primary"
              size="sm"
              onPress={() => handleEdit(subcategory)}
              label="Edit"
            >
              <FiEdit size={20} className="text-primary" />
            </CustomButton>
            <CustomButton
              isIconOnly
              variant="light"
              color="danger"
              size="sm"
              onPress={() => handleDelete(subcategory.subCategoryId)}
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

  if (isSubCategoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col mb-2 sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl font-bold">Subcategories</h1>
      </div>
      <div className="flex flex-col mb-4 sm:flex-row justify-between items-start sm:items-center gap-3">
        <Select
          size="sm"
          label="Rows per page"
          labelPlacement="inside"
          placeholder={rowsPerPage.toString()}
          className="w-36"
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
            placeholder="Search subcategories..."
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
            label="Add Subcategory"
            radius="none"
          />
        </div>
      </div>

      <Table
        radius="none"
        aria-label="Subcategories table"
        className="w-full [&_td:first-child]:rounded-none [&_td:last-child]:rounded-none"
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
              Total {sortedItems.length} subcategories
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
                {searchQuery
                  ? "No subcategories found matching your search"
                  : "No subcategories available"}
              </TableCell>
            </TableRow>
          ) : (
            paginatedItems.map((item: SubCategory) => (
              <TableRow key={item.subCategoryId}>
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
                {editSubCategoryData ? "Edit Subcategory" : "Add Subcategory"}
              </ModalHeader>
              <ModalBody>
                <AddSubcategory
                  editSubCategoryData={editSubCategoryData}
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

export default AllSubcategories;
