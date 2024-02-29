import 'primeicons/primeicons.css';
import './App.css';

import { PrimeReactProvider } from 'primereact/api';
import { usePassThrough } from 'primereact/passthrough';
import Tailwind from 'primereact/passthrough/tailwind';
import { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';


import DepartureBlocks from './components/DepartureBlocks';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthProvider';
import { DarkModeProvider } from './contexts/DarkModeProvider';
import AirportDetails from './pages/AirportDetails';
import Airports from './pages/Airports';
import AuthFailurePage from './pages/AuthFailure';
import Debug from './pages/Debug';
import Delivery from './pages/Delivery';
import FlowManagement from './pages/FlowManagement';
import Landingpage from './pages/Landingpage';
import Vdgs from './pages/VdgsNew';
import { button } from './utils/ui/customDesign/button';
import { card } from './utils/ui/customDesign/card';
import { datatable } from './utils/ui/customDesign/datatable';
import { dialog } from './utils/ui/customDesign/dialog';
import { dropdown } from './utils/ui/customDesign/dropdown';
import { global } from './utils/ui/customDesign/global';
import { inputnumber } from './utils/ui/customDesign/inputnumber';
import { inputtext } from './utils/ui/customDesign/inputtext';
import { selectbutton } from './utils/ui/customDesign/selectbutton';
import { toast } from './utils/ui/customDesign/toast';
import { toolbar } from './utils/ui/customDesign/toolbar';

function App() {

  const CustomTailwind = usePassThrough(
    Tailwind,
    {
      global: global,
      toolbar: toolbar,
      card: card,
      datatable: datatable,
      dialog: dialog,
      button: button,
      dropdown: dropdown,
      toast: toast,
      inputnumber: inputnumber,
      inputtext: inputtext,
      selectbutton: selectbutton,
      
    },
    { mergeSections: true, mergeProps: false },
   
  );

  return (
    <>
      <Router>
        <DarkModeProvider>
      <PrimeReactProvider value={{ unstyled: true, pt: CustomTailwind, ripple: true }}>
          <AuthProvider>
            <Navbar />
            <div className="mt-2">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/airports" element={<Airports />} />
                  <Route path="/airports/:icao" element={<AirportDetails />} />
                  <Route path="/vdgs" element={<Vdgs />} />
                  <Route path="/debug/:callsign" element={<Debug />} />
                  <Route
                    path="/departure-blocks/:icao"
                    element={<DepartureBlocks />}
                  />
                  <Route path="/logo" element={<Loading />} />
                  <Route path="/flow-management" element={<FlowManagement />} />
                  <Route path="/landingpage" element={<Landingpage />} />
                  <Route path="/delivery" element={<Delivery />} />
                  <Route path="/auth-failure" element={<AuthFailurePage />} />
                  <Route path="/" element={<Landingpage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </div>
          </AuthProvider>
        </PrimeReactProvider>
        </DarkModeProvider>
      </Router>
    </>
  );
}

export default App;
