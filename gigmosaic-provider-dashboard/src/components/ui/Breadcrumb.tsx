import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const currentLocation = useLocation().pathname;

  const pathSegments = currentLocation.split("/").filter(Boolean); // remove empty segments

  return (
    <Breadcrumbs>
      <BreadcrumbItem>Home</BreadcrumbItem>
      {pathSegments.map((segment, index) => (
        <BreadcrumbItem key={index}>
          {segment.charAt(0).toUpperCase() + segment.slice(1)}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
