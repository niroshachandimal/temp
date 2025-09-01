import { Outlet } from "react-router-dom";
import Header from "./ui/Header";
import ErrorBoundary from "../pages/ErrorBoundary";

const AppContent = () => {
  return (
    <>
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <Header />
        <div className="main-content flex flex-col flex-grow p-3 md:p-8 ml-[255px] md:ml-[250px] md:mt-14 mt-[70px]">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
};

export default AppContent;
