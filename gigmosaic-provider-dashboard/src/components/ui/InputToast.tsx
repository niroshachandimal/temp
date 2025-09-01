import Swal from "sweetalert2";

const InputToast = async ({
  title,
  placeholder,
  confirmText,
  cancelText,
  showCancelBtn = true,
  minValue = 0,
  maxValue = 100,
}: {
  title: string;
  placeholder: string;
  showCancelBtn?: boolean;
  confirmText: string;
  cancelText: string;
  minValue?: number;
  maxValue?: number;
}): Promise<string | null> => {
  const result = await Swal.fire({
    input: "textarea",
    inputLabel: title,
    inputPlaceholder: placeholder,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    showCancelButton: showCancelBtn,
    inputAttributes: {
      "aria-label": placeholder,
    },
    customClass: {
      input: "text-sm p-2",
      inputLabel: "text-lg font-medium text-gray-800",
      icon: "text-md",
      popup: "rounded-lg shadow-xl px-6 py-5",
      htmlContainer: "text-sm text-gray-600",
      confirmButton:
        "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none ml-5 w-24",
      cancelButton:
        "bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none w-24",
    },
    inputValidator: (value) => {
      if (!value) {
        return "Please enter a value";
      }
      if (value.length < minValue) {
        return `Please enter a value more than ${minValue} characters`;
      }
      if (value.length > maxValue) {
        return `Please enter a value less than ${maxValue} characters`;
      }
    },
  });

  return result.value;
};

export default InputToast;
