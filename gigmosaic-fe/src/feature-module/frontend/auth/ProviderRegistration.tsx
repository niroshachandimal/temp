import {
  Alert,
  Autocomplete,
  AutocompleteItem,
  DatePicker,
  Image,
  Textarea,
} from '@heroui/react';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { ROLE } from '../../../Role';
import ProfileImg from '../../../../public/fallback-profile-1.avif';

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading) return;

    const roles = auth.user?.profile['cognito:groups'] as string[] | undefined;
    const hasProviderRole = roles?.includes(ROLE.PROVIDER);
    const hasCustomerRole = roles?.includes(ROLE.CUSTOMER);

    const onlyCustomer = hasCustomerRole && !hasProviderRole;

    if (!onlyCustomer) {
      navigate('/home', { replace: true });
    }
  }, [navigate, auth.isLoading, auth.user]);

  const gender = [
    { label: 'Male', key: 'male' },
    { label: 'Female', key: 'female' },
    { label: 'Other', key: 'other' },
  ];

  const language = [
    { label: 'English', key: 'en' },
    { label: 'French', key: 'fr' },
  ];

  const currency = [
    { label: 'USD', key: 'usd' },
    { label: 'CAD', key: 'cad' },
  ];

  const title = 'Verify provider profile';
  const description =
    'Please verify your provider profile to unlock full access!';

  return (
    <>
      <div>
        <div className="mx-20 mb-20 mt-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-5">
            Create a Provider Account
          </h3>
          <div className="flex items-center justify-center w-full mb-5">
            <Alert
              variant="faded"
              color="primary"
              description={description}
              title={title}
            />
          </div>
          <div className="flex justify-start items-center mb-6">
            <div className="flex flex-initial items-center gap-4"></div>
            <Image
              className="w-28 h-28 rounded-full object-contain mx-auto"
              src={ProfileImg}
              alt="Profile"
            />
            <div className="flex flex-col gap-2 ml-4">
              <div>
                <CustomButton label="Upload Profile" color="primary" />
              </div>
              <small className="text-xs text-gray-500">
                *Image size should be at least 320px big and less than 500kb.
                Allowed files: .png, .jpg
              </small>
            </div>
          </div>

          {/* GENERAL INFORMATION */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-7">
              General Information
            </h3>
            <div className="grid grid-cols-4 gap-5 mt-2">
              <div>
                <CustomInput
                  label="Your Name"
                  isRequired
                  radius="sm"
                  variant="bordered"
                  size="md"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>

              <div>
                <CustomInput
                  isRequired
                  radius="sm"
                  variant="bordered"
                  size="md"
                  label="Mobile Number"
                  placeholder="Enter your phone number"
                  type="tel"
                />
              </div>

              <div className="">
                <Autocomplete
                  radius="sm"
                  isRequired
                  labelPlacement="outside"
                  size="md"
                  variant="bordered"
                  label="Gender"
                  placeholder="Search an gender"
                >
                  {gender.map((animal) => (
                    <AutocompleteItem key={animal.key}>
                      {animal.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <div>
                <DatePicker
                  radius="sm"
                  variant="bordered"
                  size="md"
                  showMonthAndYearPickers
                  label="Select Date"
                  isRequired
                  labelPlacement="outside"
                />
              </div>
            </div>

            {/* Bio (Textarea) */}
            <div className="mt-4">
              <Textarea
                label="Bio"
                isRequired
                isClearable
                labelPlacement="outside"
                placeholder="Tell us about yourself"
                variant="bordered"
                onClear={() => console.log('Bio cleared')}
              />
            </div>
          </div>

          {/* ADDRESS INFORMATION */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-10">
              Address Information
            </h3>
            <div className="mt-12 mb-6">
              <CustomInput
                label="Address"
                isRequired
                radius="sm"
                variant="bordered"
                size="md"
                placeholder="Enter your address"
                type="text"
              />
            </div>
            <div className="grid grid-cols-4 gap-5 mt-2">
              <div>
                <CustomInput
                  isRequired
                  radius="sm"
                  variant="bordered"
                  size="md"
                  label="Country"
                  placeholder="Enter your country"
                  type="tel"
                />
              </div>

              <div>
                <CustomInput
                  isRequired
                  radius="sm"
                  variant="bordered"
                  size="md"
                  label="State"
                  placeholder="Enter your state"
                  type="tel"
                />
              </div>

              <div>
                <CustomInput
                  isRequired
                  radius="sm"
                  variant="bordered"
                  size="md"
                  label="City"
                  placeholder="Enter your city"
                  type="tel"
                />
              </div>

              <div>
                <CustomInput
                  isRequired
                  radius="sm"
                  variant="bordered"
                  size="md"
                  label="Postal Code"
                  placeholder="Enter postal code"
                  type="tel"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-5 mt-6">
              <div className="">
                <Autocomplete
                  radius="sm"
                  isRequired
                  labelPlacement="outside"
                  size="md"
                  variant="bordered"
                  label="Language"
                  placeholder="Search an language"
                >
                  {language.map((lng) => (
                    <AutocompleteItem key={lng.key}>
                      {lng.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div className="">
                <Autocomplete
                  radius="sm"
                  isRequired
                  labelPlacement="outside"
                  size="md"
                  variant="bordered"
                  label="Currency"
                  placeholder="Search an currency"
                >
                  {currency.map((cur) => (
                    <AutocompleteItem key={cur.key}>
                      {cur.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center mt-10 gap-5">
            <CustomButton size="md" label="Clear" color="danger" />
            <CustomButton size="md" label="Next" color="primary" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderRegistration;
