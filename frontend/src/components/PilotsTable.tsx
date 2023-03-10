import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";

import { MultiSelect } from "primereact/multiselect";
import { FilterMatchMode, FilterOperator } from "primereact/api";

import { Button } from "primereact/button";
import PilotService from "../services/PilotService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { Card } from "primereact/card";
import TimeUtils from "../utils/time";
import { Link } from "react-router-dom";
import Pilot from "@shared/interfaces/pilot.interface"
import Loading from "./Loading";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const PilotsTable = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [departureAirports, setdepartureAirports] = useState<any[]>([]);
  const [arrivalAirports, setarrivalAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters2, setFilters2] = useState({
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "flightplan.departure": { value: null, matchMode: FilterMatchMode.IN },
    "flightplan.arrival": { value: null, matchMode: FilterMatchMode.IN },
    "clearance.sid": {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "callsign": {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "clearance.dep_rwy": {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },

  });

  useEffect(() => {
    async function loadData() {
      try {
        const data: Pilot[] = await PilotService.getPilots();
        let filteredPilots: Pilot[] = [];

        data.forEach(
          (element: Pilot) => {
            if (!element.inactive) {
              filteredPilots.push(element);
              const adep = element.flightplan.departure;
              const ades = element.flightplan.arrival;
              departureAirports.findIndex(
                (aerodrome) => aerodrome.name === adep
              ) === -1 && departureAirports.push({ name: adep, value: adep });

              arrivalAirports.findIndex(
                (aerodrome) => aerodrome.name === ades
              ) === -1 && arrivalAirports.push({ name: ades, value: ades });
            }
          }
        );

        setPilots(filteredPilots);
        setLoading(false);
        setdepartureAirports(departureAirports);
        setarrivalAirports(arrivalAirports);
      } catch (e) {}
    }
    let intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
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

  const tsatBodyTemplate = (rowData: any) => {
    let now = dayjs().second(0);
    let tsat = dayjs(rowData.vacdm.tsat).second(0);
    const tsatClassName = classNames({
      textColorGrey: dayjs(rowData.vacdm.asat).unix() !== -1, 
      textColorGreen:
        now.diff(tsat, "minutes") >= -5 && now.diff(tsat, "minutes") <= 5,
      textColorOrange: now.diff(tsat, "minute") > 5,
      textColorLightGreen: now.diff(tsat, "minutes") < -5,
    });
    return (
      <div className={tsatClassName}>
        {rowData.vacdm.tobt !== rowData.vacdm.tsat ? "!" : ""}{" "}
        {TimeUtils.formatTime(rowData.vacdm.tsat)}
      </div>
    );
  };

  const tobtBodyTemplate = (rowData: any) => {
    let now = dayjs().second(0);
    let tobt = dayjs(rowData.vacdm.tobt).second(0);
    const tobtClassName = classNames({
      textColorGrey: now.diff(tobt, "minute") > 5 || dayjs(rowData.vacdm.asat).unix() !== -1,
    });
    return (
      <div className={tobtClassName}>
        {TimeUtils.formatTime(rowData.vacdm.tobt)}
      </div>
    );
  };

  const debugButtonTemplate = (rowData: any) => {
    return (
      <Link to={`/debug/${rowData.callsign}`}>
        <Button className="p-button-warning p-button-sm " label="Debug" />{" "}
      </Link>
    );
  };

  if (loading) {
    return (
      <Loading />
    )
  }
  return (
    <div>
      <Card>
        <DataTable
          size="small"
          value={pilots}
          loading={loading}
          filters={filters2}
          filterDisplay="menu"
          dataKey="callsign"
          sortField="vacdm.tsat"
          sortOrder={1}
          globalFilterFields={["callsign"]}
          scrollable
          responsiveLayout="scroll"
          stateStorage="local"
          stateKey="pilots-table"
        >
          <Column
            field="callsign"
            header="Callsign"
            alignHeader="center"
            filter
            maxConstraints={3}
          />
          <Column
            field="vacdm.tobt"
            header="TOBT"
            sortable
            body={tobtBodyTemplate}
          />
          <Column
            field="vacdm.tsat"
            header="TSAT"
            sortable
            body={tsatBodyTemplate}
          />
          <Column
            field="vacdm.asat"
            header="ASAT"
            body={(rowData) => TimeUtils.formatTime(rowData.vacdm.asat)}
          />
          <Column field="vacdm.exot" header="EXOT" sortable />
          <Column
            field="vacdm.ttot"
            header="TTOT"
            sortable
            body={(rowData) => TimeUtils.formatTime(rowData.vacdm.ttot)}
          />
          <Column 
          field="clearance.dep_rwy" 
          header="RWY"
          filter 
          maxConstraints={3}
          />
          <Column field="clearance.sid" header="SID" filter />
          <Column
            field="flightplan.departure"
            header="ADEP"
            filterField="flightplan.departure"
            filter
            filterElement={departureFilterTemplate}
            showFilterMatchModes={false}
          />
          <Column
            field="flightplan.arrival"
            header="ADES"
            filterField="flightplan.arrival"
            filter
            filterElement={arrivalFilterTemplate}
            showFilterMatchModes={false}
          />
          <Column header="" body={debugButtonTemplate} align="center" />
        </DataTable>
      </Card>
    </div>
  );
};

export default PilotsTable;
