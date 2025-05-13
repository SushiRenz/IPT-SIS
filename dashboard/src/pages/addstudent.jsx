import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { 
  TextField, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogContent, 
  DialogActions, Box, Typography, Stack,
  CircularProgress, Alert
} from "@mui/material";
import "./addstudent.css";

function AddStudent() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    open: false,
    type: null,
    student: null,
    formData: {
      ID: "", fName: "", lName: "", mName: "", course: "", year: ""
    }
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:1337/students");
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const transformedData = data.map(student => ({
          ID: student.id,
          fName: student.firstName,
          lName: student.lastName,
          mName: student.middleName,
          course: student.course,
          year: student.year
        }));
        
        setStudents(transformedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    try {
      const response = await fetch("http://localhost:1337/students", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: modalState.formData.ID,
          firstName: modalState.formData.fName,
          lastName: modalState.formData.lName,
          middleName: modalState.formData.mName,
          course: modalState.formData.course,
          year: modalState.formData.year,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      const newStudent = {
        ID: modalState.formData.ID,
        fName: modalState.formData.fName,
        lName: modalState.formData.lName,
        mName: modalState.formData.mName,
        course: modalState.formData.course,
        year: modalState.formData.year,
      };
      
      setStudents([...students, newStudent]);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding student:", error);
      alert('Failed to add student. Please try again.');
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await fetch(`http://localhost:1337/students/${modalState.student.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: modalState.formData.ID,
          firstName: modalState.formData.fName,
          lastName: modalState.formData.lName,
          middleName: modalState.formData.mName,
          course: modalState.formData.course,
          year: modalState.formData.year,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      const updatedStudents = students.map(student => 
        student.ID === modalState.student.ID ? modalState.formData : student
      );
      
      setStudents(updatedStudents);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating student:", error);
      alert('Failed to update student. Please try again.');
    }
  };
  
  const handleDeleteStudent = async () => {
    try {
      const response = await fetch(`http://localhost:1337/students/${modalState.student.ID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      const filteredStudents = students.filter(student => student.ID !== modalState.student.ID);
      setStudents(filteredStudents);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert('Failed to delete student. Please try again.');
    }
  };
  
  const handleAddClick = () => {
    setModalState({
      open: true,
      type: 'add',
      student: null,
      formData: {
        ID: "", fName: "", lName: "", mName: "", course: "", year: ""
      }
    });
  };

  const handleEditClick = (student) => {
    setModalState({
      open: true,
      type: 'edit',
      student: student,
      formData: {...student}
    });
  };

  const handleDeleteClick = (student) => {
    setModalState({
      open: true,
      type: 'delete',
      student: student,
      formData: {...student}
    });
  };

  const handleInputChange = (e) => {
    setModalState({
      ...modalState,
      formData: {
        ...modalState.formData,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleCloseModal = () => {
    setModalState({
      open: false,
      type: null,
      student: null, 
      formData: {
        ID: "", fName: "", lName: "", mName: "", course: "", year: ""
      }
    });
  };

  const handleModalSubmit = () => {
    if (modalState.type === 'add') {
      handleAddStudent();
    } else if (modalState.type === 'edit') {
      handleUpdateStudent();
    } else if (modalState.type === 'delete') {
      handleDeleteStudent();
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <Typography variant="h5" className="dashboard-title">
            STUDENT MANAGEMENT
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            className="add-btn"
            onClick={handleAddClick}
          >
            ADD STUDENT
          </Button>
        </div>
        
        <div className="table-container">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} className="student-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Number</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Middle Name</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.ID}>
                        <TableCell>{student.ID}</TableCell>
                        <TableCell>{student.fName}</TableCell>
                        <TableCell>{student.lName}</TableCell>
                        <TableCell>{student.mName}</TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              onClick={() => handleEditClick(student)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small"
                              onClick={() => handleDeleteClick(student)}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>

        <Dialog 
          open={modalState.open} 
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <Box className="modal-title-box">
            <Typography variant="h4" component="h3" className="modal-title">
              {modalState.type === 'add' ? 'ADD STUDENT' : 
               modalState.type === 'edit' ? 'EDIT STUDENT' : 
               'DELETE STUDENT'}
            </Typography>
          </Box>
          <DialogContent>
            {modalState.type === 'add' || modalState.type === 'edit' ? (
              <form className="student-form">
                <TextField
                  margin="normal"
                  name="ID"
                  label="ID Number"
                  fullWidth
                  variant="outlined"
                  value={modalState.formData.ID || ""}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: modalState.type === 'edit' }}
                />
                {["fName", "lName", "mName", "course", "year"].map(field => (
                  <TextField
                    key={field}
                    margin="normal"
                    name={field}
                    label={field === "fName" ? "First Name" : 
                          field === "lName" ? "Last Name" : 
                          field === "mName" ? "Middle Name" : 
                          field === "course" ? "Course" : "Year"}
                    fullWidth
                    variant="outlined"
                    value={modalState.formData[field] || ""}
                    onChange={handleInputChange}
                  />
                ))}
              </form>
            ) : modalState.student ? (
              <div className="delete-modal-content">
                <Typography variant="h6" style={{ marginBottom: '16px' }}>
                  Do you want to delete student ({modalState.student.ID})?
                </Typography>
              </div>
            ) : null}
          </DialogContent>
          <DialogActions className="modal-actions">
            <Button 
              variant="contained" 
              color="primary" 
              className="modal-btn modal-btn-margin" 
              onClick={handleCloseModal}
            >
              CANCEL
            </Button>
            <Button 
              variant="contained" 
              color={modalState.type === 'delete' ? "error" : "primary"} 
              className="modal-btn" 
              onClick={handleModalSubmit}
            >
              {modalState.type === 'add' ? 'ADD' : 
               modalState.type === 'edit' ? 'SAVE' : 
               'DELETE'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AddStudent;