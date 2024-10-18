import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';

import AirportService from '../services/AirportService';
import PilotService from '../services/PilotService';

import Airport from '@/shared/interfaces/airport.interface';
import Pilot from '@/shared/interfaces/pilot.interface';



const Landingpage = () => {

  const [airports, setAirports] = useState<Airport[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadData() {

      AirportService.getAirports().then((data) =>{
        setAirports(data);
        setLoading(false);
      });

      PilotService.getPilots().then((data) => {
        setPilots(data);
      });
    }


    const intervalId = setInterval(loadData, 30000);

    loadData();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const numberOfPilotsTemplate = (rowData) => {
    if (pilots) {
      const number = pilots.filter((value) => value.flightplan.adep === rowData.icao);
      return number.length;
    }
  };

  const avgStartupDelayTemplate = (rowData) => {
    if (pilots) {
      let delay = 0;
      const number = pilots.filter((pilot) => pilot.flightplan.adep === rowData.icao);
      for (const pilot of number) {
        delay = delay + pilot.vacdm.delay;
      }
      return number.length === 0 ? '' : Math.ceil(delay / number.length) + ' Minutes';
    }
  };

  const statusTemplate = (rowData) => {
    if (pilots) {
      const number = pilots.filter((value) => value.flightplan.adep === rowData.icao);
      return (number.length !== 0 ? <span className='text-green-500'>CDM in operation</span> : <span className='text-gray-500'>no CDM operation</span>);
    }
  };

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
              <Column header='Status' body={statusTemplate}></Column>
              <Column header='# Pilots' body={numberOfPilotsTemplate}></Column>
              <Column header='Avg. Startup Delay' body={avgStartupDelayTemplate} ></Column>
            </DataTable>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Landingpage;
