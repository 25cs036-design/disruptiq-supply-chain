import React, { useEffect, useState } from "react";
import "./App.css";

const shipmentsData = [
  {
    id: "SHP-2041",
    route: "Chennai → Bengaluru",
    mode: "🚚 Road",
    eta: "Today 22:40",
    status: "IN TRANSIT",
    risk: 71,
  },
  {
    id: "SHP-1842",
    route: "Mumbai → Chennai",
    mode: "🚢 Sea",
    eta: "Sep 23",
    status: "DELAYED",
    risk: 92,
  },
  {
    id: "SHP-3318",
    route: "Hyderabad → Pune",
    mode: "✈ Air",
    eta: "Sep 22",
    status: "ON TIME",
    risk: 24,
  },
  {
    id: "SHP-4020",
    route: "Delhi → Chennai",
    mode: "🚆 Rail",
    eta: "Sep 24",
    status: "WATCH",
    risk: 54,
  },
  {
    id: "SHP-5127",
    route: "Kochi → Chennai",
    mode: "🚚 Road",
    eta: "Sep 22",
    status: "ON TIME",
    risk: 19,
  },
];

const suppliers = [
  {
    name: "Aruna Components",
    location: "Chennai",
    ontime: "91%",
    risk: 92,
    note: "Weather exposure",
  },
  {
    name: "Nova Industrial",
    location: "Pune",
    ontime: "96%",
    risk: 21,
    note: "Stable",
  },
  {
    name: "Zenith Electronics",
    location: "Bengaluru",
    ontime: "88%",
    risk: 76,
    note: "Lead-time drift",
  },
  {
    name: "Orbit Materials",
    location: "Hyderabad",
    ontime: "94%",
    risk: 54,
    note: "Demand pressure",
  },
];

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shipments, setShipments] = useState(shipmentsData);

  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour12: false,
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredShipments = shipments.filter((item) =>
    `${item.id} ${item.route} ${item.mode} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getRiskClass = (risk) => {
    if (risk >= 85) return "critical";
    if (risk >= 65) return "high";
    if (risk >= 40) return "medium";
    return "low";
  };

  const getStatusClass = (status) => {
    if (status === "DELAYED") return "high";
    if (status === "WATCH") return "medium";
    return "low";
  };

  const showToast = (message) => {
    alert("✓ " + message);
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brandmark">D</div>

          <div>
            <h1>Disrupt IQ</h1>
            <span>AI SUPPLY CHAIN