import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

import AirportService from '../services/AirportService';
import PilotService from '../services/PilotService';

import Airport from '@/shared/interfaces/airport.interface';
import Pilot from '@/shared/interfaces/pilot.interface';



function LandingPage() {

  const [airports, setAirports] = useState<Airport[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    function loadData() {
      Promise.allSettled([
        AirportService.getAirports().then(data => setAirports(data)),
        PilotService.getPilots().then(data => setPilots(data)),
      ]).then(() => setLoading(false));
    }

    const intervalId = setInterval(loadData, 30000);

    loadData();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function templateAirportStatus(rowData: Airport): React.ReactNode {
    if (!pilots) {
      return '';
    }

    return pilots.some((value) => value.flightplan.adep === rowData.icao)
      ? <span className='text-green-500'>CDM in operation</span>
      : <span className='text-gray-500'>no CDM operation</span>;
  }

  function templateNumberOfPilots(rowData: Airport): React.ReactNode {
    if (!pilots) {
      return '';
    }

    return String(pilots.filter((value) => value.flightplan.adep === rowData.icao).length);
  }

  function templateAverageStartupDelay(rowData: Airport): React.ReactNode {
    if (!pilots) {
      return '';
    }

    const { overallDelay, pilotCount } = pilots
      .filter((pilot) => pilot.flightplan.adep === rowData.icao)
      .reduce<{ overallDelay: number, pilotCount: number }>(
      (pv, pilot) => ({ overallDelay: pv.overallDelay + pilot.vacdm.delay, pilotCount: pv.pilotCount + 1 }),
      { overallDelay: 0, pilotCount: 0 },
    );

    if (pilotCount === 0) {
      return '';
    }

    return `${Math.round((overallDelay / 60000) / pilotCount)} Minutes`;
  }

  return (
    <>
      <div className="text-center flex flex-col justify-center">
        <span className='text-6xl font-bold'>vACDM</span>
        <span className='text-4xl'>virtual Airport Collaborative Decision Making</span>
      </div>
      <div className="grid grid-cols-4 gap-4 pt-4">
        <div className="col-span-full  lg:col-start-2 lg:col-span-2">
          <Card>
            <DataTable
            value={airports}
            loading={loading}
            header='vACDM-Managed Airports'
            sortField='icao'
            sortOrder={1}
            >
              <Column field='icao' sortable header='ICAO'></Column>
              <Column header='Status' body={templateAirportStatus}></Column>
              <Column header='# Pilots' body={templateNumberOfPilots}></Column>
              <Column header='Avg. Startup Delay' body={templateAverageStartupDelay} ></Column>
            </DataTable>
          </Card>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
