import { useState } from "react";
import {
  Search, CloudRain, Truck, Users, ShieldAlert,
  Bell, CheckCircle, AlertTriangle, BrainCircuit,
  MapPin, Activity, RefreshCw
} from "lucide-react";
import "./App.css";

const initialSuppliers = [
  { id: 1, name: "Aruna Components", location: "Chennai", financial: 15, delivery: 10, weather: 20, status: "Active" },
  { id: 2, name: "Nova Industrial", location: "Bangalore", financial: 25, delivery: 18, weather: 30, status: "Active" },
  { id: 3, name: "Vertex Supplies", location: "Mumbai", financial: 65, delivery: 45, weather: 55, status: "Active" },
  { id: 4, name: "Apex Manufacturing", location: "Pune", financial: 20, delivery: 12, weather: 25, status: "Active" },
  { id: 5, name: "Global Tech Parts", location: "Hyderabad", financial: 35, delivery: 28, weather: 40, status: "Active" },
  { id: 6, name: "Prime Materials", location: "Coimbatore", financial: 10, delivery: 15, weather: 18, status: "Active" },
  { id: 7, name: "Orion Electronics", location: "Delhi", financial: 75, delivery: 60, weather: 70, status: "Active" },
  { id: 8, name: "Zenith Components", location: "Kochi", financial: 22, delivery: 20, weather: 65, status: "Active" },
  { id: 9, name: "Matrix Engineering", location: "Ahmedabad", financial: 40, delivery: 35, weather: 30, status: "Active" },
  { id: 10, name: "BluePeak Industries", location: "Noida", financial: 18, delivery: 15, weather: 35, status: "Active" },
];

