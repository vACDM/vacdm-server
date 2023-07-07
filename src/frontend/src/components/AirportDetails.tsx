
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import AirportService from '../services/AirportService';

import Airport, { AirportTaxizone } from '@/shared/interfaces/airport.interface';

const AirportDetails = () => {
  const emptyZone = {
    label: '',
    polygon: [],
    taxiout: null,
  };

  const { icao } = useParams();
  const dt = useRef(null);
  const toast = useRef(null);
  const [airport, setAirport] = useState<Airport>();
  const [zones, setZones] = useState<AirportTaxizone[]>([]);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState<any>();
  const [zoneDialog, setZoneDialog] = useState(false);
  const [selectedZones, setSelectedZones] = useState(null);
  const [deleteZoneDialog, setDeleteZoneDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState('');
  const [globalFilter, setGlobalFilter] = useState(null);
  //const [expandedRows, setExpandedRows] = useState<any>(null);

  useEffect(() => {
    if (icao)
      AirportService.getAirport(icao).then((data: Airport) => {
        setAirport(data);
        setZones(data.taxizones);
        setLoading(false);
      });
  }, []);

  const taxioutTemplate = (rowData: any) => {
    return rowData.taxiout ? (
      <Badge value="true" severity="success" />
    ) : (
      <Badge value="false" severity="danger" />
    );
  };

  const saveZone = () => {
    /* setSubmitted(true);

    if (zone?.label.trim()) {
        let _zones = [...zones];
        let _zone = {...zone};
        if (zone.label) {
            const index = findIndexByLabel(zone.label);

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
    }; */
  };

  const editZone = (relevantZone: any) => {
    setZone({ ...relevantZone });
    setZoneDialog(true);
  };

  const deleteZone = () => {
    /*     let _zones = zones.filter(val => val.id !== zone?._id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 }); */
  };

  const confirmDeleteZone = (relevantZone: any) => {
    setZone(relevantZone);
    setDeleteZoneDialog(true);
  };
  const actionBodyTemplate = (rowData: AirportTaxizone) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editZone(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteZone(rowData)}
        />
      </React.Fragment>
    );
  };

  const hideDialog = () => {
    setSubmitted(false);
    setZoneDialog(false);
  };

  const hideDeleteZoneDialog = () => {
    setDeleteZoneDialog(false);
  };

  const onLabelInputChange = (e) => {
    const relevantZone = { ...zone };
    relevantZone.label = e.value;

    setZone(relevantZone);
  };

  const onPolygonInputChange = (e) => {
    const relevantZone = { ...zone };
    relevantZone.polygon = e.value;

    setZone(relevantZone);
    console.log(relevantZone);
  };

  const onCategoryChange = (e) => {
    const relevantZone = { ...zone };
    relevantZone.taxiout = e.value;
    setZone(relevantZone);
  };

  const polygonFormatter = (polygon: string) => {
    const formattedPolygon = polygon.split(',');
    return formattedPolygon;
  };

  const zoneDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveZone}
      />
    </React.Fragment>
  );

  const deleteZoneDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteZoneDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteZone}
      />
    </React.Fragment>
  );

  const leftTaxizonesToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          disabled
        />
      </React.Fragment>
    );
  };

  const leftCapacitiesToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          disabled
        />
      </React.Fragment>
    );
  };

  const polygonTemplate = (rowData: AirportTaxizone) => {
    const niceText = rowData.polygon.join('\n');
    return (
      <InputTextarea value={niceText} cols={22} rows={5} autoResize disabled />
    );
  };

  const textEditor = (options: any) => {
    return (
      <InputTextarea
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        cols={22}
        rows={5}
        autoResize
      />
    );
  };

  const labelEditor = (options: any) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const onRowEditComplete = (e: any) => {
    const relevantZones: AirportTaxizone[] = [...zones];
    const { newData, index } = e;

    relevantZones[index] = newData;

    setZones(relevantZones);
  };

  const statuses = [
    { label: 'True', value: true },
    { label: 'False', value: false },
  ];

  const taxioutEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.label.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  };

  const header = (
    <div className="table-header">
      <h2 className="mx-0 my-1">Manage Taxizones</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e: any) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <>
      <div className="datatable">
        <Toast ref={toast} />
        <div className="grid">
          <div className="col-12">
            <Card>
              <Toolbar
                className="mb-4"
                left={leftTaxizonesToolbarTemplate}
              ></Toolbar>
              <DataTable
                ref={dt}
                value={zones}
                dataKey="_id"
                header={header}
                responsiveLayout="scroll"
                selection={selectedZones}
                onSelectionChange={(e) => setSelectedZones(e.value)}
                globalFilter={globalFilter}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3rem' }}
                  exportable={false}
                ></Column>
                <Column field="label" header="Zonename" />
                <Column
                  field="polygon"
                  header="Polygon"
                  body={polygonTemplate}
                />
                <Column
                  field="taxiout"
                  header="Taxiout"
                  body={taxioutTemplate}
                />
                <Column
                  body={actionBodyTemplate}
                  exportable={false}
                  style={{ minWidth: '8rem' }}
                ></Column>
              </DataTable>
            </Card>
          </div>
          <div className="col">
            <Card>
              <Toolbar
                className="mb-4"
                left={leftCapacitiesToolbarTemplate}
              ></Toolbar>
              <DataTable
                ref={dt}
                value={airport?.capacities}
                dataKey="_id"
                header="Airport Capacities"
                responsiveLayout="scroll"
                editMode="row"
              >
                <Column field="rwy_designator" header="RWY" />
                <Column field="capacity" header="Capacity" />
                <Column field="alias" header="Alias" />
                <Column
                  rowEditor
                  headerStyle={{ width: '10%', minWidth: '8rem' }}
                  bodyStyle={{ textAlign: 'center' }}
                />
              </DataTable>
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        visible={zoneDialog}
        style={{ width: '450px' }}
        header="Zone Details"
        modal
        className="p-fluid"
        footer={zoneDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="label">Label</label>
          <InputText
            id="label"
            value={zone?.label}
            onChange={(e) => onLabelInputChange(e)}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !zone?.label })}
          />
          {submitted && !zone?.label && (
            <small className="p-error">Label is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="polygon">Polygon</label>
          <InputTextarea
            id="polygon"
            value={zone?.polygon}
            onChange={(e) => onPolygonInputChange(e)}
            required
            rows={3}
            cols={20}
          />
        </div>

        <div className="field">
          <label className="mb-3">Taxiout</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="taxiout1"
                name="taxiout"
                value={true}
                onChange={onCategoryChange}
                checked={zone?.taxiout === true}
              />
              <label htmlFor="taxiout1">True</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="taxiout2"
                name="taxiout"
                value={false}
                onChange={onCategoryChange}
                checked={zone?.taxiout === false}
              />
              <label htmlFor="taxiout2">False</label>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteZoneDialog}
        style={{ width: '450px' }}
        header="Confirm"
        modal
        footer={deleteZoneDialogFooter}
        onHide={hideDeleteZoneDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {zone && (
            <span>
              Are you sure you want to delete <b>{zone.label}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default AirportDetails;
