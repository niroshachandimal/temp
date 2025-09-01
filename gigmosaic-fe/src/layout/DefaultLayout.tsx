import AppContent from '../feature-module/components/AppContent';
import TopHeader from '../feature-module/components/header/TopHeader';
import SearchBar from '../feature-module/components/SearchBar';
import Footer from '../feature-module/components/Footer/Footer';
import { useLocation } from 'react-router-dom';
import AppHeader from '../feature-module/components/AppHeader';
import FAQChatbot from '../feature-module/components/common/ui/FAQChatbot';

const DefaultLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  return (
    <div>
      <div>
        {/* <AppSidebar /> */}
        <div className="">
          {isHomePage ? (
            <div className="fixed w-full bg-white max-w-[1980px] z-20 inset-x-50 top-0">
              <TopHeader />
              <SearchBar />
            </div>
          ) : (
            <>
              <TopHeader />
              <AppHeader />
            </>
          )}

          <div className="px-14">
            <AppContent />
          </div>
          <Footer />
          <FAQChatbot />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
