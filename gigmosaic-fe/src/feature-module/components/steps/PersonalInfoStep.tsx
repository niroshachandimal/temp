import type React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../core/data/redux/reducer';
import { updatePersonalInfo } from '../../../core/data/redux/booking/bookingSlice';
import {
  cn,
  Input,
  RadioGroup,
  RadioProps,
  Textarea,
  useRadio,
  VisuallyHidden,
} from '@heroui/react';
import { personalInfoSchema } from '../../../utils/validation/personalInfoSchema';
import { useEffect, useState } from 'react';
import PhoneInput from '../PhoneInput';
import CustomButton from '../CustomButton';
import { useAuth } from 'react-oidc-context';
import { PersonalInfo } from '../../../utils/type';
import { toast } from 'react-toastify';

const PersonalInfoStep = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<PersonalInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isMaxAddress, setIsMaxAddress] = useState(false);
  const cusId = auth?.user?.profile?.preferred_username;

  const personalInfo = useSelector(
    (state: RootState) => state.booking.personalInfo
  );

  // useEffect(() => {

  // }, [personalInfo, auth]);

  useEffect(() => {
    if (!cusId) return;

    const data = localStorage.getItem('addressBook');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed[cusId]) {
        setSavedAddresses(parsed[cusId]);
      }
    }
  }, [cusId]);

  const handleSaveAddress = () => {
    if (!cusId) {
      console.warn('Customer ID is missing');
      return;
    }

    const newAddress = {
      addressId: Math.floor(Math.random() * 1000000), // use larger range to avoid duplicates
      address_line_1: personalInfo || '',
    };

    const storedData = localStorage.getItem('addressBook');
    const addressBook = storedData ? JSON.parse(storedData) : {};

    // Initialize if no address list exists for this customer
    if (!addressBook[cusId]) {
      addressBook[cusId] = [];
    }

    // Limit to maximum 3 addresses per customer
    if (addressBook[cusId].length >= 3) {
      setIsMaxAddress(true);
      toast.error('You can only save up to 3 addresses.');
      return;
    }

    // Add new address
    addressBook[cusId].push(newAddress);

    // Save back to localStorage
    localStorage.setItem('addressBook', JSON.stringify(addressBook));
    setSavedAddresses([...addressBook[cusId]]);
    // alert('Address saved successfully!');
  };

  const handleRemoveAddress = () => {
    if (!selectedAddress) return;
    if (!cusId) return;

    const storedData = localStorage.getItem('addressBook');
    const addressBook = storedData ? JSON.parse(storedData) : {};

    if (!addressBook[cusId]) return;

    // if (personalInfo.addressId == selectedAddress) {
    //   toast.error('You already selected this address');
    //   return;
    // }
    // Remove the selected address
    addressBook[cusId] = addressBook[cusId].filter(
      (address: PersonalInfo) =>
        address.addressId !== undefined &&
        address.addressId.toString() !== selectedAddress.toString()
    );

    // Save the updated address book
    localStorage.setItem('addressBook', JSON.stringify(addressBook));

    // Update state
    setSavedAddresses(addressBook[cusId]);
    setSelectedAddress(''); // optionally reset selection
  };

  useEffect(() => {
    const handleSelectAddress = (addressId: string) => {
      const cusId = auth?.user?.profile?.preferred_username;

      console.log('New address id: ', addressId);

      if (!cusId) {
        console.warn('Customer ID is missing');
        return;
      }

      const storedData = localStorage.getItem('addressBook');
      const addressBook = storedData ? JSON.parse(storedData) : {};

      if (!addressBook[cusId]) {
        console.log('No addresses found for customer');
      }
      console.log('Address book: ', addressBook);

      console.log('Type1: ', typeof addressId);

      //check addressBook with addressid is match
      const selectedAddress = addressBook[cusId]?.find(
        (address: PersonalInfo) =>
          address.addressId !== undefined &&
          address.addressId.toString() === addressId
      );

      const formatAddress = {
        ...selectedAddress?.address_line_1,
        addressId: selectedAddress?.addressId, // Add or override
      };

      console.log('selectedAddress:_00000 ', formatAddress);
      dispatch(updatePersonalInfo(formatAddress));
      // setSavedAddresses([...addressBook[cusId]]);
    };
    handleSelectAddress(selectedAddress);
  }, [selectedAddress, auth]);

  useEffect(() => {
    const cusId = auth?.user?.profile?.preferred_username;
    const storedData = localStorage.getItem('addressBook');
    const addressBook = storedData ? JSON.parse(storedData) : {};

    if (cusId && addressBook[cusId]) {
      setSavedAddresses(addressBook[cusId]);
    }
  }, [auth]);

  // useEffect(() => {
  //   const cusId = auth?.user?.profile?.preferred_username;
  //   const storedData = localStorage.getItem('addressBook');
  //   const addressBook = storedData ? JSON.parse(storedData) : {};

  //   if (cusId && addressBook[cusId]) {
  //     setSavedAddresses(addressBook[cusId]);
  //   }
  // }, [auth]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    console.log('name: ', name);
    console.log('value: ', value);

    try {
      await personalInfoSchema.validateAt(name, {
        ...personalInfo,
        [name]: value,
      });
      console.log('Validation ok');
      // If valid, update value and reset error
      dispatch(updatePersonalInfo({ [name]: value, error: false }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (err: unknown) {
      console.log('Validation error:', err);
      // If invalid, still update value (optional), set error
      dispatch(updatePersonalInfo({ [name]: value, error: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: err instanceof Error ? err.message : 'Validation error',
      }));
    }
  };

  //Now addtional address save to localstorage
  // default_address
  // address_1
  // address_2
  // address_3

  console.log('Address: ', savedAddresses);
  console.log('Select address: ', selectedAddress);

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Customer Information</h3>

      {/* Right Column - Personal Information Form */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid col-span-2 border-1 rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <Input
                type="text"
                radius="sm"
                id="firstName"
                label="First Name"
                name="firstName"
                size="md"
                value={personalInfo.firstName}
                onChange={handleChange}
                // isRequired
                isDisabled
                variant="bordered"
                placeholder="Enter your first name"
                labelPlacement="outside"
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName}
              />
            </div>

            {/* Last Name */}
            <div>
              <Input
                type="text"
                radius="sm"
                id="lastName"
                label="Last Name"
                name="lastName"
                isDisabled
                size="md"
                value={personalInfo.lastName}
                onChange={handleChange}
                // isRequired
                variant="bordered"
                placeholder="Enter your last name"
                labelPlacement="outside"
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName}
              />
            </div>

            {/* Email */}
            <div>
              <Input
                type="email"
                radius="sm"
                id="email"
                label="Email"
                isDisabled
                name="email"
                size="md"
                value={personalInfo.email}
                onChange={handleChange}
                // isRequired
                variant="bordered"
                placeholder="Enter email"
                labelPlacement="outside"
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />
            </div>

            {/* Phone Number */}
            <PhoneInput
              name="phone"
              value={personalInfo.phone}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone}
              onChange={handleChange}
            />

            {/* Street Address */}
            <div>
              <Input
                type="text"
                radius="sm"
                id="streetAddress"
                name="streetAddress"
                label="Street Address"
                size="md"
                value={personalInfo.streetAddress}
                onChange={handleChange}
                isRequired
                variant="bordered"
                placeholder="Enter your address"
                labelPlacement="outside"
                isInvalid={!!errors.streetAddress}
                errorMessage={errors.streetAddress}
              />
            </div>

            {/* City */}
            <div>
              <Input
                type="text"
                radius="sm"
                id="city"
                label="City"
                name="city"
                size="md"
                value={personalInfo.city}
                onChange={handleChange}
                isRequired
                variant="bordered"
                placeholder="Enter your city"
                labelPlacement="outside"
                isInvalid={!!errors.city}
                errorMessage={errors.city}
              />
            </div>

            {/* State */}
            <div>
              <Input
                type="text"
                id="state"
                label="State"
                radius="sm"
                name="state"
                size="md"
                value={personalInfo.state}
                onChange={handleChange}
                isRequired
                variant="bordered"
                placeholder="Enter your state"
                labelPlacement="outside"
                isInvalid={!!errors.state}
                errorMessage={errors.state}
              />
            </div>

            {/* Postal Code */}
            <div>
              <Input
                type="text"
                id="postalCode"
                label="Postal Code"
                radius="sm"
                name="postalCode"
                size="md"
                value={personalInfo.postalCode}
                onChange={handleChange}
                isRequired
                variant="bordered"
                placeholder="Enter your postal code"
                labelPlacement="outside"
                isInvalid={!!errors.postalCode}
                errorMessage={errors.postalCode}
              />
            </div>
          </div>
          <div className="mt-4">
            <Textarea
              id="notes"
              name="notes"
              value={personalInfo.notes}
              onChange={handleChange}
              variant="bordered"
              rows={3}
              label="Add booking notes"
              labelPlacement="outside"
              isInvalid={!!errors.notes}
              errorMessage={errors.notes}
            ></Textarea>
          </div>
          {!isMaxAddress && (
            <div className="mt-3 flex justify-end">
              <CustomButton
                label="Save address"
                size="md"
                radius="sm"
                color="primary"
                variant="flat"
                className="ml-3"
                onPress={handleSaveAddress}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold -my-8 mb-2">Address</h3>
          <div className=" border-1 rounded-lg p-3 h-full ">
            {savedAddresses.length > 0 ? (
              <div className="border border-gray-300 rounded-lg p-4">
                <RadioGroup
                  // label="Select Address"
                  value={selectedAddress}
                  onValueChange={setSelectedAddress}
                >
                  {savedAddresses.map((address, index) => {
                    const info = address.address_line_1 as PersonalInfo;
                    // const info = address.address_line_1;
                    return (
                      <CustomRadio
                        key={address.addressId}
                        value={address?.addressId?.toString() || ''}
                        description={`${info?.streetAddress}, ${info?.city}, ${info?.state} ${info?.postalCode}`}
                        className={index > 0 ? 'mt-4' : ''}
                      >
                        Address {index + 1}
                      </CustomRadio>
                    );
                  })}
                </RadioGroup>
              </div>
            ) : (
              <p className="flex items-center justify-center text-gray-500 text-sm h-[100%]">
                No Saved address
              </p>
            )}

            {/* {savedAddresses.length < 0 && ( */}
            <div className="flex justify-end mt-4 items-center">
              <CustomButton
                label="Remove"
                size="md"
                radius="sm"
                color="danger"
                variant="light"
                onPress={handleRemoveAddress}
              />
            </div>
            {/* )} */}
          </div>
        </div>
        {/* Booking Notes */}

        {/* Cancellation Policy */}
        {/* <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Cancellation policy
          </h4>
          <p className="text-sm text-gray-600">
            Cancel for free anytime in advance, otherwise you will be charged
            100% of the service price for not showing up.
          </p>
        </div> */}
      </div>
    </>
  );
};

export default PersonalInfoStep;

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse',
        'cursor-pointer border-2 border-default rounded-lg gap-4 p-4',
        'data-[selected=true]:border-primary/50 data-[selected=true]:bg-primary/10'
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <>
            <span className="text-small text-foreground opacity-70">
              {description}
            </span>
          </>
        )}
      </div>
    </Component>
  );
};
