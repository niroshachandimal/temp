import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Slider from 'react-slick';
import { useRef } from 'react';
//import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Add lazy load blur effect

import carWash from '../../../assets/Img/car-wash-detailing-station.jpg';
import construction from '../../../assets/Img/construction-site-with-cranes-against-blue-sky.jpg';
import foundation from '../../../assets/Img/civil-engineer-construction-worker-manager-holding-digital-tablet-blueprints-talking-planing-about-construction-site-cooperation-teamwork-concept.jpg';
import cleaning from '../../../assets/Img/closeup-waitress-disinfecting-tables-outdoor-cafe.jpg';
import plumbing from '../../../assets/Img/worker-is-cutting-wires-with-lineman-s-pliers.webp';
import { useTranslation } from 'react-i18next';
import Card from '../ourFeature/Card';
const OnDiscount = () => {
  const sliderRef = useRef<Slider>(null);
  const services = [
    {
      category: 'Car Wash',
      name: 'Car Wash Services',
      price: '$29.00',
      oldPrice: '$20.00',
      image: carWash,
      rating: 4,
      reviews: 120,
    },
    {
      category: 'Construction',
      name: 'Construction Services',
      price: '$270.00',
      image: construction,
      rating: 4,
      reviews: 85,
    },
    {
      category: 'Construction',
      name: 'Building Foundations',
      price: '$208.00',
      image: foundation,
      rating: 3.5,
      reviews: 95,
    },
    {
      category: 'Cleaning',
      name: 'Office Cleaning',
      price: '$29.00',
      oldPrice: '$20.00',
      image: cleaning,
      rating: 3.5,
      reviews: 110,
    },
    {
      category: 'Plumbing',
      name: 'Fixing Leaks, Clogs',
      price: '$85.00',
      oldPrice: '$90.00',
      image: plumbing,
      rating: 4,
      reviews: 150,
    },
    {
      category: 'Construction',
      name: 'Construction Services',
      price: '$123.00',
      image: construction,
      rating: 3.5,
      reviews: 70,
    },
  ];

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '50px',
    slidesToShow: 4,
    slidesToScroll: 2,
    speed: 500,
    arrows: false, // Hide default arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, centerPadding: '40px' },
      },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: '20px' } },
    ],
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const { t } = useTranslation();

  return (
    <div className="w-full p-2">
    <div className="flex items-center justify-between font-montserrat text-md font-bold mt-4 border-b-1 border-gray-400/80 pb-1 mb-2">
        <span>{t('On_Discount')}</span>
        <div className="flex gap-2">
          <button 
            onClick={goToPrev}
            className="px-2 min-h-7 h-7 text-base font-semibold text-teal-500 bg-transparent rounded-sm cursor-pointer border border-teal-500 max-md:w-full"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={goToNext}
            className="px-2 min-h-7 h-7 text-base font-semibold text-teal-500 bg-transparent rounded-sm cursor-pointer border border-teal-500 max-md:w-full"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="slider-container">
        <Slider ref={sliderRef} {...settings}>
          {services.map((service, index) => (
            <div key={index} className="w-full p-2">
              <Card
                key={index}
                category={service.category}
                title={service.name}
                rating={service.rating}
                reviewsCount={service.reviews}
                price={service.price}
                image={service.image}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default OnDiscount;
