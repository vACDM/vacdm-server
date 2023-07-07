import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import PilotService from '../services/PilotService';

import Pilot, { PilotLog } from '@/shared/interfaces/pilot.interface';

const Debug = () => {
  const { callsign } = useParams();
  const [pilot, setPilot] = useState<Pilot>();
  const [logs, setLogs] = useState<PilotLog[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await PilotService.getPilot(callsign);

        setPilot(data);
        setLoading(false);
        const newLogs = await PilotService.getPilotLogs(callsign);
        setLogs(newLogs);
      } catch (e) {
        // disregard :)
      }
    }
    const intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
  }, []);

  const logDataTemplate = (rowData: any) => {
    return <pre>{JSON.stringify(rowData.data, null, 2)}</pre>;
  };



  if (loading || !pilot) {
    return <div>Loading</div>;
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
                          {new Date(pilot.vacdm.eobt).toISOString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TOBT</div>
                        <div className="text-2xl text-center">
                          {new Date(pilot.vacdm.tobt).toISOString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TSAT</div>
                        <div className="text-2xl text-center">
                          {new Date(pilot.vacdm.tsat).toISOString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TTOT</div>
                        <div className="text-2xl text-center">
                          {new Date(pilot.vacdm.ttot).toISOString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">ASAT</div>
                        <div className="text-2xl text-center">
                          {new Date(pilot.vacdm.asat).toISOString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">AOBT</div>
                        <div className="text-2xl text-center">
                          {new Date(pilot.vacdm.aobt).toISOString()}
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
                        {new Date(pilot.createdAt).toISOString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Updated At</div>
                        <div className="text-2xl text-center">
                        {new Date(pilot.updatedAt).toISOString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Insactive</div>
                        <div className="text-2xl text-center">
                        {pilot.inactive ? 'true' : 'false'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              

            </Card>
          </div>
          <div className="col">
            <DataTable value={logs}>
              <Column field="time" header="Time" />
              <Column field="namespace" header="Namespace" />
              <Column field="action" header="Action" />
              <Column field="data" header="Data" body={logDataTemplate} />
            </DataTable>
          </div>
        </div>
    </>
  );
};

export default Debug;
