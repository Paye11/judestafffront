import apiClient from "./apiClient";


export const getCircuitCourts = async () => {
  const res = await apiClient.get("/courts/circuit");
  return res.data.courts;
};

export const getMagisterialCourts = async () => {
  const res = await apiClient.get("/courts/magisterial");
  return res.data.courts;
};

export const getDepartments = async () => {
  const res = await apiClient.get("/courts/department");
  return res.data;
};

export const getAllStaff = async () => {
  const res = await apiClient.get("/staff/all");
  return res.data;
};

export const getStaffStatistics = async () => {
  const res = await apiClient.get("/staff/statistics");
  return res.data.statistics;
};
export const getRetiredStaff = async () => {
  const res = await apiClient.get("/staff/retired");
  return res.data.staff;
};
export const getDismissedStaff = async () => {
  const res = await apiClient.get("/staff/dismissed");
  return res.data;
};
export const deleteCircuitCourt = async (id) => {
  try {
    const response = await apiClient.delete(`/courts/circuit/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

export const createCircuitCourt = async (courtData) => {
  try {
    const response = await apiClient.post("/courts/circuit", courtData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

export const deleteMagisterialCourt = async (id) => {
  try {
    const response = await apiClient.delete(`/courts/magisterial/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};
export const updateMagisterialCourt = async (courtId, courtData) => {
  try {
    const response = await apiClient.put(
      `/courts/magisterial/${courtId}`,
      courtData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating magisterial court:", error);
    throw error.response?.data || error.message;
  }
};
export const createMagisterialCourt = async (courtData) => {
  try {
    const response = await apiClient.post("/courts/magisterial", courtData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};


export const createDepartment = async (departmentData) => {
  try {
    const response = await apiClient.post("/courts/department", departmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};
export const updateDepartment = async (id, data) => {
  const res = await apiClient.put(`/courts/department/${id}`, data);
  return res.data;
};
export const deleteDepartment = async (id) => {
  try {
    const response = await apiClient.delete(`/courts/department/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

export const getActiveStaff = async (params = {}) => {
  const res = await apiClient.get("/staff/active", { params });
  return res.data;
};

export const getStaffById = async (id) => {
  const res = await apiClient.get(`/staff/${id}`);
  return res.data.staff;
};

export const createStaff = async (data) => {
  const res = await apiClient.post("/staff/add", data);
  return res.data;
};

export const updateStaff = async (id, data) => {
  const res = await apiClient.put(`/staff/${id}`, data);
  return res.data;
};

export const deleteStaff = async (id) => {
  const res = await apiClient.delete(`/staff/${id}`);
  return res.data;
};
export const getOnLeaveStaff = async () => {
  const res = await apiClient.get("/staff/on-leave");
  return res.data;
};

// api.js
export const getRecycleBin = async () => {
  const res = await apiClient.get("/staff/recycle-bin/all");
  return res.data;
};

export const restoreFromRecycleBin = async (id) => {
  const res = await apiClient.post(`/staff/recycle-bin/restore/${id}`);
  return res.data;
};

export const permanentlyDelete = async (id) => {
  const res = await apiClient.delete(`/staff/recycle-bin/permanent/${id}`);
  return res.data;
};


export const getUserProfile = async () => {
  const res = await apiClient.get("/settings/profile");
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await apiClient.put("/settings/profile", data);
  return res.data;
};

export const updateLogo = async (formData) => {
  const res = await apiClient.post("/settings/logo", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const getLogo = async () => {
  const res = await apiClient.get("/settings/logo");
  return res.data;
};

export const getStaffByCourt = async (courtId) => {
  const res = await apiClient.get(`/staff/by-court/${courtId}`);
  return res.data.staff;
};

export const getStaffOrderByCourt = async (courtId) => {
  const res = await apiClient.get(`/settings/staff-order/${courtId}`);
  return res.data.order || [];
};

export const saveStaffOrderByCourt = async (courtId, order) => {
  const res = await apiClient.put(`/settings/staff-order/${courtId}`, { order });
  return res.data;
};

