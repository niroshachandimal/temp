import { useTranslation } from 'react-i18next';



const LongAd = () => {
  const { t } = useTranslation();
  const adDetails = [
    {
      title: 'Auto Body Detailing',
      price: '$35.00',
      label: t('Special_Discount'),
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.ctfassets.net%2Fuwf0n1j71a7j%2F6ihnLVbvnXPpEzduw0cvZH%2F81e1f68af3a77c000cf19c777324cd8c%2Fcar-detailing-guide.png&f=1&nofb=1&ipt=e301a7093e280ebb0aed8f422861308821d9aacd6f6958a5b4f556898ee825b9&ipo=images',
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

export default LongAd;