const shipments = [
  { id: "SH1001", supplier: "Aruna Components", destination: "Chennai", status: "In Transit", eta: "Today, 6 PM" },
  { id: "SH1002", supplier: "Vertex Supplies", destination: "Mumbai", status: "Delayed", eta: "Tomorrow" },
  { id: "SH1003", supplier: "Nova Industrial", destination: "Bangalore", status: "In Transit", eta: "Today, 9 PM" },
  { id: "SH1004", supplier: "Orion Electronics", destination: "Delhi", status: "At Risk", eta: "2 Days" },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("Dashboard");
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [riskResult, setRiskResult] = useState(null);
  const [weather, setWeather] = useState("Heavy Rain");
  const [search, setSearch] = useState("");
  const [shipmentResult, setShipmentResult] = useState(null);
  const [alerts, setAlerts] = useState([
    "Heavy rain detected near Chennai routes",
    "Vertex Supplies delivery delay predicted",
    "Orion Electronics financial risk increased",
  ]);

  const predictRisk = (supplier) => {
    const weatherRisk =
      weather === "Clear" ? supplier.weather * 0.3 :
      weather === "Light Rain" ? supplier.weather * 0.7 :
      weather === "Heavy Rain" ? supplier.weather * 1.2 :
      supplier.weather * 1.5;

    const total = Math.min(
      100,
      Math.round((supplier.financial + supplier.delivery + weatherRisk) / 3)
    );

    let level = total >= 65 ? "High Risk" : total >= 35 ? "Medium Risk" : "Low Risk";

    setSelectedSupplier(supplier);
    setRiskResult({
      score: total,
      level,
      weatherImpact: Math.round(weatherRisk),
      reason:
        total >= 65
          ? "Severe disruption probability. Consider alternate supplier."
          : total >= 35
          ? "Moderate risk detected. Continuous monitoring recommended."
          : "Supplier currently operating within safe conditions.",
    });
  };

  const markBankrupt = (supplier) => {
    const updated = suppliers.map((s) =>
      s.id === supplier.id ? { ...s, status: "Financial Failure" } : s
    );

    setSuppliers(updated);

    const alternate = suppliers.find(
      (s) => s.id !== supplier.id && s.status === "Active"
    );

    setAlerts((old) => [
      `⚠ ${supplier.name} marked as financially failed`,
      `AI Alternate Supplier Suggestion: ${alternate.name}`,
      ...old,
    ]);

    setRiskResult({
      score: 100,
      level: "Critical Risk",
      weatherImpact: supplier.weather,
      reason: `Suggested alternate supplier: ${alternate.name} (${alternate.location})`,
    });
  };

  const searchShipment = () => {
    const result = shipments.find(
      (s) => s.id.toLowerCase() === search.toLowerCase()
    );
    setShipmentResult(result || "Not Found");
  };

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo">D</div>
          <h1>Disrupt IQ</h1>
          <p>Supply Chain Intelligence Platform</p>
          <input placeholder="Company Email" />
          <input type="password" placeholder="Password" />
          <button onClick={() => setLoggedIn(true)}>
            Login to Control Tower
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo small">D</div>
          <div>
            <h2>Disrupt IQ</h2>
            <small>Control Tower</small>
          </div>
        </div>

        {[
          "Dashboard",
          "Live Shipments",
          "Supplier Intelligence",
          "AI Risk Engine",
          "Action Center",
          "Alerts",
        ].map((item) => (
          <button
            className={page === item ? "nav active" : "nav"}
            onClick={() => setPage(item)}
            key={item}
          >
            {item}
          </button>
        ))}

        <button className="logout" onClick={() => setLoggedIn(false)}>
          Logout
        </button>
      </aside>

      <main className="main">
        <header>
          <div>
            <small>Welcome back, Admin</small>
            <h1>{page}</h1>
          </div>
          <Bell />
        </header>

        {page === "Dashboard" && (
          <>
            <div className="search-box">
              <Search />
              <input
                placeholder="Search shipment ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={searchShipment}>Search</button>
            </div>

            {shipmentResult && (
              <div className="result-card">
                {shipmentResult === "Not Found" ? (
                  <p>Shipment not found.</p>
                ) : (
                  <>
                    <h3>{shipmentResult.id}</h3>
                    <p>Supplier: {shipmentResult.supplier}</p>
                    <p>Status: {shipmentResult.status}</p>
                    <p>ETA: {shipmentResult.eta}</p>
                  </>
                )}
              </div>
            )}

            <div className="stats">
              <Stat icon={<Truck />} title="Live Shipments" value="248" />
              <Stat icon={<Users />} title="Total Suppliers" value="126" />
              <Stat icon={<ShieldAlert />} title="High Risk Alerts" value={alerts.length} />
              <Stat icon={<Activity />} title="On-Time Delivery" value="94.6%" />
            </div>

            <div className="cards">
              <div className="card">
                <h2><CloudRain /> Weather Risk Monitor</h2>
                <p>Weather conditions affect supplier and shipment risk.</p>
                <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                  <option>Clear</option>
                  <option>Light Rain</option>
                  <option>Heavy Rain</option>
                  <option>Storm</option>
                </select>
                <h3>Current Condition: {weather}</h3>
              </div>

              <div className="card">
                <h2><BrainCircuit /> AI Risk Engine</h2>
                <p>Predict supplier disruption probability.</p>
                <button onClick={() => setPage("AI Risk Engine")}>
                  Open Predict Risk
                </button>
              </div>

              <div className="card">
                <h2><Truck /> Live Shipment Control</h2>
                <p>Track shipments and identify delivery delays.</p>
                <button onClick={() => setPage("Live Shipments")}>
                  View Shipments
                </button>
              </div>
            </div>
          </>
        )}

        {page === "Supplier Intelligence" && (
          <SupplierTable
            suppliers={suppliers}
            predictRisk={predictRisk}
            markBankrupt={markBankrupt}
          />
        )}

        {page === "AI Risk Engine" && (
          <>
            <div className="weather-panel">
              <h2>Weather Priority Risk Engine</h2>
              <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                <option>Clear</option>
                <option>Light Rain</option>
                <option>Heavy Rain</option>
                <option>Storm</option>
              </select>
            </div>

            <SupplierTable
              suppliers={suppliers}
              predictRisk={predictRisk}
              markBankrupt={markBankrupt}
            />

            {riskResult && (
              <div className="risk-result">
                <h2>{selectedSupplier?.name}</h2>
                <h1>{riskResult.score}% Risk</h1>
                <h3>{riskResult.level}</h3>
                <p>Weather Impact: {riskResult.weatherImpact}%</p>
                <p>{riskResult.reason}</p>
              </div>
            )}
          </>
        )}

        {page === "Live Shipments" && (
          <div className="list-card">
            <h2>Live Shipment Control</h2>
            {shipments.map((s) => (
              <div className="shipment" key={s.id}>
                <strong>{s.id}</strong>
                <span>{s.supplier}</span>
                <span>{s.destination}</span>
                <b className={s.status === "Delayed" ? "danger" : "safe"}>
                  {s.status}
                </b>
                <span>{s.eta}</span>
              </div>
            ))}
          </div>
        )}

        {page === "Alerts" && (
          <div className="list-card">
            <h2>Alerts & Notifications</h2>
            {alerts.map((alert, index) => (
              <div className="alert" key={index}>
                <AlertTriangle />
                {alert}
              </div>
            ))}
          </div>
        )}

        {page === "Action Center" && (
          <div className="list-card">
            <h2>Action Center</h2>
            <div className="alert">
              <CheckCircle /> Review high-risk suppliers
            </div>
            <div className="alert">
              <CheckCircle /> Confirm alternate shipment routes
            </div>
            <div className="alert">
              <CheckCircle /> Contact delayed suppliers
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div className="stat">
      <div>{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function SupplierTable({ suppliers, predictRisk, markBankrupt }) {
  return (
    <div className="list-card">
      <h2>Supplier Intelligence</h2>
      {suppliers.map((supplier) => (
        <div className="supplier" key={supplier.id}>
          <div>
            <strong>{supplier.name}</strong>
            <p><MapPin size={14} /> {supplier.location}</p>
          </div>
          <span>{supplier.status}</span>
          <button onClick={() => predictRisk(supplier)}>
            Predict Risk
          </button>
          <button className="danger-btn" onClick={() => markBankrupt(supplier)}>
            Simulate Failure
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;