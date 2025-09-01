import { ServiceData } from '../../../../utils/type';
import { useTranslation } from 'react-i18next';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { getCategoryById } from '../../../../service/categoryService';
import { useQueries } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Image } from '@heroui/react';
import { LuMapPin } from 'react-icons/lu';
import { BsStarFill } from 'react-icons/bs';
import CustomButton from '../../CustomButton';

const ServiceCardList = ({ data }: { data: ServiceData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const handleNavigate = () => {
    navigate('/service/booking');
  };

  return (
    <div>
      <div className="border-2 border-[#F5F5F5] rounded-lg p-5 mb-6 flex items-center flex-wrap">
        <div className="flex items-center mr-auto text-center">
          <div className="relative mr-4 max-w-[210px]">
            <Link
              to={`${routes.serviceDetails}/${data.serviceId}/${data.slug}`}
            >
              <Image
                src={
                  data?.gallery[0]?.serviceImages[0] ||
                  'https://cdn.staging.gigmosaic.ca/common/fallbackimg.jpg'
                }
                alt={data?.serviceTitle}
                className="object-cover h-36 w-52"
                shadow="md"
                isZoomed
                radius="none"
              />
              {/* <img
                className="rounded-lg h-36 object-cover w-52"
                alt="Service Image"
                src={data?.gallery[0]?.serviceImages[0]}
              /> */}
            </Link>
          </div>
          <div className="text-left">
            <div className="text-sm py-1 px-2 capitalize font-semibold">
              <small className=" bg-gray-200 text-gray-600  px-2 py-1 rounded-md font-medium">
                {categoryMap[data.categoryId] || 'Unknown Category'}
              </small>
            </div>
            {/* <Chip
              color="default"
              className=" "
              radius="sm"
            >
              Default
            </Chip> */}
            <h3 className="text-xl mb-2 text-ellipsis whitespace-nowrap font-semibold">
              <Link
                to={`${routes.serviceDetails}/${data.serviceId}/${data.slug}`}
              >
                {data.serviceTitle}
              </Link>
            </h3>
            <p className="mb-2 flex items-center text-base">
              <LuMapPin className="w-5 h-5 mr-2" color="#c2c9d1" />
              {data.location[0]?.city}, {data.location[0]?.state}
            </p>
            <div className="flex items-center">
              {/* <img
                            src={service?.gallery[0]?.serviceImages[0]}
                            alt="user"
                            className="w-9 h-9 rounded-full mr-2 max-w-full align-middle"
                          /> */}
              <span className="flex items-center">
                <BsStarFill color="#FFC107" size={15} className="mr-1" />
                4.9
              </span>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center justify-end flex-wrap ">
          <h6 className="font-bold text-2xl">
            {/* ${service?.priceAfterDiscount} */}
            <span className=" text-base  ml-1 font-semibold">
              ${data?.price}
            </span>
          </h6>
          <CustomButton
            label={t('services.0.button')}
            className="rounded-sm text-sm font-medium ml-8 py-2 px-6 bg-[#e4f4fd] text-primary"
            onPress={handleNavigate}
          ></CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardList;
