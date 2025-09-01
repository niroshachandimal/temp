import {
  FaShoppingCart,
  FaWallet,
  FaPiggyBank,
  FaMoneyBillWave,
} from 'react-icons/fa';
import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';
import CustomButton from '../../../components/CustomButton';

export default function Dashboard() {
  // Statistics Data
  const stats = [
    {
      title: 'Total Orders',
      value: '27',
      percentage: '16%',
      color: 'text-pink-500',
      bg: 'bg-pink-100',
      icon: <FaShoppingCart />,
    },
    {
      title: 'Total Spend',
      value: '$2,500',
      percentage: '5%',
      color: 'text-red-500',
      bg: 'bg-red-100',
      icon: <FaMoneyBillWave />,
    },
    {
      title: 'Wallet',
      value: '$200',
      percentage: '5%',
      color: 'text-red-500',
      bg: 'bg-red-100',
      icon: <FaWallet />,
    },
    {
      title: 'Total Savings',
      value: '$354',
      percentage: '16%',
      color: 'text-green-500',
      bg: 'bg-green-100',
      icon: <FaPiggyBank />,
    },
  ];

  // Transactions Data
  const transactions = [
    {
      type: 'Service Booking',
      date: '02 Sep 2022, 09:12 AM',
      amount: '$280.00',
      status: 'In Process',
    },
    {
      type: 'Service Refund',
      date: '02 Sep 2022, 04:36 PM',
      amount: '$395.00',
      status: 'Completed',
    },
    {
      type: 'Wallet Topup',
      date: '01 Sep 2022, 10:00 AM',
      amount: '$1000.00',
      status: 'Pending',
    },
    {
      type: 'Service Booking',
      date: '31 Aug 2022, 11:17 AM',
      amount: '$598.65',
      status: 'Cancelled',
    },
    {
      type: 'Service Booking',
      date: '10 Nov 2022',
      amount: '$300.00',
      status: 'Completed',
    },
  ];

  // Bookings Data
  const bookings = [
    {
      service: 'Computer Repair',
      date: '10 Nov 2022',
      name: 'John Smith',
      email: 'john@gmail.com',
      status: 'In Process',
    },
    {
      service: 'Car Repair',
      date: '15 Oct 2022',
      name: 'Timothy',
      email: 'timothy@gmail.com',
      status: 'Pending',
    },
    {
      service: 'Interior Designing',
      date: '18 Oct 2022',
      name: 'Jordan',
      email: 'jordan@gmail.com',
      status: 'Completed',
    },
    {
      service: 'Steam Car Wash',
      date: '28 Oct 2022',
      name: 'Armand',
      email: 'armand@gmail.com',
      status: 'Cancelled',
    },
    {
      service: 'House Cleaning',
      date: '10 Nov 2022',
      name: 'Joseph',
      email: 'joseph@gmail.com',
      status: 'Completed',
    },
    {
      service: 'Car Repair',
      date: '10 Nov 2022',
      name: 'Adrian',
      email: 'jadrian@gmail.com',
      status: 'In Process',
    },
  ];

  // Get color classes for status
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "Completed":
  //       return "success";
  //     case "Pending":
  //       return "warning";
  //     case "In Process":
  //       return "primary";
  //     case "Cancelled":
  //       return "danger";
  //     default:
  //       return "default";
  //   }
  // };

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6 w-full">
      {/* Breadcrumb & Title */}
      <BreadCrumb title="Dashboard" item1="Customer" />
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Dashboard</h2>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 mt-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-lg rounded-lg flex items-center justify-between"
          >
            <div className={`p-3 rounded-full ${stat.bg} text-lg`}>
              {stat.icon}
            </div>
            <div className="flex-1 ml-4">
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-md ${stat.color} bg-opacity-20`}
            >
              {stat.percentage}
            </span>
          </div>
        ))}
      </div>

      {/* Transactions & Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
              >
                <div>
                  <h4 className="text-lg">{transaction.type}</h4>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <span className="font-semibold text-gray-700">
                  {transaction.amount}
                </span>
                {/* <CustomChips label={transaction.status} color={getStatusColor(transaction.status)} /> */}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-md flex items-center justify-center text-xs">
                    200×200
                  </div>
                  <div>
                    <h4 className="text-lg">{booking.service}</h4>
                    <p className="text-sm text-gray-500"> {booking.date}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto mt-2 sm:mt-0">
                  <div>
                    <h4 className="text-lg">{booking.name}</h4>
                    <p className="text-sm text-gray-500">{booking.email}</p>
                  </div>
                  {/* <CustomChips label={booking.status} color={getStatusColor(booking.status)} /> */}
                  {/* <button className="bg-gray-200 px-3 py-1 text-sm rounded-md hover:bg-gray-300 mt-2 sm:mt-0">
                    Cancel
                  </button> */}
                  <CustomButton color="danger" label="Cancel" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
