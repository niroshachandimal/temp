import React from 'react';
import logo from '../../../../../public/favicon.png';
import CustomButton from '../../CustomButton';
import { MdOutlineLogin } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { ROLE } from '../../../../Role';
import { toast } from 'react-toastify';

interface ReusableModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  // onAction?: () => void;
  // actionLabel?: string;
  // closeLabel?: string;
}

const MessageModal: React.FC<ReusableModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
}) => {
  if (!isOpen) return null;

  const CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
  const DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN;
  const SIGN_IN_REDIRECT_URI = import.meta.env.VITE_APP_SIGN_IN_REDIRECT_URI;
  const SIGN_UP_REDIRECT_URI = import.meta.env.VITE_APP_SIGN_UP_REDIRECT_URI;

  const redirectToCognito = () => {
    if (!CLIENT_ID || !DOMAIN || !SIGN_IN_REDIRECT_URI) {
      console.error('Missing login configuration.');
      toast.error('Missing login configuration.');
      return;
    }
    window.location.href = `https://${DOMAIN}/login?client_id=${CLIENT_ID}&redirect_uri=${SIGN_IN_REDIRECT_URI}&response_type=code&scope=email+openid+profile`;
  };

  const buildSignUpUrl = () => {
    if (!CLIENT_ID || !DOMAIN || !SIGN_IN_REDIRECT_URI) {
      console.error('Missing registration configuration.');
      toast.error('Missing registration configuration.');
      return;
    }
    window.location.href = `https://${DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${SIGN_UP_REDIRECT_URI}&state=${ROLE.CUSTOMER}`;
  };

  const handleLogin = () => {
    redirectToCognito();
    onClose();
  };

  const handleLRegi = () => {
    buildSignUpUrl();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 shadow-lg ">
      <div className="bg-white text-gray-800 rounded-md max-w-xl w-full shadow-lg p-6 relative ">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-zinc-800 hover:text-red-600 "
          onClick={onClose}
        >
          {/* × */}
          <AiOutlineClose size={16} />
        </button>

        {/* Title */}
        <div className="flex flex-col justify-center items-center mt-8">
          <img src={logo} alt="Logo" className="w-14 h-14 mb-2" />
          <h2 className="flex justify-center items-center text-xl font-bold mb-4 text-gray-600">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="text-sm max-h-72 overflow-y-auto space-y-3">
          {children}
        </div>

        {/* Actions */}
        <CustomButton
          label="Login"
          fullWidth
          color="primary"
          radius="sm"
          size="md"
          onPress={handleLogin}
          className="text-md font-semibold mt-5 mb-3"
          endContent={<MdOutlineLogin />}
        />
        <CustomButton
          label="Register"
          fullWidth
          color="primary"
          radius="sm"
          size="md"
          onPress={handleLRegi}
          className="text-md font-semibold  mb-3"
          variant="bordered"
        />
        {/* <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-pink-400 hover:text-pink-300 text-sm font-medium"
          >
            {closeLabel}
          </button>
          {onAction && (
            <button
              onClick={onAction}
              className="bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-blue-600"
            >
              {actionLabel}
            </button>
          )} */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default MessageModal;
