/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Slider, { Settings } from 'react-slick';
import hero1 from '../../../assets/test2.png';
import hero2 from '../../../assets/MP-Blog-4-Insights-Article Image708x398.png';
import hero3 from '../../../assets/Inline 708X398 -people-warehouse-workers-laptop-parcels.jpg';
import { SlideProps } from '../../../utils/type';

const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    afterChange: (current: number) => setActiveSlide(current), // Update active slide index
    appendDots: (dots) => (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <ul
          style={{
            margin: 0,
            paddingLeft: 30,
            display: 'flex',
            justifyContent: 'left',
            listStyle: 'none',
          }}
        >
          {React.Children.map(dots, (dot, index) =>
            React.cloneElement(dot as React.ReactElement<any>, {
              style: {
                backgroundColor: activeSlide === index ? 'white' : 'gray',
                borderRadius: '50%', // Ensure dots are round
                width: '10px', // Set dot width
                height: '10px', // Set dot height
                margin: '0 5px', // Add spacing between dots
              },
            })
          )}
        </ul>
      </div>
    ),
    customPaging: () => <div style={{ display: 'none' }}></div>,
  };

  const slides: SlideProps[] = [
    {
      image: hero1,
      title: 'Nearby Top-rated Professionals',
      description: 'Gives affordable and excellent  workers',
    },
    {
      image: hero2,
      title: 'Discover Your Style',
      description:
        'Find the latest trends and timeless classics for every occasion.',
    },
    {
      image: hero3,
      title: 'Fall Collection',
      description: 'Stay cozy and stylish with our newest fall arrivals.',
    },
  ];

  return (
    <div className="">
      <Slider {...settings} className="">
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={slide.image}
              className="w-full object-cover rounded-sm"
              alt=""
              style={{ height: 450 }}
            />
            <div className="absolute top-0 start-0 h-full flex items-center ps-5">
              {index === activeSlide && (
                <div className="text-white">
                  <h2
                    key={`title-${activeSlide}`}
                    className="text-white font-bold"
                  >
                    {slide.title}
                  </h2>
                  <p key={`description-${activeSlide}`} className="mt-4">
                    {slide.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
