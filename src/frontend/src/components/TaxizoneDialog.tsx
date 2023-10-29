import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';
import { FormEvent, useEffect, useRef, useState } from 'react';
import React from 'react';

import { IAirport, IAirportTaxizone } from '../interfaces/airport.interface';
import AirportService from '../services/AirportService';

type TaxizoneDialogProps = {
  airport: IAirport | undefined
  taxizone: IAirportTaxizone
  visible: boolean
  onHide():  void 
};


const TaxizoneDialog = (props: TaxizoneDialogProps) => {

  const toast = useRef<Toast>(null);
  const [taxizone, setTaxizone] = useState<IAirportTaxizone>(props.taxizone);
  //const [airport, setAirport] = useState<IAirport | undefined>();
  const [submitted, setSubmitted] = useState(false);


  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  useEffect(() => {
    //setVisible(props.visible);
    setTaxizone(props.taxizone);
    
    //setAirport(props.airport);

  }, [props.visible]);

  const saveTaxizone = async () => {
    setSubmitted(true);

    if (taxizone?.label.trim()) {

      const apt = { ...props.airport };
      const txz = { ...taxizone };

      if (txz && apt.icao) {
        if (apt && apt.taxizones) {
          const index = apt.taxizones.findIndex(element => element._id === txz._id);

          if (index !== -1) {
            apt.taxizones[index] = txz;

            await AirportService.updateAirport(apt.icao, apt);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Zone Updated', life: 3000 });
            props.onHide();


          } else {

            apt.taxizones.push(txz);
            await AirportService.updateAirport(apt.icao, apt);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Zone Created', life: 3000 });
            props.onHide();
          }
        }
      }
    }
  };

  function deleteTaxitime(index: number) {
    const newTxz = { ...taxizone };
    newTxz.taxitimes.splice(index, 1);

    setTaxizone(newTxz);

  }

  function taxitimeTemplate(rowData, rowIndex: number) {
    return (<InputText className='w-[4rem]' value={rowData.rwy_designator} 
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {        
      const newTxz = { ...taxizone };
      newTxz.taxitimes.map((c, i) => {
        if (i === rowIndex) {
          c.rwy_designator = e.target.value.toUpperCase();
          return c;
        } else {
          return c;
        }
      });
      setTaxizone(newTxz);
    }}/>); 
  }

  function taxitimeMinutesTemplate(rowData, rowIndex: number) {
    return (<InputText className='w-[4rem]' keyfilter="int" value={rowData.minutes} 
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {        
      const newTxz = { ...taxizone };
      newTxz.taxitimes.map((c, i) => {
        if (i === rowIndex) {
          c.minutes = Number(e.target.value);
          return c;
        } else {
          return c;
        }
      });
      setTaxizone(newTxz);
    }}/>); 
  } 
  
  const taxitimesHeader = (
    <div className="flex flex-wrap items-center gap-2 align-items-center justify-content-between">
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        size="small"
        onClick={() => {
          taxizone.taxitimes.push({ _id: null, rwy_designator: '', minutes: 0 });
          setTaxizone({ ...taxizone });
        }} 
      />

      <h4 className="m-0">Edit Taxitimes</h4>
    </div>
  );

  return ( <>
  <Dialog
        visible={props.visible}
        modal={true}
        position='top'
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Edit Taxizone'
        className="p-fluid"
        onHide={props.onHide}
       
      >
        <form onSubmit={submitForm}>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          <div className='flex flex-col gap-3'>
          <div className="flex flex-col gap-1">
            <label htmlFor="label">Label</label>
            <InputText
              id='label'
              name='label'
              value={taxizone?.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTaxizone({ ...taxizone, label: e.target.value });
              }}
              required
              autoFocus
            />
            {submitted && !taxizone?.label && <small className="text-red-500">Name is required.</small>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="polygon">Polygon <span className='text-xs'>(one coordinate per line)</span></label>
            <InputTextarea
              id="polygon"
              value={taxizone.polygon.join('\n')}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const polygonValue = e.target.value.split('\n');
                setTaxizone({ ...taxizone, polygon: polygonValue });
              }}
              required
              rows={5}
              cols={22}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="taxiout">Is Taxiout?</label>

              <SelectButton
                id='taxiout'
                value={taxizone.taxiout ? 'Yes' : 'No'}
                options={['Yes', 'No']}
                onChange={(e: SelectButtonChangeEvent) => {
                  const taxioutValue = (e.value === 'Yes') ? true : false;
                  setTaxizone({ ...taxizone, taxiout: taxioutValue });
                }}
              />

          </div>
          </div>
          <div className='flex flex-col gap-3'>
            <DataTable
            value={taxizone.taxitimes}
            key='_id'
            header={taxitimesHeader}
            
            >
              <Column  header='Runway' body={(rowData, { rowIndex }) => taxitimeTemplate(rowData, rowIndex)} />
              <Column header='Minutes' body={(rowData, { rowIndex }) => taxitimeMinutesTemplate(rowData, rowIndex)} />
              <Column header='Admin' body={(rowData, { rowIndex }) => <Button className='w-[4rem]' size='small' label='Delete' severity='danger' onClick={() => deleteTaxitime(rowIndex)} />} />

            </DataTable>
          </div>
        </div>
        <div className='flex justify-end gap-2 pt-4'>
      <Button label="Cancel" size="small" icon="pi pi-times" outlined onClick={props.onHide} />
      <Button label="Save" size="small" icon="pi pi-check" severity='success' onClick={saveTaxizone} />
      </div>
        </form>
        </Dialog>
        <Toast ref={toast} />
  </> );
};
 
export default TaxizoneDialog;
