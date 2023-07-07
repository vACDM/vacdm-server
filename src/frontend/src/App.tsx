import './App.css';

import { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AirportDetails from './components/AirportDetails';
import AirportDetailsEditor from './components/AirportDetailsEditor';
import Debug from './components/Debug';
import DepartureBlocks from './components/DepartureBlocks';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthProvider';
import { DarkModeProvider } from './contexts/DarkModeProvider';
import Airports from './pages/Airports';
import Delivery from './pages/Delivery';
import FlowManagement from './pages/FlowManagement';
import Landingpage from './pages/Landingpage';
import Login from './pages/Login';
import Vdgs from './pages/VdgsNew';

function App() {
  return (
    <>
      <Router>
        <DarkModeProvider>
          <AuthProvider>
            <Navbar />
            <div className="mt-2">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/airports" element={<Airports />} />
                  <Route path="/airports/:icao" element={<AirportDetails />} />
                  <Route
                    path="/airports/:icao/edit"
                    element={<AirportDetailsEditor />}
                  />
                  <Route path="/vdgs" element={<Vdgs />} />
                  <Route path="/debug/:callsign" element={<Debug />} />
                  <Route
                    path="/departure-blocks/:icao"
                    element={<DepartureBlocks />}
                  />
                  <Route path="/logo" element={<Loading />} />
                  <Route path="/flow-management" element={<FlowManagement />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/landingpage" element={<Landingpage />} />
                  <Route path="/delivery" element={<Delivery />} />
                  <Route path="/" element={<Landingpage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </div>
          </AuthProvider>
        </DarkModeProvider>
      </Router>
    </>
  );
}

export default App;
