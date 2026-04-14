
// import React, { useEffect, useState } from "react";
// import CircuitCourtCard from "../components/CircuitCourtCard";
// import CircuitCourtModal from "../components/CircuitCourtModal";
// import { getCircuitCourts, deleteCircuitCourt, createCircuitCourt } from "../apis/api";
// import { toast } from "react-toastify";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";
// import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from "docx";
// import { FileText, ChevronDown } from "lucide-react";

// const CircuitCourts = () => {
//   const [courts, setCourts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourt, setEditingCourt] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     const fetchCourts = async () => {
//       try {
//         const data = await getCircuitCourts();
//         setCourts(data);
//       } catch (error) {
//         console.error("Failed to fetch courts:", error);
//       }
//     };
//     fetchCourts();
//   }, []);

//   const handleAdd = () => {
//     setEditingCourt(null);
//     setModalOpen(true);
//   };

//   const handleSave = async (court) => {
//     try {
//       const res = await createCircuitCourt(court);
//       if (res.success) {
//         setCourts((prev) => [...prev, { ...res.court, staffCount: 0 }]);
//         toast.success(res.message, { position: "top-right", autoClose: 3000 });
//         setModalOpen(false);
//       } else {
//         toast.error(res.message || "Failed to create court", { position: "top-right", autoClose: 3000 });
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handleDelete = async (court) => {
//     if (!window.confirm(`Are you sure you want to delete "${court.name}"?`)) return;
//     try {
//       const res = await deleteCircuitCourt(court._id);
//       if (res.success) {
//         setCourts(courts.filter((c) => c._id !== court._id));
//         toast.success(res.message, { position: "top-right", autoClose: 3000 });
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to delete court", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handleView = (court) => {
//     setEditingCourt(court);
//     setModalOpen(true);
//   };

//   // Export functions including total staff
//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Circuit Courts", 20, 20);
//     courts.forEach((c, i) => {
//       doc.text(`${i + 1}. Name: ${c.name}, Location: ${c.location || "N/A"}, Total Staff: ${c.staffCount || 0}`, 20, 30 + i * 10);
//     });
//     doc.save("circuit_courts.pdf");
//   };

//   const exportExcel = () => {
//     const data = courts.map(c => ({
//       Name: c.name,
//       Location: c.location || "N/A",
//       "Total Staff": c.staffCount || 0,
//     }));
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Circuit Courts");
//     XLSX.writeFile(workbook, "circuit_courts.xlsx");
//   };

//   const exportWord = async () => {
//     const doc = new Document({
//       sections: [
//         {
//           children: [
//             new Paragraph({ text: "Circuit Courts", heading: "Heading1" }),
//             ...courts.map(
//               (c, i) =>
//                 new Paragraph({
//                   children: [
//                     new TextRun(`${i + 1}. Name: ${c.name}, Location: ${c.location || "N/A"}, Total Staff: ${c.staffCount || 0}`)
//                   ]
//                 })
//             )
//           ]
//         }
//       ]
//     });
//     const blob = await Packer.toBlob(doc);
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "circuit_courts.docx";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold">Circuit Courts</h2>
//         <div className="flex gap-3 relative">
//           <button
//             onClick={handleAdd}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
//           >
//             + Add Circuit Court
//           </button>

//           {/* Export Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
//             >
//               <FileText size={16} />
//               Export Data
//               <ChevronDown size={16} />
//             </button>
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
//                 <button
//                   onClick={() => { exportPDF(); setDropdownOpen(false); }}
//                   className="block w-full text-left px-4 py-2 hover:bg-green-100"
//                 >
//                   PDF
//                 </button>
//                 <button
//                   onClick={() => { exportExcel(); setDropdownOpen(false); }}
//                   className="block w-full text-left px-4 py-2 hover:bg-green-100"
//                 >
//                   Excel
//                 </button>
//                 <button
//                   onClick={() => { exportWord(); setDropdownOpen(false); }}
//                   className="block w-full text-left px-4 py-2 hover:bg-green-100"
//                 >
//                   Word
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courts.map((court) => (
//           <CircuitCourtCard
//             key={court._id}
//             court={court}
//             onView={handleView}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>

//       <CircuitCourtModal
//         show={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSave={handleSave}
//         initialData={editingCourt}
//       />
//     </div>
//   );
// };

// export default CircuitCourts;


import React, { useEffect, useState } from "react";
import CircuitCourtCard from "../components/CircuitCourtCard";
import CircuitCourtModal from "../components/CircuitCourtModal";
import {
  getCircuitCourts,
  deleteCircuitCourt,
  createCircuitCourt,
  getStaffByCourt,
  getStaffOrderByCourt,
  saveStaffOrderByCourt,
} from "../apis/api";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { FileText, ChevronDown, ArrowLeft, GripVertical } from "lucide-react";

const CircuitCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtStaff, setCourtStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [draggingStaffId, setDraggingStaffId] = useState(null);
  const [dragOverStaffId, setDragOverStaffId] = useState(null);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const data = await getCircuitCourts();
        setCourts(data || []);
      } catch (error) {
        console.error("Failed to fetch courts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const sortStaffByOrder = (staff, order) => {
    const orderIndex = new Map(
      (order || []).map((id, index) => [String(id), index])
    );

    return [...staff].sort((a, b) => {
      const aIndex = orderIndex.has(String(a._id))
        ? orderIndex.get(String(a._id))
        : Number.MAX_SAFE_INTEGER;
      const bIndex = orderIndex.has(String(b._id))
        ? orderIndex.get(String(b._id))
        : Number.MAX_SAFE_INTEGER;

      if (aIndex !== bIndex) return aIndex - bIndex;
      return (a.name || "").localeCompare(b.name || "");
    });
  };

  const handleViewStaff = async (court) => {
    setSelectedCourt(court);
    setStaffLoading(true);
    setCourtStaff([]);
    setDraggingStaffId(null);
    setDragOverStaffId(null);

    try {
      const [staff, order] = await Promise.all([
        getStaffByCourt(court._id),
        getStaffOrderByCourt(court._id),
      ]);
      setCourtStaff(sortStaffByOrder(staff || [], order || []));
    } catch (error) {
      toast.error(error.message || "Failed to load staff", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setStaffLoading(false);
    }
  };

  const handleBackToCourts = () => {
    setSelectedCourt(null);
    setCourtStaff([]);
    setDraggingStaffId(null);
    setDragOverStaffId(null);
  };

  const persistOrder = async (courtId, nextStaff) => {
    setOrderSaving(true);
    try {
      await saveStaffOrderByCourt(
        courtId,
        (nextStaff || []).map((s) => s._id)
      );
    } catch (error) {
      toast.error(error.message || "Failed to save order", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setOrderSaving(false);
    }
  };

  const handleDragStart = (staffId) => (e) => {
    setDraggingStaffId(staffId);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(staffId));
    }
  };

  const handleDragOver = (staffId) => (e) => {
    e.preventDefault();
    if (dragOverStaffId !== staffId) setDragOverStaffId(staffId);
  };

  const handleDrop = (targetStaffId) => async (e) => {
    e.preventDefault();

    const draggedId =
      draggingStaffId ||
      (e.dataTransfer ? e.dataTransfer.getData("text/plain") : null);

    if (!draggedId || !selectedCourt) return;
    if (String(draggedId) === String(targetStaffId)) return;

    const fromIndex = courtStaff.findIndex(
      (s) => String(s._id) === String(draggedId)
    );
    const toIndex = courtStaff.findIndex(
      (s) => String(s._id) === String(targetStaffId)
    );
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...courtStaff];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    setCourtStaff(next);
    setDraggingStaffId(null);
    setDragOverStaffId(null);
    await persistOrder(selectedCourt._id, next);
  };

  const handleDragEnd = () => {
    setDraggingStaffId(null);
    setDragOverStaffId(null);
  };

  const handleAdd = () => {
    setEditingCourt(null);
    setModalOpen(true);
  };

  const handleSave = async (court) => {
    try {
      const res = await createCircuitCourt(court);
      if (res.success) {
        if (court._id) {
          // Editing
          setCourts((prev) =>
            prev.map((c) => (c._id === court._id ? { ...c, ...court } : c))
          );
        } else {
          // Creating new
          setCourts((prev) => [...prev, { ...res.court, staffCount: 0 }]);
        }
        toast.success(res.message, { position: "top-right", autoClose: 3000 });
        setModalOpen(false);
      } else {
        toast.error(res.message || "Failed to save court", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.message || "An error occurred", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (court) => {
    if (!window.confirm(`Are you sure you want to delete "${court.name}"?`))
      return;
    try {
      const res = await deleteCircuitCourt(court._id);
      if (res.success) {
        setCourts(courts.filter((c) => c._id !== court._id));
        toast.success(res.message, { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete court", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setModalOpen(true);
  };

  // Export functions
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Circuit Courts", 20, 20);
    courts.forEach((c, i) => {
      doc.text(
        `${i + 1}. Name: ${c.name}, Location: ${
          c.location || "N/A"
        }, Total Staff: ${c.staffCount || 0}`,
        20,
        30 + i * 10
      );
    });
    doc.save("circuit_courts.pdf");
  };

  const exportExcel = () => {
    const data = courts.map((c) => ({
      Name: c.name,
      Location: c.location || "N/A",
      "Total Staff": c.staffCount || 0,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Circuit Courts");
    XLSX.writeFile(workbook, "circuit_courts.xlsx");
  };

  const exportWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Circuit Courts", heading: "Heading1" }),
            ...courts.map(
              (c, i) =>
                new Paragraph({
                  children: [
                    new TextRun(
                      `${i + 1}. Name: ${c.name}, Location: ${
                        c.location || "N/A"
                      }, Total Staff: ${c.staffCount || 0}`
                    ),
                  ],
                })
            ),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "circuit_courts.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedCourt) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToCourts}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {selectedCourt.name}
              </h2>
              <p className="text-sm text-gray-500">
                Drag staff up/down to re-order
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {orderSaving ? "Saving..." : ""}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3 w-10"></th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">
                    Position
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-4">
                        <div className="h-4 w-4 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-40 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </td>
                    </tr>
                  ))
                ) : courtStaff.length === 0 ? (
                  <tr className="border-t">
                    <td
                      className="px-4 py-6 text-sm text-gray-600"
                      colSpan={4}
                    >
                      No staff found in this circuit court.
                    </td>
                  </tr>
                ) : (
                  courtStaff.map((staff) => (
                    <tr
                      key={staff._id}
                      className={`border-t ${
                        dragOverStaffId &&
                        String(dragOverStaffId) === String(staff._id)
                          ? "bg-blue-50"
                          : ""
                      }`}
                      draggable={!orderSaving}
                      onDragStart={handleDragStart(staff._id)}
                      onDragOver={handleDragOver(staff._id)}
                      onDrop={handleDrop(staff._id)}
                      onDragEnd={handleDragEnd}
                    >
                      <td className="px-4 py-3 text-gray-500 cursor-grab">
                        <GripVertical size={18} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {staff.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {staff.position || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 capitalize">
                        {(staff.employmentStatus || "N/A").replace("_", " ")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-bold">Circuit Courts</h2>
        <div className="flex flex-wrap gap-3 relative">
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
          >
            + Add Circuit Court
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              <FileText size={16} />
              Export
              <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    exportPDF();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-green-100"
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    exportExcel();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-green-100"
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    exportWord();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-green-100"
                >
                  Word
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl shadow-md p-6 bg-gray-100 animate-pulse h-40"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))
          : courts.map((court) => (
              <CircuitCourtCard
                key={court._id}
                court={court}
                onView={handleViewStaff}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      <CircuitCourtModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingCourt}
      />
    </div>
  );
};

export default CircuitCourts;
