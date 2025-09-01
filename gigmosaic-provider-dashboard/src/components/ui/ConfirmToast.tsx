import Swal from "sweetalert2";

const ConfirmToast = async ({
  title,
  message,
  type,
  confirmText,
  cancelText,
}: {
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "none";
  confirmText: string;
  cancelText: string;
}): Promise<boolean> => {
  const icon: "success" | "warning" | "error" | undefined =
    type === "none" ? undefined : type;

  const result = await Swal.fire({
    title: title,
    text: message,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    buttonsStyling: true,
    customClass: {
      icon: "text-md",
      popup: "rounded-lg shadow-xl px-6 py-5",
      title: "text-lg font-bold text-gray-800",
      htmlContainer: "text-sm text-gray-600",
      confirmButton:
        "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none ml-5 w-24",
      cancelButton:
        "bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none w-24",
    },
  });

  return result.isConfirmed;
};

export default ConfirmToast;
