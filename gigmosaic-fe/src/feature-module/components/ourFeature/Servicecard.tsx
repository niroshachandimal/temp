import { useTranslation } from 'react-i18next';
import hero from '../../../assets/Img/electrical.webp';

const ServiceCard = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-sm border border-[#12BBB5] p-4 shadow-md h-full flex flex-col">
      {/* Image Section with Frame */}
      <div className="relative flex justify-center">
        <div className="w-[200px] h-[200px] border-4 rounded-sm overflow-hidden">
          <img
            src={hero}
            alt="Electric Panel Repairing"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-4 flex-grow">
        {' '}
        {/* Allow details to take full height */}
        <p className="text-gray-500 text-sm">Electrical</p>
        <h3 className="text-lg font-bold">Electric Panel Repairing Service</h3>
        <p className="text-sm">
          {t('products.0.status')}{' '}
          <span className="text-green-500 font-bold">
            {t('products.0.available_now')}
          </span>
        </p>
        {/* Price Section */}
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-red-500 font-bold text-lg">$45.00</span>
          <span className="text-gray-400 line-through">$50.00</span>
        </div>
        {/* Progress Bar */}
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {t('products.0.available_product')}
            <span className="font-bold">35/80</span>
          </p>
          <div className="w-full bg-gray-200 h-2">
            <div className="bg-teal-500 h-2" style={{ width: '45%' }}></div>
          </div>
        </div>
        {/* Countdown Timer */}
        <div className="mt-4">
          <p className="text-sm font-bold">{t('countdown')}</p>
          <div className="flex space-x-2 mt-2">
            {['23 DAYS', '12 HRS', '34 MINS', '23 SECS'].map((time, index) => (
              <div
                key={index}
                className="flex flex-col items-center border p-2"
              >
                <span className="text-lg font-bold">{time.split(' ')[0]}</span>
                <span className="text-xs text-gray-500">
                  {time.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-auto flex justify-between text-sm text-gray-500">
        <button className="hover:underline">
          &lt; {t('pagination.previous')}
        </button>
        <button className="font-bold text-black hover:underline">
          {t('pagination.next')} &gt;
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
