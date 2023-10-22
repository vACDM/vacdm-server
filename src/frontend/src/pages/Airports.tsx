import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AirportService from '../services/AirportService';

import Airport from '@/shared/interfaces/airport.interface';

const AirpotsTable = () => {
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AirportService.getAirports().then((data: any[]) => {
      setAirports(data);
      setLoading(false);
    });
  }, []);

  const adminBodyTemplate = (rowData: Airport) => {
    return <Button severity="warning" size='small' onClick={() => navigate('/airports/' + rowData.icao)}>Edit</Button>;
  };

  const blocksBodyTemplate = (rowData: Airport) => {
    return <Button disabled={true} size='small' onClick={() => navigate('/airports/blocks' + rowData.icao)}>Blocks (wip)</Button>;
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8">
        <Card>
          <DataTable
        value={airports}
        size='small'
        loading={loading}
        >
            <Column header='ICAO' field='icao'></Column>
            <Column header='Standard Taxitime' field='standard_taxitime'></Column>
            <Column header='Taxizones' field='taxizones.length'></Column>
            <Column header='Capacities' field='capacities.length'></Column>
            <Column header='Admin' body={adminBodyTemplate}></Column>
            <Column header='Blocks' body={blocksBodyTemplate}></Column>
          </DataTable>
        </Card>
      </div>
      <div className="col-span-2"></div>
    </div>
  );
};

export default AirpotsTable;
