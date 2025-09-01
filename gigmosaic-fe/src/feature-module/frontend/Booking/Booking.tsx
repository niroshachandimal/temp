/* eslint-disable @typescript-eslint/no-explicit-any */
import 'react-calendar/dist/Calendar.css';
// import StaffsStep from '../../components/steps/StaffsStep';
import AdditionalServicesStep from '../../components/steps/AdditionalServicesStep';
import DateTime from '../../components/steps/DateTime';
import PersonalInfoStep from '../../components/steps/PersonalInfoStep';
// import CartStep from '../../components/steps/CartStep';
import PaymentStep from '../../components/steps/PaymentStep';
// import ConfirmationStep from '../../components/steps/ConfirmationStep';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../core/data/redux/reducer';
import {
  selectService,
  setCurrentStep,
  addServiceBasicDetails,
  updatePersonalInfo,
} from '../../../core/data/redux/booking/bookingSlice';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFetchServiceDataById } from '../../../hook/useQueryData';
import { ServiceBasicDetails } from '../../../utils/type';
import { toast } from 'react-toastify';
import { useAuth } from 'react-oidc-context';

export type Step = {
  id: number;
  name: string;
  component: React.ReactNode;
};

export type ServiceType = {
  id: string;
  name: string;
  requiresStaff: boolean;
  hasAdditionalServices: boolean;
  // other service properties
};

export type StepConfig = {
  id: number;
  name: string;
  component: React.ReactNode;
  isVisible: (service: ServiceType) => boolean; // Function to determine visibility
};

