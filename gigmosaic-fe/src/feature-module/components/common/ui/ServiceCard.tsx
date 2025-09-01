/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardBody, CardHeader, Image } from '@heroui/react';
import { SlLocationPin } from 'react-icons/sl';
// import {FaRegHeart } from "react-icons/fa";
import { FaStar } from 'react-icons/fa6';
import { FaHeart } from 'react-icons/fa';
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb';
// import CustomButton from '../../CustomButton';
// import { useTranslation } from 'react-i18next';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { getCategoryById } from '../../../../service/categoryService';
import { ServiceData } from '../../../../utils/type';

const ServiceCard = ({ data }: { data: ServiceData }) => {
  // const navigate = useNavigate();
  // const { t } = useTranslation();
  const routes = all_routes;

  const categoryQueries = useQueries({
    queries: [
      {
        queryKey: ['GET_CATEGORY_BY_ID', data.categoryId],
        queryFn: () => getCategoryById(data.categoryId),
        enabled: !!data.categoryId,
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
      // Add other queries if needed
    ],
  });

  // Create a map of category IDs to their names
  const categoryMap = categoryQueries.reduce(
    (acc, query) => {
      const categoryId = query?.data?.category?.categoryId; // Ensure we get categoryId from the query result
      if (categoryId && query.data) {
        const categoryData = query.data as {
          category: { categoryName: string };
        };
        acc[categoryId] = categoryData.category.categoryName;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  // const handleNavigate = (id: number) => {
  //   navigate(`/service/booking/${id}`);
  // };

  return (
    <>
      <div className="cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out w-full min-h-[350px] max-h-[350px]">
        <div className="relative">
          <div className="bg-gray-900 flex justify-center items-center cursor-pointer w-full h-[200px] relative overflow-hidden">
            <Link
              to={`${routes.serviceDetails}/${data.serviceId}/${data.slug}`}
            >
              <Image
                src={
                  data?.gallery[0]?.serviceImages[0] ||
                  'https://cdn.staging.gigmosaic.ca/common/fallbackimg.jpg'
                }
                alt={data?.serviceTitle}
                className="object-cover w-full h-full"
                shadow="md"
                isZoomed
                radius="none"
              />
            </Link>
          </div>

          <div className="absolute top-0 ledt-0 p-3 z-20">
            <small className=" bg-gray-200 text-gray-600  px-2 py-1 rounded-md font-medium">
              {categoryMap[data.categoryId] || 'Unknown Category'}
            </small>
          </div>

          <div className="absolute top-0 right-0  p-3 z-20 ">
            <small className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
              <TbRosetteDiscountCheckFilled className="mr-1 text-lg" />
              Save $30
            </small>
          </div>
        </div>
        <Card radius="none" className="h-[150px] overflow-hidden">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start"></CardHeader>
          <CardBody className="overflow-visible -mt-3 pb-3">
            <div className="flex flex-initial mb-1 items-center ">
              <div>
                <SlLocationPin size={12} className="mr-1" />
              </div>

              <small className="line-clamp-1">
                {data.location[0]?.city}, {data.location[0]?.state}
              </small>
            </div>
            <Link
              to={`${routes.serviceDetails}/${data.serviceId}/${data.slug}`}
            >
              <p className="text-subtitle1 line-clamp-2">
                {data?.serviceTitle || 'No title'}
              </p>
            </Link>

            <div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <div className="text-caption2py-[2px] px-1 rounded-full flex justify-center items-center">
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
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      ${data?.price || 'No title'}
                    </span>
                    <small className=" text-gray-500 line-through">
                      $12000
                    </small>
                  </div>
                </div>
              </div>
            </div>
            {/* 
            <div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-initial justify-center items-center gap-3"></div>

                <CustomButton
                  label={t('services.0.button')}
                  variant="ghost"
                  color="primary"
                  className="text-gray-600 font-medium"
                  onPress={() => handleNavigate(data.serviceId)}
                />
              </div>
            </div> */}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default ServiceCard;
