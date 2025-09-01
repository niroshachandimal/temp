/* eslint-disable @typescript-eslint/no-explicit-any */
import Calendar from 'react-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../core/data/redux/reducer';
import {
  resetSelectedTime,
  updateDateTime,
  updateStaff,
} from '../../../core/data/redux/booking/bookingSlice';
import { useEffect, useState } from 'react';
import { Avatar, Spinner } from '@heroui/react';
import { useCheckBookingAvailability } from '../../../hook/useMutationData';
import { checkBookingAvailability } from '../../../service/serviceService';
import moment from 'moment';
import { apiClient } from '../../../api';
import { toast } from 'react-toastify';

type TimeSlot = {
  booked: number;
  bookedStaffId: number;
  bookingDate: string;
  bookingId: number;
  bookingStatus: string;
  from: string;
  maxBookings: number;
  staffStatus: string;
  to: string;
  timeSlotId: string;
};

type Staff = {
  staffId: string;
  name: string;
  fullName: string;
  city: string;
  numberOfCompletedServices?: number;
  providerId?: string;
};

const DateTimeStep = () => {
  const dispatch = useDispatch();
  const [staffLoading, setStaffLoading] = useState<boolean>(false);
  const [timeSlotLoading, setTimeSlotLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
  const [selectDate, setSelectdate] = useState<Date | undefined>(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isStaffAvilableInDay, setIsStaffAvilableInDay] =
    useState<boolean>(false);

  const [staffData, setStaffData] = useState<Staff[] | undefined>(undefined);

  const { selectedDate } = useSelector(
    (state: RootState) => state.booking.dateTime
  );
  const { selectedStaff } = useSelector(
    (state: RootState) => state.booking.staff
  );

  const { services } = useSelector((state: RootState) => state.booking);
  const { serviceBasicDetails } = services;

  console.log('SERVICE: ', serviceBasicDetails);

  const serviceId = serviceBasicDetails[0]?.serviceId;
  const providerId = serviceBasicDetails[0]?.providerId;
  const staffInService =
    serviceBasicDetails[0]?.staff.length > 0 ? true : false;

  const { mutate } = useCheckBookingAvailability();

  const weekdayToNumber: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const allowedDays = serviceBasicDetails[0]?.availableDate.map(
    (item: { day: string }) => weekdayToNumber[item.day.toLowerCase()]
  );

  const getNextAvailableDate = () =>
    Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return allowedDays.includes(d.getDay()) ? d : null;
    }).find(Boolean) || new Date();

  useEffect(() => {
    const nextDate = getNextAvailableDate();
    setSelectdate(selectedDate ? new Date(selectedDate) : nextDate);
    dispatch(
      updateDateTime({ selectedDate: moment(nextDate).format('YYYY-MM-DD') })
    );
    dispatch(updateStaff({ isStaffAvilableInService: staffInService }));
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setStaffLoading(true);
        const data = {
          serviceId: serviceId,
          date: moment(selectDate).format('YYYY-MM-DD'),
        };
        console.log('CHECK STAFF AVALABILITY: ', data);
        const res = await apiClient.post(
          'service/api/v1/booking/checkAvailableStaff',
          data
        );
        console.log('CHECK STAFF AVALABILITY RESPONSE ', res);
        const staff = res.data?.availableStaff;
        if (staff?.length > 0) {
          const staff = res.data.availableStaff;
          setStaffData(staff);
          setIsStaffAvilableInDay(true);
          dispatch(updateStaff({ isStaffAvilableInDay: true }));
          setSelectedStaffId(selectedStaff ? selectedStaff : staff[0].staffId);
          dispatch(
            updateStaff({
              selectedStaff: selectedStaff ? selectedStaff : staff[0].staffId,
            })
          );
        } else {
          setIsStaffAvilableInDay(false);
          dispatch(updateStaff({ isStaffAvilableInDay: false }));
          setStaffData([]);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast.error('Something went wrong while fetching staff');
      } finally {
        setStaffLoading(false);
      }
    };
    fetchStaff();
  }, [selectDate, serviceId]);

  console.log('isStaffAvilableInDay------ ', isStaffAvilableInDay);

  //HANDLE DATE CHANGE
  const handleDateChange = async (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setSelectdate(value); // local state
      const date = moment(value).format('YYYY-MM-DD');

      if (date) {
        dispatch(resetSelectedTime());
        dispatch(updateDateTime({ selectedDate: date }));
      } else {
        dispatch(resetSelectedTime());
        console.error('Date selection has some issue');
        toast.error('Date selection has some issue. trying again!');
      }
    }
  };

  const selectTimeSlot = (slotId: string, from: string, to: string) => {
    if (timeSlot && from && to) {
      const foundTimeSlot = timeSlot.find((slot) => slot.timeSlotId === slotId);
      setSelectedSlot(foundTimeSlot ?? null);
      dispatch(
        updateDateTime({
          selectedFromTime: from,
          selectedToTime: to,
        })
      );
    }
  };

  const selectStaff = (staffId: string) => {
    if (staffId) {
      setSelectedStaffId(staffId);

      dispatch(updateStaff({ selectedStaff: staffId }));

      if (selectDate && serviceId) {
        mutate({
          serviceId,
          date: selectDate.toISOString().split('T')[0],
          staffId,
        });
      }
    }
  };

  useEffect(() => {
    const selectStaff = async () => {
      try {
        setTimeSlotLoading(true);
        if (selectDate && serviceId) {
          let payload;
          console.log('SELECT STAFF STATES: ', staffInService);

          if (!staffInService) {
            console.log('No staff available for this service 00');
            payload = {
              serviceId,
              date: moment(selectDate).format('YYYY-MM-DD'),
              staffId: providerId,
            };
          } else {
            if (isStaffAvilableInDay) {
              console.log('Staff available for this service');
              payload = {
                serviceId,
                date: moment(selectDate).format('YYYY-MM-DD'),
                staffId: selectedStaffId,
              };
            } else {
              console.log('No staff available for this service');
              setTimeSlot([]);
              return;
            }
            console.log('Staff available for this service');
          }
          console.log('CHECK BOOKING AVAILABILITY DATA: ', payload);

          const response = await checkBookingAvailability(payload);

          if (response?.success === true) {
            console.log('API TIMESLOT RESPONSE: ', response?.timeSlots);
            setTimeSlot(response?.timeSlots);
          } else {
            console.log('No time slot-------------------------');
            setTimeSlot([]);
            return;
          }
        }
      } catch (error: any) {
        console.error('Booking check error:', error);
        toast.error(error.message || 'Error checking booking availability');
      } finally {
        setTimeSlotLoading(false);
      }
    };

    selectStaff();
  }, [
    selectDate,
    serviceId,
    selectedStaffId,
    providerId,
    isStaffAvilableInDay,
    staffInService,
  ]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <h3 className="text-md font-semibold text-gray-700 mb-4 -mt-5">
            Select date
          </h3>
          <Calendar
            className="lg:w-[100px] rounded-lg shadow-md p-3 bg-white custom-calendar"
            onChange={(value: any) =>
              handleDateChange(value as Date | Date[] | null)
            }
            value={selectDate}
            minDate={new Date()}
            tileDisabled={({ date }) => {
              return !allowedDays.includes(date.getDay());
            }}
          />
        </div>

        <div className="w-full -mt-5 ">
          {/* No Staff in service */}
          {staffInService && (
            <>
              <h3 className="text-md font-semibold text-gray-700 mb-4">
                Select Staff
              </h3>
              {staffLoading ? (
                <div className="flex justify-center items-center">
                  <Spinner size="md" color="primary" />
                </div>
              ) : (
                <>
                  {isStaffAvilableInDay || timeSlotLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                      {staffData?.map((s, index) => (
                        <button
                          key={index}
                          onClick={() => selectStaff(s.staffId)}
                          className={`rounded-md border px-4 py-1 text-left shadow-sm transition-all duration-200 ${
                            selectedStaffId === s.staffId
                              ? 'bg-purple-300 text-gray-500 border-gray-500 '
                              : 'bg-purple-50 hover:shadow-md hover:bg-purple-300 hover:border-purple-300 border-gray-300'
                          }`}
                        >
                          <div className="flex justify-start items-center">
                            <Avatar name="Junior" size="md" radius="sm" />
                            <div className=" justify-start items-center mt-2 mb-2 ml-2">
                              <p className="text-sm font-semibold text-gray-700">
                                {s?.fullName}
                              </p>
                              <p className="text-xs text-gray-500">{s.city}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center my-3">
                      <p className="text-sm text-red-600 border border-red-200 px-4 py-3 rounded-lg shadow-sm">
                        <span className="font-medium">No staff available</span>{' '}
                        for the selected day. Please choose another date.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Right Column - Time Slots */}
          <div className="w-full ">
            {staffInService && !isStaffAvilableInDay ? (
              <p></p>
            ) : (
              <>
                <h3 className="text-md font-semibold text-gray-700 mb-4">
                  Select Time
                </h3>
                {timeSlotLoading ? (
                  <div className="flex justify-center items-center">
                    <Spinner size="md" color="primary" />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                      {timeSlot?.map((slot, index) => (
                        <button
                          key={index}
                          disabled={slot.booked >= slot.maxBookings}
                          onClick={() =>
                            selectTimeSlot(slot.timeSlotId, slot.from, slot.to)
                          }
                          className={`rounded-md border px-4 py-1 text-left shadow-sm transition-all duration-200 ${
                            // slot.availableSlots === 0
                            selectedSlot?.timeSlotId === slot.timeSlotId
                              ? 'bg-blue-200 text-gray-500 border-gray-500 '
                              : 'bg-green-100 hover:shadow-md hover:bg-green-200 hover:border-green-400 border-green-300 '
                          }`}
                        >
                          <div className="text-sm font-semibold text-gray-800">
                            {slot.from} - {slot.to}
                          </div>

                          <div className="mt-2 flex flex-col space-y-1 text-xs text-gray-600">
                            {/* <div>{slot.availableSlots} Available Slots</div> */}
                            {slot.maxBookings === slot.booked ? (
                              <div className="font-medium text-red-600">
                                All Booked
                              </div>
                            ) : (
                              <div className="font-medium text-green-600">
                                {slot.maxBookings - slot.booked} Available
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DateTimeStep;
