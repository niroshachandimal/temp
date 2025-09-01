import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { SlLocationPin } from "react-icons/sl";
import { FaRegEdit } from "react-icons/fa";
// import {FaRegHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { GrStatusGood } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import CustomButton from "./CustomButton";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { useQueries } from "@tanstack/react-query";
import { getCategoryById } from "../../api/service/apiCategory";
import NoDataFound from "../../pages/NoDataFound";

const ServiceCard = ({ data }: { data: any[] }) => {
  const navigate = useNavigate();

  const categoryQueries = useQueries({
    queries: data.map((item: any) => ({
      queryKey: ["GET_CATEGORY_BY_ID", item.categoryId],
      queryFn: () => getCategoryById(item.categoryId),
      enabled: !!item.categoryId,
      staleTime: 1 * 60 * 1000,
      refetchOnWindowFocus: false,
    })),
  });

  const categoryMap = categoryQueries.reduce((acc, query, index) => {
    const categoryId = data[index]?.categoryId;
    if (query.data) {
      acc[categoryId] = query.data?.category?.categoryName;
    }
    return acc;
  }, {} as Record<string, string>);

  const handleNavigate = (id: string, item: any, category: string) => {
    navigate(`/service/${id}/${item.slug}`, {
      state: { serviceData: item, category: category },
    });
  };

  return (
    <>
      {data?.length === 0 && <NoDataFound />}
      {data?.map((item: any, index: number) => (
        <div
          key={index}
          className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out w-full h-full"
        >
          <div
            className="relative"
            onClick={() =>
              handleNavigate(
                item?.serviceId,
                item,
                categoryMap[item.categoryId]
              )
            }
          >
            <div className="bg-gray-900 flex justify-center items-center cursor-pointer w-full h-[250px] relative overflow-hidden">
              <Image
                src={
                  item?.gallery?.[0]?.serviceImages?.[0] ||
                  "https://cdn.staging.gigmosaic.ca/common/fallbackimg.jpg"
                }
                alt={item.serviceTitle}
                className="object-cover w-full h-full"
                shadow="md"
                isZoomed
                radius="none"
              />
            </div>

            <div className="absolute top-0 ledt-0 p-3 z-20">
              <small className=" bg-gray-200 text-caption dark:text-gray-800 px-2 py-1 rounded-md ">
                {categoryMap[item.categoryId] || "Unknown Category"}
              </small>
            </div>

            <div className="absolute top-0 right-0  p-3 z-20 ">
              <small className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                <TbRosetteDiscountCheckFilled className="mr-1 text-lg" />
                Save $30
              </small>
            </div>
          </div>
          <Card radius="none">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start"></CardHeader>
            <CardBody className="overflow-visible -mt-3 pb-3">
              <div className="flex flex-initial mb-1 items-center line-clamp-1">
                <SlLocationPin
                  size={12}
                  className="mr-1 dark:text-darkModeTextSecondary"
                />
                {item?.location?.map((loc: string, index: number) => (
                  <small key={index} className="text-caption">
                    {`${loc?.city || ""} ${loc?.state || ""} `.trim()}
                  </small>
                ))}
              </div>
              <p className="text-subtitle1 line-clamp-2">
                {item?.serviceTitle || "No title"}
              </p>

              <div>
                <div className="flex items-center justify-between mt-2">
                  {/* rating */}
                  <div className="flex items-center gap-4">
                    <div className="text-caption2 py-[2px] px-1 rounded-full flex justify-center items-center">
                      {/* <FaRegHeart className="text-pink-500 hover:text-pink-600" size={16} /> */}
                      <FaHeart className="text-pink-500 " size={16} />
                    </div>
                    <div className="flex flex-initial justify-center items-center -ml-2">
                      <FaStar className="text-yellow-500  mr-1 " size={16} />
                      <small className="-mb-1 font-medium ">
                        4.5 <span className="text-caption2 "> (366)</span>
                      </small>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Price Display */}
                    <div className="flex items-center space-x-2">
                      <span className="text-subtitle1 font-bold text-gray-900">
                        ${item?.price || "No title"}
                      </span>
                      <small className=" text-caption line-through">
                        $12000
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-initial justify-center items-center gap-3">
                    <Link to={`/service/edit-service/${item?.serviceId}`}>
                      <div className="flex flex-initial justify-center items-center hover:underline hover:text-primary">
                        <FaRegEdit className="mr-1" size={14} />
                        <small className="text-caption ">Edit</small>
                      </div>
                    </Link>

                    {item.isActive ? (
                      <div className="flex flex-initial justify-center items-center hover:underline hover:text-primary">
                        <GrStatusGood className="mr-1 text-green-500" />
                        <small className="text-caption ">Active</small>
                      </div>
                    ) : (
                      <div className="flex flex-initial justify-center items-center hover:underline hover:text-primary">
                        <IoMdCloseCircleOutline
                          className="mr-1 text-red-500"
                          size={18}
                        />
                        <small className="text-caption">Inactive</small>
                      </div>
                    )}
                  </div>

                  <CustomButton
                    label="Apply Offers"
                    variant="ghost"
                    color="primary"
                    className="text-caption"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      ))}
    </>
  );
};

export default ServiceCard;
