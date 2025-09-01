// import { Mail, Check, Star } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../core/data/redux/reducer';
// import { updateStaff } from '../../../core/data/redux/booking/bookingSlice';
// import { useEffect, useState } from 'react';

// const StaffsStep = () => {
//   const dispatch = useDispatch();
//   const [showValidationError, setShowValidationError] = useState(false)
//   const { staff, selectedService } = useSelector((state: RootState) => state.booking);
//   // Use availableStaff if service requires specific staff, otherwise use allStaff
//   const staffList = selectedService?.requiresStaff ?
//     (staff.availableStaff?.length ? staff.availableStaff : staff.allStaff) :
//     staff.allStaff;

//   const { selectedStaff, selectAnyone } = staff;

//   const handleStaffSelect = (staffId: string) => {
//     if (selectAnyone) {
//       dispatch(updateStaff({
//         selectAnyone: false,
//         selectedStaff: staffId === selectedStaff?.id ? null : staffList.find(s => s.id === staffId) || null
//       }));
//     } else {
//       dispatch(updateStaff({
//         selectedStaff: staffId === selectedStaff?.id ? null : staffList.find(s => s.id === staffId) || null
//       }));
//     }
//   };

//     useEffect(() => {
//     if (showValidationError && (selectedStaff || selectAnyone)) {
//       setShowValidationError(false);
//     }
//   }, [selectedStaff, selectAnyone, showValidationError]);

//   const handleSelectAnyone = () => {
//     const newSelectAnyone = !selectAnyone;
//     dispatch(updateStaff({
//       selectAnyone: newSelectAnyone,
//       selectedStaff: newSelectAnyone ? null : selectedStaff
//     }));
//   };

//   // Don't show staff selection if service doesn't require it
//   if (!selectedService?.requiresStaff) {
//     return (
//       <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
//         <div className="flex items-center">
//           <Check className="h-5 w-5 text-blue-500 mr-2" />
//           <h3 className="text-lg font-medium text-blue-800">No Staff Selection Required</h3>
//         </div>
//         <p className="mt-2 text-blue-600">
//           The service you selected doesn't require a specific staff member.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center mb-4">
//         <h3 className="text-lg font-medium">Select Staff</h3>
//         <span className="ml-4 text-gray-500">
//           {staffList.length} {staffList.length === 1 ? 'Option' : 'Options'} Available
//         </span>
//       </div>

//       {staff.allStaff?.length === 0 && (
//         <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
//           <p className="text-yellow-700">
//             No specialized staff available for this service. Showing all staff members.
//           </p>
//         </div>
//       )}

// {showValidationError && (
//         <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
//           <p className="text-red-700">
//             Please select a staff member or choose "Select Anyone Available" before proceeding.
//           </p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {staffList.map((staffMember) => (
//           <div
//             key={staffMember.id}
//             className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//               selectedStaff?.id === staffMember.id
//                 ? 'border-primary bg-indigo-50 shadow-md'
//                 : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
//             }`}
//             onClick={() => handleStaffSelect(staffMember.id)}
//           >
//             {selectedStaff?.id === staffMember.id && (
//               <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
//                 <Check className="h-3 w-3" />
//               </div>
//             )}

//             <div className="flex flex-col items-center mb-3">
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden">
//                 <img
//                   src={staffMember.image}
//                   alt={staffMember.name}
//                   className="w-full h-full object-cover"

//                 />
//               </div>
//               <h3 className="text-sm font-medium text-center">{staffMember.name}</h3>
//             </div>

//             <div className="flex items-center justify-center text-gray-500 text-sm mb-2 truncate">
//               <Mail className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
//               <span className="truncate">{staffMember.email}</span>
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="flex items-center">
//                 <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
//                 <span className="text-xs text-gray-600">
//                   {staffMember.serviceCount} Services
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
//                 <span className="text-xs font-medium">{staffMember.rating.toFixed(1)}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedService?.requiresStaff && (
//         <div className="mt-8 flex items-center">
//           <label className="flex items-center cursor-pointer">
//             <div className="relative">
//               <input
//                 type="checkbox"
//                 className="sr-only"
//                 checked={selectAnyone}
//                 onChange={handleSelectAnyone}
//               />
//               <div
//                 className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${
//                   selectAnyone ? 'bg-primary border-primary' : 'border-gray-300'
//                 }`}
//               >
//                 {selectAnyone && <Check className="h-3 w-3 text-white" />}
//               </div>
//             </div>
//             <span className="ml-2 text-sm">Select Anyone Available</span>
//           </label>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffsStep;
