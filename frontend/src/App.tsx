import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";

import PilotsTable from "./components/PilotsTable";
import AirportsTable from "./components/AirportsTable";
import Vdgs from "./components/Vdgs";
import Debug from "./components/Debug";
import { Suspense } from "react";
import Loading from "components/Loading";
import FlowManagement from "components/FlowManagement";
import Login from "components/Login";
import Landingpage from "components/Landingpage";
import AirportDetails from "components/AirportDetails";
import AirportDetailsEditor from "components/AirportDetailsEditor";
import DepartureBlocks from "components/DepartureBlocks";
import Footer from "components/Footer";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="mt-2">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/airports" element={<AirportsTable />} />
                <Route path="/airports/:icao" element={<AirportDetails />} />
                <Route
                  path="/airports/:icao/edit"
                  element={<AirportDetailsEditor />}
                />
                <Route path="/vdgs/:callsign" element={<Vdgs />} />
                <Route path="/debug/:callsign" element={<Debug />} />
                <Route
                  path="/departure-blocks/:icao"
                  element={<DepartureBlocks />}
                />
                <Route path="/logo" element={<Loading />} />
                <Route path="/flow-management" element={<FlowManagement />} />
                <Route path="/login" element={<Login />} />
                <Route path="/landingpage" element={<Landingpage />} />
                <Route path="/" element={<PilotsTable />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>
        </AuthProvider>
        <Footer />
      </Router>
    </>
  );
}

export default App;
