import AppContent from "../components/AppContent";
import Sidebar from "../components/Sidebar";

const DefaultLayout = () => {
  return (
    <div className="flex flex-row min-h-screen bg-[#fffff] text-gray-800">
      <Sidebar />
      <AppContent />
    </div>
  );
};

export default DefaultLayout;
