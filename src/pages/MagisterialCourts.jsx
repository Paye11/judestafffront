import React, { useEffect, useState } from "react";
import MagisterialCourtCard from "../components/MagisterialCourtCard";
import MagisterialCourtModal from "../components/MagisterialCourtModal";
import {
  getMagisterialCourts,
  createMagisterialCourt,
  updateMagisterialCourt,
  deleteMagisterialCourt,
  getCircuitCourts,
  getStaffByCourt,
  getStaffOrderByCourt,
  saveStaffOrderByCourt,
} from "../apis/api";
import { toast } from "react-toastify";
import { ArrowLeft, GripVertical } from "lucide-react";

const SkeletonCourtCard = () => (
  <div className="rounded-2xl shadow-md p-6 flex flex-col items-center gap-4 bg-white animate-pulse">
    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
    <div className="h-5 w-24 bg-gray-200 rounded"></div>
    <div className="h-4 w-32 bg-gray-200 rounded"></div>
    <div className="h-4 w-28 bg-gray-200 rounded"></div>
    <div className="flex gap-3 mt-2">
      <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
      <div className="h-8 w-20 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

const MagisterialCourts = () => {
  const [courts, setCourts] = useState([]);
  const [circuitCourts, setCircuitCourts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCourt, setViewCourt] = useState(null);
  const [courtStaff, setCourtStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [draggingStaffId, setDraggingStaffId] = useState(null);
  const [dragOverStaffId, setDragOverStaffId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [magData, circuitData] = await Promise.all([
          getMagisterialCourts(),
          getCircuitCourts(),
        ]);
        setCircuitCourts(circuitData);

        const magWithCircuitName = magData.map((m) => ({
          ...m,
          circuitName:
            circuitData.find((c) => c._id === m.circuitCourtId)?.name || "N/A",
        }));
        setCourts(magWithCircuitName);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingCourt(null);
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

  const handleViewStaff = async (court) => {
    setViewCourt(court);
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
      toast.error(error.message || "Failed to load staff");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleBackToCourts = () => {
    setViewCourt(null);
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

    if (!draggedId || !viewCourt) return;
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
    await persistOrder(viewCourt._id, next);
  };

  const handleDragEnd = () => {
    setDraggingStaffId(null);
    setDragOverStaffId(null);
  };

  const handleSave = async (court) => {
    try {
      const payload = {
        name: court.name,
        location: court.location,
        circuitCourtId: court.circuitId,
      };

      if (court._id) {
        const res = await updateMagisterialCourt(court._id, payload);
        if (res.success) {
          setCourts((prev) =>
            prev.map((c) =>
              c._id === court._id
                ? {
                    ...res.court,
                    circuitName:
                      circuitCourts.find((cc) => cc._id === payload.circuitCourtId)
                        ?.name || "",
                  }
                : c
            )
          );
          toast.success(res.message);
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to update court");
        }
      } else {
        // ✅ CREATE MODE
        const res = await createMagisterialCourt(payload);
        if (res.success) {
          const circuitName =
            circuitCourts.find((c) => c._id === payload.circuitCourtId)?.name ||
            "";
          setCourts((prev) => [
            ...prev,
            { ...res.court, staffCount: 0, circuitName },
          ]);
          toast.success(res.message);
          setModalOpen(false);
        } else {
          toast.error(res.message || "Failed to create court");
        }
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDelete = async (court) => {
    if (!window.confirm(`Are you sure you want to delete "${court.name}"?`))
      return;
    try {
      const res = await deleteMagisterialCourt(court._id);
      if (res.success) {
        setCourts((prev) => prev.filter((c) => c._id !== court._id));
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete court");
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setModalOpen(true);
  };

  if (viewCourt) {
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
              <h2 className="text-lg sm:text-xl font-bold">{viewCourt.name}</h2>
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
                ) : courtStaff.length === 0 ? (
                  <tr className="border-t">
                    <td className="px-4 py-6 text-sm text-gray-600" colSpan={4}>
                      No staff found in this magisterial court.
                    </td>
                  </tr>
                ) : (
                  courtStaff.map((staff) => (
                    <tr
                      key={staff._id}
                      className={`border-t ${
                        dragOverStaffId && String(dragOverStaffId) === String(staff._id)
                          ? "bg-green-50"
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Magisterial Courts</h2>
        <div className="flex gap-3 relative">
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-1"
          >
            + Add Magisterial Court
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6)
              .fill(null)
              .map((_, i) => <SkeletonCourtCard key={i} />)
          : courts.map((court) => (
              <MagisterialCourtCard
                key={court._id}
                court={court}
                onView={handleViewStaff}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      <MagisterialCourtModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingCourt}
        circuitCourts={circuitCourts}
      />
    </div>
  );
};

export default MagisterialCourts;
