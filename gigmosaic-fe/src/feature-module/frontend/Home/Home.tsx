/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, lazy, useState } from 'react';
import Carousel from '../../components/carousel/Carousel';
import FeaturedGigs from '../../components/ourFeature/FeaturedGigs';
import { BsChevronDown, BsListUl } from 'react-icons/bs';
import img from '../../../assets/Group8.png';
import icon1 from '../../../assets/icon/1 7432983.png';
import icon2 from '../../../assets/icon/2 91248.png';
import icon3 from '../../../assets/icon/3 7.png';
import icon4 from '../../../assets/icon/headphones_862909_related_id=862909.png';
import { RiCarWashingLine } from 'react-icons/ri';
import { LuConstruction } from 'react-icons/lu';
import {
  MdOutlineCarpenter,
  MdOutlineCastForEducation,
  MdOutlineComputer,
  MdOutlineElectricalServices,
  MdOutlineLocalFireDepartment,
  MdOutlinePlumbing,
} from 'react-icons/md';
import { GiVacuumCleaner } from 'react-icons/gi';
import { PiPenNibStraightLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BiChevronRight } from 'react-icons/bi';
import AdsCards from '../../components/adsCards/adsCards';
import OurProviders from '../../components/Ourprovides/ourProvides';
import OnDiscount from '../../components/Ourprovides/OnDiscount';
import OurRecentServices from '../../components/Ourprovides/OurRecentServices';
import { useTranslation } from 'react-i18next';
import LongAd from '../../components/adsCards/LongAd';
import ForYou from '../../components/Ourprovides/ForYou';
import LongAd2 from '../../components/adsCards/LongAd2';
import PopularProviders from '../../components/Ourprovides/PopularProviders';
// import CardGrid from '../../components/ourFeature/cardGrid';
const CardGrid = lazy(() => import('../../components/ourFeature/cardGrid'));
interface SidebarItem {
  icon: JSX.Element;
  value: string;
  subcategories: {
    value: string;
    icon: string;
  }[];
}
const Home = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const sidebarvalues: SidebarItem[] = [
    {
      icon: <LuConstruction />,
      value: t('featured_categories.categories.0.label_1'), // Construction
      subcategories: [
        { icon: 'fa-building', value: 'Residential Construction' },
        { icon: 'fa-hard-hat', value: 'Commercial Construction' },
        { icon: 'fa-tools', value: 'Renovation Services' },
        { icon: 'fa-truck-pickup', value: 'Heavy Equipment Rental' },
      ],
    },
    {
      icon: <RiCarWashingLine />,
      value: t('featured_categories.categories.1.label_2'), // Car Wash
      subcategories: [
        { icon: 'fa-car', value: 'Exterior Wash' },
        { icon: 'fa-spray-can', value: 'Interior Detailing' },
        { icon: 'fa-hand-sparkles', value: 'Full Service Wash' },
        { icon: 'fa-shield-alt', value: 'Ceramic Coating' },
      ],
    },
    {
      icon: <MdOutlineElectricalServices />,
      value: t('featured_categories.categories.2.label_3'), // Electrical Services
      subcategories: [
        { icon: 'fa-bolt', value: 'Wiring Installation' },
        { icon: 'fa-lightbulb', value: 'Lighting Solutions' },
        { icon: 'fa-plug', value: 'Outlet Repair' },
        { icon: 'fa-battery-full', value: 'Generator Installation' },
      ],
    },
    {
      icon: <GiVacuumCleaner />,
      value: t('featured_categories.categories.3.label_4'), // Cleaning Services
      subcategories: [
        { icon: 'fa-broom', value: 'House Cleaning' },
        { icon: 'fa-soap', value: 'Deep Cleaning' },
        { icon: 'fa-trash-alt', value: 'Office Cleaning' },
        { icon: 'fa-wind', value: 'Carpet Cleaning' },
      ],
    },
    {
      icon: <MdOutlineCarpenter />,
      value: t('featured_categories.categories.4.label_5'), // Carpentry
      subcategories: [
        { icon: 'fa-hammer', value: 'Furniture Repair' },
        { icon: 'fa-chair', value: 'Custom Furniture' },
        { icon: 'fa-door-open', value: 'Door Installation' },
        { icon: 'fa-ruler-combined', value: 'Cabinet Making' },
      ],
    },
    {
      icon: <MdOutlinePlumbing />,
      value: t('featured_categories.categories.5.label_6'), // Plumbing
      subcategories: [
        { icon: 'fa-faucet', value: 'Leak Repair' },
        { icon: 'fa-shower', value: 'Bathroom Plumbing' },
        { icon: 'fa-toilet', value: 'Toilet Installation' },
        { icon: 'fa-tint', value: 'Water Heater Services' },
      ],
    },
    {
      icon: <MdOutlineComputer />,
      value: t('featured_categories.categories.6.label_7'), // Computer Services
      subcategories: [
        { icon: 'fa-laptop', value: 'PC Repair' },
        { icon: 'fa-network-wired', value: 'Networking Solutions' },
        { icon: 'fa-virus', value: 'Virus Removal' },
        { icon: 'fa-database', value: 'Data Recovery' },
      ],
    },
    {
      icon: <MdOutlineCastForEducation />,
      value: t('featured_categories.categories.7.label_8'), // Education
      subcategories: [
        { icon: 'fa-graduation-cap', value: 'Online Courses' },
        { icon: 'fa-book', value: 'Tutoring Services' },
        { icon: 'fa-chalkboard-teacher', value: 'Workshops' },
        { icon: 'fa-certificate', value: 'Certification Programs' },
      ],
    },
    {
      icon: <PiPenNibStraightLight />,
      value: t('featured_categories.categories.8.label_9'), // Design
      subcategories: [
        { icon: 'fa-paint-brush', value: 'Graphic Design' },
        { icon: 'fa-palette', value: 'Interior Design' },
        { icon: 'fa-pencil-ruler', value: 'Architectural Design' },
        { icon: 'fa-vector-square', value: 'UI/UX Design' },
      ],
    },
  ];

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-40">
      <section className="mt-4  flex gap-4 w-full">
        <div className="w-2/12">
          <div className="font-primary">
            <div className="">
              <div className="">
                <div
                  className="flex px-4 justify-between items-center text-white text-base font-semibold bg-primary rounded-sm h-12 max-w-[280px]"
                  aria-current="true"
                >
                  <div className="flex items-center gap-2">
                    <BsListUl />
                    <h6 className="">
                      {/* Featured Category */}
                      {t('featured_categories.header')}
                    </h6>
                  </div>
                  <BsChevronDown />
                </div>
                <div className="mt-5 ">
                  <div className="w-full max-w-[280px] rounded-sm  border border-bordercolor ">
                    {sidebarvalues.map((item, index) => (
                      <div key={index} className="overflow-hidden">
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full flex items-center px-4  justify-between border-b  py-3 text-left 
                       hover:bg-gray-200 transition-all duration-300 "
                        >
                          <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                            {item.icon}
                            <span>{item.value}</span>
                          </div>
                          <motion.span
                            animate={{ rotate: openIndex === index ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <BiChevronRight />
                          </motion.span>
                        </button>

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
                            {item.subcategories.map((subitem, subindex) => (
                              <motion.div
                                key={subindex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: subindex * 0.1,
                                }}
                              >
                                <Link
                                  to={'#'}
                                   className="block  w-full items-center px-4 text-sm font-medium justify-between border-b  py-1 text-left 
                       hover:bg-gray-200 transition-all duration-300 "
                                >
                                  {subitem.value}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    ))}

                    {/* Special "Deal of the Day" Item */}
                    <button className=" rounded-xl shadow-sm ">
                      <div className="w-full flex items-center px-4 py-3 ">
                        <MdOutlineLocalFireDepartment color="red" />
                        <span className="ml-2 text-sm font-medium">
                          {t('deal_of_the_day.description')}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-10/12">
          <div>
            <div className="">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-9">
                  <div>
                    <Carousel />
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <img
                      src={img}
                      alt="img"
                      className="rounded-sm"
                      style={{ height: 450 }}
                    />
                  </div>
                </div>
              </div>
              <div className="row-auto mt-4 ">
                <div className="grid grid-cols-4 gap-3 ">
                  <div className="flex p-3 items-center gap-2 text-primary bg-[#F6F6F6]">
                    {/* <div > */}
                    <img src={icon1} width={50} height={50} />
                    {/* </div> */}
                    <div>
                      <h6 className="text-sm font-semibold">
                        {t('features.0.label_1')}
                      </h6>
                      <p className="text-xs">{t('features.0.description_1')}</p>
                    </div>
                  </div>
                  <div className="flex p-3 items-center gap-2 text-primary bg-[#F6F6F6]">
                    {/* <div> */}
                    <img src={icon2} width={50} height={50} />
                    {/* </div> */}
                    <div>
                      <h6 className="text-sm font-secondary font-semibold">
                        {t('features.1.label_2')}
                      </h6>
                      <p className="text-xs">{t('features.1.description_2')}</p>
                    </div>
                  </div>
                  <div className="flex p-3 items-center gap-2 text-primary bg-[#F6F6F6]">
                    {/* <div> */}
                    <img src={icon3} width={50} height={50} />
                    {/* </div> */}
                    <div>
                      <h6 className="text-sm font-secondary font-semibold">
                        {t('features.2.label_3')}
                      </h6>
                      <p className="text-xs">{t('features.2.description_3')}</p>
                    </div>
                  </div>
                  <div className="flex p-3 items-center gap-2 text-primary bg-[#F6F6F6]">
                    {/* <div> */}
                    <img src={icon4} width={20} height={20} />
                    {/* </div> */}
                    <div>
                      <h6 className="text-sm font-secondary font-semibold">
                        {t('features.3.label_4')}
                      </h6>
                      <p className="text-xs">{t('features.3.description_4')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedGigs />
      <CardGrid />
      <AdsCards />
      <OurProviders />
      <OurRecentServices />
      <LongAd />
      <OnDiscount />
      <ForYou />
      <LongAd2 />
      <PopularProviders />
      
    </div>
  );
};

export default Home;
