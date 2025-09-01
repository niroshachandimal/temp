export const days = [
  { label: "Monday", id: "monday" },
  { label: "Tuesday", id: "tuesday" },
  { label: "Wednesday", id: "wednesday" },
  { label: "Thursday", id: "thursday" },
  { label: "Friday", id: "friday" },
  { label: "Saturday", id: "saturday" },
  { label: "Sunday", id: "sunday" },
];

export const serviceInfo = [
  {
    serviceTitle: "Car service",
    slug: "car_service",
    categoryId: "CID_1",
    subCategoryId: "SCID_1",
    serviceOverview:
      "<p>Since you want to <strong>ignore TypeScript errors and force a build</strong>, you should modify the Since you want to <strong>ignore TypeScript errors and force a build</strong>, you should modify the </p>",
    price: 200,
    staff: ["STID_2", "STID_1"],
    includes: ["include 1", "include 2"],
    isActive: true,
    gallery: [
      {
        serviceImages: [
          "https://cdn.staging.gigmosaic.ca/service/2.png-1740819351737",
          "https://cdn.staging.gigmosaic.ca/service/10.png-1740819351737",
        ],
        videoLink: "http://localhost:5173/service/add",
      },
    ],
    location: [
      {
        address: "4452 Municipio de El Quebrachal, Argentina",
        city: "Municipio de El Quebrachal",
        state: "Salta",
        country: "Argentina",
        pinCode: "4452",
        googleMapsPlaceId:
          "516fd003c4490150c0599b221ba3d05539c0f00103f901f7eee99402000000c0020192031b4d756e69636970616c6964616420456c205175656272616368616c",
        longitude: -64.020531483,
        latitude: -25.335567317,
      },
    ],
    additionalService: [
      {
        id: 1,
        serviceItem: "add",
        price: "100",
        images:
          "https://cdn.staging.gigmosaic.ca/service-addtional-infomation/2.png-1740819356419",
      },
      {
        id: 2,
        serviceItem: "add 2",
        price: "200",
        images:
          "https://cdn.staging.gigmosaic.ca/service-addtional-infomation/1c.png-1740819356419",
      },
    ],
    faq: [
      {
        question: "faq",
        answer: "as",
      },
      {
        question: "faq1",
        answer: "as",
      },
    ],
    availability: [
      {
        day: "monday",
        available: true,
        timeSlots: [
          {
            from: "01:00 AM",
            to: "02:00 AM",
            maxBookings: 3,
          },
          {
            from: "03:00 AM",
            to: "04:00 AM",
            maxBookings: 2,
          },
        ],
      },
      {
        day: "saturday",
        available: true,
        timeSlots: [
          {
            from: "02:00 PM",
            to: "04:00 PM",
            maxBookings: 2,
          },
        ],
      },
    ],
    seo: [
      {
        metaTitle: "title",
        metaKeywords: ["tag1", "tag2", "tag3"],
        metaDescription: "description of meta",
      },
    ],
  },
];

