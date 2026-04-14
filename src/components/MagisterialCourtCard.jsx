import React from "react";
import { Landmark } from "lucide-react";

const MagisterialCourtCard = ({ court, onView, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl shadow-md p-6 flex flex-col items-center gap-4 bg-white transition hover:scale-105 duration-300">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500">
        <Landmark className="w-8 h-8" />
      </div>

      <h3 className="font-semibold text-lg text-center text-gray-800">
        {court.name}
      </h3>
      <p className="text-gray-500 text-sm">Total Staff: {court.staffCount}</p>
      <p className="text-gray-500 text-sm">
        Parent Circuit: {court.circuitName || "N/A"}
      </p>

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => onView(court)}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition"
        >
          View
        </button>
        <button
          onClick={() => onEdit(court)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(court)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MagisterialCourtCard;
