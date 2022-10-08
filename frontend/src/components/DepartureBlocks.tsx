import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DepartureBlocksService from "services/DepartureBlocksService";
import BlockUtils from "../utils/block";
import Loading from "./Loading";

const DepartureBlocks = () => {

  const { icao } = useParams();
  const [loading, setLoading] = useState(true);
  const [basicData, setBasicData] = useState({});

  let basicOptions = {
    animation: false,
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  

  useEffect(() => {
    async function loadData() {
      try {
        const data = await DepartureBlocksService.getAirportBlocks(icao);

        

        const chartData = await departureBlocksToBarFormat(data);

        setBasicData(chartData);
        setLoading(false);
        
      } catch (e) {}
    }

    let intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
  }, []);

  function getBlockNumbers() {
    let blockNumberFromTime = BlockUtils.getBlockFromTime(new Date());
    return [
      blockNumberFromTime,
      blockNumberFromTime + 1,
      blockNumberFromTime + 2,
    ];
  }

  async function departureBlocksToBarFormat(departureBlocks: any) {
      
    let labels: any = getBlockNumbers();

    let datasetArray: any = [];

    for (const key in departureBlocks.rwys) {
      const datasetObject: any = {};
      datasetObject.label = key;
      datasetObject.data = [];

      labels.forEach((entry: any) => {
        console.log('entry', entry);
        
        datasetObject.data.push(departureBlocks.rwys[key][entry].length);
      });

      datasetArray.push(datasetObject);

      console.log("dataset", datasetObject);
    }


    return ({
      labels: labels,
      datasets: datasetArray
    });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Chart type="bar" data={basicData} options={basicOptions}  />
    </>
  );
};

export default DepartureBlocks;
