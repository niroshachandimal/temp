import { addToast } from "@heroui/react";

export const validateBookingData = (
  newStatus: string,
  bookingId: string,
  currentStatus: string
) => {
  console.log("Selected Status: ", newStatus, bookingId, currentStatus);
  if (!bookingId && !newStatus && !currentStatus) {
    addToast({
      title: "Error",
      description: "No booking selected. try again.",
      radius: "md",
      color: "danger",
    });
    return;
  }

  // 1 - pending
  // 2 - confirm
  // 3 - inprogress
  // 4 - completed
  // 5 - cancelled

  const statusMap: Record<string, number> = {
    pending: 1,
    confirmed: 2,
    inprogress: 3,
    completed: 4,
    // cancelled: 5,
  };

  const newStatusValue = statusMap[newStatus] || 0;
  const currentStatusValue = statusMap[currentStatus] || 0;

  const newStatusUpperCase = newStatus.toUpperCase();
  const currentStatusUpperCase = currentStatus.toUpperCase();

  if (currentStatusValue === 5) {
    addToast({
      title: "Booking Cancelled",
      description: `Booking is already cancelled! You cannot change the status.`,
      radius: "md",
      color: "danger",
    });
    return;
  }

  if (currentStatus === newStatus) {
    addToast({
      title: "Warning",
      description: `Booking is already ${newStatus} !`,
      radius: "md",
      color: "warning",
    });
    return;
  }

  console.log("New Status Value: ", newStatusValue);
  console.log("Current Status Value: ", currentStatusValue);

  if (currentStatusValue == 1 && newStatusValue >= 3) {
    addToast({
      title: "Confirm Booking",
      description: `You cannot change status from "${currentStatusUpperCase}" to "${newStatusUpperCase}". Please confirm the booking first.`,
      radius: "md",
      color: "warning",
    });
    return;
  }

  if (currentStatusValue == 2 && newStatusValue >= 4) {
    addToast({
      title: "Inprogress Booking",
      description: `You cannot change status from "${currentStatusUpperCase}" to "${newStatusUpperCase}" before update "INPROGRESS" status `,
      radius: "md",
      color: "warning",
    });
    return;
  }

  // if (currentStatusValue == 3 && newStatusValue >= 5) {
  //   addToast({
  //     title: "Complete Booking",
  //     description: `You cannot change status from "${currentStatusUpperCase}" to "${newStatusUpperCase}". Please mark the booking as completed first.`,
  //     radius: "md",
  //     color: "warning",
  //   });
  //   return;
  // }

  if (newStatusValue < currentStatusValue) {
    addToast({
      title: "Cannot Change Status",
      description: `You cannot change status from "${currentStatusUpperCase}" to "${newStatusUpperCase}".`,
      radius: "md",
      color: "danger",
    });
    return;
  }

  return true;
};
