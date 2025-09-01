import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useLocation } from "react-router-dom";
import routes from "../../routes";

const Breadcrumb = () => {
  const currentLocation = useLocation().pathname;

  console.log("Path name: ", currentLocation);

  // Define route type
  type Route = {
    path: string;
    name: string;
  };

  const getRouteName = (pathname: string, routes: Route[]) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : false;
  };

  // Generate breadcrumbs
  const getBreadcrumbs = (location: string) => {
    const breadcrumbs: { pathname: string; name: string; active: boolean }[] =
      [];

    location.split("/").reduce((prev, curr, index, array) => {
      if (!curr) return prev;

      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname, routes);
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        });
      }
      return currentPathname;
    }, "");

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);
  console.log("Breadcrumbs: ", breadcrumbs);

  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard">Home</BreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem key={index} href={breadcrumb.pathname}>
          {breadcrumb.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
