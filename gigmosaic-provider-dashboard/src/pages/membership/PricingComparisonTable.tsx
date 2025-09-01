/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, X } from 'lucide-react';

const PricingComparisonTable = ({ plans }: { plans: any[] }) => {
  const getFeatureValue = (plan: any, feature: string) => {
    // Handle limits
    if (feature === 'services') return plan.limits.services;
    if (feature === 'teamMembers') return plan.limits.teamMembers;
    if (feature === 'featuredListings') return plan.limits.featuredListings;
    
    // Handle features
    if (feature === 'analytics') return plan.features.analytics;
    if (feature === 'bookingCalendar') return plan.features.bookingCalendar;
    if (feature === 'messaging') return plan.features.messaging;
    if (feature === 'branding') return plan.features.branding;
    if (feature === 'promoTools') return plan.features.promoTools;
    
    // Handle addons
    if (feature === 'extraServices') {
      const addon = plan.addons.find((a: { name: string | string[]; }) => a.name.includes('Service'));
      return addon ? addon.price : '✗';
    }
    if (feature === 'extraTeamMembers') {
      const addon = plan.addons.find((a: { name: string | string[]; }) => a.name.includes('Team'));
      return addon ? addon.price : '✗';
    }
    if (feature === 'customBranding') {
      const addon = plan.addons.find((a: { name: string | string[]; }) => a.name.includes('Branded'));
      return addon ? addon.price : '✗';
    }
    
    return '';
  };

  const renderCellContent = (value:any) => {
    if (value === true) return <Check className="w-4 h-4 text-green-500 mx-auto" />;
    if (value === false) return <X className="w-4 h-4 text-red-500 mx-auto" />;
    if (value === '💸') return <span>💸</span>;
    if (value === '✗') return <X className="w-4 h-4 text-red-500 mx-auto" />;
    return value;
  };

  const features = [
    { id: 'monthlyPrice', label: 'Monthly Price (CAD)', format: (plan:any) => 
  plan.name === "Enterprise"
    ? "Custom"
    : `CAD${plan.pricing.monthly.price}/month${plan.pricing.yearly ? ` or CAD${plan.pricing.yearly.price}/year` : ""}`
    },
    { id: 'services', label: 'Services Included' },
    { id: 'extraServices', label: 'Additional Services' },
    { id: 'teamMembers', label: 'Team Member Access' },
    { id: 'extraTeamMembers', label: 'Extra Team Members' },
    { id: 'featuredListings', label: 'Featured Listings' },
    { id: 'analytics', label: 'Service Analytics' },
    { id: 'bookingCalendar', label: 'Client Booking Calendar' },
    { id: 'promoTools', label: 'Discounts & Promo Tools' },
    { id: 'messaging', label: 'Messaging System' },
    { id: 'branding', label: 'Custom Booking Page Branding' },
  ];

  return (
    <div className="overflow-x-auto py-4">
        <h1 className='text-xl text-gray-600 mb-8'>Price Comparison</h1>
      <table className="w-full text-sm text-left py-4">
        <thead className="border-b">
          <tr>
            <th className="px-4 py-3 min-w-[200px]">Feature</th>
            {plans.map(plan => (
              <th key={plan.id} className={`px-4 py-3 text-center ${plan.isPopular ? 'bg-blue-50' : ''}`}>
                <div className="font-bold">{plan.name}</div>
                {plan.isPopular && (
                  <div className="text-xs text-blue-500 mt-1">Most Popular</div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map(feature => (
            <tr key={feature.id} className="border-b">
              <td className="px-4 py-3 font-medium">{feature.label}</td>
              {plans.map(plan => (
                <td key={`${plan.id}-${feature.id}`} className="px-4 py-3 text-center">
                  {renderCellContent(
                    feature.format ? feature.format(plan) : getFeatureValue(plan, feature.id)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingComparisonTable;