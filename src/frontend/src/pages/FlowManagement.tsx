import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

import Card from '../components/ui/Card/Card';
import { Checkbox } from '../components/ui/Checkbox/Checkbox';
import DarkModeContext from '../contexts/DarkModeProvider';
import FlowService from '../services/FlowService';

import { EcfmpMeasure } from '@/shared/interfaces/ecfmp.interface';

const FlowManagement = () => {
  const [measures, setMeasures] = useState<EcfmpMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function loadData() {
      try {
        const newMeasures: EcfmpMeasure[] = await FlowService.getAllMeasures();

        setMeasures(newMeasures);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    const intervalId = setInterval(loadData, 60000);

    loadData();

    return () => clearInterval(intervalId);
  }, []);

  const setMeasureEnabled = async (measure: EcfmpMeasure, checked: boolean) => {
    const updatedMeasure = await FlowService.setMeasureEnable(
      measure.id,
      checked,
    );
    setMeasures((currentMeasures) => [
      ...currentMeasures.filter((_measure) => _measure.id !== measure.id),
      updatedMeasure,
    ]);
  };

  const enabledColumnTemplate = (rowData: EcfmpMeasure) => {
    let checked = rowData.enabled;
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => {
          setMeasureEnabled(rowData, e);
          checked = e;          
        }}
      />
    );
  };

  const filterColumns: TableColumn<any>[] = [
    {
      name: 'Type',
      selector: (row) => row.type,
    },
    {
      name: 'Value',
      selector: (row) => row.value,
    },
  ];

  const contraintsTemplate = (rowData: any) => {
    return (
      <DataTable
        data={rowData.filters}
        columns={filterColumns}
        theme={!darkMode ? 'dark' : 'default'}
      />
    );
  };

  const columns: TableColumn<EcfmpMeasure>[] = [
    {
      name: 'Enabled',
      cell: (row) => enabledColumnTemplate(row),
    },
    {
      name: 'Measure ID',
      selector: (row) => row.ident,
    },
    {
      name: 'WEF',
      selector: (row) =>
        dayjs(row.starttime).utc().format('dddd, DD.MM.YYYY HH:mm UTC'),
    },
    {
      name: 'UNT',
      selector: (row) =>
        dayjs(row.endtime).utc().format('dddd, DD.MM.YYYY HH:mm UTC'),
    },
    {
      name: 'Measure',
      cell: (row) => (
        <div>
          <div>Type: {row.measure.type}</div>
          <br />
          <div>Value: {row.measure.value}</div>
        </div>
      ),
    },
    {
      name: 'Constraints',
      cell: (row) => contraintsTemplate(row),
    },
  ];

  return (
    <Card>
      <DataTable
        data={measures}
        columns={columns}
        theme={!darkMode ? 'dark' : 'default'}
        progressPending={loading}
      />
    </Card>
  );
};

export default FlowManagement;
