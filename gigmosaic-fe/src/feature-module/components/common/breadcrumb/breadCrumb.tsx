import React from 'react';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { GoHome } from 'react-icons/go';
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';
import { useTranslation } from 'react-i18next';
interface breadCrumbProps {
  title: string;
  item1?: string;
  item1Link?: string;
  item2?: string;
}
const BreadCrumb: React.FC<breadCrumbProps> = ({ title, item1, item2,item1Link }) => {
  const routes = all_routes;
  console.log(item1);

  const { t } = useTranslation();

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex flex-col items-center justify-center text-center mt-6">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <Breadcrumbs>
        <BreadcrumbItem href={routes.index} startContent={<GoHome />}>{t('navigation.home')}</BreadcrumbItem>
        <BreadcrumbItem href={item1Link ? item1Link : ''}>{item1}</BreadcrumbItem>
   {item2 && <BreadcrumbItem>{item2}</BreadcrumbItem>}
      </Breadcrumbs>
</div>
      {/* /Breadcrumb */}
    </>
  );
};

export default BreadCrumb;
