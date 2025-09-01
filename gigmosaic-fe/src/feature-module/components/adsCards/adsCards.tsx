import { useTranslation } from 'react-i18next';

const AdsCards = () => {
  const { t } = useTranslation();
  const cards = [
    {
      title: 'Flooring Installation',
      price: '$35.00',
      label: t('recent_products.header'),
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthreetreesflooring.ca%2Fwp-content%2Fuploads%2F2021%2F03%2Fcost-to-install-engineered-hardwood-floor.jpg&f=1&nofb=1&ipt=33c69002852b58845cc16605f0612f1ec32120740283a77239bfeedaf0c17e3f&ipo=images',
    },
    {
      title: 'Security Camera Installation',
      price: '$56',
      label: t('hot_products.header'),
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.gensecurity.com%2Fhs-fs%2Fhubfs%2FBlog%2FTechnician-installing-CCTV-Camera.jpg%3Fwidth%3D1200%26name%3DTechnician-installing-CCTV-Camera.jpg&f=1&nofb=1&ipt=64e390a28dcdae2549b9cbc7b84f190ae501ae5c0175ae4a1095a75f00dca971&ipo=images',
    },
  ];

  return (
    <div className="flex justify-center gap-6 py-5 mt-5">
      {cards.map((card, index) => (
        <div
          key={index}
          className="w-full h-auto flex items-center justify-between p-6 rounded-lg shadow-lg relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(83, 83, 83, 0.8), rgba(83, 83, 83, 0)), url('${card.image}')`,
          }}
        >
          {/* Left Content */}
          <div className="text-white">
            <p className="text-[#FED604] text-sm uppercase font-semibold">
              {card.label}
            </p>
            <h2 className="text-2xl leading-tight">
              {card.title.split(' ')[0]} <br />{' '}
              {card.title.split(' ').slice(1).join(' ')}
            </h2>
            <p className="mt-2 text-lg">
              {t('recent_products.products.0.price')}{' '}
              <span className="font-semibold">{card.price}</span>
            </p>
            <button className="mt-4 bg-[#FED604] text-black font-semibold px-4 py-2 w-full h-min rounded-md">
              {t('recent_products.products.0.button')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdsCards;
