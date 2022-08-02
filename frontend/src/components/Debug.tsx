import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PilotService from "../services/PilotService";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Debug = () => {
  const { callsign } = useParams();
  const [pilot, setPilot] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await PilotService.getPilot(callsign, true);

        setPilot(data);
        setLoading(false);
      } catch (e) {}
    }
    let intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logDataTemplate = (rowData: any) => {
    return <pre>{JSON.stringify(rowData.data, null, 2)}</pre>;
  };


  if (loading) {
    return <div>Loading</div>
  }

  return (
    <>
        <div className="grid">
          <div className="col">
            <Card>
              <div className="grid">
                <div className="col">
                  <h5>Flight Data</h5>
                  <div className="flex flex-row flex-wrap gap-3">
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Callsign</div>
                        <div className="text-2xl text-center">
                          {pilot.callsign}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">ADEP</div>
                        <div className="text-2xl text-center">
                          {pilot.flightplan.departure}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">ADES</div>
                        <div className="text-2xl text-center">
                          {pilot.flightplan.arrival}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center">
                      <div className="inline-block">
                        <div className="text-sm text-center">Runway</div>
                        <div className="text-2xl text-center">
                          {pilot.clearance.dep_rwy}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">SID</div>
                        <div className="text-2xl text-center">
                          {pilot.clearance.sid}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Initial Climb</div>
                        <div className="text-2xl text-center">
                          {pilot.clearance.initial_climb}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Flightrule</div>
                        <div className="text-2xl text-center">
                          {pilot.flightplan.flight_rules}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h5>CDM Data</h5>
                  <div className="flex flex-row flex-wrap gap-3">
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">EOBT</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.eobt}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TOBT</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.tobt}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TSAT</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.tsat}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TTOT</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.ttot}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">ASAT</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.asat}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">AOBT</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.aobt}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Prio</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.prio}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center">
                      <div className="inline-block">
                        <div className="text-sm text-center">EXOT</div>
                        <div className="text-2xl text-center">
                          {pilot.vacdm.exot}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h5>Database Data</h5>
                  <div className="flex flex-row flex-wrap gap-3">
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Created At</div>
                        <div className="text-2xl text-center">
                        {pilot.createdAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Updated At</div>
                        <div className="text-2xl text-center">
                        {pilot.updatedAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Insactive</div>
                        <div className="text-2xl text-center">
                        {pilot.inactive ? "true" : "false"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              

            </Card>
          </div>
          <div className="col">
            <DataTable value={pilot.log}>
              <Column field="time" header="Time" />
              <Column field="job" header="Job" />
              <Column field="data" header="Data" body={logDataTemplate} />
            </DataTable>
          </div>
        </div>
    </>
  );
};

export default Debug;
