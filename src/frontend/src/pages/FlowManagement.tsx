import dayjs from 'dayjs';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';

import FlowService from '../services/FlowService';

import { EcfmpMeasure } from '@/shared/interfaces/ecfmp.interface';

const FlowManagement = () => {
  const [measures, setMeasures] = useState<EcfmpMeasure[]>([]);
  const [loading, setLoading] = useState(true);

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

  const setMeasureEnabled = async (measure: EcfmpMeasure, checked?: boolean) => {
    const updatedMeasure = await FlowService.setMeasureEnable(
      measure.id,
      checked ?? true,
    );
    setMeasures((currentMeasures) => [
      ...currentMeasures.filter((_measure) => _measure.id !== measure.id),
      updatedMeasure,
    ]);
  };

  const enabledColumnTemplate = (rowData: EcfmpMeasure) => {
    return (
      <Checkbox
        checked={rowData.enabled}
        onChange={(e) => {
          setMeasureEnabled(rowData, e.checked);
        }}
      />
    );
  };

  const filterValueTempate = (rowData) => {
    return rowData.value.join(', ');
  };

  const contraintsTemplate = (rowData: EcfmpMeasure) => {
    return (
      <DataTable
        value={rowData.filters}
        size='small'
      >
        <Column header='Type' field='type' />
        <Column header='Value' body={filterValueTempate} />
      </DataTable>
    );
  };

  return (
    <Card>
      <DataTable
      value={measures}
      size='small'
      loading={loading}
      sortField='ident'
      sortOrder={1}
      >
        <Column header='Enabled' body={enabledColumnTemplate}></Column>
        <Column header='Measure ID' sortable field='ident'></Column>
        <Column header='WEF' body={(rowData) => dayjs(rowData.starttime).utc().format('dddd, DD.MM.YYYY HH:mm UTC')}></Column>
        <Column header='UNT' body={(rowData) => dayjs(rowData.endtime).utc().format('dddd, DD.MM.YYYY HH:mm UTC')}></Column>
        <Column header='Constraints' body={contraintsTemplate}></Column>
      </DataTable>
  </Card>
  );
};

export default FlowManagement;
