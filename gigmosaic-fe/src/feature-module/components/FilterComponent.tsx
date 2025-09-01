/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useCategoryAndSubQuery } from '../../hook/useQueryData';
import { Filters } from '../../utils/type';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Select,
  SelectItem,
  Slider,
} from '@heroui/react';
import { TbFilterCheck } from 'react-icons/tb';
import { BiChevronRight, BiMap } from 'react-icons/bi';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { canadianProvinces } from '../../core/data/json/Province';

interface FilterComponentProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  onSubmit: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filters,
  onFilterChange,
  onSubmit,
}) => {
  const [searchParams] = useSearchParams();
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [inputValue, setInputValue] = useState<string>('all');
  const [categoryValue, setcategoryValue] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const urlparams = window.location.search;
  const [selectedValue1, setSelectedValue1] = useState<any>('all');
  const [openIndex, setOpenIndex] = useState(null);
  console.log(urlparams, 'URL PARAMS');

  useEffect(() => {
    const search = searchParams.get('search');
    const state = searchParams.get('state');
    const category = searchParams.get('categories');
    const subCategories = searchParams.get('subCategory') || 'all';
    const priceRange = searchParams.get('priceRange')
      ? searchParams.get('priceRange')!.split(',').map(Number)
      : [100, 500];
    if (search) {
      setSearchValue(search);
    }
    if (state) {
      setInputValue(state);
    }
    if (category) {
      const categoryArray = category.split(',');
      setPendingFilters((prevFilters) => ({
        ...prevFilters,
        categories: categoryArray.includes('all') ? ['all'] : categoryArray,
      }));
    }
    if (subCategories) {
      setSelectedValue1(subCategories);
      const categoryArray = subCategories.split(',');
      setPendingFilters((prevFilters) => ({
        ...prevFilters,
        subCategory: categoryArray.includes('all') ? ['all'] : categoryArray,
      }));
    }
    if (priceRange) {
      setPendingFilters((prevFilters) => ({
        ...prevFilters,
        priceRange,
      }));
    }
  }, [searchParams]);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const { data: categoriesData } = useCategoryAndSubQuery();

  const setvalues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setPendingFilters((prev) => ({ ...prev, search: value }));
  };

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPendingFilters({ ...filters, priceRange: value });
    }
  };

  const handleRatingChange = (rating: number) => {
    const updatedRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    setPendingFilters({ ...filters, ratings: updatedRatings });
  };

  const handleCategoryChange = (
    selectedCategories: string[],
    _: any,
    categoryId: string
  ) => {
    console.log(selectedCategories, 'SELECTED CATEGORIES',pendingFilters.subCategory);

    if (categoryId === 'all') {
      setcategoryValue('all')
      setPendingFilters((prev) => {
        console.log(prev, 'PREV');
        return {
          ...prev,
          subCategory:selectedValue1,
          categories: categoryId === 'all' ? ['all'] : selectedCategories,
        };
      });
    } else {
      setPendingFilters((prev) => {
        const allKey = `all-${categoryId}`;
        const isSelectingAll = selectedCategories.includes(allKey);

        return {
          ...prev,
          subCategory: isSelectingAll ? allKey : selectedCategories, // ✅ "All" is now per category
          categories: isSelectingAll
            ? [categoryId] // ✅ Keep only the category where "All" was selected
            : prev.categories.filter((id) => id !== categoryId),
        };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(pendingFilters);
    onSubmit();
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    setInputValue(value);
    setPendingFilters({ ...filters, state: value });
  };

  const handleSelectSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Get the selected subcategory ID
    console.log(value, 'SELECTED sub CATEGORIES');
    setSelectedValue1(value);
      const selectedCategory = categoriesData?.categoriesWithSubCategories.find(
        (category) =>
          category.subCategories.some((sub) => sub.subCategoryId === value)
      );

      if (selectedCategory) {
        setPendingFilters((prev) => ({
          ...prev,
          categories: [selectedCategory.categoryId], // Set the category ID
          subCategory: value, // Set the subcategory ID
        }));
      }
    // }
  };

  const handleReset = () => {
    setPendingFilters((prev) => ({
      ...prev,
      categories: ['all'],
      subCategory: 'all',
      state: 'all',
      ratings: [],
      priceRange: [100, 500],
    }));
    setSelectedValue1('all');
  };

  const { t } = useTranslation();

  return (
    <div className="relative shadow-medium rounded-md mb-6 ">
      <div className="p-5">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-3 pb-3 border-b">
            <h5 className="flex items-center text-xl ">
              <TbFilterCheck />
              {t('navigation.filters')}
            </h5>
            <button
              className="bg-transparent border-none"
              onClick={handleReset}
            >
              {t('navigation.reset_filter')}
            </button>
          </div>

          {/* Search By Keyword */}
          <div className="mb-3 pb-3 border-b">
            <label className="form-label ">
              {t('search2.search_by_keyword')}
            </label>
            <div className="border rounded-sm">
              <input
                type="text"
                className="form-control outline-none"
                placeholder={t('search2.keyword_placeholder')}
                name="keyword"
                value={searchValue}
                onChange={setvalues}
              />
            </div>
          </div>

          <div className="border-b text-sm">
            <Accordion defaultExpandedKeys={['1']}>
              <AccordionItem
                title={t('search2.categories')}
                classNames={{
                  title: 'text-xl font-semibold',
                }}
                key="1"
              >

                <div className=" ">
                  <div className="w-full max-w-[280px] rounded-sm">
                    <Checkbox
                      className="block"
                      defaultChecked={categoryValue === 'all'}
                      size="sm"
                      value={categoryValue}
                      onChange={() =>
                        handleCategoryChange(['all'], 'all', 'all')
                      }
                    >
                      {t('search2.all_categories')}
                    </Checkbox>
                    {categoriesData?.categoriesWithSubCategories.map(
                      (item, index) => (
                        <div key={index} className="overflow-hidden">
                          <div
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center px-4 justify-between border-b py-3 text-left hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                              <span>{item.categoryName}</span>
                            </div>
                            <motion.span
                              animate={{ rotate: openIndex === index ? 90 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <BiChevronRight />
                            </motion.span>
                          </div>

                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={
                              openIndex === index
                                ? { height: 'auto', opacity: 1 }
                                : { height: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 py-2 space-y-2">
                              <CheckboxGroup
                                defaultValue={[`all-${item.categoryId}`]} // Ensure each category has its unique "All"
                                value={
                                  pendingFilters.categories.includes(
                                    item.categoryId
                                  ) &&
                                  pendingFilters.subCategory ===
                                    `all-${item.categoryId}`
                                    ? [`all-${item.categoryId}`] // ✅ Ensure only "All" of this category is checked
                                    : Array.isArray(pendingFilters.subCategory)
                                      ? pendingFilters.subCategory
                                      : [pendingFilters.subCategory]
                                }
                                size="sm"
                                radius="sm"
                                onChange={(selectedCategories: string[]) =>
                                  handleCategoryChange(
                                    selectedCategories,
                                    null as any,
                                    item.categoryId
                                  )
                                }
                              >
                                <Checkbox
                                  className="block"
                                  defaultSelected={true}
                                  radius="sm"
                                  key={`all-${item.categoryId}`}
                                  size="sm"
                                  value={`all-${item.categoryId}`}
                                  onChange={handleSelectSubCategory}
                                >
                                  {`All ${item.categoryName}`}
                                </Checkbox>
                                {item?.subCategories?.map(
                                  (subitem, subindex) => (
                                    <Checkbox
                                      key={subindex}
                                      value={subitem.subCategoryId}
                                      onChange={handleSelectSubCategory} // Updated to handle HTMLInputElement event
                                    >
                                      {subitem.subCategoryName}
                                    </Checkbox>
                                  )
                                )}
                              </CheckboxGroup>
                            </div>
                          </motion.div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="border-b text-sm">
            <Accordion defaultExpandedKeys={['1']}>
              <AccordionItem
                title={t('search2.location')}
                classNames={{
                  title: 'text-xl font-semibold ',
                }}
                key="1"
              >
                <Select
                  aria-label="Location"
                  className="w-52 border-none  text-zinc-500 font-primary"
                  placeholder="Location"
                  variant="bordered"
                  radius="none"
                  autoFocus={false}
                  classNames={{
                    listbox: 'border-none',
                    base: 'text-zinc-500',
                    value: 'text-zinc-500',
                  }}
                  value={inputValue}
                  endContent={<BiMap className="w-5 h-5" />}
                  selectedKeys={[inputValue]}
                  defaultSelectedKeys={[inputValue]} // Update this to `inputValue` instead of `selectedCategory`
                  onChange={handleSelect}
                >
                  <SelectItem key="all" value="all">
                    {t('search2.all_canada')}
                  </SelectItem>
                  <>
                    {canadianProvinces?.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </>
                </Select>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="border-b text-sm">
            <Accordion defaultExpandedKeys={['1']}>
              <AccordionItem
                title={t('search2.price_range.label')}
                classNames={{
                  title: 'text-xl font-semibold ',
                }}
                key="1"
              >
                <div className=" ">
                  <Slider
                    className=""
                    onChange={handlePriceRangeChange}
                    defaultValue={[100, 500]}
                    value={
                      pendingFilters.priceRange ||
                      filters.priceRange || [100, 500]
                    }
                    formatOptions={{ style: 'currency', currency: 'CAD' }}
                    label={t('search2.price_range.label2')}
                    maxValue={1000}
                    size="sm"
                    minValue={0}
                    step={50}
                  />
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Accordion defaultExpandedKeys={['1']}>
              <AccordionItem
                title={t('ratings')}
                classNames={{
                  title: 'text-xl font-semibold ',
                }}
                key="1"
              >
                <div className="mb-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div className="mb-2" key={rating}>
                      <label className="text-sm inline-flex items-center w-full justify-between">
                        <div className="flex items-center">
                          <input
                            className="mr-2" // Adjust spacing between checkbox and stars
                            type="checkbox"
                            checked={pendingFilters.ratings.includes(rating)}
                            onChange={() => handleRatingChange(rating)}
                          />
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i}>
                                {i < rating ? (
                                  <BsStarFill color="#FFC107" size={15} />
                                ) : (
                                  <BsStar color="#FFC107" size={15} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs">({55 - rating * 10})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Search Button */}
          <button
            className="border-primary border  text-sm font-medium py-2 px-4 rounded-sm w-full"
            type="submit"
          >
            {t('search2.search_button')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilterComponent;
