import { classNames } from "primereact/utils";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import PilotService from "../services/PilotService";
import TimeUtils from "../utils/time";
import Pilot from "@shared/interfaces/pilot.interface";

const Vdgs = () => {
  const { callsign } = useParams();
  const [pilot, setPilot] = useState<Pilot>();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log('Callsign: ', callsign);
    

    if(!callsign || callsign === '') {
      return;
    }
  
    async function loadData() {
      try {
        const data: Pilot = await PilotService.getPilot(callsign, false);

        setPilot(data);
        setLoading(false);
      } catch (e) {}
    }
    let intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function vdgsColorController(time: Date | undefined) {
    let now = dayjs().second(0);
    let tsat = dayjs(time).second(0);
    return now.diff(tsat, "minute") > 5 ? "textColorRed" : "";
  }

  return (
    <>
      <div className="flex justify-content-center mt-2">
        <div className="vdgs-container">
          {loading ? (
            <div>LOADING ...</div>
          ) : (
            <div className="flex align-items-center justify-content-center">
              <div className="inline-block m-2">
                <div className="text-center">{pilot?.callsign}</div>
                <div className="text-center">
                  TOBT {TimeUtils.formatTime(pilot?.vacdm.tobt)} UTC
                </div>
                <div className="text-center">
                  TSAT {TimeUtils.formatTime(pilot?.vacdm.tsat)}
                </div>
                <div className="text-center">
                  <span className={vdgsColorController(pilot?.vacdm?.tsat)}>
                    {TimeUtils.calculateVdgsDiff(pilot?.vacdm?.tsat)}
                  </span>
                </div>
                <div className="text-center">
                  PLANNED RWY {pilot?.clearance?.dep_rwy}
                </div>
                <div className="text-center">SID {pilot?.clearance?.sid}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Vdgs;
