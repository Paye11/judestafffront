// import React, { useEffect, useState } from "react";
// import { createStaff, updateStaff, getCircuitCourts, getMagisterialCourts, getDepartments } from "../apis/api";
// import { toast } from "react-toastify";

// const StaffModal = ({ show, onClose, onSave, staff, courts }) => {
//   const [form, setForm] = useState({
//     name: "",
//     position: "",
//     area: "",
//     phone: "",
//     education: "",
//     employmentStatus: "active",
//     courtType: "",
//     courtId: "",
//     retirementDate: "",
//     dismissalDate: "",
//     leaveStartDate: "",
//     leaveEndDate: ""
//   });

//   const [filteredCourts, setFilteredCourts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (staff) {
//       setForm({
//         name: staff.name || "",
//         position: staff.position || "",
//         area: staff.area || "",
//         phone: staff.phone || "",
//         education: staff.education || "",
//         employmentStatus: staff.employmentStatus || "active",
//         courtType: staff.courtType || "",
//         courtId: staff.courtId || "",
//         retirementDate: staff.retirementDate ? new Date(staff.retirementDate).toISOString().split('T')[0] : "",
//         dismissalDate: staff.dismissalDate ? new Date(staff.dismissalDate).toISOString().split('T')[0] : "",
//         leaveStartDate: staff.leaveStartDate ? new Date(staff.leaveStartDate).toISOString().split('T')[0] : "",
//         leaveEndDate: staff.leaveEndDate ? new Date(staff.leaveEndDate).toISOString().split('T')[0] : ""
//       });
//     } else {
//       setForm({
//         name: "",
//         position: "",
//         area: "",
//         phone: "",
//         education: "",
//         employmentStatus: "active",
//         courtType: "",
//         courtId: "",
//         retirementDate: "",
//         dismissalDate: "",
//         leaveStartDate: "",
//         leaveEndDate: ""
//       });
//     }
//     setFilteredCourts([]);
//   }, [staff, show]);

//   useEffect(() => {
//     const fetchCourtsByType = async () => {
//       if (!form.courtType) {
//         setFilteredCourts([]);
//         return;
//       }

//       setLoading(true);
//       try {
//         let courtsData = [];
//         switch (form.courtType) {
//           case "circuit":
//             courtsData = await getCircuitCourts();
//             break;
//           case "magisterial":
//             courtsData = await getMagisterialCourts();
//             break;
//           case "department":
//             courtsData = await getDepartments();
//             break;
//           default:
//             courtsData = [];
//         }
//         setFilteredCourts(courtsData);
//       } catch (error) {
//         toast.error("Failed to fetch courts");
//         console.error("Error fetching courts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (form.courtType) {
//       fetchCourtsByType();
//     }
//   }, [form.courtType]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // If court type changes, reset the court selection
//     if (name === "courtType") {
//       setForm({ ...form, [name]: value, courtId: "" });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Prepare data for API call
//       const submitData = {
//         name: form.name,
//         position: form.position,
//         area: form.area,
//         phone: form.phone,
//         education: form.education,
//         employmentStatus: form.employmentStatus,
//         courtType: form.courtType,
//         courtId: form.courtId
//       };

//       // Add date fields only if they have values
//       if (form.retirementDate) submitData.retirementDate = form.retirementDate;
//       if (form.dismissalDate) submitData.dismissalDate = form.dismissalDate;
//       if (form.leaveStartDate) submitData.leaveStartDate = form.leaveStartDate;
//       if (form.leaveEndDate) submitData.leaveEndDate = form.leaveEndDate;

//       let res;
//       if (staff?._id) {
//         res = await updateStaff(staff._id, submitData);
//       } else {
//         res = await createStaff(submitData);
//       }
//       if (res.success) {
//         toast.success("Staff saved successfully");
//         onSave(res.staff);
//       }
//     } catch (err) {
//       toast.error(err.message || "Error saving staff");
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div
//         className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//         onClick={onClose}
//       ></div>

//       <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 transform transition-all duration-300 scale-100 opacity-100">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">
//           {staff ? "Edit Staff Member" : "Add New Staff Member"}
//         </h2>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//             required
//           />
//           <input
//             type="text"
//             name="position"
//             value={form.position}
//             onChange={handleChange}
//             placeholder="Position"
//             className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//             required
//           />
//           <input
//             type="text"
//             name="area"
//             value={form.area}
//             onChange={handleChange}
//             placeholder="Area"
//             className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//             placeholder="Phone"
//             className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />
//           <input
//             type="text"
//             name="education"
//             value={form.education}
//             onChange={handleChange}
//             placeholder="Education"
//             className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//             required
//           />
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
//             <select
//               name="employmentStatus"
//               value={form.employmentStatus}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//               required
//             >
//               <option value="active">Active</option>
//               <option value="retired">Retired</option>
//               <option value="dismissed">Dismissed</option>
//               <option value="on_leave">On Leave</option>
//             </select>
//           </div>
          
//           {/* Dynamic Fields based on Employment Status */}
//           {form.employmentStatus === "retired" && (
//             <div className="fade-in">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Date</label>
//               <input
//                 type="date"
//                 name="retirementDate"
//                 value={form.retirementDate}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//               />
//             </div>
//           )}
          
//           {form.employmentStatus === "dismissed" && (
//             <div className="fade-in">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Dismissal Date</label>
//               <input
//                 type="date"
//                 name="dismissalDate"
//                 value={form.dismissalDate}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//               />
//             </div>
//           )}
          
//           {form.employmentStatus === "on_leave" && (
//             <div className="grid grid-cols-2 gap-3 fade-in">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Leave Start Date</label>
//                 <input
//                   type="date"
//                   name="leaveStartDate"
//                   value={form.leaveStartDate}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Leave End Date</label>
//                 <input
//                   type="date"
//                   name="leaveEndDate"
//                   value={form.leaveEndDate}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//                 />
//               </div>
//             </div>
//           )}
          
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Court Type</label>
//               <select
//                 name="courtType"
//                 value={form.courtType}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="circuit">Circuit Court</option>
//                 <option value="magisterial">Magisterial Court</option>
//                 <option value="department">Department</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Specific Court</label>
//               <select
//                 name="courtId"
//                 value={form.courtId}
//                 onChange={handleChange}
//                 disabled={!form.courtType || loading}
//                 className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50"
//                 required
//               >
//                 <option value="">Select Court</option>
//                 {loading ? (
//                   <option value="">Loading...</option>
//                 ) : (
//                   filteredCourts.map((court) => (
//                     <option key={court._id} value={court._id}>
//                       {court.name}
//                     </option>
//                   ))
//                 )}
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition"
//             >
//               {staff ? "Save Changes" : "Add Staff"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StaffModal;

