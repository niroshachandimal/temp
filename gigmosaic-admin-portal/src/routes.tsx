import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Error404Page from "./pages/Error404Page";
import AllCategories from "./pages/category-subcategory/AllCategories";
import AllSubcategories from "./pages/category-subcategory/AllSubcategories";
import FAQManager from "./pages/faq/FaqManager";

const userRole = "Admin";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    element: (
      <ProtectedRoute
        element={Dashboard}
        allowedRoles={["Admin"]}
        userRole={userRole}
      />
    ),
  },
  {
    path: "/category/all",
    name: "All Categories",
    element: (
      <ProtectedRoute
        element={AllCategories}
        allowedRoles={["Admin"]}
        userRole={userRole}
      />
    ),
  },
  {
    path: "/subcategory/all",
    name: "All Subcategories",
    element: (
      <ProtectedRoute
        element={AllSubcategories}
        allowedRoles={["Admin"]}
        userRole={userRole}
      />
    ),
  },
  {
    path: "/faq-manager",
    name: "FAQ Manager",
    element: (
      <ProtectedRoute
        element={FAQManager}
        allowedRoles={["Admin"]}
        userRole={userRole}
      />
    ),
  },
  {
    path: "*",
    name: "Error 404",
    element: <Error404Page />,
  },
];

export default routes;