import { Card, CardBody, Image } from "@heroui/react";
import { FaHeart, FaRegEdit, FaStar } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { SlLocationPin } from "react-icons/sl";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useFetchCategoryById } from "../../hooks/queries/useFetchData";
import { useQueries } from "@tanstack/react-query";
import { getCategoryById } from "../../api/service/apiCategory";
import NoDataFound from "../../pages/NoDataFound";

const ServiceCardList = ({ data }: { data: any[] }) => {
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

  const handleNavigate = (id: string, item: any) => {
    navigate(`/service/${id}/${item.slug}`, {
      state: { serviceData: item },
    });
  };

  return (
    <>
      {data?.length === 0 && <NoDataFound />}
      {data?.map((item: any, index: number) => (
        <div
          key={index}
          className="flex flex-initial cursor-pointer  transition-all duration-300 ease-in-out"
        >
          <div
            onClick={() => handleNavigate(item?.serviceId, item)}
            className=" bg-gray-900 flex justify-center items-center cursor-pointer max-h-[152px] w-[308px] relative overflow-hidden rounded-sm"
          >
            <Image
              src={
                item?.gallery?.[0]?.serviceImages?.[0] ||
                "https://cdn.staging.gigmosaic.ca/common/fallbackimg.jpg"
              }
              alt={item.serviceTitle}
              className=" object-contain w-full h-full  relative"
              shadow="md"
              isZoomed
              radius="none"
            />
          </div>

          <Card radius="none" className="w-full ">
            <CardBody className="mr-2 ">
              <div className="flex justify-between items-center">
                <div className="absolute top-0 left-0 py-2 ml-2 z-20">
                  <small className=" bg-gray-200 text-caption dark:text-gray-800 px-2 py-1 rounded-md ">
                    {categoryMap[item.categoryId] || "Unknown Category"}
                  </small>
                </div>

                {/* Rating and discount */}
                <div className="absolute top-0 right-0 py-2 mr-2 z-20">
                  <div className="flex flex-initial items-center gap-4">
                    <div className="text-caption2 py-[2px] px-1 rounded-full flex justify-center items-center">
                      {/* <FaRegHeart
               className="text-pink-500 hover:text-pink-600"
               size={16}
             /> */}
                      <FaHeart className="text-pink-500 " size={16} />
                    </div>
                    <div className="flex flex-initial justify-center items-center -ml-2">
                      <FaStar className="text-yellow-500  mr-1 " size={16} />
                      <small className="-mb-1 font-medium ">
                        4.5 <span className="text-caption2 "> (366)</span>
                      </small>
                    </div>

                    <small className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      <TbRosetteDiscountCheckFilled className="mr-1 text-lg" />
                      Save $30
                    </small>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-initial mb-2 items-center line-clamp-1 mt-7 ">
                <SlLocationPin size={12} className="mr-1" />
                {item?.location?.map((loc: string, index: number) => (
                  <small key={index} className="text-caption">
                    {loc?.address || "No Location"}
                  </small>
                ))}
              </div>

              {/* Title */}
              <div className="flex flex-initial justify-between items-center">
                <p className="text-subtitle1 line-clamp-1 mr-2">
                  {item?.serviceTitle || "No title"}
                </p>
                <div className=" text-[15px]flex items-center space-x-2">
                  <span className="text-subtitle1 ">${item?.price || 0}</span>
                  <small className="text-caption line-through">$12000</small>
                </div>
              </div>

              {/* Action btn */}
              <div className="flex flex-initial justify-between items-end mt-3">
                <div className="flex flex-initial justify-center items-center gap-3">
                  <Link to={`/service/edit-service/${item?.serviceId}`}>
                    <div className="flex flex-initial justify-center items-center hover:underline hover:text-primary">
                      <FaRegEdit className="mr-1" size={14} />
                      <small className="text-caption">Edit</small>
                    </div>
                  </Link>

                  {item?.isActive ? (
                    <div className="flex flex-initial justify-center items-center hover:underline hover:text-primary">
                      <GrStatusGood className="mr-1 text-green-500" />
                      <small className="text-caption">Active</small>
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
            </CardBody>
          </Card>
          {/* </Link> */}
        </div>
      ))}
    </>
  );
};

export default ServiceCardList;
