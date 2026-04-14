import React, { useEffect, useState } from "react";
import DepartmentCard from "../components/DepartmentCard";
import DepartmentModal from "../components/DepartmentModal";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getStaffByCourt,
  getStaffOrderByCourt,
  saveStaffOrderByCourt,
} from "../apis/api";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { FileText, ChevronDown, ArrowLeft, GripVertical } from "lucide-react";

// Skeleton Loader
const SkeletonCard = () => (
  <div className="rounded-2xl shadow-md p-6 flex flex-col items-center gap-4 bg-white animate-pulse">
    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
    <div className="h-5 w-24 bg-gray-200 rounded"></div>
    <div className="h-4 w-28 bg-gray-200 rounded"></div>
    <div className="flex gap-3 mt-2">
      <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
      <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [departmentStaff, setDepartmentStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [draggingStaffId, setDraggingStaffId] = useState(null);
  const [dragOverStaffId, setDragOverStaffId] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await getDepartments();
        if (res.success) setDepartments(res.departments);
      } catch (error) {
        toast.error(error.message || "Failed to load departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleAdd = () => {
    setInitialData(null);
    setModalOpen(true);
  };

  const handleSave = async (dept) => {
    try {
      if (dept._id) {
        // Update existing
        const res = await updateDepartment(dept._id, dept);
        if (res.success) {
          setDepartments((prev) =>
            prev.map((d) => (d._id === dept._id ? res.department : d))
          );
          toast.success("Department updated!");
        }
      } else {
        // Create new
        const res = await createDepartment(dept);
        if (res.success) {
          setDepartments((prev) => [
            ...prev,
            { ...res.department, staffCount: 0 },
          ]);
          toast.success("Department created!");
        }
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete "${dept.name}"?`)) return;
    try {
      const res = await deleteDepartment(dept._id);
      if (res.success) {
        setDepartments((prev) => prev.filter((d) => d._id !== dept._id));
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete department");
    }
  };

  const handleEdit = (dept) => {
    setInitialData(dept);
    setModalOpen(true);
  };

  const sortStaffByOrder = (staff, order) => {
    const orderIndex = new Map((order || []).map((id, index) => [String(id), index]));
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

  const handleViewStaff = async (dept) => {
    setViewDepartment(dept);
    setStaffLoading(true);
    setDepartmentStaff([]);
    setDraggingStaffId(null);
    setDragOverStaffId(null);

    try {
      const [staff, order] = await Promise.all([
        getStaffByCourt(dept._id),
        getStaffOrderByCourt(dept._id),
      ]);
      setDepartmentStaff(sortStaffByOrder(staff || [], order || []));
    } catch (error) {
      toast.error(error.message || "Failed to load staff");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleBackToDepartments = () => {
    setViewDepartment(null);
    setDepartmentStaff([]);
    setDraggingStaffId(null);
    setDragOverStaffId(null);
  };

  const persistOrder = async (departmentId, nextStaff) => {
    setOrderSaving(true);
    try {
      await saveStaffOrderByCourt(
        departmentId,
        (nextStaff || []).map((s) => s._id)
      );
    } catch (error) {
      toast.error(error.message || "Failed to save order");
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

    if (!draggedId || !viewDepartment) return;
    if (String(draggedId) === String(targetStaffId)) return;

    const fromIndex = departmentStaff.findIndex(
      (s) => String(s._id) === String(draggedId)
    );
    const toIndex = departmentStaff.findIndex(
      (s) => String(s._id) === String(targetStaffId)
    );
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...departmentStaff];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    setDepartmentStaff(next);
    setDraggingStaffId(null);
    setDragOverStaffId(null);
    await persistOrder(viewDepartment._id, next);
  };

  const handleDragEnd = () => {
    setDraggingStaffId(null);
    setDragOverStaffId(null);
  };

  // ---------------- Export Functions ----------------
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Departments", 20, 20);
    departments.forEach((d, i) => {
      doc.text(
        `${i + 1}. Name: ${d.name}, Location: ${d.location || "N/A"}, Staff: ${
          d.staffCount || 0
        }`,
        20,
        30 + i * 10
      );
    });
    doc.save("departments.pdf");
  };

  const exportExcel = () => {
    const data = departments.map((d) => ({
      Name: d.name,
      Location: d.location || "N/A",
      "Total Staff": d.staffCount || 0,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
    XLSX.writeFile(workbook, "departments.xlsx");
  };

  const exportWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Departments", heading: "Heading1" }),
            ...departments.map(
              (d, i) =>
                new Paragraph({
                  children: [
                    new TextRun(
                      `${i + 1}. Name: ${d.name}, Location: ${
                        d.location || "N/A"
                      }, Staff: ${d.staffCount || 0}`
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
    a.download = "departments.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (viewDepartment) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToDepartments}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{viewDepartment.name}</h2>
              <p className="text-sm text-gray-500">Drag staff up/down to re-order</p>
            </div>
          </div>

          <div className="text-sm text-gray-600">{orderSaving ? "Saving..." : ""}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3 w-10"></th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Position</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Status</th>
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
                ) : departmentStaff.length === 0 ? (
                  <tr className="border-t">
                    <td className="px-4 py-6 text-sm text-gray-600" colSpan={4}>
                      No staff found in this department.
                    </td>
                  </tr>
                ) : (
                  departmentStaff.map((staff) => (
                    <tr
                      key={staff._id}
                      className={`border-t ${
                        dragOverStaffId && String(dragOverStaffId) === String(staff._id)
                          ? "bg-purple-50"
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
                      <td className="px-4 py-3 text-sm text-gray-800">{staff.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{staff.position || "N/A"}</td>
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">Departments</h2>
        <div className="flex gap-3 relative">
          <button
            onClick={handleAdd}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-1"
          >
            + Add Department
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <FileText size={16} /> Export <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    exportPDF();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    exportExcel();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    exportWord();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                  Word
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6)
              .fill(null)
              .map((_, i) => <SkeletonCard key={i} />)
          : departments.map((dept) => (
              <DepartmentCard
                key={dept._id}
                department={dept}
                onView={handleViewStaff}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      <DepartmentModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={initialData}
      />
    </div>
  );
};

export default Departments;
