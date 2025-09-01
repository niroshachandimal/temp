import { useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
//import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from '../ourFeature/Card';
import { useTranslation } from 'react-i18next';

const OurProviders = () => {
  const sliderRef = useRef<Slider>(null);

  const providers = [
    {
      category: 'Cleaning',
      name: 'Sparkle & Shine',
      price: '$250.00',
      rating: 4.5,
      reviews: 180,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.L3J-ME4EwXaUheuHb0R-iwHaE8%26pid%3DApi&f=1&ipt=cf12ff349dcfc03f050ca1799d6504abfa97ef683a3ea09bd3e446199cd1d5b2&ipo=images',
    },
    {
      category: 'Plumbing',
      name: 'Pipe Pros',
      price: '$120.00',
      rating: 4.2,
      reviews: 95,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.D9hWXzd7lxbNmcEK51ANbgHaE7%26pid%3DApi&f=1&ipt=b2b1fd0a15d15af357ab639d42fb0640b3832d9b047445446f6fa7d6fb59bb72&ipo=images',
    },
    {
      category: 'Repairs',
      name: 'Fix-It All',
      price: '$300.00',
      rating: 4.8,
      reviews: 230,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.P8myib5SdGP4jkRs_wScfgHaEK%26pid%3DApi&f=1&ipt=f97a64361f17358584d09886665c82b4ea34ce369c6e782bc3d4c01364788f7a&ipo=images',
    },
    {
      category: 'Construction',
      name: 'Build Better',
      price: '$500.00',
      rating: 4.7,
      reviews: 150,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.eDigVsUEtd-BTGvicNWkaQHaD4%26pid%3DApi&f=1&ipt=0ef99a4a6b1f462cff5ea8b54256c24a5ae85ce57d4da0d99cdc61c87d83fc3c&ipo=images',
    },
    {
      category: 'Electricians',
      name: 'Shock Shield',
      price: '$200.00',
      rating: 4.3,
      reviews: 85,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.ylFRRx6pE_2Ab3O6UQDOoQHaE8%26pid%3DApi&f=1&ipt=238dcf3abbaf7046a50fda536603d2fcdbee5515478e56defb24a00bbaa7c33c&ipo=images',
    },
    {
      category: 'Landscaping',
      name: 'Green Touch',
      price: '$350.00',
      rating: 4.6,
      reviews: 120,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.lWMh16TDVz_LsPnmttZ1fQHaE8%26pid%3DApi&f=1&ipt=33ca9a8cfb74ec1b92b6afc9b62c952d37fd0a1fc45330122bacb8d17d480485&ipo=images',
    },
    {
      category: 'Painting',
      name: 'Color Masters',
      price: '$400.00',
      rating: 4.9,
      reviews: 200,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Ru_60a0tA-VeCo1KZY11aQHaE8%26pid%3DApi&f=1&ipt=6b3d1196dbc3006eb870b2e0a41ecfc1ca30b9d3b51af479f02e907ded275092&ipo=images',
    },
    {
      category: 'Carpentry',
      name: 'Crafty Hands',
      price: '$450.00',
      rating: 4.4,
      reviews: 140,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.bYeMAKTGwCRbOL5D6teKUwHaE8%26pid%3DApi&f=1&ipt=8f2d8cbe9043af338046f2c89e4ecea34d79c2f02b1c50d885831c7c4e7010aa&ipo=images',
    },
    {
      category: 'Roofing',
      name: 'Top Cover',
      price: '$550.00',
      rating: 4.1,
      reviews: 110,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.DSMvxj0liQ6SP_rO7Qx2rAHaEK%26pid%3DApi&f=1&ipt=ec52125c0c361feef0547ad37a5b829ecaf2595226eac6acd24a900b893f9800&ipo=images',
    },
    {
      category: 'HVAC',
      name: 'Cool Air Pros',
      price: '$270.00',
      rating: 4.2,
      reviews: 130,
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.csoDSm5p9IpPi6h5UjUTdAHaE7%26pid%3DApi&f=1&ipt=d946d3ab0196fd52eaa8a05430837220b8c69f88f52c57f7f5b7fffa093b215a&ipo=images',
    },
  ];

  const settings = {
    className: 'center',
    centerMode: true,
    autoplay:true,
    infinite: true,
    centerPadding: '50px',
    slidesToShow: 4,
    slidesToScroll: 2,
    speed: 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, centerPadding: '40px' },
      },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: '20px' } },
    ],
    arrows: false, // Hide default arrows
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
        <span>{t('top_providers.header')}</span>
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
          {providers.map((provider, index) => (
            <div key={index} className="w-full p-2">
              <Card
                key={index}
                category={provider.category}
                title={provider.name}
                rating={provider.rating}
                reviewsCount={provider.reviews}
                price={provider.price}
                image={provider.image}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default OurProviders;