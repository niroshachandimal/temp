import { useTranslation } from 'react-i18next';

const FeaturedGigs = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between font-montserrat text-md font-bold mt-10 border-b-1 border-gray-400/80 pb-1 mb-2">
      <span>{t('Featured_Gigs')}</span>
      <button className="px-4 min-h-7 h-7 text-sm font-semibold text-white bg-teal-500 rounded-sm cursor-pointer border-[none] max-md:w-full">
        {t('view_all')}
      </button>
    </div>
  );
};

export default FeaturedGigs;
