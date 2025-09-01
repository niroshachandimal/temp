const Wallet = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <nav className="text-gray-500 text-sm mb-2">
          <span className="hover:text-gray-700">🏠 Customer</span> &gt;{' '}
          <span className="font-semibold text-gray-700">Wallet</span>
        </nav>
        <h1 className="text-3xl font-bold">Wallet</h1>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Wallet Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Wallet Balance', value: '$351.4' },
            { label: 'Total Credit', value: '$590.40' },
            { label: 'Total Debit', value: '$2,288.04' },
            { label: 'Taxes', value: '$351.4' },
            { label: 'Savings', value: '$200.00' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow-md text-center"
            >
              <div className="text-gray-500 text-sm">{item.label}</div>
              <div className="text-lg font-bold text-[#12bbb5]">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Add Wallet CustomButton */}
        <div className="flex justify-end mb-4">
          <button className="bg-[#12bbb5] text-white px-4 py-2 rounded-xl shadow-md hover:bg-[#0ea89b]">
            + Add Wallet
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-[#12bbb5] mb-3">
            Wallet Transactions
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                {['Type', 'Amount', 'Date', 'Payment Type', 'Status'].map(
                  (header, index) => (
                    <th key={index} className="p-3 text-left text-gray-600">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  type: 'Wallet Topup',
                  amount: '+$80',
                  date: '07 Oct 2022 11:22:51',
                  status: 'Completed',
                },
                {
                  type: 'Purchase',
                  amount: '-$20',
                  date: '06 Oct 2022 11:22:51',
                  status: 'Completed',
                },
                {
                  type: 'Refund',
                  amount: '+$40',
                  date: '06 Oct 2022 11:22:51',
                  status: 'Completed',
                },
                {
                  type: 'Wallet Topup',
                  amount: '+$100',
                  date: '28 Sep 2022 11:22:51',
                  status: 'Completed',
                },
                {
                  type: 'Purchase',
                  amount: '-$50',
                  date: '07 Oct 2022 11:22:51',
                  status: 'Completed',
                },
                {
                  type: 'Refund',
                  amount: '-$60',
                  date: '07 Oct 2022 11:22:51',
                  status: 'Completed',
                },
              ].map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{transaction.type}</td>
                  <td
                    className={`p-3 font-bold ${transaction.amount.includes('+') ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {transaction.amount}
                  </td>
                  <td className="p-3">{transaction.date}</td>
                  <td className="p-3">Paypal</td>
                  <td className="p-3">
                    <span className="bg-green-200 text-green-700 px-2 py-1 rounded-md text-sm">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-500">
            Show
            <select className="mx-2 border rounded px-2 py-1">
              <option>07</option>
              <option>10</option>
              <option>20</option>
            </select>
            entries
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3].map((page, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-[#12bbb5] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
