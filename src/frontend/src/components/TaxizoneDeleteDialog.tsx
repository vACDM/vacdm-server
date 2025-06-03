import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';
import { FormEvent, useEffect, useRef, useState } from 'react';
import React from 'react';

import { IAirport, IAirportTaxizone } from '../interfaces/airport.interface';
import AirportService from '../services/AirportService';

type TaxizoneDeleteDialogProps = {
  airport: IAirport | undefined
  taxizone: IAirportTaxizone
  visible: boolean
  onHide():  void
};


const TaxizoneDeleteDialog = (props: TaxizoneDeleteDialogProps) => {

  const toast = useRef<Toast>(null);
  const [taxizone, setTaxizone] = useState<IAirportTaxizone>(props.taxizone);
  const [visible, setVisible] = useState(false);
  const [airport, setAirport] = useState<IAirport | undefined>(props.airport);


  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  useEffect(() => {
    setVisible(props.visible);
    setTaxizone(props.taxizone);

    setAirport(props.airport);

  }, []);

  const deleteTaxizone = async () => {

    const apt = { ...airport };
    const txz = { ...taxizone };

    if (txz && apt.icao) {
      if (apt && apt.taxizones) {
        const index = apt.taxizones.findIndex(element => element._id === txz._id);

        if (index === -1) {

          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
          props.onHide();

        } else {

          apt.taxizones.splice(index, 1);

          await AirportService.updateAirport(apt.icao, apt);
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Zone Deleted', life: 3000 });
          props.onHide();
        }
      }
    }
  };

  const taxizoneDialogFooter = (
    <React.Fragment>
      <div className='flex justify-end gap-2'>
      <Button label="Cancel" size='small' icon="pi pi-times" outlined onClick={props.onHide} />
      <Button label="Delete" size='small' severity='danger' icon="pi pi-check" onClick={deleteTaxizone} />
      </div>
    </React.Fragment>
  );

  return ( <>
  <Dialog
        visible={props.visible}
        style={{ width: '24rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Taxizone Details"
        modal={true}
        className="p-fluid"
        footer={taxizoneDialogFooter}
        onHide={props.onHide}
      >
        <form>
        <div className="grid grid-rows-1 gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="label">{taxizone.label}</label>
          </div>
          </div>
        </form>
        </Dialog>
        <Toast ref={toast} />
  </> );
};

export default TaxizoneDeleteDialog;
