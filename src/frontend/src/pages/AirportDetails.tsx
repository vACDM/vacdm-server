import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable/';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useState, useEffect, useContext, useRef } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';

import TaxizoneDeleteDialog from '../components/TaxizoneDeleteDialog';
import TaxizoneForm from '../components/TaxizoneDialog';
import TaxizoneDialog from '../components/TaxizoneDialog';
import DarkModeContext from '../contexts/DarkModeProvider';
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

  const { icao } = useParams();
  const toast = useRef<Toast>(null);
  const [taxizoneDialog, setTaxizoneDialog] = useState(false);
  const [deleteTaxizoneDialog, setDeleteTaxizoneDialog] = useState(false);
  const [deleteTaxizonesDialog, setDeleteTaxizonesDialog] = useState(false);
  const [airport, setAirport] = useState<IAirport>();
  const [selectedTaxizones, setSelectedTaxizones] = useState<
  IAirportTaxizone[]
  >([]);
  const [selectedCapacities, setSelectedCapacities] = useState<
  IAirportCapacity[]
  >([]);
  const [taxizone, setTaxizone] = useState<IAirportTaxizone>(emptyTaxizone);
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
    //setLoading(true);  
    fetchAirport();   
  }, []);

  

  const openNew = () => {
    setTaxizone(emptyTaxizone);
    setTaxizoneDialog(true);
  };


  const hideDialog = () => {
    setTaxizoneDialog(false);
    setDeleteTaxizoneDialog(false);
    setDeleteTaxizonesDialog(false);
    //fetchAirport();
  };


  const confirmDeleteTaxizone = (_taxizone) => {
    setTaxizone(_taxizone);
    setDeleteTaxizoneDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteTaxizonesDialog(true);
  };


  const header = (

    <div className="flex flex-wrap items-center gap-2 align-items-center justify-content-between">
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        size="small"
        onClick={openNew}
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
        onClick={openNew}
      />

      <h4 className="m-0">Edit Capacities</h4>
    </div>
  );

  const actionBodyTemplate = (rowData: IAirportTaxizone) => {
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
              
              onSelectionChange={(e) => {
                if (Array.isArray(e.value)) {
                  setSelectedTaxizones(e.value);
                }
              }}
              dataKey="_id"
              header={header}
            >
              <Column field="label" header="Label"></Column>
              <Column field="taxiout" header="Taxiout"></Column>

              <Column header="Admin" body={actionBodyTemplate}></Column>
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
                selection={selectedCapacities}
                selectionMode={'checkbox'}
                onSelectionChange={(e) => {
                  if (Array.isArray(e.value)) {
                    setSelectedCapacities(e.value);
                  }
                }}
                dataKey="_id"
                header={capacityHeader}
              >
                <Column field="rwy_designator" header="Runway"></Column>
                <Column field="capacity" header="Capacity"></Column>
                <Column field="alias" header="Alias"></Column>
                <Column header="Admin" body={actionBodyTemplate}></Column>
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
      airport={airport} taxizone={taxizone} visible={taxizoneDialog} onHide={hideDialog} />
      

      <TaxizoneDeleteDialog airport={airport} taxizone={taxizone} visible={deleteTaxizoneDialog} onHide={hideDialog} />

    </>
  );
};

export default AirpotDetailsTable;
