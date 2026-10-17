import React, { useEffect, useState } from 'react';
import './profilemate.css';
import BoxContainer from './home/BoxContainer';
import MateInfo from './MateInfo';
import SetterPercentage from './home/SetterPercentage';
import ActualWorkSetter from './home/ActualWorkSetter';
import XpointSetter from './home/XpointSetter';
import { useParams } from 'react-router-dom';
import api1 from '../../api/DashboardAPI';
import api2 from '../../api/SignUpAPI';


const ProfileMate = () => {
  const { id } = useParams();  // Get the user ID from URL params
  const [teamMate, setTeamMate] = useState(null);  // State to hold the teammate info
  const [loading, setLoading] = useState(true);    // Loading state
  const [teammatePercentage, setTeammatePercentage] = useState(0);

  // Fetch the teammate's data based on the ID
  useEffect(() => {
    const fetchTeamMate = async () => {
      try {
        const response = await api2.get(`/SignUpAPI/${id}`); // Fetching the teamMate data
        const data = response.data;  // Parse response data
        setTeamMate(data);  // Set the fetched data to state

        // Fetch percentage data for the specific teammate
        const dashboardResponse = await api1.get('/DashboardAPI');
        const dashboardData = dashboardResponse.data;
        const teammateData = dashboardData.find(item => item.email === data.email);
        setTeammatePercentage(teammateData ? teammateData.percentage : 0);
        
        setLoading(false);  // Turn off the loading spinner
      } catch (error) {
        console.error('Error fetching teamMate:', error);  // Log any fetch error
        setLoading(false);  // Turn off the loading spinner on error
      }
    };
    fetchTeamMate();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;  // Show loading text
  }

  if (!teamMate) {
    return <div>Teammate not found</div>;  // Handle case when teammate is not found
  }

  return (

    <div className='profile_mate'>
     
      <div className='profile_mate-container'>
    
        <BoxContainer filled className='w_58'>
          <MateInfo teamMate={teamMate} />  {/* Pass the fetched teammate to MateInfo */}
        </BoxContainer>
        <BoxContainer filled className='w_39'>
          <SetterPercentage percentage={teammatePercentage} />  {/* Pass percentage to SetterPercentage */}
        </BoxContainer>
        <BoxContainer filled className='actual_goal_box'>
          <BoxContainer filled className='w_50'>
            <ActualWorkSetter teamMate={teamMate} />
          </BoxContainer>
          <BoxContainer filled className='w_50_border'>
            <XpointSetter teamMate={teamMate} />
          </BoxContainer>
        </BoxContainer>
      </div>
    </div>
  );
};

export default ProfileMate;
