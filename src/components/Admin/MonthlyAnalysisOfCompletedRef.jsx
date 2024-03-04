import React, { useState, useEffect } from 'react';

import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import api from '../../axios/api';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

const MonthlyAnalysisOfCompletedRef = () => {
  const [loader , setLoader] = useState(false)

  const navigate = useNavigate()

  const [dataset, setData] = useState([]);
  const chartSetting = {
    yAxis: [
      {
        label: 'month analysis',
      },
    ],
    width: 800,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
  };

  //   const dataset = [
  //     {
  //      totalreference : 1,
  //       month: 'Jan',
  //     },
  //     {
  //        totalreference : 0,
  //       month: 'Fev',
  //     },
  //     {
  //        totalreference : 5,
  //       month: 'Mar',
  //     },
  //     {
  //        totalreference : 7,
  //       month: 'Apr',
  //     },
  //     {
  //         totalreference : 2,
  //       month: 'May',
  //     },
  //     {
  //         totalreference : 6,
  //       month: 'June',
  //     },
  //     {
  //         totalreference : 8,
  //       month: 'July',
  //     },
  //     {
  //         totalreference : 19,
  //       month: 'Aug',
  //     },
  //     {
  //        totalreference : 6,
  //       month: 'Sept',
  //     },
  //     {
  //        totalreference : 8,
  //       month: 'Oct',
  //     },
  //     {
  //         totalreference : 9,
  //       month: 'Nov',
  //     },
  //     {
  //         totalreference : 4,
  //       month: 'Dec',
  //     },
  //   ];


  useEffect(() => {

    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.role === "admin") {
      return navigate("/login");
    }

    api.get('/complete-analytics/monthly',{
      headers:{
        Authorization :`Berear ${user && user.access_token}`
      }
    })
      .then(response => {

        setData(response.data.formattedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);



  return (
    <div className='w-full flex items-center justify-center'>
      {
        dataset.length ? <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[
            { dataKey: 'totalreference', label: 'Completed Referrals' },
          ]}
          {...chartSetting}
        /> : <Loader/>
      }
    </div>
  );
};

export default MonthlyAnalysisOfCompletedRef;
