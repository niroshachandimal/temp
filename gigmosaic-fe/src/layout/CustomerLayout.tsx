import AppHeader from '../feature-module/components/AppHeader';
import Footer from '../feature-module/components/Footer/Footer';
import Customers from '../feature-module/frontend/Customer/customers';
import CustomerSidebar from '../feature-module/frontend/Customer/customerSidebar';

import { useLocation } from 'react-router-dom';

const CustomerLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <div className="flex flex-col min-h-screen">
      {isHomePage ? (
        <div className="sticky top-0 w-full bg-white z-20">
          <AppHeader />
        </div>
      ) : (
        <div className="w-full">
          <AppHeader />
        </div>
      )}

      <div className="flex-grow px-14 py-6">
        <div className="flex gap-6">
          <div className="w-1/5">
            <CustomerSidebar />
          </div>
          <div className="w-4/5">
            <Customers />
          </div>
        </div>
        <Footer/>
      </div>
      <Footer/>
    </div>
  );
};


export default CustomerLayout;
