import { Checkbox, Chip, Divider } from '@heroui/react';
import { useEffect, useState } from 'react';
import { FcCurrencyExchange } from 'react-icons/fc';
import CustomButton from '../CustomButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/data/redux/reducer';
import { useFetchServiceDataById } from '../../../hook/useQueryData';
import { AdditionalServiceData } from '../../../utils/type';
import { apiClient } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/loading/LoadingSprinner';

type PaymentType = 'card' | 'paypal' | 'Cash on Delivery';

const PaymentStep = () => {
  const navigate = useNavigate();
  const [locading, setLoading] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState('Cash on Delivery');
  const [addtionalService, setAddtionalService] = useState<
    AdditionalServiceData[]
  >([]);
  const [total, setTotal] = useState<number>(0);

  const bookingData = useSelector((state: RootState) => state.booking);

  const userData = bookingData.personalInfo;
  const bookingItems = bookingData.services;
  const serviceDetails = bookingData.services?.serviceBasicDetails[0];
  const dateTime = bookingData.dateTime;
  const staff = bookingData.staff;

  const { data } = useFetchServiceDataById(serviceDetails.serviceId);

  const apiAddtionalDetails = data?.serviceInfo?.additionalServices;

  useEffect(() => {
    // totalCalculation()
    if (bookingItems && apiAddtionalDetails) {
      const selected = apiAddtionalDetails.filter(
        (item: AdditionalServiceData) =>
          bookingItems.selectedServices.includes(item.id)
      );

      console.log('selected: ', selected);
      setAddtionalService(selected);
    }
  }, [bookingItems, apiAddtionalDetails]);

  useEffect(() => {
    const servicePrice = serviceDetails?.price || 0;

    const addtionalServicesPriceTotal =
      addtionalService?.reduce(
        (acc: number, item: AdditionalServiceData) => acc + item.price,
        0
      ) || 0;
    const total = servicePrice + addtionalServicesPriceTotal;

    setTotal(total);
  }, [addtionalService, serviceDetails?.price]);

  const handleChange = (paymentType: PaymentType) => {
    setSelectedPayment(paymentType);
  };
  const additionalServiceIds = addtionalService.map((s) => s.id);

  console.log('Addtional data: ', additionalServiceIds);

  const handleSubmitData = async () => {
    setLoading(true);
    const additionalServiceIds = addtionalService.map((s) => s.id);

    if (!selectedPayment) {
      toast.error('Please select a payment type');
      setLoading(false);
      return;
    }

    const data = {
      serviceId: serviceDetails.serviceId,
      providerId: serviceDetails.providerId,
      staffId: staff.selectedStaff,
      additionalServiceIds: additionalServiceIds,
      appointmentDate: dateTime.selectedDate,
      appointmentTimeFrom: dateTime.selectedFromTime,
      appointmentTimeTo: dateTime.selectedToTime,
      package: '',
      personalInfo: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        address: {
          street: userData.streetAddress,
          city: userData.city,
          state: userData.state,
          postalCode: userData.postalCode,
        },
        bookingNotes: userData.notes || '',
      },
      paymentMethod: selectedPayment,
      isPaid: false,
      subtotal: total,
      tax: 0,
      discount: 0,
      total: total,
    };

    console.log('Final booking data: ', data);

    try {
      const res = await apiClient.post('/service/api/v1/booking', data);
      console.log('rs: ', res);
      if (
        res.data?.success &&
        res.data?.message === 'Booking created successfully'
      ) {
        navigate('/booking/success', {
          state: {
            bookingId:
              res.data.booking.referenceCode || 'Something went wrong!',
            serviceName: serviceDetails.serviceTitle,
            paymentMethod: selectedPayment,
            date: dateTime.selectedDate,
            fromTime: dateTime.selectedFromTime,
            toTime: dateTime.selectedToTime,
            firstName: userData.firstName,
            lastName: userData.lastName,
            address: userData.streetAddress,
            city: userData.city,
            state: userData.state,
            postalCode: userData.postalCode,
            phone: userData.phone,
            total: total,
          },
          replace: true,
        });
      }
      toast.success('Booking successful');
    } catch (error) {
      toast.error('Booking failed');
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {locading && <LoadingSpinner />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* 1 Grid */}
        <div className=" ">
          <h3 className="text-base font-semibold text-slate-900 mb-5">
            Personal Information
          </h3>
          <div className="rounded-xlmt-4 border p-4 rounded-lg">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-900 text-sm font-medium">Customer</p>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  {userData?.firstName || 'N/A'} {userData?.lastName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-slate-900 text-sm font-medium">Email</p>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  {userData?.email || 'No data'}
                </p>
              </div>
              <div>
                <p className="text-slate-900 text-sm font-medium">Address</p>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  {userData?.postalCode}, {userData?.streetAddress},{' '}
                  {userData?.city}
                </p>
              </div>
              <div>
                <p className="text-slate-900 text-sm font-medium">Phone</p>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  {userData?.phone || 'No Number'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-900 text-sm font-medium">Booking note</p>
              <p className="text-slate-500 text-sm font-medium mt-2">
                {userData?.notes}
              </p>
            </div>
          </div>

          {/* Payment method */}

          <div className="mt-6">
            <h2 className="text-xl text-slate-900 font-semibold mb-6">
              Payment
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className=" p-4 rounded-md border bg-gray-100 border-gray-300 max-w-sm cursor-not-allowed opacity-50">
                <div>
                  <div className="flex items-center">
                    <Checkbox
                      isDisabled
                      isSelected={selectedPayment === 'card'}
                      onValueChange={() => handleChange('card')}
                    />
                    <label className="ml-2 flex gap-5 cursor-pointer">
                      <img
                        src="https://readymadeui.com/images/visa.webp"
                        className="w-12"
                        alt="card1"
                      />
                      <img
                        src="https://readymadeui.com/images/american-express.webp"
                        className="w-12"
                        alt="card2"
                      />
                      {/* <img
                      src="https://readymadeui.com/images/master.webp"
                      className="w-12"
                      alt="card3"
                    /> */}
                    </label>
                  </div>
                </div>
              </div>

              {/* Paypal */}
              <div className=" p-4 rounded-md border border-gray-300 max-w-sm cursor-not-allowed bg-gray-100 opacity-50">
                <div>
                  <div className="flex items-center mt-3">
                    <Checkbox
                      isDisabled
                      isSelected={selectedPayment === 'paypal'}
                      onValueChange={() => handleChange('paypal')}
                    />
                    <label className="ml-2 flex gap-2 cursor-pointer">
                      <img
                        src="https://readymadeui.com/images/paypal.webp"
                        className="w-20"
                        alt="paypalCard"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Cash in hand */}
              <div
                className={'p-4 rounded-md border border-gray-300 max-w-sm '}
              >
                <div>
                  <div className="flex items-center mt-3 ">
                    <Checkbox
                      isSelected={selectedPayment === 'Cash on Delivery'}
                      onValueChange={() => handleChange('Cash on Delivery')}
                    />
                    <div className="flex flex-initial">
                      <FcCurrencyExchange size={32} />

                      <p className="ml-2 flex gap-2 cursor-pointer font-medium text-md">
                        Cash
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-md">
            <p className="text-slate-900 text-sm font-medium mb-2">
              Do you have a promo code?
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                disabled
                placeholder="Promo code"
                className="px-4 py-2.5 bg-white border border-gray-300 text-slate-900 w-full text-sm rounded-md focus:outline-blue-600 cursor-not-allowed"
              />
              <button
                disabled
                type="button"
                className="flex items-center justify-center font-medium tracking-wide bg-blue-200 hover:bg-blue-200 px-4 py-2.5 rounded-md text-sm text-white cursor-not-allowed "
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        {/* 2 Grid */}
        <div className="p-4 rounded-md">
          <h3 className="text-base font-semibold text-slate-900 mb-6">
            Booking Item
          </h3>
          <div className="">
            {/* Maain service info */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 max-sm:flex-col">
                <div className="w-[70px] h-[70px] bg-black-200 rounded-lg flex items-center justify-center ">
                  <img
                    src={serviceDetails?.serviceImages}
                    alt={serviceDetails?.serviceTitle || 'N/A'}
                    className="w-14 h-14 object-cover rounded-sm"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">
                    {serviceDetails?.serviceTitle || 'N/A'}
                  </h4>
                  <p className="text-slate-500 text-sm font-medium mt-2 ">
                    Package:
                    <Chip size="sm" color="warning" className="ml-2">
                      Golden
                    </Chip>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 text-sm font-semibold">
                    ${serviceDetails?.price || 'N/A'}
                  </p>
                </div>
              </div>

              {/*  addtional info*/}
              {addtionalService?.length > 0 && (
                <>
                  <Divider />
                  <h3 className="text-base font-semibold text-slate-900 mb-6">
                    Addtional Service
                  </h3>
                  {addtionalService.map((service, idx) => (
                    <div
                      key={service.id || idx}
                      className="flex items-start gap-4 max-sm:flex-col max-sm:border-t max-sm:pt-4 max-sm:border-gray-300"
                    >
                      <div className="w-[50px] h-[50px] bg-gray-200 rounded-lg flex items-center justify-center ">
                        <img
                          src={service.images}
                          alt="Additional Service"
                          className="w-10 h-10 object-cover rounded-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-900">
                          {service.serviceItem || 'No Data'}
                        </h4>
                        <p className="text-slate-500 text-xs font-medium mt-2">
                          Addtional Service
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-900 text-sm font-semibold">
                          ${service.price || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-4">
            <Divider />
            <h3 className="text-base font-semibold text-slate-900  my-4">
              Booking Summary
            </h3>
            <div className=" rounded-xl p-4 mb-8 bg-gray-100 ">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm text-slate-900 font-medium">Subtotal</p>
                  <p className="text-slate-900 text-sm font-semibold">
                    ${total}
                  </p>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-300">
                  <p className="text-lg font-semibold text-slate-900">Total</p>
                  <p className="text-lg font-semibold text-slate-900">
                    ${total}
                  </p>
                </div>
              </div>

              <CustomButton
                fullWidth={true}
                label="Booking Confirm"
                className="mt-5"
                color="primary"
                radius="sm"
                size="md"
                onPress={() => handleSubmitData()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentStep;
