import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import AirportService from "../services/AirportService";
import { InputTextarea } from "primereact/inputtextarea";

import Airport, { AirportTaxizone } from "@shared/interfaces/airport.interface";

import { Badge } from "primereact/badge";
import { Link, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { RadioButton } from 'primereact/radiobutton';
import { classNames } from "primereact/utils";
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

const AirportDetails = () => {

    
    let emptyZone = {
        _id: null,
        label: '',
        taxizones: [],
        polygon: [],
        taxiout: null
    };




  const { icao } = useParams();
  const dt = useRef(null);
  const toast = useRef(null);
  const [airport, setAirport] = useState<Airport>();
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState(emptyZone);
  const [zoneDialog, setZoneDialog] = useState(false);
  const [deleteZoneDialog, setDeleteZoneDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false);
  //const [expandedRows, setExpandedRows] = useState<any>(null);

  useEffect(() => {
    if (icao)
    AirportService.getAirport(icao).then((data: Airport) => {
      setAirport(data);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const taxioutTemplate = (rowData: any) => {
    return rowData.taxiout ? (
      <Badge value="true" severity="success" />
    ) : (
      <Badge value="false" severity="danger" />
    );
  };

  const saveZone = () => {
/*     setSubmitted(true);

    if (zone?.label.trim()) {
        let _zones = [...zones];
        let _zone = {...zone};
        if (product.id) {
            const index = findIndexById(product.id);

            _products[index] = _product;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Zone Updated', life: 3000 });
        }
        else {
            _product.id = createId();
            _product.image = 'product-placeholder.svg';
            _products.push(_product);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Zone Created', life: 3000 });
        }

        setProducts(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
    } */
}
  
  const editZone = (zone: any) => {
    setZone({...zone});
    setZoneDialog(true);
}


const deleteZone = () => {
/*     let _zones = zones.filter(val => val.id !== zone?._id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 }); */
}

  const confirmDeleteZone = (zone: any) => {
    setZone(zone);
    setDeleteZoneDialog(true);
}
  const actionBodyTemplate = (rowData: AirportTaxizone) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editZone(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteZone(rowData)} />
        </React.Fragment>
    );
}

const hideDialog = () => {
    setSubmitted(false);
    setZoneDialog(false);
}

const hideDeleteZoneDialog = () => {
    setDeleteZoneDialog(false);
}


const onInputChange = (e: any, label: any) => {
   const val = (e.target && e.target.value) || '';
    let _zone = {...zone};
    _zone.label = val;

    setZone(_zone);
}

const onCategoryChange = (e: any) => {
    let _zone = {...zone};
    _zone['taxiout'] = e.value;
    setZone(_zone);
}

const zoneDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveZone} />
    </React.Fragment>
);

const deleteZoneDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteZoneDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteZone} />
    </React.Fragment>
);


const leftTaxizonesToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="New" icon="pi pi-plus" className="p-button-success mr-2"  disabled/>
        </React.Fragment>
    )
}

const leftCapacitiesToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" disabled />
        </React.Fragment>
    )
}

  return (
    <>
    <Toast ref={toast} />
    <div className="grid">
      <div className="lg:col-6 col">
        <Card>
        <Toolbar className="mb-4" left={leftTaxizonesToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={airport?.taxizones}
                    dataKey="_id"
                    header='Airport Taxizones' responsiveLayout="scroll">
                    <Column field="label" header="Zonename" />
                    <Column
                field="polygon"
                header="Polygon"
                body={(rowData) => <InputTextarea value={rowData.polygon} autoResize />}
              />
              <Column field="taxiout" header="Taxiout" body={taxioutTemplate}/>
                    
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
        </Card>
      </div>
      <div className="lg:col-6 col"><Card>
      <Toolbar className="mb-4" left={leftCapacitiesToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={airport?.capacities}
                    dataKey="_id"
                    header='Airport Capacities' responsiveLayout="scroll">
                    <Column field="rwy_designator" header="RWY" />
                    <Column
                field="capacity"
                header="Capacity"
              />
              <Column field="alias" header="Alias" />
                    
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
        </Card></div>
    </div>

<Dialog visible={zoneDialog} style={{ width: '450px' }} header="Zone Details" modal className="p-fluid" footer={zoneDialogFooter} onHide={hideDialog}>
<div className="field">
    <label htmlFor="label">Label</label>
    <InputText id="label" value={zone?.label} onChange={(e) => onInputChange(e, 'label')} required autoFocus className={classNames({ 'p-invalid': submitted && !zone?.label })} />
    {submitted && !zone?.label && <small className="p-error">Label is required.</small>}
</div>
<div className="field">
    <label htmlFor="polygon">Polygon</label>
    <InputTextarea id="polygon" value={zone?.polygon}  required rows={3} cols={20} />
</div>

<div className="field">
    <label className="mb-3">Taxiout</label>
    <div className="formgrid grid">
        <div className="field-radiobutton col-6">
            <RadioButton inputId="taxiout1" name="taxiout" value={true} onChange={onCategoryChange} checked={zone?.taxiout === true} />
            <label htmlFor="taxiout1">True</label>
        </div>
        <div className="field-radiobutton col-6">
            <RadioButton inputId="taxiout2" name="taxiout" value={false} onChange={onCategoryChange} checked={zone?.taxiout === false} />
            <label htmlFor="taxiout2">False</label>
        </div>
    </div>
</div>

</Dialog>

<Dialog visible={deleteZoneDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteZoneDialogFooter} onHide={hideDeleteZoneDialog}>
<div className="confirmation-content">
    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
    {zone && <span>Are you sure you want to delete <b>{zone.label}</b>?</span>}
</div>
</Dialog>

</>
  );
};

export default AirportDetails;

