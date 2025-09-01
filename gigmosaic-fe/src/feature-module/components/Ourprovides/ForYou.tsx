import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Slider from 'react-slick';
import { useRef } from 'react';
//import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Add lazy load blur effect

import { useTranslation } from 'react-i18next';
import Card from '../ourFeature/Card';
const ForYou = () => {
  const sliderRef = useRef<Slider>(null);
const services = [
  {
    category: 'Gardening',
    name: 'Lawn Mowing Services',
    price: '$35.00',
    oldPrice: '$30.00',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.jTWCHZDv0bQNGLu1BWREWwHaEK%26pid%3DApi&f=1&ipt=da1659ae98f6405c42584d5e4b51e257fd28492caba717baa158e04f62c71aa5&ipo=images',
    rating: 4.5,
    reviews: 200,
  },
  {
    category: 'Technology',
    name: 'Computer Repair',
    price: '$120.00',
    oldPrice: '$100.00',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.wtLW6oidYYIcDzmZGVxkpgHaEK%26pid%3DApi&f=1&ipt=37334f5c589a9b2d9da0ddf7efbd5721de7a3ba04c102ef6ec7a4d1b6552e673&ipo=images',
    rating: 4,
    reviews: 95,
  },
  {
    category: 'Health & Wellness',
    name: 'Personal Training',
    price: '$60.00',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.dNNYMNEGK4KPgweFiBViogHaE8%26pid%3DApi&f=1&ipt=4b9eaf61a6d61b74c4c0ff3f72153e97b9cdbdc3e18cb9e156499c19c9d12f0c&ipo=images',
    rating: 4.8,
    reviews: 220,
  },
  {
    category: 'Home Improvement',
    name: 'Painting Services',
    price: '$150.00',
    oldPrice: '$140.00',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.f5S_MYWvesR2Cw_0nu33TwHaE8%26pid%3DApi&f=1&ipt=f1fbd0e04d11a716b1a025a6a09104b2c482238d838ad158d5c5dfcb592eecff&ipo=images',
    rating: 4.2,
    reviews: 130,
  },
  {
    category: 'Auto Repair',
    name: 'Tire Replacement',
    price: '$50.00',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.9cuIxtNohhNRRZr8rWfO4gHaE7%26pid%3DApi&f=1&ipt=bcee26629a3cf2843d2ba14b42f6c853ba92e64c83caaffc6a2f0e6f110a4fed&ipo=images',
    rating: 4.1,
    reviews: 80,
  },
  {
    category: 'Catering',
    name: 'Event Catering',
    price: '$500.00',
    oldPrice: '$450.00',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.GLjWIv3tFwLEGw5jTJI1tQHaFj%26pid%3DApi&f=1&ipt=02ca0a382c9f2fd4ad7a4e2db8ea318cf5ad498d5107e172ad577369d1bbe373&ipo=images',
    rating: 4.7,
    reviews: 60,
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
        <span>{t('For_You')}</span>
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

export default ForYou;
