import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';

import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { Button } from 'primereact/button';
import PilotService from '../services/PilotService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from 'primereact/card';
import TimeUtils from '../utils/time';
import { Link } from 'react-router-dom';
import Pilot from '@shared/interfaces/pilot.interface';
import Loading from '../components/Loading';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const dummy: any = [
  {
    position: {
      lat: 50.87802,
      lon: 7.1242399999999995,
    },
    vacdm: {
      eobt: '2023-06-14T16:09:00.000Z',
      tobt: '2023-06-14T16:09:00.000Z',
      tobt_state: 'NOW',
      exot: 3,
      manual_exot: false,
      tsat: '2023-06-15T20:31:00.000Z',
      ctot: '1969-12-31T23:59:59.999Z',
      ttot: '2023-06-14T16:12:00.000Z',
      asrt: '1969-12-31T23:59:59.999Z',
      aort: '1969-12-31T23:59:59.999Z',
      asat: '1969-12-31T23:59:59.999Z',
      aobt: '1969-12-31T23:59:59.999Z',
      delay: 0,
      prio: 0,
      sug: '1969-12-31T23:59:59.999Z',
      pbg: '1969-12-31T23:59:59.999Z',
      txg: '1969-12-31T23:59:59.999Z',
      taxizone: 'B10 - B18',
      taxizoneIsTaxiout: false,
      blockAssignment: '2023-06-14T15:45:26.471Z',
      blockId: 97,
      block_rwy_designator: '14L',
    },
    flightplan: {
      flight_rules: 'I',
      departure: 'EDDK',
      arrival: 'GCLP',
    },
    clearance: {
      dep_rwy: '14L',
      sid: 'NVO1Q',
      initial_climb: '5000',
      assigned_squawk: '2003',
      current_squawk: '2003',
    },
    _id: '6489e096e55c2cc6320a411b',
    callsign: 'RYR2QZ',
    hasBooking: false,
    inactive: false,
    measures: [],
    createdAt: '2023-06-14T15:45:26.925Z',
    updatedAt: '2023-06-14T16:15:44.052Z',
    __v: 0,
  },
];

const Delivery = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [departureAirports, setdepartureAirports] = useState<any[]>([]);
  const [arrivalAirports, setarrivalAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters2, setFilters2] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'flightplan.departure': { value: null, matchMode: FilterMatchMode.IN },
    'flightplan.arrival': { value: null, matchMode: FilterMatchMode.IN },
    'clearance.sid': {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    callsign: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    'clearance.dep_rwy': {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  });

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
  ];
  useEffect(() => {
    // async function loadData() {
    //   try {
    //     const data: Pilot[] = await PilotService.getPilots();
    //     let filteredPilots: Pilot[] = [];

    //     data.forEach(
    //       (element: Pilot) => {
    //         if (!element.inactive) {
    //           filteredPilots.push(element);
    //           const adep = element.flightplan.departure;
    //           const ades = element.flightplan.arrival;
    //           departureAirports.findIndex(
    //             (aerodrome) => aerodrome.name === adep
    //           ) === -1 && departureAirports.push({ name: adep, value: adep });

    //           arrivalAirports.findIndex(
    //             (aerodrome) => aerodrome.name === ades
    //           ) === -1 && arrivalAirports.push({ name: ades, value: ades });
    //         }
    //       }
    //     );

    //     setPilots(filteredPilots);
    //     setLoading(false);
    //     setdepartureAirports(departureAirports);
    //     setarrivalAirports(arrivalAirports);
    //   } catch (e) {}
    // }

    setPilots(dummy);
    setLoading(false);
    // let intervalId = setInterval(loadData, 5000);

    // loadData();

    // return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const AirportsItemTemplate = (option: any) => {
    return <span>{option.name}</span>;
  };

  const departureFilterTemplate = (options: any) => {
    return (
      <MultiSelect
        value={options.value}
        options={departureAirports}
        itemTemplate={AirportsItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
      />
    );
  };

  const arrivalFilterTemplate = (options: any) => {
    return (
      <MultiSelect
        value={options.value}
        options={arrivalAirports}
        itemTemplate={AirportsItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
      />
    );
  };

  function debugButtonTemplate(rowData: any) {
    return (
      <Link to={`/debug/${rowData.callsign}`}>
        <Button className="p-button-warning p-button-sm " label="Debug" />{' '}
      </Link>
    );
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <Card>
        <DataTable columns={columns} data={pilots} theme="dark" />
      </Card>
    </div>
  );
};

export default Delivery;
