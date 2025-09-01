import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
  Tooltip,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import { apiClient } from "../../api";
import logger from "../../utils/logger";

import {
  CustomInput,
  CustomTextArea,
  CustomButton,
  CustomChip,
  Table,
  ToggleSwitch,
  CustomAutocomplete,
  CustomPagination,
} from "../../components/ui";

interface FAQ {
  _id: string;
  faqId: string;
  category: "customer" | "provider" | "general";
  question: string;
  answer: string;
  isEnabled: boolean;
  user?: string;
}

const FAQManager = () => {
  const queryClient = useQueryClient();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onOpenChange: onFormOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Omit<FAQ, "_id" | "faqId" | "isEnabled">
  >({
    category: "customer",
    question: "",
    answer: "",
    user: "admin",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    question?: string;
    answer?: string;
    category?: string;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "customer" | "provider" | "general"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Category options for the autocomplete dropdown
  const categoryOptions = [
    { label: "All Categories", id: "all" },
    { label: "Customer FAQs", id: "customer" },
    { label: "Provider FAQs", id: "provider" },
    { label: "General FAQs", id: "general" },
  ];

  // Fetch all FAQs using Tanstack Query
  const {
    data: faqs = [],
    isLoading,
    error,
  } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/api/v1/faq?includeDisabled=true");
        return res.data.faqs || [];
      } catch (error) {
        logger.error("Error fetching FAQs", error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Filter FAQs based on search query and category filter
  const filteredFaqs = React.useMemo(() => {
    let filtered = faqs;

    // First apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((faq) => faq.category === categoryFilter);
    }

    // Then apply search filter (only on question, answer, and FAQ ID)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      filtered = filtered.filter((faq) => {
        if (!faq) return false;

        const faqId = faq.faqId || "";
        const question = faq.question || "";
        const answer = faq.answer || "";

        return (
          faqId.toLowerCase().includes(query) ||
          question.toLowerCase().includes(query) ||
          answer.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [faqs, searchQuery, categoryFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Check if we have original data
  const hasOriginalData = faqs.length > 0;

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: async (payload: Omit<FAQ, "_id" | "faqId" | "isEnabled">) => {
      try {
        const res = await apiClient.post("/api/v1/faq", payload);
        return res.data;
      } catch (error) {
        logger.error("Error creating FAQ", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      resetForm();
      onFormOpenChange();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<FAQ, "_id" | "faqId" | "isEnabled">;
    }) => {
      try {
        const res = await apiClient.put(`/api/v1/faq/${id}`, payload);
        return res.data;
      } catch (error) {
        logger.error("Error updating FAQ", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      resetForm();
      onFormOpenChange();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await apiClient.delete(`/api/v1/faq/${id}`);
        return res.data;
      } catch (error) {
        logger.error("Error deleting FAQ", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      onDeleteOpenChange();
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await apiClient.patch(`/api/v1/faq/${id}/toggle`);
        return res.data;
      } catch (error) {
        console.error("Error toggling FAQ status:", error);
        logger.error("Error toggling FAQ status", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });

  const handleSubmit = () => {
    // Clear previous validation errors
    setValidationErrors({});

    // Validate required fields
    const errors: {
      question?: string;
      answer?: string;
      category?: string;
    } = {};

    if (!formData.question.trim()) {
      errors.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      errors.answer = "Answer is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    // If there are validation errors, don't submit
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (isEditing && editId) {
      updateMutation.mutate({ id: editId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setIsEditing(true);
    setEditId(faq._id);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      user: faq.user || "admin",
    });
    onFormOpen();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "customer",
      question: "",
      answer: "",
      user: "admin",
    });
    setIsEditing(false);
    setEditId(null);
    setValidationErrors({});
  };

  const openAddForm = () => {
    resetForm();
    onFormOpen();
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchChange = (value: string) => {
    try {
      const sanitizedValue = value || "";
      setSearchQuery(sanitizedValue);
    } catch (error) {
      console.error("Error handling search change:", error);
      setSearchQuery("");
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "customer":
        return "Customer FAQs";
      case "provider":
        return "Provider FAQs";
      case "general":
        return "General (Both)";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "customer":
        return "primary";
      case "provider":
        return "secondary";
      case "general":
        return "success";
      default:
        return "default";
    }
  };

  const columns = [
    { key: "faqId", label: "FAQ ID" },
    { key: "category", label: "Category" },
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  // Render content based on different states
  const renderTableContent = () => {
    try {
      if (isLoading) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Failed to load FAQs</p>
              <CustomButton
                color="primary"
                onPress={() =>
                  queryClient.invalidateQueries({ queryKey: ["faqs"] })
                }
                label="Retry"
              />
            </div>
          </div>
        );
      }

      if (!hasOriginalData) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No data to display</p>
              <CustomButton
                color="primary"
                onPress={openAddForm}
                label="Add First FAQ"
              />
            </div>
          </div>
        );
      }

      // Check if we have filtered results
      if (filteredFaqs.length === 0) {
        if (searchQuery.trim().length > 0) {
          return (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    No results found
                  </p>
                  <p className="text-sm text-gray-500">
                    No FAQs match "{searchQuery}"
                  </p>
                </div>
                <CustomButton
                  color="primary"
                  variant="bordered"
                  onPress={clearSearch}
                  label="Clear Search"
                />
              </div>
            </div>
          );
        } else if (categoryFilter !== "all") {
          return (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">
                  No FAQs found in {getCategoryLabel(categoryFilter)}
                </p>
                <CustomButton
                  color="primary"
                  variant="bordered"
                  onPress={() => setCategoryFilter("all")}
                  label="Show All Categories"
                />
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No data to display</p>
              </div>
            </div>
          );
        }
      }

      return (
        <Table columns={columns} data={paginatedFaqs}>
          {Array.isArray(paginatedFaqs) &&
            paginatedFaqs.map((faq) => {
              if (!faq || !faq._id) return null;

              return (
                <TableRow key={faq._id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Tooltip
                      content={`FAQ ID: ${faq.faqId}`}
                      className="bg-gray-900 text-white border border-gray-700 shadow-lg"
                      placement="top"
                      showArrow={true}
                      delay={200}
                    >
                      <span>{faq.faqId}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <CustomChip
                      label={getCategoryLabel(faq.category)}
                      color={getCategoryColor(faq.category)}
                      size="sm"
                      variant="flat"
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <Tooltip
                      content={faq.question}
                      className="bg-gray-900 text-white border border-gray-700 shadow-lg max-w-xs"
                      placement="top"
                      showArrow={true}
                      delay={200}
                    >
                      <span>{faq.question}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <Tooltip
                      content={faq.answer}
                      className="bg-gray-900 text-white border border-gray-700 shadow-lg max-w-md"
                      placement="top"
                      showArrow={true}
                      delay={200}
                    >
                      <div className="text-gray-600 line-clamp-2 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <ToggleSwitch
                      size="sm"
                      isSelected={!!faq.isEnabled}
                      onValueChange={() => {
                        try {
                          handleToggleStatus(faq._id);
                        } catch (error) {
                          console.error("Error toggling FAQ status:", error);
                        }
                      }}
                      color={faq.isEnabled ? "success" : "danger"}
                      className="scale-75"
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <CustomButton
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => {
                        try {
                          handleEdit(faq);
                        } catch (error) {
                          console.error("Error editing FAQ:", error);
                        }
                      }}
                    >
                      <FaRegEdit className="text-primary" size={16} />
                    </CustomButton>
                    <CustomButton
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => {
                        try {
                          handleDelete(faq._id);
                        } catch (error) {
                          console.error("Error deleting FAQ:", error);
                        }
                      }}
                    >
                      <RiDeleteBin6Line
                        className="text-red-500 hover:text-red-700"
                        size={16}
                      />
                    </CustomButton>
                  </TableCell>
                </TableRow>
              );
            })}
        </Table>
      );
    } catch (error) {
      console.error("Error rendering table content:", error);
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No data to display</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-1 md:p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <CustomButton
            color="primary"
            size="sm"
            startContent={<FaPlus />}
            onPress={openAddForm}
            label="Add FAQ"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex gap-2">
            <CustomInput
              placeholder="Search FAQs..."
              type="text"
              className="md:w-[350px]"
              value={searchQuery}
              onValueChange={handleSearchChange}
            />
          </div>

          <div className="flex gap-2">
            <CustomAutocomplete
              label="Filter by Category"
              placeholder="Select category"
              defaultItems={categoryOptions}
              defaultSelectedKey={categoryFilter}
              onSelectionChange={(selectedId) => {
                if (selectedId) {
                  setCategoryFilter(
                    selectedId as "all" | "customer" | "provider" | "general"
                  );
                }
              }}
              size="sm"
              width="none"
              variant="bordered"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h2 className="text-lg font-semibold mb-1">
            All FAQs
            {filteredFaqs.length !== faqs.length && (
              <span className="text-sm text-gray-500 ml-2">
                ({filteredFaqs.length} of {faqs.length} results)
              </span>
            )}
          </h2>

          {renderTableContent()}

          {/* Pagination */}
          {filteredFaqs.length > 0 && (
            <div className="flex justify-end items-end py-5 mt-7">
              <CustomPagination
                page={currentPage}
                initialPage={1}
                total={totalPages}
                size="md"
                onChange={handlePageChange}
                onItemPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit FAQ Modal */}
      <Modal isOpen={isFormOpen} onOpenChange={onFormOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditing ? "Edit FAQ" : "Add New FAQ"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="relative z-0">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Category
                    </label>
                    <RadioGroup
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          category: value as
                            | "customer"
                            | "provider"
                            | "general",
                        })
                      }
                      orientation="horizontal"
                      classNames={{
                        wrapper: "gap-4",
                      }}
                    >
                      <Radio
                        value="customer"
                        classNames={{
                          label: "text-sm text-gray-700",
                        }}
                      >
                        Customer FAQs
                      </Radio>
                      <Radio
                        value="provider"
                        classNames={{
                          label: "text-sm text-gray-700",
                        }}
                      >
                        Provider FAQs
                      </Radio>
                      <Radio
                        value="general"
                        classNames={{
                          label: "text-sm text-gray-700",
                        }}
                      >
                        General (Both)
                      </Radio>
                    </RadioGroup>
                    {validationErrors.category && (
                      <p className="text-danger text-sm mt-1">
                        {validationErrors.category}
                      </p>
                    )}
                  </div>

                  <div className="relative z-0">
                    <CustomInput
                      label="Question"
                      placeholder="Enter your question"
                      value={formData.question}
                      onValueChange={(value) =>
                        setFormData({ ...formData, question: value })
                      }
                      isRequired
                      type="text"
                    />
                    {validationErrors.question && (
                      <p className="text-danger text-sm mt-1">
                        {validationErrors.question}
                      </p>
                    )}
                  </div>

                  <div className="relative z-0">
                    <CustomTextArea
                      label="Answer"
                      placeholder="Enter your answer"
                      value={formData.answer}
                      onValueChange={(value) =>
                        setFormData({ ...formData, answer: value })
                      }
                      isRequired
                      minRows={8}
                      maxRows={12}
                    />
                    {validationErrors.answer && (
                      <p className="text-danger text-sm mt-1">
                        {validationErrors.answer}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  variant="light"
                  onPress={onClose}
                  label="Cancel"
                />
                <CustomButton
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={
                    createMutation.isPending || updateMutation.isPending
                  }
                  label={isEditing ? "Update FAQ" : "Add FAQ"}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this FAQ?</p>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  variant="light"
                  onPress={onClose}
                  label="Cancel"
                />
                <CustomButton
                  color="danger"
                  onPress={confirmDelete}
                  isLoading={deleteMutation.isPending}
                  label="Delete"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FAQManager;
