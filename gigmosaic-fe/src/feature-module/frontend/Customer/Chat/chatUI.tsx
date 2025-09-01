const ChatUI = () => {
  return (
    <div className="bg-hite-100 flex justify-center  h-screen">
      <div className="w-80 bg-white rounded-lg shadow-lg p-4">
        <div className="border-b pb-2 mb-2">
          <input
            type="text"
            placeholder="Search For Contacts or Messages"
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#12bbb5]"
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-700">All Chats</h2>
        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-700">Aaryian Jose</p>
              <p className="text-sm text-gray-500">tonight...</p>
            </div>
            <span className="text-xs text-gray-500">02:40 PM</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-700">Sarika Jain</p>
              <p className="text-sm text-gray-500">Do you know which</p>
            </div>
            <span className="text-xs text-gray-500">08:12 AM</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-700">Clyde Smith</p>
              <p className="text-sm text-gray-500">Haha oh man 😂</p>
            </div>
            <span className="text-xs text-gray-500">03:15 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
