import React, { useState, useContext, useEffect, use } from 'react'
import {useUserAuth} from '../../hooks/useUserAuth'
import {UserContext} from '../../context/userContext'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import {API_PATHS} from '../../utils/apiPaths.js'
import moment from 'moment'
import {addThousandsSeparator} from '../../utils/helper'
import InfoCard from '../../components/Cards/InfoCard'
import TaskListTable from '../../components/layouts/TaskListTable'
import {LuArrowRight} from 'react-icons/lu'
import CustomPieChart from '../../components/Charts/CustomPieChart'

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"]

const Dashboard = () => {
  useUserAuth();
  const {user} = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);


  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: 'Pending', count: taskDistribution?.Pending || 0 },
      { status: 'In Progress', count: taskDistribution?.InProgress || 0 },
      { status: 'Completed', count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: 'High', count: taskPriorityLevels?.High || 0 },
      { priority: 'Medium', count: taskPriorityLevels?.Medium || 0 },
      { priority: 'Low', count: taskPriorityLevels?.Low || 0 },
    ];

    setBarChartData(PriorityLevelData);

  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data){
        setDashboardData(response.data);
        prepareChartData(response.data?.charts ||null);
      }
    }
    catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const onSeeMore = () => {
    navigate('/admin/tasks')
  }

  useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='card my-5'>
        <div>
          <div className='col-span-3'>
            <h2 className='text-xl md:text-2xl'>Good Morning! {user?.name}</h2>
            <p className='text=xs md:text-[13px] text-gray-400 mt-1.5'>
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5 '>
          <InfoCard 
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color = "bg-primary"
          />  
          <InfoCard 
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color = "bg-violet-500"
          />  
          <InfoCard 
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color = "bg-cyan-500"
          /> 
          <InfoCard 
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color = "bg-lime-500"
          /> 
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gaps-6 my-4 md:my-6'>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <h5 className='font-medium'>Task Distribution</h5>
          </div>

          <CustomPieChart 
            data={pieChartData}
            colors={COLORS}
          />
        </div>


        <div className='md:col-span-2'>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='text-lg'>Recent Tasks</h5>
              <button className='card-btn' onClick={onSeeMore}>
                See All <LuArrowRight className='text-base' />
              </button>
            </div>
            <TaskListTable tasks={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard