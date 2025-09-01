import { Plus, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../core/data/redux/reducer';
import { updateServices } from '../../../core/data/redux/booking/bookingSlice';
import { useFetchServiceDataById } from '../../../hook/useQueryData';
import { Spinner } from '@heroui/react';

interface AdditionalService {
  id: string;
  images?: string;
  serviceItem: string;
  price: number;
}

const AdditionalServicesStep = () => {
  const dispatch = useDispatch();
  const { services } = useSelector((state: RootState) => state.booking);
  const { selectedServices, allServices, serviceBasicDetails } = services;
  const { data, isFetching } = useFetchServiceDataById(
    serviceBasicDetails[0]?.serviceId
  );

  const toggleService = (serviceId: string) => {
    const newSelectedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    dispatch(updateServices({ selectedServices: newSelectedServices }));
  };

  const addtionalData = data?.serviceInfo?.additionalServices;

  console.log('Basic additional data', serviceBasicDetails);
  console.log('TYPE', typeof serviceBasicDetails);
  console.log('allServices', allServices);

  return (
    <div>
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium">Additional Services</h3>
        <span className="ml-4 text-gray-500">
          Total: {addtionalData?.length}
        </span>
      </div>
      {isFetching ? (
        <div className="flex justify-center items-center">
          <Spinner size="md" color="primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addtionalData?.map((service: AdditionalService) => {
            const isSelected = selectedServices.includes(service.id);

            return (
              <div
                key={service?.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm  bg-purple-50"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                    <img
                      src={service.images || '/placeholder.svg'}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">
                      {service.serviceItem}
                    </h3>
                    <p className="text-sm text-gray-500">${service.price}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center mr-4"></div>

                  <button
                    onClick={() => toggleService(service.id)}
                    className={`flex items-center justify-center rounded-md px-3 py-1.5 text-sm ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdditionalServicesStep;
