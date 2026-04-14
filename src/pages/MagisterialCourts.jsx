import React, { useEffect, useState } from "react";
import MagisterialCourtCard from "../components/MagisterialCourtCard";
import MagisterialCourtModal from "../components/MagisterialCourtModal";
import {
  getMagisterialCourts,
  createMagisterialCourt,
  updateMagisterialCourt,
  deleteMagisterialCourt,
  getCircuitCourts,
} from "../apis/api";
import { toast } from "react-toastify";

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
  const [selectedCourt, setSelectedCourt] = useState(null); 
  const [loading, setLoading] = useState(true);

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
    setSelectedCourt(null); 
    setModalOpen(true);
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
    setSelectedCourt(court); 
    setModalOpen(true);
  };


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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      <MagisterialCourtModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={selectedCourt}
        circuitCourts={circuitCourts}
      />
    </div>
  );
};

export default MagisterialCourts;
