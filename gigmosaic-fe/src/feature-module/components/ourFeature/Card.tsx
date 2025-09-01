import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//import man from '../../../assets/Img/worker-is-cutting-wires-with-lineman-s-pliers.webp';

interface CardProps {
  category: string;
  title: string;
  rating: number;
  reviewsCount: number;
  price: string;
  image: string;
}

const Card: React.FC<CardProps> = ({
  category,
  title,
  rating,
  reviewsCount,
  price,
  image,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-12 overflow-hidden shadow-lg border bg-[#ffff] transform rounded-sm min-h-40 transition duration-300">
      {/* Service Image */}
      <div className="relative col-span-5">
        <img
          className="w-[142px] h-[142px] object-cover object-center rounded-sm my-2 mx-2 relative"
          src={image}
          alt="service image"
        />
        <Chip className=" bg-gradient-to-br from-yellow-300/85 to-orange-400/90 bg-transparent p-0 m-4 rounded-full rounded-tl-none top-0 left-0 absolute">
          <h2 className="text-[10px] text-black font-semibold">{category}</h2>
        </Chip>
      </div>
      <div className="col-span-7 ml-1 p-2">
        <h3 className="text-sm min-h-[75px] font-semibold text-neutral-900/80">
          {title}
        </h3>
        <div className="flex flex-col items-start min-h-10 mt-1">
          {/* Star Rating */}
          <div className="flex items-center mt-1">
            <div className="flex text-yellow-500 space-x-0">
              {[...Array(Math.floor(rating))].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path d="M12 2l2.09 6.26h6.61l-5.35 3.88 2.09 6.26-5.34-3.88-5.35 3.88 2.09-6.26-5.35-3.88h6.61L12 2z" />
                </svg>
              ))}
              {rating % 1 !== 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path d="M12 2l2.09 6.26h6.61l-5.35 3.88 2.09 6.26-5.34-3.88-5.35 3.88 2.09-6.26-5.35-3.88h6.61L12 2z" />
                </svg>
              )}
              {[...Array(5 - Math.ceil(rating))].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2l2.09 6.26h6.61l-5.35 3.88 2.09 6.26-5.34-3.88-5.35 3.88 2.09-6.26-5.35-3.88h6.61L12 2z"
                  />
                </svg>
              ))}
            </div>
            <p className="ml-2 text-[12px] text-gray-600">{rating}</p>
          </div>
          {/* Review Count */}
          <div className="mt-0 text-[10px] text-gray-500">
            {reviewsCount}{' '}
            {Number(reviewsCount) === 1 ? 'Review' : t('services.0.reviews')}
            {/* {reviewsCount} {Number(reviewsCount) === 1 ? 'Review' : 'Reviews'} */}
          </div>
        </div>

        {/* Right-Aligned Small Rectangular Book Now Button */}
        <div className="flex justify-between mt-0 gap-2">
          <p className="text-xs font-bold text-neutral-500">{price}</p>
          <Link to={'/service/booking'}>
            <button className="border border-[#12BBB5] text-[#12BBB5] font-bold px-1 py-0 text-[10px] hover:bg-[#12BBB5] hover:text-white transition">
              {t('services.0.button')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
