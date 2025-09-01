import {
  addToast,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useFetchStaff } from "../../hooks/queries/useFetchData";
import moment from "moment";
import CustomChip from "./CustomChip";
import EditStaffModal from "../../pages/staff/EditStaffModal";
import CustomButton from "./CustomButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDeleteStaffMutation } from "../../hooks/mutations/useDeleteData";
import ConfirmToast from "./ConfirmToast";
import CustomPagination from "./CustomPagination";
import { useEffect, useMemo, useState } from "react";
import Loading from "./Loading";
import { apiClient } from "../../api/axios/apiClient";

const DataTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState([]);
  const { mutate } = useDeleteStaffMutation();

  // const { data, isLoading } = useFetchStaff({
  //   page: currentPage,
  //   limit: 8,
  // });

  useEffect(() => {
    const getStaffData = async () => {
      const res = await apiClient.get(
        `https://api.staging.gigmosaic.ca/service/api/v1/staff?page=${currentPage}&limit=11`
      );
      if (res?.data?.message == "Staff fetched successfully")
        console.log("Staff res: ", res);
      setData(res.data);
    };
    getStaffData();
  }, [currentPage]);

  console.log("Staff data: ", data);

  const apiData = useMemo(() => data?.staff || [], [data]);
  const totalPage = useMemo(() => data?.pages || 1, [data]);

  const columns = [
    {
      key: "id",
      label: "Staff ID",
    },
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "email",
      label: "email",
    },
    {
      key: "zipcode",
      label: "Zipcode",
    },
    {
      key: "address",
      label: "Address",
    },
    {
      key: "city",
      label: "City",
    },
    {
      key: "state",
      label: "State",
    },
    {
      key: "country",
      label: "Country",
    },
    {
      key: "PhoneNo",
      label: "Phone No",
    },
    {
      key: "createAt",
      label: "Regi Date",
    },

    {
      key: "status",
      label: "Status",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  const handleDelete = async (id: string) => {
    if (!id) {
      addToast({
        title: "Error",
        description: "Staff ID Cannot find in table",
        radius: "md",
        color: "danger",
      });
      return;
    }
    const isConfirmed = await ConfirmToast({
      title: "Are you sure?",
      message: "Do you want to delete this user?",
      type: "warning",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (isConfirmed) {
      mutate(id);
    }
  };

  return (
    <>
      {/* {isLoading ? <Loading label="Loading..." /> : <></>} */}
      <Table
        aria-label="staff Table"
        selectionMode="single"
        color="success"
        // className="mt-4"
        isStriped
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className="bg-gray-500 text-white font-bold uppercase"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data to display"}>
          {apiData?.map((item: any) => (
            <TableRow key={item?.staffId} className="cursor-pointer">
              <TableCell>{item?.staffId}</TableCell>
              <TableCell>{item?.fullName}</TableCell>
              <TableCell>{item?.email}</TableCell>
              <TableCell>{item?.zipCode}</TableCell>
              <TableCell>{item?.address}</TableCell>
              <TableCell>{item?.city}</TableCell>
              <TableCell>{item?.state}</TableCell>
              <TableCell>{item?.country}</TableCell>
              <TableCell>{item?.phoneNumber}</TableCell>
              <TableCell>
                {moment(item?.createAt).format("DD/MM/YYYY")}
              </TableCell>
              {/* <TableCell>View</TableCell> */}
              <TableCell>
                {item?.status === true ? (
                  <CustomChip label="Active" color="success" />
                ) : (
                  <CustomChip label="Inactive" color="danger" />
                )}
              </TableCell>
              <TableCell className="flex flex-initial">
                <EditStaffModal id={item.staffId} itemData={item} />
                <CustomButton
                  type="button"
                  isIconOnly
                  className="bg-transparent"
                  startContent={
                    <RiDeleteBin6Line
                      size={18}
                      className="text-red-500 hover:text-red-700"
                    />
                  }
                  onPress={() => handleDelete(item.staffId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-end py-5 mt-7">
        <CustomPagination
          page={currentPage}
          initialPage={1}
          total={totalPage}
          size="md"
          onChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default DataTable;
