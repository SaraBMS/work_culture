import { useEffect, useState } from 'react';
import api1 from '../../../api/DashboardAPI';
import api2 from '../../../api/SignUpAPI';
import './teammates.css';
import { useLocation, useNavigate } from 'react-router-dom';
import teammates from '../../../assets/images/teammates 1.svg';
import refreshButton from '../../../assets/images/refreshButton.svg';
import arrowButton from '../../../assets/images/arrowButton.svg';
import MedalOne from '../../../assets/images/first_1.svg';
import Avatar from '../../../assets/images/Avatar.svg';
import MedalTwo from '../../../assets/images/first_2.svg';
import MedalThree from '../../../assets/images/first- 3.svg';
import { useEmail, useRole } from '../../../hook/EmailProvider';
import useAxiosFetch from '../../../hook/useAxiosFetch';
import MonthSelect from './MonthSelect';
import { useStateContext } from '../../../hook/ContextProvider';
// import Question from '../Admin/Question';


const agencyStyles = {
    'DevSyro': {
        agency_color: "#fff",
        color: '#05CD99',
        background: '#05CD991A',
    },
    'ProSyro': {
        agency_color: "#23C1FF",
        color: '#EE5D50',
        background: '#EE5D501A',
    },
    'ArtSyro': {
        agency_color: "#A744FF",
        color: '#FFEB37',
        background: '#FFEB371A',
    },
    'iSyro': {
        agency_color: "#EE9C50",
        color: '#fff',
        background: '#333',
    },
};

