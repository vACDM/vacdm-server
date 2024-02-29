import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable/';;
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';

import TaxizoneDeleteDialog from '../components/TaxizoneDeleteDialog';
import TaxizoneDialog from '../components/TaxizoneDialog';
import RunwayCapacityDialog from '../components/RunwayCapacityDialog';
import {
  IAirport,
  IAirportCapacity,
  IAirportTaxizone,
} from '../interfaces/airport.interface';
import AirportService from '../services/AirportService';

const AirpotDetailsTable = () => {
  const emptyTaxizone: IAirportTaxizone = {
    _id: null,
    label: '',
    polygon: [],
    taxiout: false,
    taxitimes: [],
  };

  const emptyCapacity: IAirportCapacity = {
    _id: null,
    rwy_designator: '',
    capacity: 0,
    alias: ''
  };

  const { icao } = useParams();
  const toast = useRef<Toast>(null);
  const [taxizoneDialog, setTaxizoneDialog] = useState(false);
  const [rwyCapacityDialog, setRwyCapacityDialog] = useState(false);
  const [deleteTaxizoneDialog, setDeleteTaxizoneDialog] = useState(false);
  const [deleteRwyCapacityDialog, setDeleteRwyCapacityDialog] = useState(false);
  const [airport, setAirport] = useState<IAirport>();
  const [taxizone, setTaxizone] = useState<IAirportTaxizone>(emptyTaxizone);
  const [rwyCapacity, setRwyCapacity] = useState<IAirportCapacity>(emptyCapacity);
  const [loading, setLoading] = useState(true);
  

  async function fetchAirport() {
    if (icao) {
      AirportService.getAirport(icao).then((data) => {
        if (data) {
          setAirport(data);
          setLoading(false);
        }
      },
      );
    }
  }
  
  useEffect(() => { 
    fetchAirport();   
  }, []);

  

  const openNewTaxizone = () => {
    setTaxizone(emptyTaxizone);
    setTaxizoneDialog(true);
  };

  const openNewCapacity = () => {
    setRwyCapacity(emptyCapacity);
    setRwyCapacityDialog(true);
  };


  const hideTaxizoneDialog = () => {
    setTaxizoneDialog(false);
    setDeleteTaxizoneDialog(false);
  };

  const hideCapacityDialog = () => {
    setRwyCapacityDialog(false);
    setDeleteRwyCapacityDialog(false);
  };


  const confirmDeleteTaxizone = (_taxizone) => {
    setTaxizone(_taxizone);
    setDeleteTaxizoneDialog(true);
  };

  const confirmDeleteCapacity = (_capacity) => {
    setRwyCapacity(_capacity);
    setDeleteTaxizoneDialog(true);
  };


  const header = (

    <div className="flex flex-wrap items-center gap-2 align-items-center justify-content-between">
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        size="small"
        onClick={openNewTaxizone}
      />

      <h4 className="m-0">Edit Taxizones</h4>
    </div>
  );

  const capacityHeader = (
    <div className="flex flex-wrap items-center gap-2 align-items-center justify-content-between">
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        size="small"
        onClick={openNewCapacity}
      />

      <h4 className="m-0">Edit Capacities</h4>
    </div>
  );

  const actionBodyTaxizoneTemplate = (rowData: IAirportTaxizone) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="mr-2"
          severity="warning"
          size="small"
          onClick={() => {
            setTaxizone(rowData);
            setTaxizoneDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          onClick={() => confirmDeleteTaxizone(rowData)}
        />
      </React.Fragment>
    );
  };

  const actionBodyCapacityTemplate = (rowData: IAirportCapacity) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="mr-2"
          severity="warning"
          size="small"
          onClick={() => {
            setRwyCapacity(rowData);
            setRwyCapacityDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          onClick={() => confirmDeleteCapacity(rowData)}
        />
      </React.Fragment>
    );
  };



  return (
    <>
      <div className="container mx-auto">
        <Card>
          Airport Config for: {icao}
        </Card>
      </div>
      <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-2">
        <Card>
          <div>
            <DataTable
            loading={loading}
              size="small"
              value={airport?.taxizones}
              dataKey="_id"
              header={header}
            >
              <Column field="label" header="Label"></Column>
              <Column field="taxiout" header="Taxiout"></Column>

              <Column header="Admin" body={actionBodyTaxizoneTemplate}></Column>
            </DataTable>
          </div>
        </Card>
        <div>
          <Card>
            <div>
              <DataTable
              loading={loading}
                size="small"
                value={airport?.capacities}
                dataKey="_id"
                header={capacityHeader}
              >
                <Column field="rwy_designator" header="Runway"></Column>
                <Column field="capacity" header="Capacity"></Column>
                <Column field="alias" header="Alias"></Column>
                <Column header="Admin" body={actionBodyCapacityTemplate}></Column>
              </DataTable>
            </div>
          </Card>
          <div className="pt-4">
            <Card>
              <p className="text-lg">Airport Profiles</p>
              <div className="flex items-center flex-row  gap-2 pt-2">
                <Dropdown
                  value={'Profile1'}
                  options={[{ name: 'Profile1' }]}
                  optionLabel="name"
                  placeholder="Select a Profile"
                  className="w-full md:w-14rem"
                />
                <Button label="Load" size='small' severity="success"></Button>
                <span>Current active Profile:</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      
      <TaxizoneDialog        
      airport={airport} taxizone={taxizone} visible={taxizoneDialog} onHide={hideTaxizoneDialog} />
      
      <RunwayCapacityDialog airport={airport} capacity={rwyCapacity} visible={rwyCapacityDialog} onHide={hideCapacityDialog} />

      <TaxizoneDeleteDialog airport={airport} taxizone={taxizone} visible={deleteTaxizoneDialog} onHide={hideTaxizoneDialog} />

    </>
  );
};

export default AirpotDetailsTable;
