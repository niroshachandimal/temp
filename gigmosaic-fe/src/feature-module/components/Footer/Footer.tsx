import { FaFacebookF, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import gigImage from '../../../assets/logo/Seamless Services, Infinite Possibilities. (2).png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-gradient-to-tr from-slate-800 via-neutral-9000 to-gray-950 text-white flex flex-col items-center p-5">
      {/* Footer Links */}
      <div className="w-full flex justify-around mt-10">
        <div>
          <h3 className="text-[18px] font-semibold">
            {t('footer.sections.0.title')}
          </h3>
          <ul className="list-disc text-[15px] font-primary space-y-1 mt-2 ">
            <li>
              <a href="/computer" className="hover:underline">
                {t('footer.sections.0.items.item1')}
              </a>
            </li>
            <li>
              <a href="/contraction" className="hover:underline">
                {t('footer.sections.0.items.item2')}
              </a>
            </li>
            <li>
              <a href="/cleaning" className="hover:underline">
                {t('footer.sections.0.items.item3')}
              </a>
            </li>
            <li>
              <a href="/plumbing" className="hover:underline">
                {t('footer.sections.0.items.item4')}
              </a>
            </li>
            <li>
              <a href="/car-wash" className="hover:underline">
                {t('footer.sections.0.items.item5')}
              </a>
            </li>
            <li>
              <a href="/electrical" className="hover:underline">
                {t('footer.sections.0.items.item6')}
              </a>
            </li>
            <li>
              <a href="/software-development" className="hover:underline">
                {t('footer.sections.0.items.item7')}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-[18px] font-semibold">
            {t('footer.sections.1.title')}
          </h3>
          <ul className="list-disc text-[15px] font-primary space-y-1 mt-2">
            <li>
              <a href="/my-account" className="hover:underline">
                {t('footer.sections.1.items.item1')}
              </a>
            </li>
            <li>
              <a href="/login-register" className="hover:underline">
                {t('footer.sections.1.items.item2')}
              </a>
            </li>
            <li>
              <a href="/wishlist" className="hover:underline">
                {t('footer.sections.1.items.item3')}
              </a>
            </li>
            <li>
              <a href="/about-us" className="hover:underline">
                {t('footer.sections.1.items.item4')}
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:underline">
                {t('footer.sections.1.items.item5')}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-[18px] font-semibold">
            {t('footer.sections.2.title')}
          </h3>
          <ul className="list-disc text-[15px] font-primary space-y-1 mt-2">
            <li>
              <a href="/contact-us" className="hover:underline">
                {t('footer.sections.2.items.item1')}
              </a>
            </li>
            <li>
              <a href="/redeem-voucher" className="hover:underline">
                {t('footer.sections.2.items.item2')}
              </a>
            </li>
            <li>
              <a href="/support" className="hover:underline">
                {t('footer.sections.2.items.item3')}
              </a>
            </li>
            <li>
              <a href="/affiliate" className="hover:underline">
                {t('footer.sections.2.items.item4')}
              </a>
            </li>
            <li>
              <a href="/policies-rules" className="hover:underline">
                {t('footer.sections.2.items.item5')}
              </a>
            </li>
          </ul>
        </div>
        {/* <div>
          <h3 className="text-[18px] font-semibold">{t('footer.sections.3.title')}</h3>
          <ul className="text-[15px] font-[Roboto] space-y-1 mt-2">
            <li>{t('footer.sections.3.items.item1')}</li>
            <li>{t('footer.sections.3.items.item2')}</li>
            <li>{t('footer.sections.3.items.item3')}</li>
          </ul>
        </div> */}
        {/* Logo and Tagline */}
        <div className="text-center flex flex-col items-center ">
          <img
            src={gigImage}
            alt="Gig Mosaic"
            className="w-min h-auto rounded-lg mb-0"
          />
          <p className="text-[15px] font-primary">
            {t('footer.description')} <br />
            {t('footer.description_1')}
          </p>
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mt-5">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
            >
              <FaFacebookF className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
            >
              <FaYoutube className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
            >
              <FaTwitter className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
            >
              <FaLinkedin className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="flex items-center justify-center w-full mt-0">
        <p className="text-[12px]">{t('footer.copyright')}</p>
      </div>
      <div>
        <h6 className='text-[12px] text-gray-500'>
           version 1.0.0
        </h6>
       
      </div>
    </div>
  );
};

export default Footer;
