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

import blockUtils from '../../../shared/utils/block.utils';
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
          filteredPilots.push(element);
          const { adep, ades } = element.flightplan;

          if (departureAirports.findIndex((aerodrome) => aerodrome.name === adep) === -1) {
            departureAirports.push({ name: adep, value: adep });
          }

          if (arrivalAirports.findIndex((aerodrome) => aerodrome.name === ades) === -1) {
            arrivalAirports.push({ name: ades, value: ades });
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

    return <div className={tobtClassName}>{dayjs(rowData.vacdm.tobt).utc().format('HH:mm')}</div>;
  };

  const tsatBodyTemplate = (rowData: Pilot) => {
    const diff = dayjs().diff(dayjs(rowData.vacdm.tsat).second(0), 'minute');

    const tsatClassName = classNames('', {
      'text-gray-500' : dayjs(rowData.vacdm.asat).unix() !== -1,
      'bg-green-800' : diff >= -5 && diff <= 5,
      'text-amber-500' : diff > 5,
      'text-green-300' : diff < -5,
    });
    return <div className={tsatClassName}>{dayjs(rowData.vacdm.tsat).utc().format('HH:mm')}</div>;
  };

  function mkFormat(getValue: (pilot: Pilot) => Date) {
    return (rowData) => {
      const val = getValue(rowData);

      const day = dayjs(val).utc();

      if (day.unix() === -1) {
        return '-';
      }

      return <div title={day.format('YYYY-MM-DDTHH:mm:ss[Z]')}>{day.format('HH:mm')}</div> ;
    };
  }

  function mkRawTemplate(getValue: (pilot: Pilot) => string) {
    return (rowData) => {
      return <div>{getValue(rowData)}</div> ;
    };
  }

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
          sortMode="multiple"
          sortField="vacdm.tsat"
          sortOrder={-1}
        >
          <Column header='' body={mkRawTemplate(p => p.inactive ? '💤' : '')}></Column>
          <Column header='Callsign' sortable field='callsign'></Column>
          <Column header='EOBT' body={mkFormat(pilot => pilot.vacdm.eobt)}></Column>
          <Column header='TOBT' sortable field="vacdm.tobt" body={tobtBodyTemplate}></Column>
          <Column header='TSAT' sortable field="vacdm.tsat" body={tsatBodyTemplate}></Column>
          <Column header='ASAT' sortable field="vacdm.asat" body={mkFormat(pilot => pilot.vacdm.asat)}></Column>
          <Column header='EXOT' sortable field='vacdm.exot'></Column>
          <Column header='TTOT' sortable field="vacdm.ttot" body={mkFormat(pilot => pilot.vacdm.ttot)}></Column>
          <Column header='CTOT' sortable field="vacdm.ctot" body={mkFormat(pilot => pilot.vacdm.ctot)}></Column>
          <Column header='ADEP' field='flightplan.adep'></Column>
          <Column header='Prio' sortable field='vacdm.prio'></Column>
          <Column header='Delay' sortable field="vacdm.delay" body={(pilot: Pilot) => Math.ceil(pilot.vacdm.delay / 60000)}></Column>
          <Column header='Block ID' sortable field="vacdm.blockId" body={mkRawTemplate(p => String(p.vacdm.blockId))}></Column>
          <Column header='Block Time' body={mkRawTemplate(p => dayjs(blockUtils.getTimeFromBlock(p.vacdm.blockId)).utc().format('HH:mm'))}></Column>
          <Column header='SID-RWY' body={sidRwyBodyTemplate}></Column>
          <Column header='ADES' field='flightplan.ades'></Column>
          <Column header='Taxizone' field='vacdm.taxizone'></Column>
          <Column header='Debug' body={debugBodyTemplate}></Column>
        </DataTable>
      </Card>
    </div>
  );
};

export default Delivery;
