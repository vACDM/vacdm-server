import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Toast } from "primereact/toast";

import PilotService from "../services/PilotService";
import TimeUtils from "../utils/time";
import Pilot from "@shared/interfaces/pilot.interface";
import User from "@shared/interfaces/user.interface";
import  Card from "../components/ui/Card/Card";
import {Input} from "../components/ui/Input/Input";
import  Button  from "../components/ui/Button/Button";
import VdgsService from "../services/VdgsService";
import AuthService from "../services/AuthService";
import DatafeedService from "../services/DatafeedService";
import utc from "dayjs/plugin/utc";
import Container from "../components/Container";

dayjs.extend(utc);

const Vdgs = () => {
  const navigate = useNavigate();

  const [pilot, setPilot] = useState<Pilot | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingTobt, setLoadingTobt] = useState(false);
  const [inputTextValue, setinputTextValue] = useState("");
  const [validity, setValidity] = useState(false);
  const [wrongFormat, setwrongFormat] = useState("");
  const [clock, setClock] = useState(dayjs(new Date()).utc().format('HH:mm:ss'));
  const toast: any = useRef(null);

  useEffect(() => {
    setwrongFormat("");
    setValidity(false);
    async function loadData() {
      await checkPilot();
    }

    loadData();
    let intervalId = setInterval(loadData, 10000);
    let clockInterval = setInterval(utcTime, 1000)

    return () => {
      clearInterval(intervalId);
      clearInterval(clockInterval);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function utcTime() {
    return setClock(dayjs(new Date()).utc().format('HH:mm:ss'));
  }

  async function checkPilot() {
    try {
      const user: User = await AuthService.getProfile();

      const pilot = await DatafeedService.getPilotFromCid(
        user.apidata.cid
      );

      const vacdmPilot: Pilot = await PilotService.getPilot(pilot.callsign)


      setPilot(vacdmPilot);
      setLoading(false);
    } catch (e) {}
  }

  const tobtConfimationText = () => {
    if (!pilot) {
      return '';
    }

    if (isTobtConfirmed(pilot?.vacdm.tobt_state)) {
      return <span className="text-green-500">Your TOBT is confirmed!<br />Set your TOBT to get your TSAT.</span>
    } else {
      return <span className="text-amber-500">Your TOBT is not yet confirmed!</span>
    }
  }

  function vdgsColorController(time: Date | undefined) {
    let now = dayjs().second(0);
    let tsat = dayjs(time).second(0);
    return now.diff(tsat, "minute") > 5 ? "text-red-500" : "";
  }

  function isTobtConfirmed(tobtState: string | undefined) {
    return tobtState === "CONFIRMED" || tobtState === "NOW"
  }

  async function updateTobt() {
    setLoadingTobt(true);

    let regex = new RegExp("^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$");
    if (!regex.test(inputTextValue)) {
      setValidity(true);
      setwrongFormat("Allowed Format: HHMM");
      setLoadingTobt(false);
    } else {
      let p = pilot;
      if (p) {
        p.vacdm.tobt = dayjs(TimeUtils.formatVdgsTobt(inputTextValue)).toDate();
        if(dayjs(p.vacdm.tobt).isBefore(dayjs())) {
          p.vacdm.tobt = dayjs(p.vacdm.tobt).add(1, 'day').toDate();
        }
        p.vacdm.tsat = dayjs(-1).toDate();
      }
      setPilot(p);
      setwrongFormat("");
      setValidity(false);
      setinputTextValue(inputTextValue);
      
      VdgsService.updateTobt(inputTextValue, pilot?.callsign)
        .then(() => {       
          setinputTextValue("");
        })
        .catch(() => {
          setwrongFormat("Unauthorized!");
        })
        .finally(() => setLoadingTobt(false));

    }
  
  }

  return (
    <>
      <Toast ref={toast} />
    
      <div className="grid grid-cols-12 gap-2 px-2">
      <div className="col-span-3"></div>
        <div className="col-span-5">
      <Card className='bg-zinc-800'>
          <div className="vdgs-font  text-3xl lg:text-4xl xl:text-5xl  text-center">
            {loading ? (
              <>
                <p>SEARCHING FOR CALLSIGN...</p>
                
                </>
            ) : (
              <div className="flex align-items-center justify-content-center">
                <div className="inline-block mx-auto">
                  <div className="text-center">{pilot?.callsign}</div>
                  <div className="text-center">
                     {isTobtConfirmed(pilot?.vacdm?.tobt_state) ? 'TOBT ' + TimeUtils.formatTime(pilot?.vacdm?.tobt) + ' UTC' : 'NO TOBT' } 
                  </div>
                  <div className="text-center">
                     {isTobtConfirmed(pilot?.vacdm?.tobt_state) ? 'TSAT ' + TimeUtils.formatTime(pilot?.vacdm?.tsat) + ' UTC' : '-'}
                  </div>
                  <div className="text-center">
                    <span className={vdgsColorController(pilot?.vacdm?.tsat)}>
                      {isTobtConfirmed(pilot?.vacdm?.tobt_state) ? TimeUtils.calculateVdgsDiff(pilot?.vacdm?.tsat) : '-'}
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
        </Card>
        </div>
        <div className="col-span-4">
          <Card className="p-3">
            <div className="flex">
            <h1 className="text-3xl min-w-[130px]">{clock}</h1>
            <h1 className="text-3xl">UTC</h1>

            </div>

            {tobtConfimationText()}
            
            <h5 className="dark:text-zinc-500">Set TOBT (UTC-Time when ready for pushback)</h5>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Input

                  inputError={validity}
                  loading={loading}
                  hideSpinner={true}
                  placeholder="HHMM"
                  aria-describedby="tobt-help"
                  className="min-h-[36px]"
                ></Input>
              <Button
              className="mb-auto"
                loading={loadingTobt}
                onClick={updateTobt}
                disabled={!pilot?.callsign  || pilot?.callsign === "" ? true : false}
                >Set TOBT</Button>
                </div>
            </div>
            <p className="mt-4"><b>Info:</b> Your TOBT (Target Off-Block Time) is the time you are fully ready for pushback.
              The initial TOBT you see here is the one extracted from your fight plan on VATSIM.
              Once you "confirm" or "update" your TOBT in the field above, ATC is able to better plan a departure sequence.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Vdgs;
