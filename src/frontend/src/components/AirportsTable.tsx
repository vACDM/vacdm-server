import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AirportService from '../services/AirportService';


const AirpotsTable = () => {
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<any>(null);

  useEffect(() => {
    AirportService.getAirports().then((data: any[]) => {
      setAirports(data);
      setLoading(false);
    });
  }, []);

  const taxioutTemplate = (rowData: any) => {
    return (rowData.taxiout ? <Badge value="true" severity="success" /> : <Badge value="false" severity="danger" />);
  };

  const editButtonTemplate = (rowData: any) => {
    return (
      <Link to={`/airports/${rowData.icao}`}>
        <Button className="p-button-sm " label="Edit" />{' '}
      </Link>
    );
  };

  const blocksButtonTemplate = (rowData: any) => {
    return (
      <Link to={`/departure-blocks/${rowData.icao}`}>
        <Button className="p-button-sm " label="Blocks" />{' '}
      </Link>
    );
  };


  const rowExpansionTemplate = (data: any) => {
    return (
      <>
        <div className="grid">
          <div className="col">
            <DataTable value={data.taxizones} responsiveLayout="scroll">
              <Column field="label" header="Zonename" />
              <Column
                field="polygon"
                header="Polygon"
                body={(rowData) => <InputTextarea value={rowData.polygon} autoResize />}
              />
              <Column field="taxiout" header="Taxiout" body={taxioutTemplate}/>
            </DataTable>
          </div>
          <div className="col">
          <DataTable value={data.capacities} responsiveLayout="scroll">
              <Column field="rwy_designator" header="Runway" />
              <Column
                field="capacity"
                header="Capacity"
              />
              <Column field="alias" header="Alias"/>
            </DataTable>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="grid">
      <div className="col"></div>
      <div className="col-8">
        <Card>
          <DataTable
            value={airports}
            sortMode="multiple"
            responsiveLayout="scroll"
            loading={loading}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="icao"
            expandedRows={expandedRows}
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="icao" header="ICAO"></Column>
            <Column
              field="standard_taxitime"
              header="Standard Taxitime"
            ></Column>
            <Column field="taxizones.length" header="Taxizones"></Column>
            <Column field="capacities.length" header="Capacities"></Column>
            <Column body={editButtonTemplate} header="Actions"></Column>
            <Column header="Blocks" body={blocksButtonTemplate} />
          </DataTable>
        </Card>
      </div>
      <div className="col"></div>
    </div>
  );
};

export default AirpotsTable;
