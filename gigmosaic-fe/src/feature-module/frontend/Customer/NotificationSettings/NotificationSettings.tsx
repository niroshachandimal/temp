import { Switch } from '@heroui/react';

const NotificationSettings = () => {
  return (
    <div className=" mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <nav className="text-gray-500 text-sm mb-2">
          <span className="hover:text-gray-700">🏠 Customer</span> &gt;{' '}
          <span className="font-semibold text-gray-700">Dashboard</span>
        </nav>
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      <div className="grid grid-cols-4 font-semibold bg-gray-200 p-3 rounded-t-lg border-b">
        <div className="col-span-1">General Notifications</div>
        <div className="text-center">Push</div>
        <div className="text-center">Email</div>
        <div className="text-center">SMS</div>
      </div>

      {/** General Notifications **/}
      <div className="border rounded-lg mb-4">
        <div className="p-4 space-y-3">
          <NotificationItem
            title="General Notifications Newsletter"
            description="Manage notification settings for timely newsletter updates."
          />
          <NotificationItem
            title="Daily Updates"
            description="Set your notification preferences for daily updates."
          />
        </div>
      </div>

      {/** Booking **/}
      <div className="grid grid-cols-4 font-semibold bg-gray-200 p-3 rounded-t-lg border-b">
        <div className="col-span-1">Booking</div>
        <div className="text-center">Push</div>
        <div className="text-center">Email</div>
        <div className="text-center">SMS</div>
      </div>
      <div className="border rounded-lg mb-4">
        <div className="p-4 space-y-3">
          <NotificationItem
            title="Booking Request"
            description="Enable notifications to stay updated on your booking requests."
          />
          <NotificationItem
            title="Booking Status"
            description="Get instant notifications on your booking status."
          />
          <NotificationItem
            title="Refund Request"
            description="Receive updates on your refund request status instantly."
          />
        </div>
      </div>

      {/** Subscription **/}
      <div className="grid grid-cols-4 font-semibold bg-gray-200 p-3 rounded-t-lg border-b">
        <div className="col-span-1">Subscription</div>
        <div className="text-center">Push</div>
        <div className="text-center">Email</div>
        <div className="text-center">SMS</div>
      </div>
      <div className="border rounded-lg mb-4">
        <div className="p-4">
          <NotificationItem
            title="Subscription Notification"
            description="Stay updated with notifications about your subscription."
          />
        </div>
      </div>

      {/** Wallet **/}
      <div className="grid grid-cols-4 font-semibold bg-gray-200 p-3 border-b">
        <div className="col-span-1">Wallet</div>
        <div className="text-center">Push</div>
        <div className="text-center">Email</div>
        <div className="text-center">SMS</div>
      </div>
      <div className="border rounded-lg">
        <div className="p-4">
          <NotificationItem
            title="Wallet Notification"
            description="Get notifications for all wallet transactions and updates."
          />
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4 border-t p-3">
      <div className="col-span-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      <div className="flex justify-center">
        <Switch defaultSelected color="success" />
      </div>
      <div className="flex justify-center">
        <Switch defaultSelected color="success" />
      </div>
      <div className="flex justify-center">
        <Switch defaultSelected color="success" />
      </div>
    </div>
  );
};

export default NotificationSettings;
