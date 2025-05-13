import React from "react";
import Sidebar from "./sidebar";
import {useState, useRef} from "react";
import "./dashboard.css";
import { TextField, Button} from "@mui/material";

function Dashboard() {
const brandRef = useRef();
const modelRef = useRef();
const yearRef = useRef();
const colorRef = useRef();

const [car,setCar] = useState({
  brand: "",
  model: "",
  year: "",
  color: "",
});

function handleClick() {
  setCar({
    brand: brandRef.current.value,
    model: modelRef.current.value,
    year: yearRef.current.value,
    color: colorRef.current.value,
  });
}
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <h1>Welcome to Saint Mary's University</h1>
        <h2>My car is {car.brand}</h2>
        <p>
          It is a {car.color} {car.model} from {car.year}
        </p>
      </div>
      <div className="text-fields">
  <TextField inputRef={brandRef} label="Brand" variant="outlined" fullWidth />
  <TextField inputRef={modelRef} label="Model" variant="outlined" fullWidth />
  <TextField inputRef={yearRef} label="Year" variant="outlined" fullWidth />
  <TextField inputRef={colorRef} label="Color" variant="outlined" fullWidth />
  <Button variant="contained" color="primary" onClick={handleClick}>
    UPDATE DETAILS
  </Button>
</div>
</div>
  );
}

export default Dashboard;
