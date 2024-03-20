import { PieChart } from '@mui/x-charts';
import React, { useEffect, useState } from 'react';
import api from '../../axios/api';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';

const UserMonthAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, []);

  const fetchData = () => {
    setLoading(true);
    api.get('/pie-chart-data')
      .then((res) => {
        const sortedData = res.data.sort((a, b) => a.month.localeCompare(b.month)); // Sort months alphabetically
        setData(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
        // Handle error or show a toast message
      });
  };

  const combineData = () => {
    const combinedMap = new Map(); // Use a Map to track unique labels and their summed values
  
    selectedMonths.forEach((month) => {
      const monthData = data.find((item) => item.month === month);
      if (monthData) {
        monthData.data.forEach((item) => {
          // Check if label already exists in the Map
          if (combinedMap.has(item.label)) {
            // If label exists, update its value by adding the current item's value
            combinedMap.set(item.label, combinedMap.get(item.label) + item.value);
          } else {
            // If label doesn't exist, add it to the Map with its value
            combinedMap.set(item.label, item.value);
          }
        });
      }
    });
  
    // Convert Map entries to an array of objects with id and label properties
    const combined = Array.from(combinedMap).map(([label, value], id) => ({ id, label, value }));
  
    setCombinedData(combined);
  };
  
  
  

  const handleMonthChange = (event) => {
    const { value, checked } = event.target;
    const selectedMonthData = data.find((item) => item.month === value);

    if (checked && selectedMonthData && selectedMonthData.data.length === 0) {
      toast.error(`No data available for ${value}`);
      return;
    }

    setSelectedMonths((prevMonths) =>
      checked ? [...prevMonths, value] : prevMonths.filter((month) => month !== value)
    );
  };

  const renderIndividualPieChart = (month, year) => {
    const filteredData = data.find((item) => item.month === month && item.year === year);
    if (!filteredData) {
      return null;
    }

    return (
      <div key={`${month}-${year}`} className='bg-white shadow-md w-fit rounded p-4'>
        <h2 className='text-lg font-semibold mb-2'>{`${month} ${year}`}</h2>
        <PieChart
          series={[
            {
              data: filteredData.data,
            },
          ]}
          width={350}
          height={200}
        />
        <p className='mt-4'>Number Of Referrals: {filteredData.totalReferrals}</p>
      </div>
    );
  };

  const renderCombinedPieChart = () => {
    if (combinedData.length === 0) {
      return null;
    }
  
    // Calculate the sum of values in combinedData
    const totalReferrals = combinedData.reduce((acc, item) => acc + item.value, 0);
  
    return (
      <div className='bg-white shadow-md w-fit rounded p-4'>
        <h2 className='text-lg font-semibold mb-2'>Combined Pie Chart</h2>
        <PieChart
          series={[
            {
              data: combinedData,
            },
          ]}
          width={350}
          height={200}
        />
        <p className='mt-4'>Number Of Referrals: {totalReferrals}</p>
      </div>
    );
  };
  
  

  useEffect(() => {
    combineData();
  }, [selectedMonths, data]);

  return (
    <div className='container mx-auto p-8'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h1 className='text-2xl font-bold mb-4'>User Referral Analysis</h1>
       <div className='w-full flex items-center'>

       <div className='flex flex-wrap gap-4'>
          {data.map((item) => (
            <label key={item.month} className='flex items-center'>
              <input
                type='checkbox'
                value={item.month}
                checked={selectedMonths.includes(item.month)}
                onChange={handleMonthChange}
                className='mr-2'
              />
              {item.month}
            </label>
          ))}
        </div>
        {renderCombinedPieChart()}
       </div>
          
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2'>
        {selectedMonths.length > 0 ? (
          selectedMonths.map((selectedMonth) => renderIndividualPieChart(selectedMonth, data.find((item) => item.month === selectedMonth)?.year))
        ) : (
          <p className='text-center text-red-500'>No months selected.</p>
        )}

      </div>
      {loading && <Loader />}
    </div>
  );
};

export default UserMonthAnalysis;
