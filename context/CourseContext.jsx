import React, { createContext, useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_BASEURL;
export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all courses from backend
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/courses`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <CourseContext.Provider value={{ 
      courses, 
      loading, 
      fetchCourses
    }}>
      {children}
    </CourseContext.Provider>
  );
};