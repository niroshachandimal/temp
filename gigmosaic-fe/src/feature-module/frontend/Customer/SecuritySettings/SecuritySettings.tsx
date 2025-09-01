import {
  FaLock,
  FaDesktop,
  FaUserShield,
  FaKey,
  FaTrash,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import { apiClient } from '../../../../api';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Alert, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from '@heroui/react';
import { AxiosError } from 'axios';
import { useAuth } from 'react-oidc-context';

// Define interface for device data
interface DeviceData {
  id: string;
  device: string;
  browser: string;
  operatingSystem: string;
  date: string;
  ipAddress: string;
  location: string;
  status: string;
  isCurrent: boolean;
}

// Define interface for account activity data
interface ActivityData {
  id: string;
  activityType: 'login' | 'logout' | 'password_change' | 'profile_update' | 'device_added' | 'device_removed' | 'settings_change';
  date: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  operatingSystem: string;
  status: 'success' | 'failed';
  details?: string;
}

const SecuritySettings = () => {
  // Password reset modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Device management modal
  const {
    isOpen: isDeviceModalOpen,
    onOpen: onDeviceModalOpen,
    onClose: onDeviceModalClose
  } = useDisclosure();

  // Account activity modal
  const {
    isOpen: isActivityModalOpen,
    onOpen: onActivityModalOpen,
    onClose: onActivityModalClose
  } = useDisclosure();

  // Two-Factor Authentication modal
  const {
    isOpen: isTwoFactorModalOpen,
    onOpen: onTwoFactorModalOpen,
    onClose: onTwoFactorModalClose
  } = useDisclosure();

  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [resetStep, setResetStep] = useState<'forgot' | 'verify' | 'reset'>('forgot');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [lastLoginTime, setLastLoginTime] = useState<string>('');
  const [lastPasswordChangeTime, setLastPasswordChangeTime] = useState<string>('');

  // Two-Factor Authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [twoFactorSetupStep, setTwoFactorSetupStep] = useState<'intro' | 'qrcode' | 'verify'>('intro');
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>('');
  const [twoFactorQrCode, setTwoFactorQrCode] = useState<string>('');
  const [twoFactorVerificationCode, setTwoFactorVerificationCode] = useState<string>('');
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState<boolean>(false);
  const [twoFactorAlertMessage, setTwoFactorAlertMessage] = useState<string>('');
  const [twoFactorAlertType, setTwoFactorAlertType] = useState<'success' | 'error'>('success');
  const [showTwoFactorAlert, setShowTwoFactorAlert] = useState<boolean>(false);

  // Device management state
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isRevokingDevice, setIsRevokingDevice] = useState(false);
  const [deviceAlertMessage, setDeviceAlertMessage] = useState('');
  const [deviceAlertType, setDeviceAlertType] = useState<'success' | 'error'>('success');
  const [showDeviceAlert, setShowDeviceAlert] = useState(false);

  // Account activity state
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityData[]>([]);
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activityAlertMessage, setActivityAlertMessage] = useState('');
  const [activityAlertType, setActivityAlertType] = useState<'success' | 'error'>('success');
  const [showActivityAlert, setShowActivityAlert] = useState(false);

  // Get user email from auth context when component mounts
  useEffect(() => {
    if (auth.user?.profile?.email) {
      setEmail(auth.user.profile.email);

      // Check if this is a new login
      const currentTime = new Date().toISOString();
      const storedLoginTime = localStorage.getItem('lastLoginTime');

      if (!storedLoginTime) {
        // First login, store the current time
        localStorage.setItem('lastLoginTime', currentTime);
        setLastLoginTime(formatDate(currentTime));
      } else {
        // Use the stored login time
        setLastLoginTime(formatDate(storedLoginTime));
      }

      // Get last password change time
      const storedPasswordChangeTime = localStorage.getItem('lastPasswordChange');
      if (storedPasswordChangeTime) {
        setLastPasswordChangeTime(formatDate(storedPasswordChangeTime));
      } else {
        // If no password change time is stored, use a default value
        setLastPasswordChangeTime('Not changed yet');
      }

      // Check if 2FA is enabled
      const twoFactorStatus = localStorage.getItem('twoFactorEnabled');
      if (twoFactorStatus === 'true') {
        setTwoFactorEnabled(true);
      }

      // Load device data
      fetchDevices();

      // Load account activity data
      fetchAccountActivity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  // Function to start 2FA setup process
  const startTwoFactorSetup = async () => {
    setIsTwoFactorLoading(true);
    setShowTwoFactorAlert(false);
    setTwoFactorSetupStep('intro');

    try {
      // In a real implementation, this would be an API call to generate a secret and QR code
      // const response = await apiClient.post('/api/v1/user/2fa/setup');
      // setTwoFactorSecret(response.data.secret);
      // setTwoFactorQrCode(response.data.qrCode);

      // Mock implementation - generate fake secret and QR code URL
      const mockSecret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      const mockQrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/GigMosaic:' +
        encodeURIComponent(auth.user?.profile?.email || 'user@example.com') +
        '?secret=' + mockSecret + '&issuer=GigMosaic';

      setTwoFactorSecret(mockSecret);
      setTwoFactorQrCode(mockQrCodeUrl);

      onTwoFactorModalOpen();
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      setTwoFactorAlertMessage('Failed to set up Two-Factor Authentication');
      setTwoFactorAlertType('error');
      setShowTwoFactorAlert(true);
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  // Function to verify 2FA setup with verification code
  const verifyTwoFactorSetup = async () => {
    if (!twoFactorVerificationCode) {
      setTwoFactorAlertMessage('Please enter the verification code');
      setTwoFactorAlertType('error');
      setShowTwoFactorAlert(true);
      return;
    }

    setIsTwoFactorLoading(true);
    setShowTwoFactorAlert(false);

    try {
      // In a real implementation, this would be an API call to verify the code
      // const response = await apiClient.post('/api/v1/user/2fa/verify', {
      //   secret: twoFactorSecret,
      //   code: twoFactorVerificationCode
      // });

      // Mock implementation - accept any 6-digit code
      if (twoFactorVerificationCode.length === 6 && /^\d+$/.test(twoFactorVerificationCode)) {
        // Success - 2FA is now enabled
        setTwoFactorEnabled(true);
        localStorage.setItem('twoFactorEnabled', 'true');

        setTwoFactorAlertMessage('Two-Factor Authentication has been enabled successfully');
        setTwoFactorAlertType('success');
        setShowTwoFactorAlert(true);

        // Close modal after a delay
        setTimeout(() => {
          onTwoFactorModalClose();
          setShowTwoFactorAlert(false);
        }, 2000);
      } else {
        // Invalid code
        setTwoFactorAlertMessage('Invalid verification code. Please try again.');
        setTwoFactorAlertType('error');
        setShowTwoFactorAlert(true);
      }
    } catch (error) {
      console.error('Error verifying 2FA setup:', error);
      setTwoFactorAlertMessage('Failed to verify Two-Factor Authentication setup');
      setTwoFactorAlertType('error');
      setShowTwoFactorAlert(true);
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  // Function to disable 2FA
  const disableTwoFactor = async () => {
    // Confirm before disabling
    if (!confirm('Are you sure you want to disable Two-Factor Authentication? This will reduce the security of your account.')) {
      return;
    }

    setIsTwoFactorLoading(true);

    try {
      // In a real implementation, this would be an API call to disable 2FA
      // await apiClient.post('/api/v1/user/2fa/disable');

      // Mock implementation
      setTwoFactorEnabled(false);
      localStorage.removeItem('twoFactorEnabled');

      setTwoFactorAlertMessage('Two-Factor Authentication has been disabled');
      setTwoFactorAlertType('success');
      setShowTwoFactorAlert(true);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      setTwoFactorAlertMessage('Failed to disable Two-Factor Authentication');
      setTwoFactorAlertType('error');
      setShowTwoFactorAlert(true);
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  // Mock function to fetch devices - would be replaced with actual API call
  const fetchDevices = async () => {
    try {
      // In a real implementation, this would be an API call
      // const response = await apiClient.get('/api/v1/user/devices');
      // setDevices(response.data);

      // Mock data for now
      const mockDevices: DeviceData[] = [
        {
          id: '1',
          device: 'Windows PC',
          browser: 'Chrome',
          operatingSystem: 'Windows 11',
          date: formatDate(new Date().toISOString()),
          ipAddress: '192.168.1.1',
          location: 'Toronto, Canada',
          status: 'active',
          isCurrent: true
        },
        {
          id: '2',
          device: 'MacBook Pro',
          browser: 'Safari',
          operatingSystem: 'macOS Monterey',
          date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          ipAddress: '192.168.1.2',
          location: 'Vancouver, Canada',
          status: 'active',
          isCurrent: false
        },
        {
          id: '3',
          device: 'iPhone 13',
          browser: 'Safari Mobile',
          operatingSystem: 'iOS 16',
          date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()),
          ipAddress: '192.168.1.3',
          location: 'Montreal, Canada',
          status: 'active',
          isCurrent: false
        }
      ];

      setDevices(mockDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDeviceAlertMessage('Failed to load device data');
      setDeviceAlertType('error');
      setShowDeviceAlert(true);
    }
  };

  // Function to revoke device access
  const handleRevokeDevice = async (deviceId: string) => {
    setIsRevokingDevice(true);

    try {
      // In a real implementation, this would be an API call
      // await apiClient.post('/api/v1/user/devices/revoke', { deviceId });

      // Mock implementation - filter out the revoked device
      setDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId));

      setDeviceAlertMessage('Device access revoked successfully');
      setDeviceAlertType('success');
      setShowDeviceAlert(true);
    } catch (error) {
      console.error('Error revoking device access:', error);
      setDeviceAlertMessage('Failed to revoke device access');
      setDeviceAlertType('error');
      setShowDeviceAlert(true);
    } finally {
      setIsRevokingDevice(false);
    }
  };

  // Mock function to fetch account activity - would be replaced with actual API call
  const fetchAccountActivity = async () => {
    setIsLoadingActivities(true);

    try {
      // In a real implementation, this would be an API call
      // const response = await apiClient.get('/api/v1/user/activity');
      // setActivities(response.data);

      // Mock data for now
      const mockActivities: ActivityData[] = [
        {
          id: '1',
          activityType: 'login',
          date: formatDate(new Date().toISOString()),
          ipAddress: '192.168.1.1',
          location: 'Toronto, Canada',
          device: 'Windows PC',
          browser: 'Chrome',
          operatingSystem: 'Windows 11',
          status: 'success'
        },
        {
          id: '2',
          activityType: 'password_change',
          date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()),
          ipAddress: '192.168.1.1',
          location: 'Toronto, Canada',
          device: 'Windows PC',
          browser: 'Chrome',
          operatingSystem: 'Windows 11',
          status: 'success'
        },
        {
          id: '3',
          activityType: 'login',
          date: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()),
          ipAddress: '192.168.1.2',
          location: 'Vancouver, Canada',
          device: 'MacBook Pro',
          browser: 'Safari',
          operatingSystem: 'macOS Monterey',
          status: 'success'
        },
        {
          id: '4',
          activityType: 'profile_update',
          date: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()),
          ipAddress: '192.168.1.1',
          location: 'Toronto, Canada',
          device: 'Windows PC',
          browser: 'Chrome',
          operatingSystem: 'Windows 11',
          status: 'success',
          details: 'Updated profile information'
        },
        {
          id: '5',
          activityType: 'login',
          date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          ipAddress: '192.168.1.3',
          location: 'Montreal, Canada',
          device: 'iPhone 13',
          browser: 'Safari Mobile',
          operatingSystem: 'iOS 16',
          status: 'failed',
          details: 'Incorrect password'
        },
        {
          id: '6',
          activityType: 'login',
          date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3600000).toISOString()),
          ipAddress: '192.168.1.3',
          location: 'Montreal, Canada',
          device: 'iPhone 13',
          browser: 'Safari Mobile',
          operatingSystem: 'iOS 16',
          status: 'success'
        },
        {
          id: '7',
          activityType: 'device_added',
          date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()),
          ipAddress: '192.168.1.3',
          location: 'Montreal, Canada',
          device: 'iPhone 13',
          browser: 'Safari Mobile',
          operatingSystem: 'iOS 16',
          status: 'success',
          details: 'New device added to account'
        }
      ];

      setActivities(mockActivities);
      setFilteredActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching account activity:', error);
      setActivityAlertMessage('Failed to load account activity data');
      setActivityAlertType('error');
      setShowActivityAlert(true);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Function to filter activities by type
  const filterActivities = (filterType: string) => {
    setActivityFilter(filterType);

    if (filterType === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter(activity => activity.activityType === filterType)
      );
    }
  };

  // Function to get activity type label
  const getActivityTypeLabel = (type: string): string => {
    switch (type) {
      case 'login':
        return 'Login';
      case 'logout':
        return 'Logout';
      case 'password_change':
        return 'Password Change';
      case 'profile_update':
        return 'Profile Update';
      case 'device_added':
        return 'Device Added';
      case 'device_removed':
        return 'Device Removed';
      case 'settings_change':
        return 'Settings Change';
      default:
        return 'Unknown Activity';
    }
  };

  // Function to get activity type icon
  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <FaKey size={16} className="text-green-500" />;
      case 'logout':
        return <FaKey size={16} className="text-gray-500" />;
      case 'password_change':
        return <FaLock size={16} className="text-blue-500" />;
      case 'profile_update':
        return <FaUserShield size={16} className="text-purple-500" />;
      case 'device_added':
        return <FaDesktop size={16} className="text-indigo-500" />;
      case 'device_removed':
        return <FaDesktop size={16} className="text-red-500" />;
      case 'settings_change':
        return <FaUserShield size={16} className="text-orange-500" />;
      default:
        return <FaUserShield size={16} className="text-gray-500" />;
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const forgotPassword = async () => {
    if (!email) {
      setAlertMessage('Please enter your email first');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsRequestingCode(true);
    setShowAlert(false);

    try {
      // Call the forgotPassword API endpoint
      await apiClient.post('/api/v1/auth/forgotPassword', {
        email
      });

      setAlertMessage('Password reset code sent to your email');
      setAlertType('success');
      setShowAlert(true);
      setResetStep('verify');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      const axiosError = error as AxiosError<{message: string}>;
      setAlertMessage(axiosError.response?.data?.message || 'Error initiating password reset. Please try again.');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setIsRequestingCode(false);
    }
  };

  const requestVerificationCode = async () => {
    if (!email) {
      setAlertMessage('Please enter your email first');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsRequestingCode(true);
    setShowAlert(false);

    try {
      // Call the resendCode API endpoint
      await apiClient.post('/api/v1/auth/resendCode', {
        email
      });

      setAlertMessage('Verification code resent to your email');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error resending verification code:', error);
      const axiosError = error as AxiosError<{message: string}>;
      setAlertMessage(axiosError.response?.data?.message || 'Error resending verification code. Please try again.');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleResetPassword = async () => {
    // Validate form based on current step
    if (resetStep === 'forgot') {
      await forgotPassword();
      return;
    } else if (resetStep === 'verify' && (!email || !verificationCode)) {
      setAlertMessage('Please enter both email and verification code');
      setAlertType('error');
      setShowAlert(true);
      return;
    } else if (resetStep === 'reset' && (!email || !verificationCode || !newPassword)) {
      setAlertMessage('Please fill in all required fields');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    // If we're in the verify step, move to reset step
    if (resetStep === 'verify' && verificationCode) {
      setResetStep('reset');
      setAlertMessage('Please enter your new password');
      setAlertType('success');
      setShowAlert(true);
      return;
    }

    // Only proceed with API call if we're in the reset step
    if (resetStep === 'reset') {
      setIsLoading(true);
      setShowAlert(false);

      try {
        const response = await apiClient.post('/api/v1/auth/resetPassword', {
          email,
          verificationCode,
          newPassword
        });

        if (response.data.success) {
          setAlertMessage('Password has been reset successfully');
          setAlertType('success');
          setShowAlert(true);

          // Update last password change time
          const currentTime = new Date().toISOString();
          localStorage.setItem('lastPasswordChange', currentTime);
          setLastPasswordChangeTime(formatDate(currentTime));

          // Clear form fields
          setVerificationCode('');
          setNewPassword('');

          // Reset the step
          setResetStep('forgot');

          // Close modal after a delay
          setTimeout(() => {
            onClose();
            setShowAlert(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        const axiosError = error as AxiosError<{message: string}>;
        setAlertMessage(axiosError.response?.data?.message || 'Error resetting password. Please try again.');
        setAlertType('error');
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <BreadCrumb title="Security" item1="Settings" />
      <h2 className="text-2xl font-semibold mb-4">Security</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          {/* Password */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4">
              <FaLock className="text-gray-600" size={20} />
              <div>
                <h3 className="font-semibold">Password</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Last login: {lastLoginTime || 'Not available'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Last changed: {lastPasswordChangeTime || 'Not available'}
                  </p>
                  {auth.user?.profile?.email && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                      Account: {auth.user.profile.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <CustomButton
              color="primary"
              
              label="Change Password"
              onPress={() => {
                setResetStep('forgot');
                setShowAlert(false);
                onOpen();
              }}
            />
          </div>

          {/* Reset Password Modal */}
          <Modal
            isOpen={isOpen}
            onClose={() => {
              setResetStep('forgot');
              setVerificationCode('');
              setNewPassword('');
              setShowAlert(false);
              onClose();
            }}
            placement="center"
            backdrop="blur"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                {resetStep === 'forgot' ? 'Forgot Password' : resetStep === 'verify' ? 'Enter Verification Code' : 'Reset Password'}
              </ModalHeader>
              <ModalBody>
                {showAlert && (
                  <Alert className="mb-4" color={alertType === 'success' ? 'success' : 'danger'}>
                    {alertMessage}
                  </Alert>
                )}

                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex flex-col items-center ${resetStep === 'forgot' ? 'text-primary-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${resetStep === 'forgot' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>1</div>
                    <span className="text-xs">Request</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${resetStep === 'forgot' ? 'bg-gray-200' : 'bg-primary-500'}`}></div>
                  <div className={`flex flex-col items-center ${resetStep === 'verify' ? 'text-primary-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${resetStep === 'verify' ? 'bg-primary-500 text-white' : resetStep === 'reset' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>2</div>
                    <span className="text-xs">Verify</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${resetStep === 'reset' ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                  <div className={`flex flex-col items-center ${resetStep === 'reset' ? 'text-primary-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${resetStep === 'reset' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>3</div>
                    <span className="text-xs">Reset</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Email input - shown in all steps */}
                  <div className="space-y-1">
                    <CustomInput
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onValueChange={setEmail}
                      isRequired
                      isReadOnly={!!auth.user?.profile?.email || resetStep !== 'forgot'}
                    />
                    {auth.user?.profile?.email && (
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Using email from your account
                      </div>
                    )}
                  </div>

                  {/* Verification code input - shown in verify and reset steps */}
                  {(resetStep === 'verify' || resetStep === 'reset') && (
                    <div className="flex flex-col gap-2">
                      <CustomInput
                        label="Verification Code"
                        type="text"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onValueChange={setVerificationCode}
                        isRequired
                      />
                      <div className="flex justify-end">
                        <CustomButton
                          size="sm"
                          color="secondary"
                          variant="flat"
                          label="Resend Code"
                          isLoading={isRequestingCode}
                          onPress={requestVerificationCode}
                        />
                      </div>
                    </div>
                  )}

                  {/* New password input - shown only in reset step */}
                  {resetStep === 'reset' && (
                    <CustomInput
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onValueChange={setNewPassword}
                      isRequired
                    />
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  color="danger"
                  variant="flat"
                  label="Cancel"
                  onPress={() => {
                    setResetStep('forgot');
                    onClose();
                  }}
                />
                <CustomButton
                  color="primary"
                  label={
                    resetStep === 'forgot'
                      ? 'Request Code'
                      : resetStep === 'verify'
                        ? 'Verify Code'
                        : 'Reset Password'
                  }
                  onPress={handleResetPassword}
                  isLoading={isLoading || isRequestingCode}
                />
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Two-Factor Authentication */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4">
              <FaKey className="text-gray-600" size={20} />
              <div>
                <h3 className="font-semibold">Two Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  Enhance security with 2FA
                </p>

                {twoFactorEnabled ? (
                  <span className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded flex items-center gap-1 mt-1 w-fit">
                    <FaCheck size={12} /> Enabled
                  </span>
                ) : (
                  <span className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded flex items-center gap-1 mt-1 w-fit">
                    <FaTimes size={12} /> Disabled
                  </span>
                )}

                {showTwoFactorAlert && (
                  <Alert className="mt-2" color={twoFactorAlertType === 'success' ? 'success' : 'danger'}>
                    {twoFactorAlertMessage}
                  </Alert>
                )}
              </div>
            </div>

            {twoFactorEnabled ? (
              <CustomButton
                color="danger"
                label="Disable"
                onPress={disableTwoFactor}
                isLoading={isTwoFactorLoading}
              />
            ) : (
              <CustomButton
                color="primary"
                label="Enable"
                onPress={startTwoFactorSetup}
                isLoading={isTwoFactorLoading}
                startContent={<FaShieldAlt size={14} />}
              />
            )}
          </div>

          {/* Two-Factor Authentication Setup Modal */}
          <Modal
            isOpen={isTwoFactorModalOpen}
            onClose={() => {
              setTwoFactorSetupStep('intro');
              setTwoFactorVerificationCode('');
              setShowTwoFactorAlert(false);
              onTwoFactorModalClose();
            }}
            placement="center"
            backdrop="blur"
            size="lg"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                {twoFactorSetupStep === 'intro'
                  ? 'Set Up Two-Factor Authentication'
                  : twoFactorSetupStep === 'qrcode'
                    ? 'Scan QR Code'
                    : 'Verify Setup'}
              </ModalHeader>
              <ModalBody>
                {showTwoFactorAlert && (
                  <Alert className="mb-4" color={twoFactorAlertType === 'success' ? 'success' : 'danger'}>
                    {twoFactorAlertMessage}
                  </Alert>
                )}

                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex flex-col items-center ${twoFactorSetupStep === 'intro' ? 'text-primary-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${twoFactorSetupStep === 'intro' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>1</div>
                    <span className="text-xs">Info</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${twoFactorSetupStep === 'intro' ? 'bg-gray-200' : 'bg-primary-500'}`}></div>
                  <div className={`flex flex-col items-center ${twoFactorSetupStep === 'qrcode' ? 'text-primary-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${twoFactorSetupStep === 'qrcode' ? 'bg-primary-500 text-white' : twoFactorSetupStep === 'verify' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>2</div>
                    <span className="text-xs">QR Code</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${twoFactorSetupStep === 'verify' ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                  <div className={`flex flex-col items-center ${twoFactorSetupStep === 'verify' ? 'text-primary-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${twoFactorSetupStep === 'verify' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>3</div>
                    <span className="text-xs">Verify</span>
                  </div>
                </div>

                {/* Step content */}
                {twoFactorSetupStep === 'intro' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Enhance Your Account Security</h3>
                    <p className="text-sm text-gray-600">
                      Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password when you sign in.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                      <h4 className="text-md font-medium flex items-center gap-2 text-blue-700">
                        <FaInfoCircle /> Before you begin
                      </h4>
                      <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
                        <li>You'll need to download an authenticator app on your mobile device</li>
                        <li>We recommend Google Authenticator, Microsoft Authenticator, or Authy</li>
                        <li>Make sure you have your mobile device with you</li>
                      </ul>
                    </div>
                  </div>
                )}

                {twoFactorSetupStep === 'qrcode' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Scan the QR Code</h3>
                    <p className="text-sm text-gray-600">
                      Open your authenticator app and scan the QR code below. The app will generate a 6-digit code that changes every 30 seconds.
                    </p>

                    <div className="flex justify-center p-4 bg-white border rounded-md">
                      {twoFactorQrCode && (
                        <img
                          src={twoFactorQrCode}
                          alt="QR Code for Two-Factor Authentication"
                          className="w-48 h-48"
                        />
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h4 className="text-md font-medium">Manual Setup</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        If you can't scan the QR code, enter this code manually in your app:
                      </p>
                      <div className="bg-gray-100 p-2 rounded mt-2 font-mono text-sm break-all">
                        {twoFactorSecret}
                      </div>
                    </div>
                  </div>
                )}

                {twoFactorSetupStep === 'verify' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Verify Setup</h3>
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit verification code from your authenticator app to complete the setup.
                    </p>

                    <CustomInput
                      label="Verification Code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={twoFactorVerificationCode}
                      onValueChange={setTwoFactorVerificationCode}
                      isRequired
                    />

                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                      <h4 className="text-md font-medium flex items-center gap-2 text-yellow-700">
                        <FaInfoCircle /> Important
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Store your recovery codes in a safe place. If you lose access to your authenticator app, you'll need these codes to regain access to your account.
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {twoFactorSetupStep === 'intro' ? (
                  <>
                    <CustomButton
                      color="danger"
                      variant="flat"
                      label="Cancel"
                      onPress={onTwoFactorModalClose}
                    />
                    <CustomButton
                      color="primary"
                      label="Next"
                      onPress={() => setTwoFactorSetupStep('qrcode')}
                    />
                  </>
                ) : twoFactorSetupStep === 'qrcode' ? (
                  <>
                    <CustomButton
                      color="danger"
                      variant="flat"
                      label="Back"
                      onPress={() => setTwoFactorSetupStep('intro')}
                    />
                    <CustomButton
                      color="primary"
                      label="Next"
                      onPress={() => setTwoFactorSetupStep('verify')}
                    />
                  </>
                ) : (
                  <>
                    <CustomButton
                      color="danger"
                      variant="flat"
                      label="Back"
                      onPress={() => setTwoFactorSetupStep('qrcode')}
                    />
                    <CustomButton
                      color="primary"
                      label="Verify & Enable"
                      onPress={verifyTwoFactorSetup}
                      isLoading={isTwoFactorLoading}
                    />
                  </>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Phone Verification */}
          {/* <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4">
              <FaMobileAlt className="text-gray-600" size={20} />
              <div>
                <h3 className="font-semibold">Phone Number Verification</h3>
                <p className="text-sm text-gray-500">
                  Verify your phone for security
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <CustomButton color="primary" label="Change" />
                <CustomButton color="danger" label="Remove" />
              </div>
            </div>
          </div> */}

          {/* Email Verification */}
          {/* <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-gray-600" size={20} />
              <div>
                <h3 className="font-semibold">Email Verification</h3>
                <p className="text-sm text-gray-500">Your email is verified</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <CustomButton color="primary" label="Change" />
                <CustomButton color="danger" label="Remove" />
              </div>
            </div>
          </div> */}

          {/* Device Management */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4">
              <FaDesktop className="text-gray-600" size={20} />
              <div>
                <h3 className="font-semibold">Device Management</h3>
                <p className="text-sm text-gray-500">
                  Manage your connected devices
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {devices.length} device{devices.length !== 1 ? 's' : ''} connected to your account
                </p>
              </div>
            </div>
            <CustomButton
              color="primary"
              
              label="Manage"
              onPress={onDeviceModalOpen}
            />
          </div>

          {/* Device Management Modal */}
          <Modal
            isOpen={isDeviceModalOpen}
            onClose={onDeviceModalClose}
            placement="center"
            backdrop="blur"
            size="3xl"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                Device Management
              </ModalHeader>
              <ModalBody>
                {showDeviceAlert && (
                  <Alert className="mb-4" color={deviceAlertType === 'success' ? 'success' : 'danger'}>
                    {deviceAlertMessage}
                  </Alert>
                )}

                <p className="text-sm text-gray-600 mb-4">
                  These are the devices that have logged into your account. Review the list and revoke access for any devices you don't recognize.
                </p>

                <Table aria-label="Devices connected to your account">
                  <TableHeader>
                    <TableColumn>DEVICE</TableColumn>
                    <TableColumn>MOST RECENT ACTIVITY</TableColumn>
                    <TableColumn>LOCATION</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{device.device}</p>
                            <p className="text-xs text-gray-500">{device.browser} • {device.operatingSystem}</p>
                            {device.isCurrent && (
                              <Chip size="sm" color="success" variant="flat" className="mt-1">
                                Current Device
                              </Chip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{device.date}</p>
                            <p className="text-xs text-gray-500">{device.ipAddress}</p>
                          </div>
                        </TableCell>
                        <TableCell>{device.location}</TableCell>
                        <TableCell>
                          <Chip color={device.status === 'active' ? 'success' : 'danger'} variant="flat">
                            {device.status === 'active' ? 'Active' : 'Revoked'}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {device.isCurrent ? (
                            <Tooltip content="You cannot revoke your current device">
                              <span>
                                <CustomButton
                                  color="danger"
                                  variant="flat"
                                  label="Revoke"
                                  isDisabled={true}
                                  size="sm"
                                />
                              </span>
                            </Tooltip>
                          ) : (
                            <CustomButton
                              color="danger"
                              variant="flat"
                              label="Revoke"
                              isLoading={isRevokingDevice}
                              onPress={() => handleRevokeDevice(device.id)}
                              size="sm"
                              startContent={<FaTrash size={12} />}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  color="danger"
                  variant="flat"
                  label="Revoke All Other Devices"
                  onPress={() => {
                    // Filter out current device and revoke all others
                    const otherDeviceIds = devices
                      .filter(device => !device.isCurrent)
                      .map(device => device.id);

                    // Confirm before revoking all
                    if (otherDeviceIds.length > 0 && confirm('Are you sure you want to revoke access for all other devices?')) {
                      otherDeviceIds.forEach(id => handleRevokeDevice(id));
                    }
                  }}
                  startContent={<FaExclamationTriangle size={14} />}
                />
                <CustomButton
                  color="primary"
                  label="Close"
                  onPress={onDeviceModalClose}
                />
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Account Activity */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <FaUserShield className="text-gray-600" size={20} />
              <div>
                <h3 className="font-semibold">Account Activity</h3>
                <p className="text-sm text-gray-500">
                  View recent login activity
                </p>
                {activities.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last activity: {activities[0].date}
                  </p>
                )}
              </div>
            </div>

            <CustomButton
              color="primary"
              label="Manage"
              onPress={onActivityModalOpen}
            />
          </div>

          {/* Account Activity Modal */}
          <Modal
            isOpen={isActivityModalOpen}
            onClose={onActivityModalClose}
            placement="center"
            backdrop="blur"
            size="4xl"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                Account Activity Log
              </ModalHeader>
              <ModalBody>
                {showActivityAlert && (
                  <Alert className="mb-4" color={activityAlertType === 'success' ? 'success' : 'danger'}>
                    {activityAlertMessage}
                  </Alert>
                )}

                <p className="text-sm text-gray-600 mb-4">
                  This is a record of recent activity in your account. Review this log to ensure all actions were performed by you.
                </p>

                {/* Activity Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <CustomButton
                    size="sm"
                    color={activityFilter === 'all' ? 'primary' : 'default'}
                    variant={activityFilter === 'all' ? 'solid' : 'flat'}
                    label="All Activities"
                    onPress={() => filterActivities('all')}
                  />
                  <CustomButton
                    size="sm"
                    color={activityFilter === 'login' ? 'primary' : 'default'}
                    variant={activityFilter === 'login' ? 'solid' : 'flat'}
                    label="Logins"
                    onPress={() => filterActivities('login')}
                  />
                  <CustomButton
                    size="sm"
                    color={activityFilter === 'password_change' ? 'primary' : 'default'}
                    variant={activityFilter === 'password_change' ? 'solid' : 'flat'}
                    label="Password Changes"
                    onPress={() => filterActivities('password_change')}
                  />
                  <CustomButton
                    size="sm"
                    color={activityFilter === 'profile_update' ? 'primary' : 'default'}
                    variant={activityFilter === 'profile_update' ? 'solid' : 'flat'}
                    label="Profile Updates"
                    onPress={() => filterActivities('profile_update')}
                  />
                  <CustomButton
                    size="sm"
                    color={activityFilter === 'device_added' ? 'primary' : 'default'}
                    variant={activityFilter === 'device_added' ? 'solid' : 'flat'}
                    label="Device Changes"
                    onPress={() => filterActivities('device_added')}
                  />
                </div>

                {/* Activity Table */}
                <Table aria-label="Account activity log">
                  <TableHeader>
                    <TableColumn>ACTIVITY</TableColumn>
                    <TableColumn>DATE & TIME</TableColumn>
                    <TableColumn>DEVICE</TableColumn>
                    <TableColumn>LOCATION</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {isLoadingActivities ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                            <span className="ml-2">Loading activity data...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="text-center p-4 text-gray-500">
                            No activity records found
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActivityTypeIcon(activity.activityType)}
                              <div>
                                <p className="font-medium">{getActivityTypeLabel(activity.activityType)}</p>
                                {activity.details && (
                                  <p className="text-xs text-gray-500">{activity.details}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{activity.date}</p>
                              <p className="text-xs text-gray-500">{activity.ipAddress}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{activity.device}</p>
                              <p className="text-xs text-gray-500">{activity.browser} • {activity.operatingSystem}</p>
                            </div>
                          </TableCell>
                          <TableCell>{activity.location}</TableCell>
                          <TableCell>
                            <Chip
                              color={activity.status === 'success' ? 'success' : 'danger'}
                              variant="flat"
                              size="sm"
                            >
                              {activity.status === 'success' ? 'Success' : 'Failed'}
                            </Chip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  color="primary"
                  label="Close"
                  onPress={onActivityModalClose}
                />
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

        {/* Actions */}
        {/* <div className="flex justify-end mt-6 gap-4">
          <CustomButton color="secondary" label="Manage" />
          <CustomButton color="success" label="Save Changes" />
        </div> */}
      </div>
    </div>
  );
};

export default SecuritySettings;
