import dayjs from 'dayjs';
import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DepartureBlocksService from '../services/DepartureBlocksService';
import blockUtils from '../utils/block.utils';

import Loading from './Loading';

const DepartureBlocks = () => {
  const { icao } = useParams();
  const [loading, setLoading] = useState(true);
  const [basicData, setBasicData] = useState({});

  const basicOptions = {
    animation: false,
    maintainAspectRatio: false,
    aspectRatio: 0.8,

    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
    },
  };

  function getBlockNumbers() {
    const blockNumberFromTime = blockUtils.getBlockFromTime(new Date());
    return [
      blockUtils.getTimeFromBlock(blockNumberFromTime),
      blockUtils.getTimeFromBlock(blockNumberFromTime + 1),
      blockUtils.getTimeFromBlock(blockNumberFromTime + 2),
    ];
  }

  async function departureBlocksToBarFormat(departureBlocks: any) {
    const labels: any = getBlockNumbers();



    const datasetArray: any = [];
    const niceLabels: any = [];

    for (const key in departureBlocks.rwys) {
      const datasetObject: any = {};
      datasetObject.label = key;
      datasetObject.data = [];

      labels.forEach((entry: any) => {
        console.log('entry', entry);



        datasetObject.data.push(departureBlocks.rwys[key][blockUtils.getBlockFromTime(entry)].length);
      });


      datasetArray.push(datasetObject);

      console.log('dataset', datasetObject);

    }

    labels.forEach((entry: any) => {
      niceLabels.push(dayjs(entry).utc().format('HH:mmz'));
    });

    return {
      labels: niceLabels,
      datasets: datasetArray,
    };
  }

  useEffect(() => {
    async function loadData() {
      try {
        const data = await DepartureBlocksService.getAirportBlocks(icao);

        const chartData = await departureBlocksToBarFormat(data);

        setBasicData(chartData);
        setLoading(false);

      } catch (e) {
        // disregard :)
      }
    }

    const intervalId = setInterval(loadData, 5000);

    loadData();

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Chart type="bar" data={basicData} options={basicOptions} />
    </>
  );
};

export default DepartureBlocks;