import React, { useEffect, useState, useCallback } from "react";
import { createStaff, updateStaff, getCircuitCourts, getMagisterialCourts, getDepartments } from "../apis/api";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const StaffModal = ({ show, onClose, onSave, staff, courts }) => {
  const [form, setForm] = useState({
    name: "",
    position: "",
    area: "",
    phone: "",
    education: "",
    employmentStatus: "active",
    courtType: "",
    courtId: "",
    retirementDate: "",
    dismissalDate: "",
    leaveStartDate: "",
    leaveEndDate: ""
  });

  const [filteredCourts, setFilteredCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal is opened/closed or staff changes
  useEffect(() => {
    if (show) {
      if (staff) {
        setForm({
          name: staff.name || "",
          position: staff.position || "",
          area: staff.area || "",
          phone: staff.phone || "",
          education: staff.education || "",
          employmentStatus: staff.employmentStatus || "active",
          courtType: staff.courtType || "",
          courtId: staff.courtId || "",
          retirementDate: staff.retirementDate ? new Date(staff.retirementDate).toISOString().split('T')[0] : "",
          dismissalDate: staff.dismissalDate ? new Date(staff.dismissalDate).toISOString().split('T')[0] : "",
          leaveStartDate: staff.leaveStartDate ? new Date(staff.leaveStartDate).toISOString().split('T')[0] : "",
          leaveEndDate: staff.leaveEndDate ? new Date(staff.leaveEndDate).toISOString().split('T')[0] : ""
        });
      } else {
        setForm({
          name: "",
          position: "",
          area: "",
          phone: "",
          education: "",
          employmentStatus: "active",
          courtType: "",
          courtId: "",
          retirementDate: "",
          dismissalDate: "",
          leaveStartDate: "",
          leaveEndDate: ""
        });
      }
      setFilteredCourts([]);
    }
  }, [staff, show]);

  // Fetch courts based on selected type
  const fetchCourtsByType = useCallback(async (courtType) => {
    if (!courtType) {
      setFilteredCourts([]);
      return;
    }

    setLoading(true);
    try {
      let courtsData = [];
      switch (courtType) {
        case "circuit": {
          const circuitsRes = await getCircuitCourts();
          courtsData = circuitsRes.success
            ? circuitsRes.courts || []
            : circuitsRes || [];
          break;
        }
        case "magisterial": {
          const magsRes = await getMagisterialCourts();
          courtsData = magsRes.success ? magsRes.courts || [] : magsRes || [];
          break;
        }
        case "department": {
          const deptsRes = await getDepartments();
          courtsData = deptsRes.success
            ? deptsRes.departments || deptsRes.courts || []
            : deptsRes || [];
          break;
        }
        default:
          courtsData = [];
      }
      setFilteredCourts(courtsData);
    } catch (error) {
      toast.error("Failed to fetch courts");
      console.error("Error fetching courts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use existing courts if available, otherwise fetch
  useEffect(() => {
    if (form.courtType) {
      // Check if we already have courts of this type from props
      const existingCourts = courts.filter(c => c.type === form.courtType);
      
      if (existingCourts.length > 0) {
        setFilteredCourts(existingCourts);
      } else {
        fetchCourtsByType(form.courtType);
      }
    } else {
      setFilteredCourts([]);
    }
  }, [form.courtType, courts, fetchCourtsByType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If court type changes, reset the court selection
    if (name === "courtType") {
      setForm(prev => ({ ...prev, [name]: value, courtId: "" }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Prepare data for API call
      const submitData = {
        name: form.name.trim(),
        position: form.position.trim(),
        area: form.area.trim(),
        phone: form.phone.trim(),
        education: form.education.trim(),
        employmentStatus: form.employmentStatus,
        courtType: form.courtType,
        courtId: form.courtId
      };

      // Add date fields only if they have values
      if (form.retirementDate) submitData.retirementDate = form.retirementDate;
      if (form.dismissalDate) submitData.dismissalDate = form.dismissalDate;
      if (form.leaveStartDate) submitData.leaveStartDate = form.leaveStartDate;
      if (form.leaveEndDate) submitData.leaveEndDate = form.leaveEndDate;

      let res;
      if (staff?._id) {
        res = await updateStaff(staff._id, submitData);
      } else {
        res = await createStaff(submitData);
      }
      
      if (res.success) {
        toast.success("Staff saved successfully");
        onSave(res.staff);
      } else {
        toast.error(res.message || "Error saving staff");
      }
    } catch (err) {
      toast.error(err.message || "Error saving staff");
    } finally {
      setSubmitting(false);
    }
  };

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose();
    };
    
    if (show) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Enter position"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="Enter area"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education *</label>
            <input
              type="text"
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="Enter education"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status *</label>
            <select
              name="employmentStatus"
              value={form.employmentStatus}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            >
              <option value="active">Active</option>
              <option value="retired">Retired</option>
              <option value="dismissed">Dismissed</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
          
          {/* Dynamic Fields based on Employment Status */}
          {form.employmentStatus === "retired" && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Date</label>
              <input
                type="date"
                name="retirementDate"
                value={form.retirementDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>
          )}
          
          {form.employmentStatus === "dismissed" && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dismissal Date</label>
              <input
                type="date"
                name="dismissalDate"
                value={form.dismissalDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>
          )}
          
          {form.employmentStatus === "on_leave" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Start Date</label>
                <input
                  type="date"
                  name="leaveStartDate"
                  value={form.leaveStartDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave End Date</label>
                <input
                  type="date"
                  name="leaveEndDate"
                  value={form.leaveEndDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Court Type *</label>
              <select
                name="courtType"
                value={form.courtType}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              >
                <option value="">Select Type</option>
                <option value="circuit">Circuit Court</option>
                <option value="magisterial">Magisterial Court</option>
                <option value="department">Department</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specific Court *</label>
              <select
                name="courtId"
                value={form.courtId}
                onChange={handleChange}
                disabled={!form.courtType || loading}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50"
                required
              >
                <option value="">Select Court</option>
                {loading ? (
                  <option value="">Loading courts...</option>
                ) : (
                  filteredCourts.map((court) => (
                    <option key={court._id} value={court._id}>
                      {court.name}
                    </option>
                  ))
                )}
              </select>
              {loading && (
                <p className="text-xs text-gray-500 mt-1">Loading courts...</p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {staff ? "Saving..." : "Adding..."}
                </>
              ) : (
                staff ? "Save Changes" : "Add Staff"
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StaffModal;
