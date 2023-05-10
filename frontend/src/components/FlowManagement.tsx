import { EcfmpMeasure } from "@shared/interfaces/ecfmp.interface";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import FlowService from "services/FlowService";
import timeUtils from "../utils/time";

const FlowManagement = () => {
  const [measures, setMeasures] = useState<EcfmpMeasure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const measures: EcfmpMeasure[] = await FlowService.getAllMeasures();

        setMeasures(measures);
        setLoading(false);
      } catch (e) {}
    }
    let intervalId = setInterval(loadData, 60000);

    loadData();

    return () => clearInterval(intervalId);
  }, []);

  const measureColumnTemplate = (rowData: any) => {
    return (
      <div>
        <div>Type: {rowData.measure.type}</div>
        <br />
        <div>Value: {rowData.measure.value}</div>
      </div>
    );
  };

  const contraintsColumnTemplate = (rowData: any) => {
    return (
      <DataTable value={rowData.filters}>
        <Column field="type" header="Typ" />
        <Column field="value" header="Value" />
      </DataTable>
    );
  };

  const enabledColumnTemplate = (rowData: EcfmpMeasure) => {
    let checked = rowData.enabled;
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => {
          setMeasureEnabled(rowData, e.checked);
          checked = e.checked;
        }}
      />
    );
  };

  const setMeasureEnabled = async (measure: EcfmpMeasure, checked: boolean) => {
    const updatedMeasure = await FlowService.setMeasureEnable(measure.id, checked);
    console.log([...measures.filter((_measure) => _measure.id !== measure.id), updatedMeasure]);
    setMeasures((measures) => [...measures.filter((_measure) => _measure.id !== measure.id), updatedMeasure]);    
  };

  return (
    <Card>
      <DataTable
        value={measures}
        sortMode="multiple"
        responsiveLayout="scroll"
        loading={loading}
        dataKey="id"
      >
        <Column
          field="enabled"
          header="Enabled"
          body={enabledColumnTemplate}
        />
        <Column field="ident" header="Measure ID" />
        <Column
          field="starttime"
          header="WEF"
          body={(rowData) => timeUtils.flowTimeFormat(rowData.starttime)}
        />
        <Column
          field="endtime"
          header="UNT"
          body={(rowData) => timeUtils.flowTimeFormat(rowData.endtime)}
        />
        <Column header="Measure" body={measureColumnTemplate} />
        <Column header="Constraints" body={contraintsColumnTemplate} />
      </DataTable>
    </Card>
  );
};

export default FlowManagement;
