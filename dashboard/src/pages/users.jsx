import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { 
  TextField, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogContent, 
  DialogActions, Box, Typography, Stack, InputAdornment, IconButton,
  CircularProgress, Alert
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modalState, setModalState] = useState({
    open: false,
    user: null,
    formData: {
      _id: "", username: "", email: "", password: ""
    }
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:1337/users");
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleEditClick = (user) => {
    setModalState({
      open: true,
      user: user,
      formData: {...user}
    });
    setShowPassword(false);
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
      user: null, 
      formData: {
        _id: "", username: "", email: "", password: ""
      }
    });
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`http://localhost:1337/updateUser/${modalState.formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: modalState.formData.username,
          email: modalState.formData.email,
          password: modalState.formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUsers = users.map(user => 
        user._id === modalState.formData._id ? modalState.formData : user
      );
      
      setUsers(updatedUsers);
      handleCloseModal();
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:1337/deleteUser/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <Typography variant="h5" className="dashboard-title">
            USER MANAGEMENT
          </Typography>
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
            <TableContainer component={Paper} className="user-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{"••••••••"}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              onClick={() => handleEditClick(user)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small"
                              onClick={() => handleDeleteUser(user._id)}
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
              EDIT USER
            </Typography>
          </Box>
          <DialogContent>
            <form className="user-form">
              <TextField
                margin="normal"
                name="username"
                label="Username"
                fullWidth
                variant="outlined"
                value={modalState.formData.username || ""}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={modalState.formData.email || ""}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={modalState.formData.password || ""}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
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
              color="primary" 
              className="modal-btn" 
              onClick={handleUpdateUser}
            >
              SAVE
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Users;
