interface NotFoundDataProps {
  label?: string;
}

const NotFoundData = ({ label }: NotFoundDataProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-caption text-center">{label || "No Data Found"}</p>
    </div>
  );
};

export default NotFoundData;
