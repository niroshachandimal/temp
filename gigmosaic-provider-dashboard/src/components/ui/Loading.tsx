interface LoadingProps {
  label?: string;
}

const Loading = ({ label = "Loading..." }: LoadingProps) => {
  return (
    <>
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-darkModeBackground">
        <div className="w-10 h-10 animate-spin rounded-full border-4 border-t-primary"></div>
        <p className="mt-3 text-gray-600 text-sm font-medium">{label}</p>
      </div>
    </>
  );
};

export default Loading;
