import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes.tsx";
import { Spinner } from "@heroui/react";

const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
            <Spinner
              classNames={{ label: "text-foreground text-sm" }}
              label="Loading..."
              variant="default"
              color="success"
              size="lg"
            />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
