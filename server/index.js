const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const Student = require("./models/student.model");
const User = require("./models/user.model");

mongoose.connect("mongodb://localhost:27017/StudentInformationSystem", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

// ----------------- USER ROUTES -----------------

app.post("/signup", async (req, res) => {
  try {
    console.log("Signup request body:", req.body); // See what data you’re getting

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error); // Log the error to terminal
    res.status(500).json({ message: "Signup failed" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, email: 1, password: 1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ----------------- STUDENT ROUTES -----------------

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error("Error fetching students from MongoDB:", err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/students", async (req, res) => {
  const student = new Student({
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
    course: req.body.course,
    year: req.body.year
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Error adding student to MongoDB:", err);
    res.status(400).json({ message: err.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { id: req.params.id },
      {
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        course: req.body.course,
        year: req.body.year
      },
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
    res.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student in MongoDB:", err);
    res.status(400).json({ message: err.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ id: req.params.id });
    if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student from MongoDB:", err);
    res.status(500).json({ message: err.message });
  }
});

// ----------------- START SERVER -----------------

const port = 1337;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
