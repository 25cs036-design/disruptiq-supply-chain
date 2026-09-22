import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  BrainCircuit,
  Bell,
  Settings,
  MapPin,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

const suppliers = [
  {
    id: "SUP-101",
    name: "Aruna Components",
    location: "Chennai",
    delivery: 94,
    reliability: 91,
    financial: 18,
    weather: 25,
    inventory: 82,
  },
  {
    id: "SUP-102",
    name: "Bharat Electronics",
    location: "Bengaluru",
    delivery: 81,
    reliability: 76,
    financial: 42,
    weather: 35,
    inventory: 61,
  },
  {
    id: "SUP-103",
    name: "Coastal Materials",
    location: "Kochi",
    delivery: 68,
    reliability: 62,
    financial: 64,
    weather: 78,
    inventory: 39,
  },
  {
    id: "SUP-104",
    name: "Delta Packaging",
    location: "Hyderabad",
    delivery: 88,
    reliability: 84,
    financial: 29,
    weather: 46,
    inventory: 74,
  },
];

const historicalData = [
  { year: "2021", disruptions: 18, delays: 12 },
  { year: "2022", disruptions: 24, delays: 17 },
  { year: "2023", disruptions: 21, delays: 15 },
  { year: "2024", disruptions: 31, delays: 22 },
  { year: "2025", disruptions: 37, delays: 28 },
];

const initialShipments = [
  {
    id: "SHP-1001",
    product: "Electronic Components",
    source: "Chennai",
    destination: "Mumbai",
    progress: 72,
    status: "In Transit",
    eta: "Today, 8:30 PM",
  },
  {
    id: "SHP-1002",
    product: "Packaging Materials",
    source: "Hyderabad",
    destination: "Pune",
    progress: 45,
    status: "In Transit",
    eta: "Tomorrow, 10:00 AM",
  },
  {
    id: "SHP-1003",
    product: "Industrial Parts",
    source: "Kochi",
    destination: "Delhi",
    progress: 22,
    status: "Weather Check",
    eta: "Delayed by 5 hours",
  },
];

function riskLevel(score) {
  if (score >= 75) return "Critical";
  if (score >= 55) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}

