import React, { useState, useEffect } from 'react';
import './analytics.css';
import BoxContainer from '../../pages/home/BoxContainer';
import { useEmail } from '../../../hook/EmailProvider';
import api1 from '../../../api/SignUpAPI';
import api2 from '../../../api/DashboardAPI';
import Avatar from '../../../assets/images/Avatar.svg';

const agencyStyles = {
  'ProSyro': { percentage: 30, agency_color: "#23C1FF", color: '#fff', background: "linear-gradient(103.18deg, #00FEFC -41.67%, #0002FE 141.58%)", borderColor: '#23C1FF' },
  'iSyro': { percentage: 65, agency_color: "#FAFF00", color: '#000000', background: "#FAFF00", borderColor: '#FAFF00' },
  'ArtSyro': { percentage: 45, agency_color: "#9824FF", color: '#000000', background: "#9824FF", borderColor: '#9824FF' },
  'DevSyro': { percentage: 55, agency_color: "#fff", color: '#000000', background: '#fff', borderColor: '#05CD99' },
  'Business': { percentage: 75, agency_color: "#09C76A", color: '#fff', background: '#09C76A', borderColor: '#09C76A' },
};

const Analytics = () => {
  const [teamMates, setTeamMates] = useState([]);
  const { email } = useEmail();
  const [agencyPercentages, setAgencyPercentages] = useState({});
  const [headerData, setHeaderData] = useState([
    { title: 'Overdue Tasks', value: '0' },
    { title: 'Candidate of BOB', value: '-' },
    { title: 'Total Members', value: '0' },
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, signupResponse] = await Promise.all([
          api2.get('/DashboardAPI'),
          api1.get('/SignUpAPI')
        ]);

        const dashboardData = dashboardResponse.data; 
        const signupData = signupResponse.data.filter((item) => item.role !== 'admin');

        const emailToPercentageMap = dashboardData.reduce((acc, item) => {
          if (item.email) acc[item.email] = item.percentage || 0;
          return acc;
        }, {});

        const combinedData = signupData.map(signupItem => {
          const percentage = emailToPercentageMap[signupItem.email] || 0;
          const agencyStyle = agencyStyles[signupItem.selectedOption2] || { agency_color: '#000', color: '#000', background: '#0000001A' };
          const profileImage = signupItem.image && !signupItem.image.startsWith('blob:') ? signupItem.image : Avatar;

          return {
            name: signupItem.name,
            profile: profileImage,
            agency: signupItem.selectedOption2,
            agency_color: agencyStyle.agency_color,
            color: agencyStyle.color,
            background: agencyStyle.background,
            percentage,
            email: signupItem.email,
            id: signupItem.id
          };
        });

        const candidateOfBob = [...combinedData].sort((a, b) => b.percentage - a.percentage)[0];
        const overdueTasks = dashboardData.filter((item) => item.completed === false).length;

        const agencyPercentages = combinedData.reduce((acc, teamMate) => {
          if (!acc[teamMate.agency]) acc[teamMate.agency] = { total: 0, count: 0 };
          acc[teamMate.agency].total += teamMate.percentage;
          acc[teamMate.agency].count += 1;
          return acc;
        }, {});
    
        for (const agency in agencyPercentages) {
          const { total, count } = agencyPercentages[agency];
          // Calculate average and floor to remove decimals
          agencyPercentages[agency] = Math.floor(total / count);
        }

        setTeamMates(combinedData);
        setAgencyPercentages(agencyPercentages);
        setHeaderData([
          { title: 'Overdue Tasks', value: String(overdueTasks) },
          { title: 'Candidate of BOB', value: candidateOfBob?.name || '-' },
          { title: 'Total Members', value: String(signupData.length) },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [email]);

  const agencyNames = ['ProSyro', 'iSyro', 'ArtSyro', 'DevSyro', 'Business'];

  return (
    <div className='analytics'>
      <div className='analytics-container'>
        {/* Header Section */}
        <div className='analytics-container-header'>
          {headerData.map((item, index) => (
            <BoxContainer filled className='w_30' key={index}>
              <div className='analytics-container-header-task'>
                <div className='analytics-container-header-task-left'>
                  <h3 className='overdue_tasks'>{item.title}</h3>
                  <span className='overdue_tasks_value'>{item.value}</span>
                </div>
                <div className='analytics-container-header-task-right'>
                  <svg width='120' height='57' viewBox='0 0 120 57' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M3.22437 54.0499C3.22437 54.0499 11.388 -7.70703 31.8244 20.9C52.2607 49.5069 60.4244 48.193 68.2244 26.1C77.8661 -1.2098 113.41 22.3047 116.974 2.69995' stroke='url(#paint0_linear_975_9886)' strokeWidth='5.2' strokeLinecap='round' strokeLinejoin='round' />
                    <defs>
                      <linearGradient id='paint0_linear_975_9886' x1='-1.32566' y1='60.5499' x2='92.3755' y2='-21.8887' gradientUnits='userSpaceOnUse'>
                        <stop stopColor='white' />
                        <stop offset='1' stopColor='white' stopOpacity='0' />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </BoxContainer>
          ))}
        </div>

        {/* Body Section */}
        <div className='analytics-container-body'>
          {agencyNames.map((agencyName, index) => (
            <BoxContainer filled className={`w_20 ${agencyName.replace(/\s+/g, '-').toLowerCase()}-border`} key={index}>
              <div className='analytics-container-body-agency'>
                <div className='analytics-container-body-agency-top'>
                  <h3 className='agency_name'>{agencyName} Agency</h3>
                  <div
                    className="agency_percentage"
                    style={{
                      background: agencyStyles[agencyName]?.background,
                      color: agencyStyles[agencyName]?.color,
                    }}
                  >
                    {agencyPercentages[agencyName] || '0'}%
                  </div>
                </div>
                <div className='analytics-container-body-agency-bottom'>
                  <div className='analytics-container-body-agency-bottom-mate'>
                    {teamMates.filter(tm => tm.agency === agencyName).sort((a, b) => b.percentage - a.percentage).slice(0, 4).map((teamMate) => (
                      <div key={teamMate.id} className="analytics-container-mates_container">
                        <img
                          src={teamMate.profile}
                          alt="profile_image"
                          className="pro_img mate"
                          style={{ borderColor: teamMate.agency_color }}
                        />
                        <div className='question-container-mates_container-info-profile-name'>
                          {teamMate.name}
                          <span className='teame_agency' style={{ color: teamMate.agency_color }}>
                            {teamMate.agency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BoxContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
