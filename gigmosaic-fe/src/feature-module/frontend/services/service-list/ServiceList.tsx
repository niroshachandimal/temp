/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from 'react-router-dom';
import FilterComponent from '../../../components/FilterComponent';
import StickyBox from 'react-sticky-box';
import { useEffect, useState } from 'react';
import { Filters } from '../../../../utils/type';
import { useDispatch, useSelector } from 'react-redux';
import { CiBoxList, CiGrid41 } from 'react-icons/ci';
import { Pagination, Select, SelectItem } from '@heroui/react';
import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';
import { getAllService } from '../../../../core/data/redux/searchFunction/actionCreator';
import { useTranslation } from 'react-i18next';
import ServiceCard from '../../../components/common/ui/ServiceCard';
import LoadingSpinner from '../../../components/common/loading/LoadingSprinner';
import { RootState } from '../../../../core/data/redux/reducer';
import ServiceCardList from '../../../components/common/ui/ServiceCardList';

const ServiceList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isListInView1, setIsListInView1] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: ['all'],
    search: '',
    state: 'all',
    subCategory: 'all',
    priceRange: [100, 500],
    ratings: [],
    page: 1
  });
  const dispatch = useDispatch<any>();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || 'all';
    const subCategories = searchParams.get('subCategory') || 'all';
    const categories = searchParams.get('categories') || 'all';
    const priceRange = searchParams.get('priceRange')
      ? searchParams.get('priceRange')!.split(',').map(Number)
      : [100, 500];
    const ratings = searchParams.get('ratings')
      ? searchParams.get('ratings')!.split(',').map(Number)
      : [];

    setFilters({
      categories: categories === 'all' ? ['all'] : categories.split(','),
      search,
      state,
      subCategory: subCategories === 'all' ? ['all'] : subCategories.split(','),
      priceRange,
      ratings,
      page: currentPage
    });
  }, [searchParams, currentPage]);

  const handleSubmit = () => {
    window.scrollTo({
      top: 50,
      behavior: 'smooth',
    });
    
    const queryParams = new URLSearchParams({
      search: filters.search || '',
      state: filters.state || 'all',
      categories: filters.categories.join(','),
      subCategory: Array.isArray(filters.subCategory) 
        ? filters.subCategory.join(',') 
        : filters.subCategory,
      priceRange: filters.priceRange.join(','),
      ratings: filters.ratings.join(','),
      page: currentPage.toString()
    });
    
    dispatch(getAllService({ filter: queryParams }));
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSubmit();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, currentPage]);

  const state = useSelector((state: RootState) => state.searchData);
  const loading = state.loading;

  const ServiceData =
    state && Array.isArray(state.data) && state.data?.[0]?.sortedResults
      ? state.data?.[0]?.sortedResults
      : [];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters: Filters) => {
    // Update URL params immediately
    setSearchParams({
      search: newFilters.search || '',
      state: newFilters.state || 'all',
      categories: Array.isArray(newFilters.categories) 
        ? newFilters.categories.join(',') 
        : 'all',
      subCategory: Array.isArray(newFilters.subCategory) 
        ? newFilters.subCategory.join(',') 
        : newFilters.subCategory || 'all',
      priceRange: newFilters.priceRange.join(','),
      ratings: newFilters.ratings.join(','),
    });
    
    // Update local state
    setFilters({
      ...newFilters,
      page: 1 // Reset to first page when filters change
    });
    setCurrentPage(1);
  };

  const { t } = useTranslation();

  return (
    <>
      <BreadCrumb
        title={t('navigation.services')}
        item1={t('navigation.services')}
      />

      {loading && <LoadingSpinner />}
      <div className="font-primary mt-14">
        <div className="flex">
          <div className="max-w-[280px]">
            <StickyBox>
              <FilterComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                onSubmit={() => {
                  setCurrentPage(1);
                  handleSubmit();
                }}
              />
            </StickyBox>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center flex-wrap mb-4 pl-5">
              <h4 className="text-2xl font-semibold">
                {t('found')}{' '}
                <span className="text-primary">
                  {state.data?.[0]?.totalRecords || 0}{' '}
                  {t('navigation.services')}
                </span>
              </h4>
              <div className="flex items-center">
                <span className="me-2 text-base">
                  {t('sort_options.sort')}
                </span>
                <div className="dropdown me-2">
                  <Select
                    className="w-[160px]"
                    placeholder={t('sort_options.price_low_to_high')}
                    variant="bordered"
                    defaultSelectedKeys={'LTH'}
                  >
                    <SelectItem value="LTH">
                      {t('sort_options.price_low_to_high')}
                    </SelectItem>
                    <SelectItem value="HTL">
                      {t('sort_options.price_high_to_low')}
                    </SelectItem>
                  </Select>
                </div>
                <button
                  onClick={() => setIsListInView1(false)}
                  className={`p-2 border border-bordercolor flex justify-center items-center rounded me-2 ${isListInView1 ? '' : 'bg-primary text-white'}`}
                >
                  <CiGrid41 />
                </button>
                <button
                  onClick={() => setIsListInView1(true)}
                  className={`p-2 border-bordercolor flex justify-center items-center border rounded ${isListInView1 ? 'bg-primary text-white' : ''}`}
                >
                  <CiBoxList />
                </button>
              </div>
            </div>
            <div className={`${isListInView1 ? 'row-auto' : 'row justify-center items-center'}`}>
              <div
                className={`${
                  isListInView1
                    ? 'grid grid-cols-1'
                    : 'grid xl:grid-cols-4 md:grid-cols-6 grid-cols-2 gap-2'
                } pl-5`}
              >
                {ServiceData.length > 0 ? (
                  ServiceData.map((service: any, index: number) => (
                    <div key={index}>
                      {isListInView1 ? (
                        <ServiceCardList data={service} />
                      ) : (
                        <div className="mb-6 bg-white border border-bordercolor rounded-sm shadow-small">
                          <ServiceCard data={service} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="pl-5">{t('no_services_available')}</p>
                )}
              </div>
              <Pagination
                className="pl-5"
                showControls
                page={currentPage}
                total={state.data?.[0]?.pages || 1}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceList;