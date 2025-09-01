type Props = {
  label?: string;
};

const FullLoading = ({ label = "Loading..." }: Props) => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-xl z-[9999]"
      role="status"
      aria-busy="true"
    >
      <div className="w-10 h-10 animate-spin rounded-full border-4 border-t-primary border-gray-300"></div>
      <p className="mt-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
        {label}
      </p>
    </div>
  );
};

export default FullLoading;
