import { FaUserCircle, FaExternalLinkAlt, FaCopy } from 'react-icons/fa';
import {
  Select,
  SelectItem,
  DatePicker,
  Textarea,
  Alert,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Progress,
} from '@heroui/react';
import CustomInput from '../../../components/CustomInput';
import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';
import CustomButton from '../../../components/CustomButton';
import { useAuth } from 'react-oidc-context';
import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '../../../../api';
import { uploadToS3, deleteFromS3 } from '../aws/s3FileUpload';
import { ROLE } from '../../../../Role';

// Define user data interface
interface UserData {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  currency?: string;
  language?: string;
  profileImage?: string;
}

const AccountSettings = () => {
  const auth = useAuth();
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Role-based address editing states
  const [isProvider, setIsProvider] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [showProviderPortalAlert, setShowProviderPortalAlert] = useState(false);

  // Profile image states
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showImageUrl, setShowImageUrl] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // Get user ID from auth context - using preferred_username as primary identifier
  // Fall back to 'sub' or email if preferred_username is not available
  const preferredUsername = auth.user?.profile?.preferred_username;
  const sub = auth.user?.profile?.sub;
  const email = auth.user?.profile?.email;

  // Use the first available identifier
  const uid = preferredUsername || sub || email;

  // Note: Token refresh functionality has been disabled as requested

  // Check user role and set appropriate state
  useEffect(() => {
    if (auth.user) {
      console.log('User authenticated:', auth.user.profile);
      console.log('User ID (preferred_username):', uid);

      // Log all available profile fields to help identify user information
      console.log('All profile fields:', Object.keys(auth.user.profile));
      console.log('Profile data:', auth.user.profile);

      // Check user roles from cognito groups
      const roles = auth.user?.profile['cognito:groups'] as
        | string[]
        | undefined;
      const hasProviderRole = roles?.includes(ROLE.PROVIDER);
      const hasCustomerRole = roles?.includes(ROLE.CUSTOMER);

      console.log('Has provider role:', hasProviderRole);
      console.log('Has customer role:', hasCustomerRole);

      setIsProvider(hasProviderRole || false);
      setIsCustomer(hasCustomerRole || false);

      // Address fields are disabled for all users
      // No verification needed as fields are not editable

      if (!uid) {
        console.warn(
          'preferred_username is not available in the user profile!'
        );
        console.log('Checking alternative user identifiers...');
        console.log('sub:', auth.user.profile.sub);
        console.log('email:', auth.user.profile.email);
      }
    } else {
      console.log('No authenticated user found');
    }
  }, [auth.user, uid]);

  // Function to fetch user data - wrapped in useCallback to prevent unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching user data for ID (preferred_username): ${uid}`);
      console.log(
        `API endpoint: ${import.meta.env.VITE_APP_BACKEND_PORT}/api/v1/user/${uid}`
      );

      // Check if user is authenticated
      if (!auth.isAuthenticated) {
        console.error('User is not authenticated');
        setError(
          'You are not logged in. Please log in to view your account settings.'
        );
        setLoading(false);
        return;
      }

      // Get the ID token from auth context
      const token = auth.user?.id_token;

      if (!token) {
        console.error('No ID token available');
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Using ID token for authentication');

      // Make API request with authentication token
      console.log(
        'Final API endpoint:',
        `${import.meta.env.VITE_APP_BACKEND_PORT}/api/v1/user/${uid}`
      );

      const response = await apiClient.get(`api/v1/user/${uid}`);

      if (response.status === 200 && response.data) {
        console.log('User data fetched successfully:', response.data);
        console.log('User data fields:', Object.keys(response.data));

        // Check if we need to adapt the field names from the API response
        const apiData = response.data.user;
        const adaptedData: UserData = {};

        // Map API fields to our UserData interface
        // This handles potential differences in field naming between API and our form
        if (apiData) {
          // Try different possible field names for each property
          adaptedData.name =
            apiData.name || apiData.fullName || apiData.full_name || '';
          adaptedData.username =
            apiData.username || apiData.userName || apiData.user_name || '';
          adaptedData.email =
            apiData.email ||
            apiData.emailAddress ||
            apiData.email_address ||
            '';
          adaptedData.phone =
            apiData.phone ||
            apiData.phoneNumber ||
            apiData.phone_number ||
            apiData.mobile ||
            '';
          adaptedData.gender = apiData.gender || apiData.sex || '';
          adaptedData.dateOfBirth =
            apiData.dateOfBirth ||
            apiData.birthDate ||
            apiData.date_of_birth ||
            apiData.dob ||
            '';
          adaptedData.bio =
            apiData.bio || apiData.biography || apiData.about || '';
          adaptedData.address =
            apiData.address ||
            apiData.streetAddress ||
            apiData.street_address ||
            '';
          adaptedData.country =
            apiData.country ||
            apiData.countryName ||
            apiData.country_name ||
            '';
          adaptedData.state =
            apiData.state || apiData.province || apiData.region || '';
          adaptedData.city =
            apiData.city || apiData.cityName || apiData.city_name || '';
          adaptedData.postalCode =
            apiData.postalCode ||
            apiData.zipCode ||
            apiData.postal_code ||
            apiData.zip ||
            '';
          adaptedData.currency =
            apiData.currency ||
            apiData.currencyCode ||
            apiData.currency_code ||
            '';
          adaptedData.language =
            apiData.language ||
            apiData.languageCode ||
            apiData.language_code ||
            '';
          adaptedData.profileImage =
            apiData.profileImage ||
            apiData.avatar ||
            apiData.profile_image ||
            '';
        }

        console.log('Adapted user data:', adaptedData);

        // Set the adapted user data in state
        setUserData(adaptedData);
        setError(null);

        // Show success message if data was loaded
        if (Object.values(adaptedData).some((value) => value && value !== '')) {
          setSuccess('User data loaded successfully!');
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
        }

        // Log each field for debugging
        console.log('Name:', adaptedData.name);
        console.log('Username:', adaptedData.username);
        console.log('Email:', adaptedData.email);
        console.log('Phone:', adaptedData.phone);
        console.log('Gender:', adaptedData.gender);
        console.log('Date of Birth:', adaptedData.dateOfBirth);
      } else {
        console.error('Failed to fetch user data:', response);
        setError('Failed to fetch user data. Please try again later.');
      }
    } catch (err: unknown) {
      console.error('Error fetching user data:', err);

      // More detailed error logging
      if (err && typeof err === 'object') {
        const error = err as Record<string, unknown>;
        if (error.response && typeof error.response === 'object') {
          const response = error.response as Record<string, unknown>;
          console.error('Error response:', response.status, response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else if (error.message && typeof error.message === 'string') {
          console.error('Error setting up request:', error.message);
        }
      }

      setError('An error occurred while fetching your account data.');
    } finally {
      setLoading(false);
    }
  }, [uid, auth.user?.id_token, auth.isAuthenticated]);

  // Call fetchUserData when component mounts
  useEffect(() => {
    if (uid) {
      fetchUserData();
    } else {
      console.warn('No user ID available to fetch data');
    }
  }, [uid, fetchUserData]);

  // Handle form submission
  const handleSaveChanges = async () => {
    if (!uid) {
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      setSaveLoading(true);
      console.log(`Saving user data for ID (preferred_username): ${uid}`);

      // Save user data using the helper function
      const updatedData = await saveUserData(userData);

      // Update the form with the latest data from the server
      setUserData(updatedData);

      // Show success message
      setError(null);
      setSuccess('Your account information has been updated successfully!');

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: unknown) {
      console.error('Error updating user data:', err);

      // More detailed error logging
      if (err && typeof err === 'object') {
        const error = err as Record<string, unknown>;
        if (error.response && typeof error.response === 'object') {
          const response = error.response as Record<string, unknown>;
          console.error('Error response:', response.status, response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else if (error.message && typeof error.message === 'string') {
          console.error('Error setting up request:', error.message);
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while updating your account data.'
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof UserData, value: string) => {
    // Don't allow email editing
    if (field === 'email') {
      return;
    }

    // For address fields, check if provider needs to go to provider portal
    // Customers can't edit address fields at all
    const addressFields = ['address', 'country', 'state', 'city', 'postalCode'];

    if (addressFields.includes(field)) {
      if (isProvider) {
        // Show alert for providers trying to edit address - they need to go to provider portal
        setShowProviderPortalAlert(true);

        // Don't update the field value
        return;
      } else if (isCustomer) {
        // Customers can't edit address fields at all
        return;
      }
    }

    // For non-address and non-email fields, update normally
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file selection for profile picture upload
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a .jpg or .png file.');
      return;
    }

    // Validate file size (500KB = 512000 bytes)
    if (file.size > 512000) {
      setError('File is too large. Maximum size is 500KB.');
      return;
    }

    try {
      setUploadLoading(true);
      setError(null);
      setSuccess(null); // Clear any previous success messages
      setUploadProgress(10); // Start progress

      // Create a real progress tracker
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5; // Slower progress to be more realistic
        });
      }, 200);

      console.log('Starting file upload to S3...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Upload file to S3
      const imageUrl = await uploadToS3(file, 'profile-images');

      if (!imageUrl) {
        throw new Error('Failed to get image URL after upload');
      }

      console.log('S3 upload successful, received URL:', imageUrl);

      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update user data with new profile image URL
      const updatedUserData = {
        ...userData,
        profileImage: imageUrl,
      };

      setUserData(updatedUserData);
      console.log('Updated user data with new profile image:', updatedUserData);

      // Save changes to backend
      console.log('Saving updated profile image to database...');
      const savedData = await saveUserData(updatedUserData);

      if (!savedData) {
        throw new Error('Failed to save profile image to database');
      }

      console.log('Profile image saved to database successfully:', savedData);

      // Show success message and image URL
      setSuccess('Profile picture uploaded and saved successfully!');
      setShowImageUrl(true);

      // Auto-hide URL after 10 seconds
      setTimeout(() => {
        setShowImageUrl(false);
      }, 10000);
    } catch (err: unknown) {
      console.error('Error uploading profile picture:', err);
      setUploadProgress(0);

      // More detailed error logging
      if (err && typeof err === 'object') {
        const error = err as Record<string, unknown>;
        if (error.response && typeof error.response === 'object') {
          const response = error.response as Record<string, unknown>;
          console.error('Error response:', response.status, response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else if (error.message && typeof error.message === 'string') {
          console.error('Error setting up request:', error.message);
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to upload profile picture. Please try again.'
      );
    } finally {
      setUploadLoading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  // Copy image URL to clipboard
  const copyImageUrlToClipboard = () => {
    if (userData.profileImage) {
      navigator.clipboard
        .writeText(userData.profileImage)
        .then(() => {
          setUrlCopied(true);
          setTimeout(() => setUrlCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Failed to copy URL: ', err);
        });
    }
  };

  // Helper function to save user data to backend
  const saveUserData = async (dataToSave: UserData) => {
    if (!uid) {
      throw new Error('User ID not found. Please log in again.');
    }

    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      throw new Error(
        'You are not logged in. Please log in to save your account settings.'
      );
    }

    // Get the ID token from auth context
    const token = auth.user?.id_token;

    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    try {
      console.log('Using ID token for authentication when saving data');
      console.log(
        'Final save API endpoint:',
        `${import.meta.env.VITE_APP_BACKEND_PORT}/api/v1/user/${uid}`
      );
      console.log('Data being saved:', dataToSave);

      // Prepare data for MongoDB by ensuring all fields are properly formatted
      const formattedData = {
        ...dataToSave,
        // Convert date strings to ISO format if they exist
        dateOfBirth: dataToSave.dateOfBirth
          ? new Date(dataToSave.dateOfBirth).toISOString()
          : undefined,
        // Ensure profileImage is a string
        profileImage: dataToSave.profileImage || '',
      };

      console.log('Formatted data for MongoDB:', formattedData);

      // Make the API request
      const response = await apiClient.put(
        `/api/v1/user/${uid}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      // Check for successful response
      if (response.status !== 200) {
        console.error('Unexpected response status:', response.status);
        throw new Error(
          `Failed to update user data. Server returned status ${response.status}`
        );
      }

      if (!response.data) {
        console.error('No data returned from server');
        throw new Error(
          'Failed to update user data. No data returned from server.'
        );
      }

      console.log('User data updated successfully:', response.data);

      // Return the data from the response
      return response.data;
    } catch (error) {
      console.error('Error in saveUserData:', error);

      // Rethrow with more specific error message
      if (error instanceof Error) {
        throw new Error(`Failed to save user data: ${error.message}`);
      } else {
        throw new Error('Failed to save user data due to an unknown error');
      }
    }
  };

  // Handle profile picture removal
  const handleRemoveProfilePicture = async () => {
    // Check if there's a profile image to remove
    if (!userData.profileImage) {
      setError('No profile picture to remove.');
      return;
    }

    try {
      setRemoveLoading(true);
      setError(null);
      setSuccess(null); // Clear any previous success messages

      console.log('Starting profile picture removal process...');
      console.log('Image URL to delete:', userData.profileImage);

      // Delete file from S3
      const deleteResult = await deleteFromS3(userData.profileImage);
      console.log('S3 deletion result:', deleteResult);

      // Update user data to remove profile image URL
      const updatedUserData = {
        ...userData,
        profileImage: '',
      };

      setUserData(updatedUserData);
      console.log('Updated user data after image removal:', updatedUserData);

      // Save changes to backend
      console.log(
        'Saving updated user data without profile image to database...'
      );
      const savedData = await saveUserData(updatedUserData);

      if (!savedData) {
        throw new Error(
          'Failed to update database after removing profile image'
        );
      }

      console.log(
        'Database updated successfully after image removal:',
        savedData
      );

      // Show success message
      setSuccess('Profile picture removed successfully from S3 and database!');

      // Hide image URL display if it was showing
      setShowImageUrl(false);
    } catch (err: unknown) {
      console.error('Error removing profile picture:', err);

      // More detailed error logging
      if (err && typeof err === 'object') {
        const error = err as Record<string, unknown>;
        if (error.response && typeof error.response === 'object') {
          const response = error.response as Record<string, unknown>;
          console.error('Error response:', response.status, response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else if (error.message && typeof error.message === 'string') {
          console.error('Error setting up request:', error.message);
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to remove profile picture. Please try again.'
      );
    } finally {
      setRemoveLoading(false);
    }
  };

  // Alert content
  // const alertTitle = userData.email ? 'Account Verified' : 'Verify Your Account';
  // const description = userData.email
  //   ? 'Your account is verified and active.'
  //   : 'Please verify your account to access all features.';

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading account data..." />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb title="Account Settings" item1="Settings" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Account Settings
        </h2>
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">
              Logged in as: {auth.user?.profile?.email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full my-10 gap-4">
        {/* Success or Error Messages */}
        {success && (
          <Alert
            description={success}
            title="Success"
            variant="faded"
            radius="lg"
            color="success"
            onClose={() => setSuccess(null)}
          />
        )}

        {error && (
          <Alert
            description={error}
            title="Error"
            variant="faded"
            radius="lg"
            color="danger"
            onClose={() => setError(null)}
          />
        )}

        {/* Upload Progress Alert */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Alert
            description={`Uploading image... ${uploadProgress}% complete`}
            title="Upload in Progress"
            variant="faded"
            radius="lg"
            color="primary"
          />
        )}

        {/* Database Save Alert */}
        {saveLoading && (
          <Alert
            description="Saving your changes to the database..."
            title="Saving"
            variant="faded"
            radius="lg"
            color="primary"
          />
        )}

        {/* Provider Portal Alert for Providers */}
        {showProviderPortalAlert && isProvider && (
          <Alert
            description="Address information can only be edited in the Provider Portal. Please go to the Provider Portal to update your address."
            title="Provider Address Update"
            variant="faded"
            radius="lg"
            color="primary"
            onClose={() => setShowProviderPortalAlert(false)}
            endContent={
              <Button
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => (window.location.href = '/provider-portal')}
              >
                Go to Provider Portal
              </Button>
            }
          />
        )}
      </div>

      {/* Profile Picture Section */}
      <div className="mt-4 flex flex-col md:flex-row items-start gap-6">
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => userData.profileImage && setShowImagePreview(true)}
          >
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-500 text-6xl" />
            )}
          </div>
          {userData.profileImage && (
            <span className="text-xs text-gray-500">
              Click image to preview
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 flex-grow">
          <div className="flex flex-wrap gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
            <CustomButton
              color="primary"
              label={uploadLoading ? 'Uploading...' : 'Upload'}
              className="mr-2"
              isDisabled={uploadLoading || removeLoading}
              onPress={handleFileSelect}
            />
            <CustomButton
              color="danger"
              label={removeLoading ? 'Removing...' : 'Remove'}
              isDisabled={
                !userData.profileImage || uploadLoading || removeLoading
              }
              onPress={handleRemoveProfilePicture}
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="w-full max-w-md">
              <Progress
                value={uploadProgress}
                color={uploadProgress === 100 ? 'success' : 'primary'}
                showValueLabel={true}
                className="mt-2"
                label={
                  uploadProgress === 100 ? 'Upload complete!' : 'Uploading...'
                }
                size="md"
                isStriped={uploadProgress < 100}
              />
            </div>
          )}

          {/* S3 Image URL Display */}
          {showImageUrl && userData.profileImage && (
            <div className="mt-2 p-3 bg-gray-100 rounded-md max-w-md">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">Image URL:</span>
                <div className="flex gap-2">
                  <Tooltip content={urlCopied ? 'Copied!' : 'Copy URL'}>
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={copyImageUrlToClipboard}
                      color={urlCopied ? 'success' : 'primary'}
                    >
                      <FaCopy />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Open in new tab">
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      as="a"
                      href={userData.profileImage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <div className="text-xs bg-white p-2 rounded border overflow-x-auto">
                <code className="break-all">{userData.profileImage}</code>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <p>
                  Image saved to database and S3 storage. This URL will be used
                  to display your profile image.
                </p>
                {urlCopied && (
                  <p className="text-green-600 font-semibold mt-1">
                    URL copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-1">
            *Image size should be at least 320px big and less than 500kb.
            Allowed files: .png, .jpg
          </p>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Profile Image Preview
          </ModalHeader>
          <ModalBody>
            {userData.profileImage && (
              <div className="flex justify-center">
                <img
                  src={userData.profileImage}
                  alt="Profile Preview"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            )}
            <div className="mt-2 text-sm text-gray-600 break-all">
              {userData.profileImage}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setShowImagePreview(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* General Information */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">
          General Information
        </h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <CustomInput
              isRequired
              className="max-w-xs"
              placeholder="Enter your full name"
              type="text"
              value={userData.name || ''}
              onValueChange={(value) => handleInputChange('name', value)}
              variant="bordered"
            />
          </div>

          {/* <div>
            <label className="text-sm font-semibold text-gray-700">
              User Name
            </label>
            <CustomInput
              isRequired
              className="max-w-xs"
              placeholder="Enter your username"
              type="text"
              value={userData.username || ''}
              onValueChange={(value) => handleInputChange('username', value)}
              variant="bordered"s
            />
          </div> */}

          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <CustomInput
              isRequired
              className="max-w-xs"
              placeholder="Enter your email"
              type="email"
              value={userData.email || ''}
              isDisabled={true}
              description="Email cannot be edited"
              variant="bordered"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Mobile Number
            </label>
            <CustomInput
              isRequired
              className="max-w-xs"
              placeholder="Enter your phone number"
              type="tel"
              value={userData.phone || ''}
              onValueChange={(value) => handleInputChange('phone', value)}
              variant="bordered"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Gender
            </label>
            <Select
              label="Select Gender"
              isRequired
              selectedKeys={userData.gender ? [userData.gender] : []}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              variant="bordered"
            >
              <SelectItem key="male">Male</SelectItem>
              <SelectItem key="female">Female</SelectItem>
              <SelectItem key="other">Other</SelectItem>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Date of Birth
            </label>
            <DatePicker
              showMonthAndYearPickers
              label="Select Date"
              isRequired
              variant="bordered"
              onChange={(date) =>
                date && handleInputChange('dateOfBirth', date.toString())
              }
            />
          </div>
        </div>

        {/* Bio (Textarea) */}
        <div className="mt-2">
          <label className="text-sm font-semibold text-gray-700">Bio</label>
          <Textarea
            isClearable
            className="w-full"
            placeholder="Tell us about yourself"
            variant="bordered"
            value={userData.bio || ''}
            onValueChange={(value) => handleInputChange('bio', value)}
            onClear={() => handleInputChange('bio', '')}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Address
          {isCustomer && !isProvider && (
            <span className="ml-2 text-sm text-gray-600 font-normal">
              (Not editable)
            </span>
          )}
          {isProvider && (
            <span className="ml-2 text-sm text-blue-600 font-normal">
              (Edit in Provider Portal)
            </span>
          )}
        </h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="col-span-3">
            <label className="text-sm font-semibold text-gray-700">
              Address
            </label>
            <CustomInput
              isRequired
              placeholder="Enter your address"
              type="text"
              value={userData.address || ''}
              onValueChange={(value) => handleInputChange('address', value)}
              variant="bordered"
              isDisabled={true}
              description={
                isProvider
                  ? 'Edit in Provider Portal'
                  : isCustomer
                    ? 'Address cannot be edited'
                    : ''
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Country
            </label>
            <CustomInput
              isRequired
              placeholder="Enter your country"
              type="text"
              value={userData.country || ''}
              onValueChange={(value) => handleInputChange('country', value)}
              variant="bordered"
              isDisabled={true}
              description={
                isProvider
                  ? 'Edit in Provider Portal'
                  : isCustomer
                    ? 'Address cannot be edited'
                    : ''
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">State</label>
            <CustomInput
              isRequired
              placeholder="Enter your state"
              type="text"
              value={userData.state || ''}
              onValueChange={(value) => handleInputChange('state', value)}
              variant="bordered"
              isDisabled={true}
              description={
                isProvider
                  ? 'Edit in Provider Portal'
                  : isCustomer
                    ? 'Address cannot be edited'
                    : ''
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">City</label>
            <CustomInput
              isRequired
              placeholder="Enter your city"
              type="text"
              value={userData.city || ''}
              onValueChange={(value) => handleInputChange('city', value)}
              variant="bordered"
              isDisabled={true}
              description={
                isProvider
                  ? 'Edit in Provider Portal'
                  : isCustomer
                    ? 'Address cannot be edited'
                    : ''
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Postal Code
            </label>
            <CustomInput
              isRequired
              placeholder="Enter postal code"
              type="text"
              value={userData.postalCode || ''}
              onValueChange={(value) => handleInputChange('postalCode', value)}
              variant="bordered"
              isDisabled={true}
              description={
                isProvider
                  ? 'Edit in Provider Portal'
                  : isCustomer
                    ? 'Address cannot be edited'
                    : ''
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Currency
            </label>
            <Select
              label="Choose Currency"
              isRequired
              selectedKeys={userData.currency ? [userData.currency] : []}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              variant="bordered"
            >
              <SelectItem key="usd">USD</SelectItem>
              <SelectItem key="eur">EUR</SelectItem>
              <SelectItem key="gbp">GBP</SelectItem>
              <SelectItem key="inr">INR</SelectItem>
            </Select>
          </div>

          <div className="col-span-3">
            <label className="text-sm font-semibold text-gray-700">
              Language
            </label>
            <CustomInput
              isRequired
              placeholder="Enter your preferred language"
              type="text"
              value={userData.language || ''}
              onValueChange={(value) => handleInputChange('language', value)}
              variant="bordered"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-6 gap-4">
        <CustomButton
          color="primary"
          label="Reset Changes"
          isDisabled={saveLoading}
          onPress={() => {
            // Confirm before resetting
            if (
              window.confirm(
                'Are you sure you want to reset all changes? This will reload your data from the server.'
              )
            ) {
              fetchUserData();
            }
          }}
        />
        <CustomButton
          color="danger"
          label={saveLoading ? 'Saving...' : 'Save Changes'}
          isDisabled={saveLoading}
          onPress={handleSaveChanges}
        />
      </div>
    </div>
  );
};

export default AccountSettings;
