import { FaExchangeAlt, FaWallet, FaShoppingCart } from 'react-icons/fa';

const transactions = [
  {
    id: 1,
    type: 'Service Booking',
    icon: <FaShoppingCart className="text-gray-600 text-xl" />,
    date: '22 Sep 2023',
    time: '10:12 AM',
    amount: '$280.00',
    status: 'Completed',
  },
  {
    id: 2,
    type: 'Service Refund',
    icon: <FaExchangeAlt className="text-gray-600 text-xl" />,
    date: '15 Oct 2022',
    time: '14:36 PM',
    amount: '$395.00',
    status: 'Cancelled',
  },
  {
    id: 3,
    type: 'Wallet Topup',
    icon: <FaWallet className="text-gray-600 text-xl" />,
    date: '18 Oct 2022',
    time: '15:19 PM',
    amount: '$1000.00',
    status: 'In Progress',
  },
  {
    id: 4,
    type: 'Service Booking',
    icon: <FaShoppingCart className="text-gray-600 text-xl" />,
    date: '28 Oct 2022',
    time: '11:17 AM',
    amount: '$598.65',
    status: 'Completed',
  },
  {
    id: 5,
    type: 'Service Booking',
    icon: <FaShoppingCart className="text-gray-600 text-xl" />,
    date: '10 Nov 2022',
    time: '09:13 AM',
    amount: '$300.00',
    status: 'Cancelled',
  },
  {
    id: 6,
    type: 'Service Booking',
    icon: <FaShoppingCart className="text-gray-600 text-xl" />,
    date: '10 Nov 2022',
    time: '09:13 AM',
    amount: '$300.00',
    status: 'Completed',
  },
];

const RecentTransactions = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="bg-white shadow-lg rounded-xl p-5">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-full">
                {transaction.icon}
              </div>
              <div>
                <p className="text-sm font-semibold">{transaction.type}</p>
                <p className="text-xs text-gray-500">
                  📅 {transaction.date} ⏰ {transaction.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm px-2 py-1 rounded ${
                  transaction.status === 'Cancelled'
                    ? 'bg-red-200 text-red-700'
                    : transaction.status === 'Completed'
                      ? 'bg-green-200 text-green-700'
                      : 'bg-blue-200 text-blue-700'
                }`}
              >
                {transaction.status}
              </span>
              <p className="text-lg font-bold">{transaction.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
