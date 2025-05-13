const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  middleName: String,
  course: String,
  year: String,
});

module.exports = mongoose.model("Student", StudentSchema);
