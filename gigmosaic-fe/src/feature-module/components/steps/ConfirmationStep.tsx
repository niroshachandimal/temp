import { useLocation, useNavigate } from 'react-router-dom';
import CustomButton from '../CustomButton';

const ConfirmationStep = () => {
  const navigate = useNavigate();

  const data = useLocation();
  const bookingData = data.state;

  console.log('Booking data: ', bookingData);

  const navigateToLink = (param: string) => {
    if (param === 'dashboard') {
      navigate('/customer/customer-booking');
    } else if (param === 'calender') {
      // navigate('/customer/customer-booking');
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-b py-12 max-h-screen">
      <div className="w-full max-w-2xl mx-4 text-center transition-all transform bg-white ">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 className="mb-6 text-2xl font-extrabold text-green-600">
          Booking Successful!
        </h1>

        <p className="mb-8 text-md text-gray-700">
          Thank you for your booking. A confirmation email has been sent to your
          registered address. You can view your booking details below.
        </p>

        <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6  mb-6 md:mb-8">
          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal text-sm mb-1 sm:mb-0 text-gray-500 ">
              Booking ID
            </dt>
            <dd className="font-medium text-gray-900 text-sm  sm:text-end">
              {bookingData.bookingId}
            </dd>
          </dl>

          {/* <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal text-sm mb-1 sm:mb-0 text-gray-500 ">
              Booking Status
            </dt>
            <dd className="font-medium text-gray-900 text-sm  sm:text-end">
              {bookingData.bookingStatus}
            </dd>
          </dl>  */}
          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal text-sm mb-1 sm:mb-0 text-gray-500 ">
              Service Name
            </dt>
            <dd className="font-medium text-gray-900 text-sm  sm:text-end">
              {bookingData.serviceName}
            </dd>
          </dl>
          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal mb-1 sm:mb-0 text-gray-500 text-sm">
              Customer Name
            </dt>
            <dd className="font-medium text-gray-900  sm:text-end text-sm">
              {bookingData.firstName} {bookingData.lastName}
            </dd>
          </dl>
          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal mb-1 sm:mb-0 text-sm text-gray-500 ">
              Date
            </dt>
            <dd className="font-medium text-gray-900 text-sm sm:text-end">
              {bookingData.date}
            </dd>
          </dl>

          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal mb-1 sm:mb-0 text-gray-500 text-sm">
              Time Slot
            </dt>
            <dd className="font-medium text-gray-900  sm:text-end text-sm">
              {bookingData.fromTime} - {bookingData.toTime}
            </dd>
          </dl>
          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal mb-1 text-sm sm:mb-0 text-gray-500 ">
              Payment Method
            </dt>
            <dd className="font-medium text-gray-900 text-sm  sm:text-end">
              {bookingData.paymentMethod}
            </dd>
          </dl>

          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal mb-1 sm:mb-0 text-gray-500 text-sm">
              Address
            </dt>
            <dd className="font-medium text-gray-900  sm:text-end text-sm">
              {bookingData.postalCode} {bookingData.address} {bookingData.city}{' '}
              {bookingData.state}
            </dd>
          </dl>
          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal mb-1 sm:mb-0 text-gray-500 text-sm">
              Phone
            </dt>
            <dd className="font-medium text-gray-900  sm:text-end">
              {bookingData.phone}
            </dd>
          </dl>
          <dl className="sm:flex items-center justify-between gap-4">
            <dt className="font-normal mb-1 sm:mb-0 text-gray-500 text-sm">
              Total
            </dt>
            <dd className="font-medium text-gray-900  sm:text-end">
              ${bookingData.total}
            </dd>
          </dl>
        </div>

        <div className="flex flex-initial justify-between items-center mt-6 gap-4">
          <CustomButton
            fullWidth={true}
            label="Go to Home"
            className="mt-5"
            color="primary"
            radius="sm"
            size="md"
            variant="flat"
            onPress={() => navigateToLink('calender')}
          />

          <CustomButton
            fullWidth={true}
            label="Go to Dashoard"
            className="mt-5"
            color="primary"
            radius="sm"
            size="md"
            onPress={() => navigateToLink('dashboard')}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
