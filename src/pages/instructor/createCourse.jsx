import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Authcontext";
import axios from "axios";
import SideNav from "../../components/instructorCom/sideNav";
import MainFrame from "../../components/instructorCom/mainFrame";
import { CourseContext } from "../../../context/CourseContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";


const InstructorCreateCourse = () => {
    const { user } = useContext(AuthContext) || {};
      const { courses, loading: coursesLoading } = useContext(CourseContext);
    
      // Admins state
      const [admins, setAdmins] = useState([]);
      const [adminsLoading, setAdminsLoading] = useState(false);
    
      // Create lecture batch state
      const [form, setForm] = useState({
        courseId: "",
        startTime: "",
        platform: "Zoom",
        zoomLink: "",
        topics: "",
        jitsiPassword: "",
        isVerified: false,
        verificationToken: "",
        days: [],
        adminIds: user?._id ? [user._id] : [],
      });
      const [loading, setLoading] = useState(false);
      const [msg, setMsg] = useState("");
      const [err, setErr] = useState("");
    
      // Update lecture batch state
      const [updateId, setUpdateId] = useState("");
      const [updateForm, setUpdateForm] = useState({
        startTime: "",
        platform: "",
        zoomLink: "",
        topics: "",
        jitsiPassword: "",
        isVerified: false,
        verificationToken: "",
        days: [],
        lecturesListed: [],
      });
      const [updateLoading, setUpdateLoading] = useState(false);
      const [updateMsg, setUpdateMsg] = useState("");
      const [updateErr, setUpdateErr] = useState("");
      const [lectures, setLectures] = useState([]);
      const [lecturesLoading, setLecturesLoading] = useState(false);
    
      // Fetch all admins for select input
      useEffect(() => {
        const fetchAdmins = async () => {
          setAdminsLoading(true);
          try {
            const res = await fetch(`${API_BASE}/lectures/admins`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            const data = await res.json();
            if (res.ok) {
              setAdmins(data.admins || []);
            }
          } catch (error) {}
          setAdminsLoading(false);
        };
        fetchAdmins();
      }, []);
    
      // Fetch all lectures for table
      const fetchLectures = async () => {
        setLecturesLoading(true);
        try {
          const res = await fetch(`${API_BASE}/lectures/lectures`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            // Add an 'isExpired' flag to each lecture based on expiringDate
            const lecturesWithExpiry = (data.lectures || []).map(lecture => ({
              ...lecture,
              isExpired: lecture.expiringDate && new Date(lecture.expiringDate) <= new Date()
            }));
            setLectures(lecturesWithExpiry);
          }
        } catch (error) {
          console.error('Error fetching lectures:', error);
        } finally {
          setLecturesLoading(false);
        }
      };
    
      useEffect(() => {
        fetchLectures();
      }, []);
    
      // Handle create form change
      const handleChange = (e) => {
        const { name, value, type, checked, options } = e.target;
        
        if (name === "adminIds") {
          const selected = Array.from(options)
            .filter((o) => o.selected)
            .map((o) => o.value);
          setForm((prev) => ({
            ...prev,
            adminIds: selected,
          }));
        } else if (name === "days") {
          setForm(prev => {
            const newDays = checked
              ? [...prev.days, value]
              : prev.days.filter(day => day !== value);
            return { ...prev, days: newDays };
          });
        } else {
          setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
          }));
        }
        setMsg("");
        setErr("");
      };
    
      // Handle update form change
      const handleUpdateChange = (e) => {
        const { name, value, type, checked, options } = e.target;
        if (name === "lecturesListed") {
          const selected = Array.from(options)
            .filter((o) => o.selected)
            .map((o) => o.value);
          setUpdateForm((prev) => ({
            ...prev,
            lecturesListed: selected,
          }));
        } else if (name === "days") {
          setUpdateForm(prev => {
            const newDays = checked
              ? [...prev.days, value]
              : prev.days.filter(day => day !== value);
            return { ...prev, days: newDays };
          });
        } else {
          setUpdateForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
          }));
        }
        setUpdateMsg("");
        setUpdateErr("");
      };
    
      // Fetch lecture details for update
      const fetchLecture = async (lectureId) => {
        setUpdateMsg("");
        setUpdateErr("");
        if (!lectureId) return;
        try {
          const res = await fetch(`${API_BASE}/lectures/lectures/${lectureId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setUpdateForm({
              startTime: data.lecture.startTime?.slice(0, 16) || "",
              platform: data.lecture.platform || "",
              zoomLink: data.lecture.zoomLink || "",
              topics: Array.isArray(data.lecture.topics) ? data.lecture.topics.join(", ") : data.lecture.topics || "",
              jitsiPassword: data.lecture.jitsiPassword || "",
              isVerified: data.lecture.isVerified || false,
              verificationToken: data.lecture.verificationToken || "",
              days: Array.isArray(data.lecture.days) ? data.lecture.days : [],
              lecturesListed: Array.isArray(data.lecture.lecturesListed)
                ? data.lecture.lecturesListed.map(a => (typeof a === "object" ? a._id : a))
                : [],
            });
            setUpdateId(data.lecture._id);
          } else {
            setUpdateErr(data.message || "Lecture not found.");
          }
        } catch (err) {
          setUpdateErr("Error fetching lecture.");
        }
      };
    
      // Handle create lecture batch submit
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        setErr("");
        if (!form.courseId || !form.startTime || !form.platform || !form.adminIds.length || form.days.length === 0 || !form.days.length === 0) {
          setErr("All fields are required, including at least one day of the week.");
          setLoading(false);
          return;
        }
        try {
          const res = await fetch(`${API_BASE}/lectures/create-lecture-batch`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              ...form,
              topics: form.topics.split(",").map(t => t.trim()).filter(Boolean),
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setMsg("Lecture batch created successfully!");
            setForm({
              courseId: "",
              startTime: "",
              platform: "Zoom",
              zoomLink: "",
              topics: "",
              jitsiPassword: "",
              isVerified: false,
              verificationToken: "",
              days: [],
              adminIds: user?._id ? [user._id] : [],
            });
            fetchLectures();
          } else {
            setErr(data.message || "Failed to create lecture batch.");
          }
        } catch (error) {
          setErr("Network error. Please try again.");
        }
        setLoading(false);
      };
    
      // Handle update lecture batch submit
      const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateMsg("");
        setUpdateErr("");
        if (!updateId) {
          setUpdateErr("Lecture ID is required.");
          setUpdateLoading(false);
          return;
        }
        try {
          const res = await fetch(`${API_BASE}/lectures/update-lecture/${updateId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              ...updateForm,
              topics: updateForm.topics.split(",").map(t => t.trim()).filter(Boolean),
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setUpdateMsg("Lecture batch updated successfully!");
            fetchLectures();
            setUpdateId("");
            setUpdateForm({
              startTime: "",
              platform: "",
              zoomLink: "",
              topics: "",
              jitsiPassword: "",
              isVerified: false,
              verificationToken: "",
              days: [],
              lecturesListed: [],
            });
          } else {
            setUpdateErr(data.message || "Failed to update lecture batch.");
          }
        } catch (error) {
          setUpdateErr("Network error. Please try again.");
        }
        setUpdateLoading(false);
      };
    
      // Handle delete lecture
      const handleDelete = async (lectureId) => {
        if (!window.confirm("Are you sure you want to delete this lecture batch?")) return;
        try {
          const res = await fetch(`${API_BASE}/lectures/${lectureId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            fetchLectures();
          } else {
            alert(data.message || "Failed to delete lecture batch.");
          }
        } catch (error) {
          alert("Network error. Please try again.");
        }
      };
    
      const handleEdit = (lectureId) => {
        fetchLecture(lectureId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    return (
        <div>
            <SideNav />
            <MainFrame>
                <h1>Create Lecture batch</h1>

                <div className="create-lecture-form-section">
                    
                </div>
            </MainFrame>
        </div>
    );
};

export default InstructorCreateCourse;