const TeamMates = () => {
    const [search, setSearch] = useState('');
    const { email, yourQue } = useEmail();
    const [teamMates, setTeamMates] = useState([]);
    const { fetchError, isLoading } = useAxiosFetch('http://localhost:3400/DashboardAPI');
    const location = useLocation();
    const isTeamPage = location.pathname === '/admin/team';
    const isQuestionPage = location.pathname === '/admin/question';
    const [selectedValue, setSelectedValue] = useState('All Agencies');
    const [searchResults, setSearchResults] = useState([]);
    const{sendReminder} = useStateContext();
    const{role} = useRole();
    const navigate = useNavigate();

 
    const renderQuestionPgae = isQuestionPage;
    const handleSearch = () => {
        const filteredResults = teamMates.filter(teamMate =>
            (teamMate.name && teamMate.name.toLowerCase().includes(search.toLowerCase())) ||
            (teamMate.agency && teamMate.agency.toLowerCase().includes(search.toLowerCase()))
        );
        setSearchResults(filteredResults);
    };

    useEffect(() => {
        handleSearch();
    }, [search,teamMates]);

    const handleAgencySelect = (value) => {
        setSelectedValue(value);
    };

    const filteredTeamMates = selectedValue === 'All Agencies'
        ? searchResults
        : searchResults.filter(teamMate => teamMate.agency === selectedValue);
        
        useEffect(() => {
            const fetchData = async () => {
                try {
                    // Fetch data from both endpoints
                    const [dashboardResponse, signupResponse] = await Promise.all([
                        api1.get('/DashboardAPI'),
                        api2.get('/SignUpAPI')
                    ]);
        
                    // Extract data from responses
                    const dashboardData = dashboardResponse.data; 
                    const signupData = signupResponse.data.filter((item) => item.role !== 'admin');
        
                    // Create a map for quick lookup of percentage by email
                    const emailToPercentageMap = dashboardData.reduce((acc, item) => {
                        if (item.email) {
                            acc[item.email] = item.percentage || 0;
                        }
                        return acc;
                    }, {});
        
                    // Combine data from signup and dashboard APIs
                    const combinedData = signupData.map(signupItem => {
                        const percentage = emailToPercentageMap[signupItem.email] || 0;
        
                        // Define agency style
                        const agencyStyle = agencyStyles[signupItem.selectedOption2] || {
                            agency_color: '#000',  
                            color: '#000',
                            background: '#0000001A',
                        };
        
                        // Define profile image
                        const profileImage = signupItem.image && !signupItem.image.startsWith('blob:')
                            ? signupItem.image
                            : Avatar;
        
                        return {
                            name: signupItem.name,
                            profile: profileImage,
                            agency: signupItem.selectedOption2,
                            agency_color: agencyStyle.agency_color,
                            color: agencyStyle.color,
                            background: agencyStyle.background,
                            percentage,  // Set percentage from the map
                            email: signupItem.email,
                            question: yourQue,
                            id: signupItem.id
                        };
                    });
        
                    // Update state with the combined data
                    setTeamMates(combinedData);
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            };
        
            fetchData();
        }, [email]);
        
    const assignMedalOrRank = (index) => {
        if (index === 0) return { type: 'medal', content: MedalOne };
        if (index === 1) return { type: 'medal', content: MedalTwo };
        if (index === 2) return { type: 'medal', content: MedalThree };
        return { type: 'rank', content: index + 1 };
    };

 
   //Display mate profile 
    const handleProfileClick = (teamMate) => {
        // Check access control logic
        if (role === 'admin' || role === 'user' ) {
            navigate(`/admin/profilemate/${teamMate.id}`);  // Navigate to the profile if user is admin or same agency
        } else {
            alert('Access Denied: You do not have permission to view this profile.');
        }
    };
    
// Send reminder to teammate 

const handleSendReminder = (teamMate) => {
    // Assuming you are using a context or some global state
    sendReminder({
        name: teamMate.name,
        email: teamMate.email
    });
};


    return (
        <div className='team_mates'>
        {!isTeamPage && (
            <div className="team_mates-header">
                <div className="team_mates-header-text">
                    {renderQuestionPgae ? (
                        <>
                          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 17.3334C11.2306 17.3334 12.9223 16.8447 14.3612 15.929C15.8002 15.0133 16.9217 13.7118 17.5839 12.1891C18.2462 10.6664 18.4195 8.99084 18.0819 7.37433C17.7442 5.75782 16.9109 4.27297 15.6872 3.10753C14.4635 1.94209 12.9044 1.14842 11.207 0.826874C9.50971 0.505331 7.75037 0.670359 6.15152 1.30109C4.55267 1.93182 3.1861 2.99992 2.22464 4.37033C1.26318 5.74074 0.75 7.35191 0.75 9.00008C0.75 11.2102 1.67187 13.3298 3.31282 14.8926C4.12533 15.6665 5.08992 16.2803 6.15152 16.6991C7.21312 17.1179 8.35093 17.3334 9.5 17.3334ZM9.5 15.6667C9.24041 15.6667 8.98665 15.5934 8.77081 15.4561C8.55497 15.3187 8.38675 15.1235 8.28741 14.8951C8.18807 14.6667 8.16208 14.4154 8.21272 14.1729C8.26336 13.9304 8.38837 13.7077 8.57192 13.5329C8.75548 13.3581 8.98934 13.239 9.24394 13.1908C9.49854 13.1425 9.76244 13.1673 10.0023 13.2619C10.2421 13.3565 10.4471 13.5167 10.5913 13.7223C10.7355 13.9278 10.8125 14.1695 10.8125 14.4167C10.8125 14.7483 10.6742 15.0662 10.4281 15.3006C10.1819 15.5351 9.8481 15.6667 9.5 15.6667ZM6 6.49508C5.9871 5.85485 6.17272 5.22521 6.53364 4.68493C6.89456 4.14466 7.41474 3.71774 8.02912 3.45758C8.57393 3.22585 9.17123 3.12851 9.76595 3.17453C10.3607 3.22055 10.9336 3.40846 11.432 3.72092C11.8916 4.01069 12.2728 4.39973 12.5446 4.85636C12.8164 5.31298 12.9711 5.82429 12.9962 6.34866C13.0213 6.87302 12.916 7.39561 12.6889 7.87387C12.4617 8.35214 12.1192 8.77257 11.6892 9.10092C11.0862 9.54351 10.6525 10.1624 10.4546 10.8626C10.4001 11.0774 10.2582 11.2628 10.0601 11.378C9.86206 11.4932 9.62407 11.5287 9.3985 11.4768C9.17293 11.4248 8.97827 11.2897 8.85733 11.101C8.73639 10.9124 8.69909 10.6857 8.75362 10.4709C9.03845 9.41246 9.68489 8.47432 10.5911 7.80425C10.8065 7.64017 10.9781 7.42992 11.092 7.19066C11.2058 6.95139 11.2587 6.68988 11.2462 6.42747C11.2338 6.16505 11.1564 5.90915 11.0203 5.68064C10.8843 5.45214 10.6934 5.25749 10.4634 5.11258C10.2056 4.95192 9.90899 4.85685 9.60171 4.83642C9.29443 4.816 8.98678 4.87091 8.70812 4.99592C8.41264 5.13061 8.16448 5.34398 7.99366 5.61019C7.82284 5.8764 7.73669 6.18405 7.74562 6.49592C7.73054 6.70625 7.63232 6.90333 7.47073 7.04743C7.30915 7.19153 7.09622 7.27195 6.87485 7.27248C6.65348 7.27301 6.44013 7.19361 6.27779 7.05028C6.11545 6.90695 6.01619 6.71035 6 6.50008V6.49508Z" fill="url(#paint0_linear_679_2478)" />
                <defs>
                    <linearGradient id="paint0_linear_679_2478" x1="-3.82661" y1="-17.3157" x2="33.4959" y2="-8.13557" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FEFC" />
                        <stop offset="1" stopColor="#0002FE" />
                    </linearGradient>
                </defs>
            </svg>
                            <h2>Question</h2>
                        </>
                    ) : (
                        <>
                            <img src={teammates} alt="teammates" />
                            <h2>Team Mates</h2>
                            {role === 'admin' && (
                                <div className="team_mates-header-search">
                                    <label htmlFor="searchMate">Search Mate</label>
                                    <input
                                        type="search"
                                        name="mate"
                                        id="searchMate"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button type='button' onClick={handleSearch}>
                                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_960_9617)">
                                            <path d="M9.47556 0C13.0699 0 16.0002 2.74723 16.0002 6.11689C16.0002 9.48656 13.0699 12.2338 9.47556 12.2338C7.96559 12.2338 6.57368 11.7485 5.46578 10.9363L1.3654 14.7804C1.05309 15.0732 0.546776 15.0732 0.234464 14.7804C-0.0777855 14.4877 -0.0777855 14.013 0.234464 13.7202L4.33484 9.87609C3.46821 8.83772 2.94931 7.53252 2.94931 6.11692C2.94931 2.74726 5.88124 0 9.47556 0ZM9.47556 1.49959C6.74571 1.49959 4.54884 3.55767 4.54884 6.11692C4.54884 8.67615 6.74568 10.7343 9.47556 10.7343C12.2054 10.7343 14.4007 8.67615 14.4007 6.11692C14.4007 3.55767 12.2054 1.49959 9.47556 1.49959Z" fill="white"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_960_9617">
                                                <rect width="16" height="15" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="team_mates-header-buttons">
                    {role === 'admin' && !renderQuestionPgae && (
                        <div className="agency_select-container">
                            <MonthSelect onChange={handleAgencySelect} type="team" />
                        </div>
                    )}
                    <button type='button'>
                        <img src={refreshButton} alt="refreshButton" />
                    </button>
                    {role !== 'admin' &&  !renderQuestionPgae && (
                        <button type='button'>
                            <img src={arrowButton} alt="arrowButton" />
                        </button>
                    )}
                </div>
            </div>
        )}
           
            {isLoading && <p className='statusMsg'>Loading...</p>}
            {!isLoading && fetchError && <p className='statusMsg' style={{color:'red'}}>{fetchError}</p>}
            {!isLoading && !fetchError && (
                filteredTeamMates.length === 0 ? (
                    <p className='statusMsg'>No match found.</p>
                ) : (
                    <div className="team_mates-mates_container">
                        {filteredTeamMates.map((teamMate, index) => {
                              const medalOrRank = !isQuestionPage ? assignMedalOrRank(index) : '';
                            return (
                                <div
                                 className="team_mates-mates_container-feild"
                                 key={teamMate.id}
                                //  onClick={() => handleProfileClick(teamMate)} 
                                //  style={{ cursor: 'pointer' }}
                             >
                                    <div className="team_mates-mates_container-feild-container">
                                        <div className={`team_mates-mates_container-feild-container-info ${role==='admin' ? 'w_42' : ''}`}>
                                            {medalOrRank.type === 'medal' ? (
                                                <img src={medalOrRank.content} alt="Medal" />
                                            ) : (
                                                <div className="rank-number">{medalOrRank.content}</div>
                                            )}
                                            <div 
                                              key={teamMate.id}
                                              onClick={() => handleProfileClick(teamMate)} 
                                              style={{ cursor: 'pointer' }}
                                            className="team_mates-mates_container-feild-container-info-profile">
                                                <img
                                                    src={teamMate.profile}
                                                    alt="profile_image"
                                                    className="pro_img mate"
                                                    style={{ borderColor: teamMate.agency_color }} 
                                                />
                                                <div className='team_mates-mates_container-feild-container-info-profile-name'>
                                                    {teamMate.name}
                                                    <span className='teame_agency' style={{ color: teamMate.agency_color }}>
                                                        {teamMate.agency}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {!isQuestionPage ?
                                        <div
                                            className="team_mates-mates_container-feild-container-percentage"
                                            style={{ backgroundColor: teamMate.background, color: teamMate.color }}
                                        >
                                            {teamMate.percentage}%
                                        </div> : 'button'}
                                        {role === 'admin' && (
                                                <div className="team_mates-mates_container-feild-container-button">
                                                    <button type='button' onClick={() => handleSendReminder(teamMate)}>Send Reminder</button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
};

export default TeamMates;
