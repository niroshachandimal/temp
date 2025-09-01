import { useTranslation } from 'react-i18next';



const LongAd2 = () => {
  const { t } = useTranslation();
  const adDetails = [
    {
      title: 'Engine Tune-Up',
    price: '$45.00',
    label: t('Limited_Time'),
    image: 'https://ic.carid.com/articles/performing-a-basic-engine-tune-up/performing-a-basic-engine-tune-up_0.jpg',
  }
  ];
  return (
    <div className="flex justify-center gap-6 py-5">
        <div
          className="w-full h-[300px] flex items-center justify-between p-6 rounded-lg shadow-lg relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(83, 83, 83, 0.7), rgba(83, 83, 83, 0)), url('${adDetails[0].image}')`,
          }}
        >
          {/* Left Content */}
          <div className="text-white">
            <p className="text-[#FED604] text-sm uppercase font-semibold">
              {adDetails[0].label}
            </p>
          <h2 className="text-2xl leading-tight">
            {adDetails[0].title.split(' ')[0]} <br />{' '}
            {adDetails[0].title.split(' ').slice(1).join(' ')}
            </h2>
            <p className="mt-2 text-lg">
            {adDetails[0].price}{' '}
            </p>
            <button className="mt-4 bg-[#FED604] text-black font-semibold px-4 py-2 w-full h-min rounded-md">
              {t('recent_products.products.0.button')}
            </button>
          </div>
        </div>
    </div>
  );
};

export default LongAd2;
