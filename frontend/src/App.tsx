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

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/airports" element={<AirportsTable />} />
          <Route path="/vdgs/:callsign" element={<Vdgs />} />
          <Route path="/debug/:callsign" element={<Debug />} />
          <Route path="/logo" element={<Loading />} />
          <Route path="/" element={<PilotsTable />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
