import { useState, useEffect, useContext } from 'react';
import Card from '../components/ui/Card/Card';
import AirportService from '../services/AirportService';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import DarkModeContext from '../contexts/DarkModeProvider';
import DataTable, { TableColumn } from 'react-data-table-component';
import Airport from '../../../shared/src/interfaces/airport.interface';

const AirpotsTable = () => {
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const columns: TableColumn<Airport>[] = [
    {
      name: 'ICAO',
      selector: (row) => row.icao,
    },
    {
      name: 'Standard Taxitime',
      selector: (row) => row.standard_taxitime,
    },
    {
      name: 'Taxizones',
      selector: (row) => row.taxizones.length,
    },
    {
      name: 'Capacities',
      selector: (row) => row.capacities.length,
    },
    {
      name: 'Details',
      cell: (row) => (
        <Button disabled={true} style="warning" onClick={() => navigate(``)}>
          Details (wip)
        </Button>
      ),
    },
    {
      name: 'Blocks',
      cell: (row) => (
        <Button disabled={true} onClick={() => navigate(``)}>
          Blocks (wip)
        </Button>
      ),
    },
  ];

  useEffect(() => {
    AirportService.getAirports().then((data: any[]) => {
      setAirports(data);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className="col-span-8">
        <Card>
          <DataTable
            columns={columns}
            data={airports}
            theme={!darkMode ? 'dark' : 'default'}
            progressPending={loading}
          />
        </Card>
      </div>
      <div className="col-span-2"></div>
    </div>
  );
};

export default AirpotsTable;
