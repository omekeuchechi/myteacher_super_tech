import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { CourseContext } from '../../../context/CourseContext';
import axios from 'axios';

const AssignCourse = () => {
  const { courses } = useContext(CourseContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/user`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      const usersData = response.data.users || [];
      
      // Keep course names as strings
      setUsers(usersData);
      setFilteredUsers(usersData);
      
      // Initialize assignments state with course names
      const initialAssignments = {};
      usersData.forEach(user => {
        initialAssignments[user._id] = user.userCourse || '';
      });
      setAssignments(initialAssignments);
      
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courses.length > 0) {
      fetchUsers();
    }
  }, [courses]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleAssignmentChange = (userId, courseName) => {
    if (!courseName) {
      setAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[userId];
        return newAssignments;
      });
    } else {
      const isValidCourse = courses.some(course => course.course === courseName);
      if (isValidCourse) {
        setAssignments(prev => ({
          ...prev,
          [userId]: courseName
        }));
      }
    }
  };

  const handleSaveAssignment = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const courseName = assignments[userId] || null;
      
      if (!courseName) {
        setError('Please select a course to assign');
        return;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/admin/assign-onsite-user-to-course/${userId}`,
        { userCourse: courseName },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Course assignment updated successfully');
        fetchUsers();
      } else {
        setError(response.data.message || 'Failed to update course assignment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the course assignment');
      console.error('Error updating course assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assign Courses to Users
      </Typography>

      <TextField
        label="Search users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Current Course</TableCell>
              <TableCell>Assign New Course</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !filteredUsers.length ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.userCourse || 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={assignments[user._id] || ''}
                      onChange={(e) => handleAssignmentChange(user._id, e.target.value)}
                      displayEmpty
                      disabled={loading}
                      fullWidth
                      renderValue={(selected) => {
                        if (!selected) return <em>Select a course</em>;
                        return selected;
                      }}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course._id} value={course.course}>
                          {course.course} ({course.durationWeeks} weeks)
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveAssignment(user._id)}
                      disabled={loading || assignments[user._id] === user.userCourse}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssignCourse;