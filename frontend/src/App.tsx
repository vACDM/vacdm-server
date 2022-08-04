import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PilotsTable from "./components/PilotsTable";
import AirportsTable from "./components/AirportsTable";
import Vdgs from "./components/Vdgs";
import Debug from "./components/Debug";
import { Suspense } from "react";
import Loading from "components/Loading";
import FlowManagement from "components/FlowManagement";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="mt-2">
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/airports" element={<AirportsTable />} />
          <Route path="/vdgs/:callsign" element={<Vdgs />} />
          <Route path="/debug/:callsign" element={<Debug />} />
          <Route path="/logo" element={<Loading />} />
          <Route path="/flow-management" element={<FlowManagement />} />
          <Route path="/" element={<PilotsTable />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Suspense>
        </div>
      </Router>
    </>
  );
}

export default App;
