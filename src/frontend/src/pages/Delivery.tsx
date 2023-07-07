import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect, useContext } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import DarkModeContext from '../contexts/DarkModeProvider';
import PilotService from '../services/PilotService';

import Pilot from '@/shared/interfaces/pilot.interface';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const Delivery = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [departureAirports, setdepartureAirports] = useState<any[]>([]);
  const [arrivalAirports, setarrivalAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const columns: TableColumn<Pilot>[] = [
    {
      name: 'Callsign',
      selector: (row) => row.callsign,
    },
    {
      name: 'EOBT',
      selector: (row) => dayjs(row.vacdm.eobt).format('HH:mm'),
    },
    {
      name: 'TOBT',
      selector: (row) => dayjs(row.vacdm.tobt).format('HH:mm'),
      conditionalCellStyles: [
        {
          when: (row) =>
            dayjs().diff(dayjs(row.vacdm.tobt).second(0), 'minute') > 5 ||
            dayjs(row.vacdm.asat).unix() !== -1,
          classNames: ['text-gray-500'],
        },
      ],
    },
    {
      name: 'TSAT',
      selector: (row) => dayjs(row.vacdm.tsat).format('HH:mm'),
      conditionalCellStyles: [
        {
          when: (row) => dayjs(row.vacdm.asat).unix() !== -1,
          classNames: ['text-gray-500'],
        },
        {
          when: (row) =>
            dayjs().diff(dayjs(row.vacdm.tsat).second(0), 'minutes') >= -5 &&
            dayjs().diff(dayjs(row.vacdm.tsat).second(0), 'minutes') <= 5,
          classNames: ['bg-green-800'],
        },
        {
          when: (row) =>
            dayjs().diff(dayjs(row.vacdm.tsat).second(0), 'minute') > 5,
          classNames: ['text-amber-500'],
        },
        {
          when: (row) =>
            dayjs().diff(dayjs(row.vacdm.tsat).second(0), 'minute') < -5,
          classNames: ['text-green-300'],
        },
      ],
    },
    {
      name: 'ASAT',
      selector: (row) => dayjs(row.vacdm.asat).format('HH:mm'),
    },
    {
      name: 'EXOT',
      selector: (row) => row.vacdm.exot,
    },
    {
      name: 'TTOT',
      selector: (row) => dayjs(row.vacdm.ttot).format('HH:mm'),
    },
    {
      name: 'CTOT',
      selector: (row) => dayjs(row.vacdm.ctot).format('HH:mm'),
    },
    {
      name: 'ADEP',
      selector: (row) => row.flightplan.departure,
    },
    {
      name: 'SID+RWY',
      selector: (row) => row.clearance.sid + ' ' + row.clearance.dep_rwy,
    },
    {
      name: 'ADES',
      selector: (row) => row.flightplan.arrival,
    },
    {
      name: 'Taxizone',
      selector: (row) => row.vacdm.taxizone,
    },
    {
      name: 'Debug',
      cell: (row) => (
        <Button
          style="warning"
          onClick={() => navigate(`/debug/${row.callsign}`)}
        >
          Debug
        </Button>
      ),
    },
  ];
  useEffect(() => {
    async function loadData() {
      try {
        const data: Pilot[] = await PilotService.getPilots();
        const filteredPilots: Pilot[] = [];

        data.forEach((element: Pilot) => {
          if (!element.inactive) {
            filteredPilots.push(element);
            const adep = element.flightplan.departure;
            const ades = element.flightplan.arrival;

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

  return (
    <div>
      <Card>
        <DataTable
          columns={columns}
          data={pilots}
          theme={!darkMode ? 'dark' : 'default'}
          progressPending={loading}
        />
      </Card>
    </div>
  );
};

export default Delivery;
