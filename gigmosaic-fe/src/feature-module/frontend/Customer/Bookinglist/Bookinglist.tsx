import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';
import CustomButton from '../../../components/CustomButton';

const BookingList = () => {
  const bookings = [
    {
      id: 1,
      service: 'Computer Services',
      status: 'Cancelled',
      date: '27 Sep 2022, 17:00-18:00',
      amount: '$100.00',
      payment: 'PayPal',
      location: 'Newark, USA',
      provider: 'John Doe',
      email: 'info@johndoe.com',
      phone: '+1 888-888-8888',
      actions: ['Reschedule'],
    },
    {
      id: 2,
      service: 'Car Repair Services',
      status: 'Completed',
      date: '23 Sep 2022, 10:00-11:00',
      amount: '$50.00',
      payment: 'COD',
      location: 'Alabama, USA',
      provider: 'John Smith',
      email: 'info@johnsmith.com',
      phone: '+1 607-275-5393',
      actions: ['Rebook', 'Add Review'],
    },
    {
      id: 3,
      service: 'Interior Designing',
      status: 'Inprogress',
      date: '22 Sep 2022, 11:00-12:00',
      amount: '$50.00',
      payment: 'PayPal',
      location: 'Washington, DC, USA',
      provider: 'Quentin',
      email: 'info@quentin.com',
      phone: '+1 601-810-9218',
      actions: ['Chat', 'Cancel'],
    },
  ];

  const getButtonStyles = (action: string) => {
    if (action === 'Cancel') {
      return 'danger';
    }
    return 'primary';
  };

  return (
    <div className="mx-auto p-4">
      <BreadCrumb title="Booking List" item1="Customer" />
      <h2 className="text-2xl sm mb-4 mt-4">Booking List</h2>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white p-4 shadow-md rounded-md flex items-center"
          >
            {/* Placeholder for Image */}
            <div className="w-24 h-24 bg-gray-300 flex-shrink-0 rounded-md"></div>

            {/* Booking Details */}
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold mb-1">{booking.service}</h3>
              <span
                className={`text-sm px-2 py-1 rounded mb-2 inline-block ${
                  booking.status === 'Cancelled'
                    ? 'bg-red-200 text-red-700'
                    : booking.status === 'Completed'
                      ? 'bg-green-200 text-green-700'
                      : 'bg-blue-200 text-blue-700'
                }`}
              >
                {booking.status}
              </span>
              <p className="text-sm text-gray-600 mb-1">{booking.date}</p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Amount:</span> {booking.amount}{' '}
                <span className="text-blue-600">{booking.payment}</span>
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Location:</span>{' '}
                {booking.location}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Provider:</span>{' '}
                {booking.provider} -{' '}
                <a href={`mailto:${booking.email}`} className="text-blue-600">
                  {booking.email}
                </a>
                , {booking.phone}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              {booking.actions.map((action, index) => (
                // <button
                //   key={index}
                //   className={`border text-xs font-medium px-3 py-1 rounded transition ${getButtonStyles(action)}`}
                // >

                //   {action}
                // </button>
                <CustomButton
                  key={index}
                  label={action}
                  color={getButtonStyles(action)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