function Login({ onLogin }) {
  const [role, setRole] = useState("supplier");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-big">
          <ShieldCheck size={42} />
        </div>

        <h1>SupplyGuard AI</h1>
        <p>AI-Powered Supply Chain Disruption Early Warning System</p>

        <div className="role-switch">
          <button
            className={role === "supplier" ? "active-role" : ""}
            onClick={() => setRole("supplier")}
          >
            Supplier
          </button>

          <button
            className={role === "customer" ? "active-role" : ""}
            onClick={() => setRole("customer")}
          >
            Customer
          </button>
        </div>

        <h3>Login as {role === "supplier" ? "Supplier" : "Customer"}</h3>

        <input
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={() => onLogin(role, email || "demo@user.com")}
        >
          Login <ArrowRight size={18} />
        </button>

        <small>Demo login: Any email and password accepted</small>
      </div>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [page, setPage] = useState("Dashboard");
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]);
  const [weather, setWeather] = useState("Clear");
  const [riskResult, setRiskResult] = useState(null);
  const [shipments, setShipments] = useState(initialShipments);
  const [notifications, setNotifications] = useState([
    {
      title: "System Ready",
      message: "AI monitoring engine is active.",
      type: "success",
    },
  ]);

  const calculateRisk = () => {
    const weatherScore =
      weather === "Storm"
        ? 95
        : weather === "Heavy Rain"
        ? 78
        : weather === "Light Rain"
        ? 42
        : 15;

    const historicalAverage = 26;
    const score = Math.round(
      selectedSupplier.financial * 0.2 +
        (100 - selectedSupplier.delivery) * 0.25 +
        (100 - selectedSupplier.reliability) * 0.2 +
        weatherScore * 0.25 +
        historicalAverage * 0.1
    );

    const level = riskLevel(score);

    const reasons = [
      selectedSupplier.delivery < 85
        ? "Supplier delivery performance is below the preferred threshold."
        : "Supplier delivery performance is stable.",
      selectedSupplier.reliability < 80
        ? "Previous reliability records indicate possible delays."
        : "Supplier reliability is currently acceptable.",
      weatherScore > 60
        ? `${weather} may affect transportation routes and delivery schedules.`
        : "Weather conditions currently show limited disruption risk.",
      "Historical disruption patterns from the previous five years were considered.",
    ];

    const recommendation =
      level === "Critical"
        ? "Switch to an alternate supplier, increase safety stock, and prioritize this shipment."
        : level === "High"
        ? "Monitor supplier closely and prepare an alternate transportation route."
        : level === "Medium"
        ? "Continue monitoring and maintain a backup procurement plan."
        : "No immediate action required. Continue regular monitoring.";

    const result = {
      score,
      level,
      reasons,
      recommendation,
      supplier: selectedSupplier.name,
      weather,
    };

    setRiskResult(result);

    setNotifications((prev) => [
      {
        title: `${level} Risk Detected`,
        message: `${selectedSupplier.name} risk score: ${score}%`,
        type: level === "Critical" || level === "High" ? "danger" : "warning",
      },
      ...prev,
    ]);
  };

  const simulateShipmentUpdate = (id) => {
    setShipments((prev) =>
      prev.map((shipment) =>
        shipment.id === id
          ? {
              ...shipment,
              progress: Math.min(shipment.progress + 10, 100),
              status:
                shipment.progress + 10 >= 100 ? "Delivered" : "In Transit",
            }
          : shipment
      )
    );

    setNotifications((prev) => [
      {
        title: "Shipment Updated",
        message: `${id} tracking information updated successfully.`,
        type: "success",
      },
      ...prev,
    ]);
  };

  const criticalCount = suppliers.filter(
    (s) => s.delivery < 75 || s.weather > 70
  ).length;

  if (!loggedIn) {
    return (
      <Login
        onLogin={(role, email) => {
          setUserRole(role);
          setUserEmail(email);
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck size={30} />
          <div>
            <h2>SupplyGuard</h2>
            <span>AI Control Center</span>
          </div>
        </div>

        <div className="user-box">
          <strong>{userRole.toUpperCase()}</strong>
          <small>{userEmail}</small>
        </div>

        {[
          ["Dashboard", LayoutDashboard],
          ["Live Shipments", Truck],
          ["Supplier Intelligence", Users],
          ["AI Risk Engine", BrainCircuit],
          ["Action Center", Activity],
          ["Alerts", Bell],
        ].map(([name, Icon]) => (
          <button
            key={name}
            className={page === name ? "nav-active" : "nav-btn"}
            onClick={() => setPage(name)}
          >
            <Icon size={19} />
            {name}
          </button>
        ))}

        <button className="nav-btn logout" onClick={() => setLoggedIn(false)}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>Continuous monitoring • Historical analysis • AI prediction</p>
          </div>

          <div className="top-status">
            <span className="live-dot"></span>
            System Monitoring Live
          </div>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="hero">
              <div>
                <span className="eyebrow">TEAM CODE COMMANDERS</span>
                <h2>Predict disruptions before they impact your business.</h2>
                <p>
                  Our AI engine learns from five years of historical data,
                  supplier performance, weather conditions and logistics
                  updates.
                </p>
              </div>
              <BrainCircuit size={100} />
            </section>

            <div className="stats-grid">
              <div className="stat-card">
                <Package />
                <span>Total Suppliers</span>
                <h2>{suppliers.length}</h2>
                <small>Continuously monitored</small>
              </div>

              <div className="stat-card">
                <Truck />
                <span>Active Shipments</span>
                <h2>{shipments.length}</h2>
                <small>Virtual live tracking</small>
              </div>

              <div className="stat-card">
                <AlertTriangle />
                <span>High Risk Suppliers</span>
                <h2>{criticalCount}</h2>
                <small>Requires attention</small>
              </div>

              <div className="stat-card">
                <Bell />
                <span>Notifications</span>
                <h2>{notifications.length}</h2>
                <small>Automatic alerts generated</small>
              </div>
            </div>

            <section className="panel">
              <div className="panel-heading">
                <h3>Five-Year Historical Disruption Analysis</h3>
                <span>2021–2025</span>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="disruptions"
                    stroke="#6366f1"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="delays"
                    stroke="#f97316"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        {page === "Live Shipments" && (
          <section className="panel">
            <div className="panel-heading">
              <h3>Virtual Real-Time Shipment Tracking</h3>
              <span>Updates available after shipment starts</span>
            </div>

            <div className="shipment-grid">
              {shipments.map((shipment) => (
                <div className="shipment-card" key={shipment.id}>
                  <div className="shipment-top">
                    <Truck />
                    <strong>{shipment.id}</strong>
                    <span className="status-pill">{shipment.status}</span>
                  </div>

                  <h3>{shipment.product}</h3>

                  <p>
                    <MapPin size={15} /> {shipment.source} →{" "}
                    {shipment.destination}
                  </p>

                  <div className="progress-bg">
                    <div
                      className="progress-fill"
                      style={{ width: `${shipment.progress}%` }}
                    ></div>
                  </div>

                  <div className="shipment-info">
                    <span>{shipment.progress}% completed</span>
                    <span>
                      <Clock size={14} /> {shipment.eta}
                    </span>
                  </div>

                  <button
                    className="secondary-btn"
                    onClick={() => simulateShipmentUpdate(shipment.id)}
                  >
                    Simulate Tracking Update
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "Supplier Intelligence" && (
          <section className="panel">
            <div className="panel-heading">
              <h3>Supplier Performance Intelligence</h3>
              <span>Reliability-based monitoring</span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Location</th>
                    <th>On-Time Delivery</th>
                    <th>Reliability</th>
                    <th>Financial Risk</th>
                    <th>Weather Risk</th>
                  </tr>
                </thead>

                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>{supplier.name}</td>
                      <td>{supplier.location}</td>
                      <td>{supplier.delivery}%</td>
                      <td>{supplier.reliability}%</td>
                      <td>{supplier.financial}%</td>
                      <td>{supplier.weather}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === "AI Risk Engine" && (
          <section className="panel risk-panel">
            <div className="panel-heading">
              <h3>
                <BrainCircuit /> AI-Powered Risk Prediction Engine
              </h3>
              <span>Historical + supplier + weather analysis</span>
            </div>

            <div className="form-grid">
              <div>
                <label>Select Supplier</label>
                <select
                  value={selectedSupplier.id}
                  onChange={(e) =>
                    setSelectedSupplier(
                      suppliers.find((s) => s.id === e.target.value)
                    )
                  }
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Current Weather Condition</label>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                >
                  <option>Clear</option>
                  <option>Light Rain</option>
                  <option>Heavy Rain</option>
                  <option>Storm</option>
                </select>
              </div>
            </div>

            <button className="primary-btn predict-btn" onClick={calculateRisk}>
              Predict Risk <BrainCircuit size={20} />
            </button>

            {riskResult && (
              <div className="risk-result">
                <div className="risk-score">
                  <span>Predicted Disruption Risk</span>
                  <strong>{riskResult.score}%</strong>
                  <b className={`risk-${riskResult.level.toLowerCase()}`}>
                    {riskResult.level}
                  </b>
                </div>

                <div className="risk-details">
                  <h3>Why this risk was predicted</h3>
                  <ul>
                    {riskResult.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>

                  <div className="recommendation">
                    <strong>AI Recommendation:</strong>
                    <p>{riskResult.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {page === "Action Center" && (
          <section className="panel">
            <div className="panel-heading">
              <h3>Recommended Preventive Actions</h3>
              <span>AI-generated response plan</span>
            </div>

            <div className="action-grid">
              {[
                [
                  "Switch Alternate Supplier",
                  "Identify backup suppliers when current supplier risk becomes critical.",
                ],
                [
                  "Increase Safety Stock",
                  "Maintain additional inventory for products exposed to disruption.",
                ],
                [
                  "Change Transportation Route",
                  "Use alternative routes when heavy rain, floods or logistics issues occur.",
                ],
                [
                  "Prioritize Critical Shipments",
                  "Move urgent shipments first to reduce business impact.",
                ],
              ].map(([title, desc]) => (
                <div className="action-card" key={title}>
                  <CheckCircle />
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <button
                    className="secondary-btn"
                    onClick={() =>
                      setNotifications((prev) => [
                        {
                          title: "Action Selected",
                          message: `${title} added to action plan.`,
                          type: "success",
                        },
                        ...prev,
                      ])
                    }
                  >
                    Add to Action Plan
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "Alerts" && (
          <section className="panel">
            <div className="panel-heading">
              <h3>
                <Bell /> Real-Time Notifications
              </h3>
              <span>Automatic event monitoring</span>
            </div>

            <div className="alert-list">
              {notifications.map((notification, index) => (
                <div className={`alert-item ${notification.type}`} key={index}>
                  <Bell size={20} />
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;