const Booking = () => {
  // const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const { serviceId, serviceTitle, serviceimage } = location.state || {};
  const dispatch = useDispatch();
  const { staff, dateTime, personalInfo, currentStep } = useSelector(
    (state: RootState) => state.booking
  );
  const dataredux = useSelector((state: RootState) => state.booking);
  const { selectedStaff, selectAnyone } = staff;
  const [steps, setSteps] = useState<StepConfig[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<StepConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [, setShowValidationError] = useState(false);

  const { data } = useFetchServiceDataById(serviceId);

  console.log('Data: ', data);
  console.log('REDUX DATA: ', dataredux);
  console.log('USER DATA: ', auth.user);

  console.log('Service Id: ', serviceId);
  // All possible steps configuration
  const allSteps: StepConfig[] = [
    {
      id: 1,
      name: 'Date & Time',
      component: <DateTime />,
      isVisible: () => true, // Always visible
    },
    // {
    //   id: 2,
    //   name: 'Staffs',
    //   component: <StaffsStep />,
    //   isVisible: (service) => service?.requiresStaff || false,
    // },
    {
      id: 3,
      name: 'Additional Services',
      component: <AdditionalServicesStep />,
      isVisible: (service) => service?.hasAdditionalServices || false,
    },
    {
      id: 4,
      name: 'Personal Information',
      component: <PersonalInfoStep />,
      isVisible: () => true, // Always visible
    },

    {
      id: 6,
      name: 'Payment',
      component: <PaymentStep />,
      isVisible: () => true, // Always visible
    },
    // {
    //   id: 7,
    //   name: 'Confirmation',
    //   component: <ConfirmationStep />,
    //   isVisible: () => true, // Always visible
    // },
  ];

  // Fetch service data (mock implementation)
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const addtionalData = data?.serviceInfo || {};
        const userEmail = auth?.user?.profile?.email || '';

        console.log('addtionalData: ', addtionalData);

        const formatServiceData: ServiceBasicDetails = {
          serviceId: addtionalData?.serviceId,
          providerId: addtionalData?.providerId,
          serviceTitle: addtionalData?.serviceTitle,
          categoryId: addtionalData?.categoryId,
          subCategoryId: addtionalData?.subCategoryId,
          price: addtionalData?.price,
          isOffers: addtionalData?.isOffers,
          isAdditional: addtionalData?.isAdditional,
          serviceImages: addtionalData?.gallery[0]?.serviceImages[0] || '',
          city: addtionalData?.location[0]?.city || '',
          state: addtionalData?.location[0]?.state || '',
          country: addtionalData?.location[0]?.country || '',
          staff: addtionalData?.staff,
          availableDate: addtionalData?.availability,
        };
        // In a real app, this would be an API call
        // const response = await fetch(`/api/services/${serviceId}`);
        // const serviceData = await response.json();

        // Mock data - this would come from your app state or API
        const mockService = {
          id: '123',
          name: 'Haircut',
          requiresStaff: false, // This service doesn't require staff selection
          hasAdditionalServices: true,
          price: 30, // mock price
          duration: 45, // mock duration in minutes
          rating: 4.9, // mock rating
          image: 'https://via.placeholder.com/150', // mock image url
        };
        dispatch(
          updatePersonalInfo({
            firstName:
              userEmail == 'nilukygy@azuretechtalk.net' ? 'Ulises' : 'Stephon ',
            lastName:
              userEmail == 'nilukygy@azuretechtalk.net' ? 'Ferry' : 'Medhurst',
            email: userEmail,
            phone:
              userEmail == 'nilukygy@azuretechtalk.net'
                ? '+1 528 3548 567'
                : '+1 528 5548 667',
            streetAddress:
              userEmail == 'nilukygy@azuretechtalk.net'
                ? '123 Main St'
                : '01 James St N',
            city:
              userEmail == 'nilukygy@azuretechtalk.net' ? 'Hamilton' : 'Lewes',
            state: 'Ontario',
            postalCode:
              userEmail == 'nilukygy@azuretechtalk.net' ? 'K8R 9L2' : 'L8R 2L2',
          })
        );
        setSelectedService(mockService);
        dispatch(selectService(mockService));
        dispatch(addServiceBasicDetails(formatServiceData));

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load service data:', error);
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [dispatch, data?.serviceInfo]);

  // Update visible steps when service changes
  useEffect(() => {
    if (selectedService) {
      const filteredSteps = allSteps.filter((step) =>
        step.isVisible(selectedService)
      );

      // Reindex the steps to have consecutive IDs
      const reindexedSteps = filteredSteps.map((step, index) => ({
        ...step,
        id: index + 1, // Reset IDs to be consecutive
      }));

      setSteps(reindexedSteps);
      setVisibleSteps(reindexedSteps);
    }
  }, [selectedService]);

  const isCurrentStepValid = () => {
    // console.log(
    //   'DADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: ',
    //   data?.serviceInfo?.staff
    // );
    const { selectedDate, selectedFromTime, selectedToTime } = dateTime;
    const { selectedStaff, isStaffAvilableInDay, isStaffAvilableInService } =
      staff;
    // const isStaffHas = data?.serviceInfo?.staff;
    const {
      firstName,
      lastName,
      city,
      email,
      phone,
      postalCode,
      state,
      streetAddress,
      error,
    } = personalInfo;

    switch (currentStep) {
      case 1:
        if (!selectedDate)
          return { status: false, message: 'Please select a date!' };
        if (!selectedFromTime || !selectedToTime)
          return { status: false, message: 'Please select a time slot!' };
        if (isStaffAvilableInService)
          if (isStaffAvilableInDay && !selectedStaff) {
            return { status: false, message: 'Please select a staff member!' };
          }
        break;

      case 3:
        console.log('PERSONAL DATE: ', personalInfo);
        if (!firstName)
          return { status: false, message: 'Please enter your first name!' };
        if (!lastName)
          return { status: false, message: 'Please enter your last name!' };
        if (!city) return { status: false, message: 'Please enter your city!' };
        if (!email)
          return { status: false, message: 'Please enter your email!' };
        if (!phone)
          return { status: false, message: 'Please enter your phone!' };
        if (!postalCode)
          return { status: false, message: 'Please enter your postal code!' };
        if (!state)
          return { status: false, message: 'Please enter your state!' };
        if (!streetAddress)
          return {
            status: false,
            message: 'Please enter your street address!',
          };
        if (error)
          return {
            status: false,
            message: 'Please complete all fields correctly!',
          };

        break;

      default:
        break;
    }

    return true;
  };

  const handleNext = () => {
    // Check if we're on the staff step and validation is needed
    const currentStepConfig = steps.find((step) => step.id === currentStep);

    if (
      currentStepConfig?.name === 'Staffs' &&
      selectedService?.requiresStaff
    ) {
      if (!selectedStaff && !selectAnyone) {
        // Show validation error in StaffsStep
        setShowValidationError(true);
        return; // Don't proceed
      }
    }

    const validationResult = isCurrentStepValid();

    if (validationResult !== true) {
      toast.error(validationResult.message);
      return;
    }

    if (currentStep < visibleSteps.length) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const calculateProgress = () => {
    if (visibleSteps.length === 0) return 0;
    return ((currentStep - 1) / (visibleSteps.length - 1)) * 100;
  };

  if (isLoading) {
    return <div>Loading booking steps...</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg py-4">
      <div className="flex-col md:flex-row grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Sidebar */}
        <div className="col-span-2  p-6 border-r">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Service Details</h2>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                {/* <div className="w-6 h-6 bg-gray-500 rounded-md"> */}
                <img
                  src={serviceimage}
                  alt={serviceTitle}
                  className="object-fill"
                />
                {/* </div> */}
              </div>
              <div
                onClick={() => {
                  const url = `/services/service-details/${encodeURIComponent(serviceId)}/${encodeURIComponent(serviceTitle)}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="cursor-pointer"
              >
                <h3 className="text-sm font-medium capitalize">
                  {data?.serviceInfo?.serviceTitle}
                </h3>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xs">★ 4.9</span>
                  <span className="text-gray-400 text-xs ml-1">
                    (255 reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Bookings</h2>
            <ul className="space-y-4">
              {steps.map((step) => (
                <li key={step.id} className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 
                      ${currentStep === step.id ? 'border-primary bg-primary' : currentStep > step.id ? 'bg-primary' : 'border-gray-600 '}`}
                  >
                    {currentStep > step.id && (
                      <svg
                        className="w-3 h-3 text-white "
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {currentStep === step.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm ${currentStep === step.id || currentStep > step.id ? 'text-black font-medium' : 'text-gray-400'}`}
                  >
                    {step.id}. {step.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <div className="text-sm text-gray-400 mb-2">
              {calculateProgress().toFixed(0)}% complete
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div
                className="bg-[#facc15] h-1 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 col-span-10 overflow-auto relative">
          {/* Current Step Content */}
          <div className="mb-6">
            {steps.find((step) => step.id === currentStep)?.component}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end mt-6 bottom-0 right-0 absolute">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center mr-2"
              >
                <BiChevronLeft className="mr-1 h-4 w-4" /> Prev
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center"
            >
              Next <BiChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
