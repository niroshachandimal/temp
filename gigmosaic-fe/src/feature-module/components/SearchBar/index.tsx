/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { all_routes } from '../../../core/data/routes/all_routes';
import { useEffect, useState } from 'react';
import { Filters } from '../../../utils/type';
import { Select, SelectItem } from '@heroui/react';
import logo from '../../../assets/logo/1 (1).png';
import { LuMapPin } from 'react-icons/lu';
// import { useQuery } from '@tanstack/react-query';
// import { SendLocation } from '../../../hook/useSearchData';
import { useCategoryQuery } from '../../../hook/useQueryData';
import { useTranslation } from 'react-i18next';
import { canadianProvinces } from '../../../core/data/json/Province';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read query parameters
  const routes = all_routes;
  const [inputValue, setInputValue] = useState<string>('allcanada');
  const [searchValue, setSearchValue] = useState<string>('');
  // const [options, setOptions] = useState<{ label: string; value: string }[]>(
  //   []
  // );
  const [selectedCategory, setSelectedCategory] = useState('');

  const [filters, setFilters] = useState<Filters>({
    search: '',
    state: 'all',
    categories: [],
    subCategory: '',
    priceRange: [],
    ratings: [],
  });

  // Read query parameters from the URL and set initial values
  useEffect(() => {
    const search = searchParams.get('search');
    const state = searchParams.get('state');
    const category = searchParams.get('categories');
    if (search) {
      setSearchValue(search);
      setFilters((prevFilters) => ({ ...prevFilters, search }));
    }
    if (state) {
      setInputValue(state);
      setFilters((prevFilters) => ({ ...prevFilters, state }));
    }
    if (category) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        categories: category.split(','),
      }));
    }
  }, [searchParams]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    setInputValue(value); // Update the input field
    setFilters((prevFilters) => ({ ...prevFilters, state: value })); // Update filters
    // setShowDropdown(false); // Hide the dropdown
  };

  const { data: categoriesData } = useCategoryQuery();

  const setvalues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilters((prevFilters) => ({ ...prevFilters, search: value })); // Update filters
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      categories: [e.target.value],
    }));
  };

  // const { data } = useQuery({
  //   queryKey: ['location'],
  //   queryFn: SendLocation,
  // });

  // useEffect(() => {
  //   if (data?.resData) {
  //     // Set the options to the states array
  //     setOptions(
  //       data.resData.states.map((state: any) => ({
  //         label: state,
  //         value: state,
  //       }))
  //     );

  //     // // Set the default state (user's current state)
  //     // if (data.state) {
  //     //   setInputValue(data.state);
  //     //   // setFilters((prevFilters) => ({ ...prevFilters, state: data.state }));
  //     // }
  //   }
  // }, [data]);

  // const dispatch = useDispatch<any>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dispatch the async action
      // await dispatch(getAllService({ filter: filters }));

      // Construct the new URL with updated query parameters
      const searchParams = new URLSearchParams({
        search: filters.search,
        state: filters.state,
        categories: filters.categories.join(',')|| 'all',
      }).toString();

      navigate(`${routes.searchList}?${searchParams}`);
    } catch (err) {
      console.error('Error fetching search data:', err);
    }
  };

  const { t } = useTranslation();

  return (
    <div className=" py-3 w-full max-md:flex-wrap max-md:gap-4 max-md:p-4 max-sm:p-2.5 border-b ">
      <div className="px-14 flex justify-between gap-x-20">
        <div className="flex  items-center">
          <img
            src={logo}
            alt="Gig Mosaic Logo"
            className="object-fit h-[76px] w-[198px]"
          />
        </div>
        <form
          className="flex gap-3 flex-[2] border rounded-sm items-center px-5"
          onSubmit={handleSubmit}
        >
          <div className="text-base bg-neutral-100 cursor-pointer min-w-[200px] text-zinc-500 ">
            <Select
              aria-label="Select Category"
              className="list-box max-w-sm border-none text-zinc-500 font-primary"
              placeholder={t('search.select_category')}
              variant="bordered"
              radius="none"
              autoFocus={false}
              listboxProps={{
                style: { borderRadius: '0px', borderStartStartRadius: '0px' },
              }}
              classNames={{
                // listbox: '!border-none !rounded-none',
                base: '',
                value: '',
              }}
              selectedKeys={[selectedCategory]}
              onChange={handleSelectChange}
            >
              <SelectItem value={''}>{t('search.select_category')}</SelectItem>
              <>
                {categoriesData?.categories?.map((category) => (
                  <SelectItem
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </SelectItem>
                ))}
              </>
            </Select>
          </div>

          <label htmlFor="searchInput" className="sr-only">
            {t('search.search_products')}
          </label>
          <input
            id="searchInput"
            type="text"
            placeholder={t('search.search_for_servises')}
            value={searchValue}
            onChange={setvalues}
            className="flex-1 p-4 min-h-10 h-10 text-sm rounded-sm bg-neutral-100 border text-zinc-500 max-md:w-full"
          />
          {/* Location Input */}

          <div className="text-base  cursor-pointer min-w-[200px] text-zinc-500 ">
            <Select
              aria-label="Location"
              className="max-w-sm border-none bg-neutral-100 text-zinc-500 font-primary"
              placeholder="Location"
              variant="bordered"
              radius="none"
              autoFocus={false}
              classNames={{
                listbox: '!border-none !rounded-none',
                base: 'text-zinc-500',
                value: 'text-zinc-500',
              }}
              listboxProps={{ style: { borderRadius: '0px' } }}
              startContent={<LuMapPin className="w-5 h-5" />}
              defaultSelectedKeys={[inputValue]}
              onChange={handleSelect}
            >
              <SelectItem key="allcanada" value="all">
                {t('search.all_canada')}
              </SelectItem>

              <>
                {canadianProvinces?.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </>
            </Select>
          </div>

          <button
            type="submit"
            aria-label="{Search for services}"
            className="px-7 min-h-10 h-10 text-base font-semibold text-white bg-teal-500 rounded-sm cursor-pointer border-[none] max-md:w-full"
          >
            {t('search.search_button')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
