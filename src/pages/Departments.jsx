import React, { useEffect, useState } from "react";
import DepartmentCard from "../components/DepartmentCard";
import DepartmentModal from "../components/DepartmentModal";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../apis/api";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { FileText, ChevronDown } from "lucide-react";

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