export const sampleNotifications = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?u=1",
    title: "Payment Successful",
    subtitle: "Payment of $75 for Cleaning Service has been processed.",
    date: "2 days ago",
    statusColor: "green",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?u=2",
    title: "Booking Confirmed",
    subtitle: "Your booking with Sarah on July 25 has been confirmed.",
    date: "1 day ago",
    statusColor: "blue",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?u=3",
    title: "New Message",
    subtitle: "You have a new message from John.",
    date: "3 hrs ago",
    statusColor: "orange",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/150?u=4",
    title: "Profile Updated",
    subtitle: "Your profile was successfully updated.",
    date: "4 days ago",
    statusColor: "green",
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/150?u=5",
    title: "Service Approved",
    subtitle: "Your plumbing service listing has been approved.",
    date: "2 hrs ago",
    statusColor: "green",
  },
  {
    id: 6,
    avatar: "https://i.pravatar.cc/150?u=6",
    title: "Booking Cancelled",
    subtitle: "Your booking with Tom on July 20 has been cancelled.",
    date: "5 days ago",
    statusColor: "red",
  },
  {
    id: 7,
    avatar: "https://i.pravatar.cc/150?u=7",
    title: "Password Changed",
    subtitle: "Your password was successfully changed.",
    date: "1 week ago",
    statusColor: "green",
  },
  {
    id: 8,
    avatar: "https://i.pravatar.cc/150?u=8",
    title: "New Review Received",
    subtitle: "You received a 5-star review from Emma.",
    date: "3 days ago",
    statusColor: "blue",
  },
  {
    id: 9,
    avatar: "https://i.pravatar.cc/150?u=9",
    title: "Verification Required",
    subtitle: "Please verify your phone number to continue.",
    date: "6 hrs ago",
    statusColor: "yellow",
  },
  {
    id: 10,
    avatar: "https://i.pravatar.cc/150?u=10",
    title: "Account Warning",
    subtitle: "Unusual activity detected. Please review your login history.",
    date: "2 weeks ago",
    statusColor: "red",
  },
  {
    id: 11,
    avatar: "https://i.pravatar.cc/150?u=11",
    title: "New Booking",
    subtitle: "You have received a new booking from James.",
    date: "10 mins ago",
    statusColor: "blue",
  },
  {
    id: 12,
    avatar: "https://i.pravatar.cc/150?u=12",
    title: "Email Verified",
    subtitle: "Your email address has been successfully verified.",
    date: "Yesterday",
    statusColor: "green",
  },
  {
    id: 13,
    avatar: "https://i.pravatar.cc/150?u=13",
    title: "Promo Offer",
    subtitle: "Get 20% off on your next booking!",
    date: "3 days ago",
    statusColor: "purple",
  },
  {
    id: 14,
    avatar: "https://i.pravatar.cc/150?u=14",
    title: "Service Paused",
    subtitle: "Your AC Repair service is now paused.",
    date: "2 days ago",
    statusColor: "yellow",
  },
  {
    id: 15,
    avatar: "https://i.pravatar.cc/150?u=15",
    title: "New Tip Received",
    subtitle: "You received a $10 tip from a client.",
    date: "4 hrs ago",
    statusColor: "green",
  },
  {
    id: 16,
    avatar: "https://i.pravatar.cc/150?u=16",
    title: "Booking Reminder",
    subtitle: "Reminder: You have a booking tomorrow at 10 AM.",
    date: "1 hr ago",
    statusColor: "blue",
  },
  {
    id: 17,
    avatar: "https://i.pravatar.cc/150?u=17",
    title: "Subscription Renewed",
    subtitle: "Your monthly subscription has been renewed.",
    date: "Today",
    statusColor: "green",
  },
  {
    id: 18,
    avatar: "https://i.pravatar.cc/150?u=18",
    title: "Service Update",
    subtitle: "You updated your Lawn Mowing service details.",
    date: "3 days ago",
    statusColor: "gray",
  },
  {
    id: 19,
    avatar: "https://i.pravatar.cc/150?u=19",
    title: "Support Ticket Closed",
    subtitle: "Your support ticket #3245 has been resolved.",
    date: "1 week ago",
    statusColor: "green",
  },
  {
    id: 20,
    avatar: "https://i.pravatar.cc/150?u=20",
    title: "Failed Payment",
    subtitle: "Payment for booking ID 4587 failed. Please update your card.",
    date: "6 hrs ago",
    statusColor: "red",
  },
];

//PROVINCES AND TERRITORIES
export const canadaProvincesAndTerritories = [
  { label: "Ontario", key: "Ontario" },
  { label: "Quebec", key: "Quebec" },
  { label: "Nova Scotia", key: "Nova Scotia" },
  { label: "New Brunswick", key: "New Brunswick" },
  { label: "Manitoba", key: "Manitoba" },
  { label: "British Columbia", key: "British Columbia" },
  { label: "Prince Edward Island", key: "Prince Edward Island" },
  { label: "Saskatchewan", key: "Saskatchewan" },
  { label: "Alberta", key: "Alberta" },
  { label: "Newfoundland and Labrador", key: "Newfoundland and Labrador" },

  // Territories
  { label: "Northwest Territories", key: "Northwest Territories" },
  { label: "Yukon", key: "Yukon" },
  { label: "Nunavut", key: "Nunavut" },
];

//COUNTRY
export const countryData = [{ label: "Canada", key: "Canada" }];

export const languageData = [
  { label: "English", key: "English" },
  { label: "French", key: "French" },
];

export const currencyCodeData = [
  { label: "USD", key: "USD" },
  { label: "CAD", key: "CAD" },
];
