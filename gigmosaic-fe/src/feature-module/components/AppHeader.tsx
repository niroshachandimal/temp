// import { FaRegUser } from 'react-icons/fa';
import logo from '../../assets/logo/1 (1).png';
// import { BiBell } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import Language from './common/Language';
import CustomButton from './CustomButton';
import { FaHome } from 'react-icons/fa';

const AppHeader = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="w-full max-md:flex-wrap max-md:gap-4 max-md:p-4 max-sm:p-2.5 border-b">
      <div className="px-14 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Gig Mosaic Logo"
              className="object-contain h-16 w-auto"
            />
          </Link>
        </div>
        <div className="flex items-center">
          <CustomButton
            label="Home"
            color="primary"
            variant="solid"
            size="md"
            radius="sm"
            startContent={<FaHome />}
            onPress={handleGoHome}
            className="px-4"
          />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
