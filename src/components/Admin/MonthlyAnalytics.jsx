import React, { useState, useEffect } from 'react';

import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import api from '../../axios/api';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

const BarGraph = () => {

  const navigate = useNavigate()

  const [dataset, setData] = useState([]);
   console.log(dataset);
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
  



  useEffect(() => {


    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.role === "admin") {
      return navigate("/login");
    }

    const months = ['Jan', 'Fev', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

   
    api.get('/analytics/monthly', {
      headers:{
        Authorization :`Berear ${user && user.access_token}`
      }
    })
      .then(response => {
        const dataset = months.map((month, index) => ({
            month: month,
            totalreference: 0
          }));

          response.data.monthlyAnalytics.forEach(item => {
            const monthIndex = item._id.month - 1; 
            dataset[monthIndex].totalreference = item.totalReferrals;
          });

        setData(dataset);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  

  return (
   <div className='w-full flex items-center justify-center'>
    {
        dataset.length ?  <BarChart
        dataset={ dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
       series={[
    { dataKey: 'totalreference', label: 'Referrals' },
    ]}
        {...chartSetting}
      /> : <Loader/>
    }
   </div>
  );
};

export default BarGraph;
