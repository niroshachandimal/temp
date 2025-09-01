import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import PageLoader from '../../core/loader';
import { publicRoutes } from '../router/router.link';

const AppContent = () => {
  return (
    <div className="">
      <Suspense fallback={<PageLoader />}>
        {/* <Suspense fallback={<p>Loading...</p>}> */}
        <Routes>
          {publicRoutes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element} />
          ))}
          {/* <Route path="/" element={<Navigate to="dashboard" replace />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default React.memo(AppContent);
