import React from "react";
import { Users } from "lucide-react";

const DepartmentCard = ({ department, onView, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl shadow-md p-6 flex flex-col items-center gap-4 bg-white transition hover:scale-105 duration-300">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-500">
        <Users className="w-8 h-8" />
      </div>

      <h3 className="font-semibold text-lg text-center text-gray-800">
        {department.name}
      </h3>
      <p className="text-gray-500 text-sm">
        Total Staff: {department.staffCount || 0}
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-2 w-full">
        <button
          onClick={() => onView(department)}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition w-full sm:w-auto"
        >
          View
        </button>
        <button
          onClick={() => onEdit(department)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition w-full sm:w-auto"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(department)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition w-full sm:w-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
