import { FaPaperPlane } from 'react-icons/fa';

const ChatUIbody = () => {
  return (
    <div className="bg-white flex justify-center  h-screen p-2">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold text-gray-700">Aaryian Jose</p>
              <p className="text-sm text-[#12bbb5]">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 h-96 overflow-y-auto p-2">
          <div className="text-gray-500 text-center text-xs">Yesterday</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-2 rounded-lg max-w-xs">
                <p className="text-sm text-gray-700">
                  Hi there! I'm interested in your services.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#12bbb5] text-white p-2 rounded-lg max-w-xs">
                <p className="text-sm">
                  Can you tell me more about what you offer? Can you explain it
                  briefly...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-2 rounded-lg max-w-xs">
                <p className="text-sm text-gray-700">
                  Ecommerce.zip{' '}
                  <span className="text-xs text-gray-500">34.2 KB</span>
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#12bbb5] text-white p-2 rounded-lg max-w-xs">
                <p className="text-sm">Send me your Profile Video if any?</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-2 rounded-lg max-w-xs">
                <p className="text-sm text-gray-700">
                  Sure! Here's a short introduction video.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-2 rounded-lg max-w-xs">
                <p className="text-sm text-gray-700">
                  profile_video.mp4{' '}
                  <span className="text-xs text-gray-500">5.6 MB</span>
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#12bbb5] text-white p-2 rounded-lg max-w-xs">
                <p className="text-sm">
                  Thanks! I'll check it out and get back to you soon.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-2 rounded-lg max-w-xs">
                <p className="text-sm text-gray-700">
                  Sounds good! Let me know if you have any questions.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Chat Input */}
        <div className="border-t pt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type Your Message"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#12bbb5]"
          />
          <button className="bg-[#12bbb5] text-white p-2 rounded-full">
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUIbody;
