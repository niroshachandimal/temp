import OurProviders from '../Ourprovides/ourProvides';
import OurRecentServices from './OurRecentServices';

const ServiceProvidersGrid = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center gap-4">
      {/* Left Side - OurProviders */}
      <div className="w-full lg:w-1/2">
        <OurProviders />
      </div>

      {/* Right Side - OurRecentServices */}
      <div className="w-full lg:w-1/2">
        <OurRecentServices />
      </div>
    </div>
  );
};

export default ServiceProvidersGrid;
