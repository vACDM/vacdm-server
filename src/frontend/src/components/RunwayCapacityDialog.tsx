import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { FormEvent, useEffect, useRef, useState } from 'react';
import React from 'react';

import { IAirport, IAirportCapacity } from '../interfaces/airport.interface';
import AirportService from '../services/AirportService';

type RunwayCapacityDialogProps = {
  airport: IAirport | undefined
  capacity: IAirportCapacity
  visible: boolean
  onHide():  void
};


const RunwayCapacityDialog = (props: RunwayCapacityDialogProps) => {

  const toast = useRef<Toast>(null);
  const [rwyCapacity, setRwyCapacity] = useState<IAirportCapacity>(props.capacity);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    //setVisible(props.visible);
    setRwyCapacity(props.capacity);

    //setAirport(props.airport);

  }, [props.visible]);

  const saveCapacity = async () => {
    setSubmitted(true);

    if (rwyCapacity?.rwy_designator.trim()) {

      const apt = { ...props.airport };
      const capa = { ...rwyCapacity };

      if (capa && apt.icao) {
        if (apt && apt.capacities) {
          const index = apt.capacities.findIndex(element => element._id === capa._id);

          if (index !== -1) {
            apt.capacities[index] = capa;

            await AirportService.updateAirport(apt.icao, apt)
              .then(() =>{
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Capacity Updated', life: 3000 });
              })
              .catch((reason) => {
                toast.current?.show({ severity: 'error', summary: 'Successful', detail: reason, life: 3000 });
              });
            props.onHide();


          } else {

            apt.capacities.push(capa);
            await AirportService.updateAirport(apt.icao, apt)
              .then(() =>{
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Capacity Updated', life: 3000 });
              })
              .catch((reason) => {
                toast.current?.show({ severity: 'error', summary: 'Successful', detail: reason, life: 3000 });
              });
            props.onHide();
          }
        }
      }
    }
  };

  return ( <>
  <Dialog
        visible={props.visible}
        modal={true}
        position='top'
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Edit Capacity'
        className="p-fluid"
        onHide={props.onHide}

      >
        <form>
        <div className="grid grid-cols-2 gap-6">
          <div className='flex flex-col gap-3'>
          <div className="flex flex-col gap-1">
            <label htmlFor="rwy_designator">Rwy designator</label>
            <InputText
              id='rwy_designator'
              name='rwy_designator'
              value={rwyCapacity?.rwy_designator}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRwyCapacity({ ...rwyCapacity, rwy_designator: e.target.value });
              }}
              required
              autoFocus
            />
            {submitted && !rwyCapacity?.rwy_designator && <small className="text-red-500">Runway designator is required.</small>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="capacity">Capacity <span className='text-xs'>(Departure rate per 10 minutes)</span></label>
            <InputNumber
              id='capacity'
              name='capacity'
              value={rwyCapacity?.capacity}
              onValueChange={(e: InputNumberValueChangeEvent) => setRwyCapacity({ ...rwyCapacity, capacity: e.value ?? 0 })}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="alias">Alias</label>
            <InputText
              id='alias'
              name='alias'
              value={rwyCapacity?.alias}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRwyCapacity({ ...rwyCapacity, alias: e.target.value });
              }}
              autoFocus
            />
          </div>

          </div>

        </div>
        <div className='flex justify-end gap-2 pt-4'>
      <Button label="Cancel" size="small" icon="pi pi-times" outlined onClick={props.onHide} />
      <Button label="Save" size="small" icon="pi pi-check" severity='success' onClick={saveCapacity} />
      </div>
        </form>
        </Dialog>
        <Toast ref={toast} />
  </> );
};

export default RunwayCapacityDialog;
