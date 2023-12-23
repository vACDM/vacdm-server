import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { classNames } from 'primereact/utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PilotService from '../services/PilotService';

import Pilot from '@/shared/interfaces/pilot.interface';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const Delivery = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [departureAirports, setdepartureAirports] = useState<{ name: string; value: string; }[]>([]);
  const [arrivalAirports, setarrivalAirports] = useState<{ name: string; value: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data: Pilot[] = await PilotService.getPilots();
        const filteredPilots: Pilot[] = [];

        data.forEach((element: Pilot) => {
          if (!element.inactive) {
            filteredPilots.push(element);
            const { adep, ades } = element.flightplan;

            if (departureAirports.findIndex((aerodrome) => aerodrome.name === adep) === -1) {
              departureAirports.push({ name: adep, value: adep });
            }

            if (arrivalAirports.findIndex((aerodrome) => aerodrome.name === ades) === -1) {
              arrivalAirports.push({ name: ades, value: ades });
            }
          }
        });

        setPilots(filteredPilots);
        setLoading(false);
        setdepartureAirports(departureAirports);
        setarrivalAirports(arrivalAirports);
      } catch (e) {
        setLoading(false);
      }
    }

    const intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
  }, []);

  const tobtBodyTemplate = (rowData: Pilot) => {
    const tobtClassName = (dayjs().diff(dayjs(rowData.vacdm.tobt).second(0), 'minute') > 5 || dayjs(rowData.vacdm.asat).unix() !== -1) ? 'text-gray-500' : '';

    return <div className={tobtClassName}>{dayjs(rowData.vacdm.tobt).format('HH:mm')}</div>;
  };

  const tsatBodyTemplate = (rowData: Pilot) => {
    const tsatClassName = classNames('', {
      'text-gray-500' : dayjs(rowData.vacdm.asat).unix() !== -1,
      'bg-green-800' : dayjs().diff(dayjs(rowData.vacdm.tsat).second(0), 'minutes') >= -5 && dayjs().diff(dayjs(rowData.vacdm.tsat).second(0), 'minutes') <= 5,
      'text-amber-500' : dayjs().diff(dayjs(rowData.vacdm.tsat).second(0), 'minute') > 5,
      'text-green-300' : dayjs().diff(dayjs(rowData.vacdm.tsat).second(0), 'minute') < -5,
    });
    return <div className={tsatClassName}>{dayjs(rowData.vacdm.tsat).format('HH:mm')}</div>;
  };

  const sidRwyBodyTemplate = (rowData: Pilot) => {
    return <div>{rowData.clearance.sid + ' (' + rowData.clearance.dep_rwy + ')'}</div>;
  };

  const debugBodyTemplate = (rowData: Pilot) => {
    return <Button
    severity="warning"
    size='small'
    onClick={() => navigate(`/debug/${rowData.callsign}`)}
  >
    Debug
  </Button>;
  };


  return (
    <div>
      <Card>
        <DataTable
        value={pilots}
        size='small'
        loading={loading}
        >
          <Column field='callsign' header='Callsign'></Column>
          <Column header='EOBT' body={(rowData) => dayjs(rowData.vacdm.eobt).format('HH:mm')}></Column>
          <Column header='TOBT' body={tobtBodyTemplate}></Column>
          <Column header='TSAT' body={tsatBodyTemplate}></Column>
          <Column header='ASAT' body={(rowData) => dayjs(rowData.vacdm.asat).format('HH:mm')}></Column>
          <Column header='EXOT' field='vacdm.exot'></Column>
          <Column header='TTOT' body={(rowData) => dayjs(rowData.vacdm.ttot).format('HH:mm')}></Column>
          <Column header='CTOT' body={(rowData) => dayjs(rowData.vacdm.ctot).format('HH:mm')}></Column>
          <Column header='ADEP' field='flightplan.departure'></Column>
          <Column header='SID-RWY' body={sidRwyBodyTemplate}></Column>
          <Column header='ADES' field='flightplan.arrival'></Column>
          <Column header='Taxizone' field='vacdm.taxizone'></Column>
          <Column header='Debug' body={debugBodyTemplate}></Column>
        </DataTable>
      </Card>
    </div>
  );
};

export default Delivery;
