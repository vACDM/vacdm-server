import dayjs from 'dayjs';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PilotService from '../services/PilotService';

import Pilot from '@/shared/interfaces/pilot.interface';

const Debug = () => {
  const { callsign } = useParams();
  const [pilot, setPilot] = useState<Pilot>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await PilotService.getPilot(callsign);

        setPilot(data);
      } catch (e) {
        //
      }
      setLoading(false);
    }
    const intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
  }, []);

  function dateFormatter(date: Date) {
    if (new Date(date).getTime() === -1) {
      return 'N/A';
    }
    return dayjs(new Date(date)).utc().format('HH:mm');
  }

  if (loading) {
    return <div>Loading</div>;
  }

  if (!pilot) {
    return <div>Pilot not found.</div>;
  }

  return (
    <>
        <div className="grid">
          <div className="col">
            <Card>
              <div className="grid">
                <div className="col">
                  <h5>Flight Data</h5>
                  <div className="flex flex-row flex-wrap gap-4">
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block border">
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
                          {pilot.flightplan.adep}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">ADES</div>
                        <div className="text-2xl text-center">
                          {pilot.flightplan.ades}
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
                  </div>
                  <br />
                  <h3>CDM Data</h3>
                  <div className="flex flex-row flex-wrap gap-5">
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">EOBT</div>
                        <div className="text-2xl text-center">
                          {dateFormatter(pilot.vacdm.eobt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TOBT</div>
                        <div className="text-2xl text-center">
                          {dateFormatter(pilot.vacdm.tobt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TSAT</div>
                        <div className="text-2xl text-center">
                          {dateFormatter(pilot.vacdm.tsat)}
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
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">TTOT</div>
                        <div className="text-2xl text-center">
                          {dateFormatter(pilot.vacdm.ttot)}
                        </div>
                      </div>
                    </div>

                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">ASAT</div>
                        <div className="text-2xl text-center">
                          {dateFormatter(pilot.vacdm.asat)}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center ">
                      <div className="inline-block">
                        <div className="text-sm text-center">AOBT</div>
                        <div className="text-2xl text-center">
                          {dateFormatter(pilot.vacdm.aobt)}
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
                  </div>
                  <br />
                  <div className="flex flex-row flex-wrap gap-3">
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Created At</div>
                        <div className="text-2xl text-center">
                        {dayjs(new Date(pilot.createdAt)).utc().format('YYYY-MM-DD HH:MM:ss')}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Updated At</div>
                        <div className="text-2xl text-center">
                        {dayjs(new Date(pilot.createdAt)).utc().format('YYYY-MM-DD HH:MM:ss')}
                        </div>
                      </div>
                    </div>
                    <div className="flex align-items-center justify-content-center  ">
                      <div className="inline-block">
                        <div className="text-sm text-center">Inactive</div>
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
          <Card>
            <DataTable value={pilot.operationalLog}>
              <Column field="time" header="Time" />
              <Column field="logType" header="Log Type" />
              <Column field="event" header="Event" />
              <Column field="content" header="Content" />
            </DataTable>
          </Card>
          </div>

        </div>
    </>
  );
};

export default Debug;
