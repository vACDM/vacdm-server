import React, { useState, useEffect, useRef } from "react";
import AirportService from "../services/AirportService";

import Airport from "@shared/interfaces/airport.interface";

import { useParams } from "react-router-dom";
import { Button } from "primereact/button";

import Editor from "react-simple-code-editor";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

hljs.registerLanguage("json", json);

const AirportDetailsEditor = () => {
  const { icao } = useParams();
  const toast = useRef<Toast>(null);
  const [airport, setAirport] = useState<Airport>();
  const [airportJson, setAirportJson] = useState<string>("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (icao)
      AirportService.getAirport(icao)
        .then((data: Airport) => {
          setAirport(data);

          const obj = JSON.parse(JSON.stringify(data));

          delete obj._id;
          delete obj.__v;
          delete obj.createdAt;
          delete obj.updatedAt;

          obj.taxizones.map((taxizone: any) => {
            delete taxizone._id;

            taxizone.taxitimes.map((taxitime: any) => {
              delete taxitime._id;

              return taxitime;
            });

            return taxizone;
          });

          obj.capacities.map((capacity: any) => {
            delete capacity._id;

            return capacity;
          });

          setAirportJson(JSON.stringify(obj, undefined, 2));
          setLoading(false);
        })
        .catch(() => {
          toast?.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Airport is not defined. Please create one!",
            sticky: true,
          });
        });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveAirport = () => {
    try {
      JSON.parse(airportJson);
    } catch (e) {
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Upsi! No valid JSON",
        life: 3000,
      });
      throw e;
    }
    setLoading(true);
    if (airport) {
      if (icao)
        AirportService.updateAirport(icao, JSON.parse(airportJson))
          .then(() => {
            toast?.current?.show({
              severity: "success",
              summary: "Successful",
              detail: "Airport Updated",
              life: 3000,
            });
            setLoading(false);
          })
          .catch(() => {
            toast?.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Upsi",
              life: 3000,
            });
            setLoading(false);
          });
    } else {
      AirportService.createAirport(JSON.parse(airportJson))
        .then(() => {
          toast?.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "Airport created",
            life: 3000,
          });
          setLoading(false);
        })
        .catch(() => {
          toast?.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Upsi",
            life: 3000,
          });
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Button label="Save" onClick={(e) => saveAirport()} loading={loading} />
      <Card>
        <Editor
          value={airportJson}
          onValueChange={(code) => setAirportJson(code)}
          highlight={(code) => hljs.highlight(code, { language: "json" }).value}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
      </Card>
    </>
  );
};

export default AirportDetailsEditor;
