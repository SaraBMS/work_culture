import { useEffect, useState, useRef } from 'react';
import api1 from '../../../api/SignUpAPI';
import api2 from '../../../api/QuestionAPI';
import './question.css';
import Avatar from '../../../assets/images/Avatar.svg';
import { useEmail } from '../../../hook/EmailProvider';
import BoxContainer from '../home/BoxContainer';
import { useStateContext } from '../../../hook/ContextProvider';
import { useLocation, useNavigate } from 'react-router-dom';

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

const Question = () => {
    const { yourQue } = useEmail();
    const [teamMates, setTeamMates] = useState([]);
    const { openAnspopUp, openpopUp, setSelectedQuestion, answeredQuestions  } = useStateContext();
    const containerRef = useRef(null); // Ref to get the container's width
    const location = useLocation();
    const [checkedState, setCheckedState] = useState({});
    const isPanelPage = location.pathname === '/admin/control-panel';
    const navigate = useNavigate();
 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const signupResponse = await api1.get('/SignUpAPI', { params: { question: yourQue } });
                const signupData = signupResponse.data.filter((item) => item.role !== 'admin');

                const questionResponse = await api2.get('/QuestionAPI', { params: { question: yourQue } });
                const questionData = questionResponse.data;

                const combinedData = signupData.map((signupItem, index) => {
                    const questionItem = questionData.find(q => q.email === signupItem.email);

                    if (!questionItem) {
                        return null;
                    }

                    return {
                        index: index,
                        name: signupItem.name,
                        profile: signupItem.image || Avatar,
                        agency: signupItem.selectedOption2,
                        agency_color: agencyStyles[signupItem.selectedOption2]?.agency_color || '#000',
                        color: agencyStyles[signupItem.selectedOption2]?.color || '#000',
                        background: agencyStyles[signupItem.selectedOption2]?.background || '#0000001A',
                        question: questionItem.question,
                        date: questionItem.date || '9/18/2024',
                        email: signupItem.email,
                        answered: answeredQuestions[questionItem.question] || Boolean(questionItem.answer),
                        id: signupItem.id
                    };
                }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));

                setTeamMates(combinedData);
                setCheckedState(combinedData.reduce((acc, mate) => ({ ...acc, [mate.index]: false }), {}));
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [answeredQuestions, yourQue]);

    const handleAnswerClick = (question) => {
        setSelectedQuestion(question);
        openAnspopUp(); 
    };

    const handleCheckboxChange = (index) => {
        setCheckedState(prevState => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const sliceQuestion = (question) => {
        if (!question) return ''; // Return an empty string if there's no question
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const maxLength = Math.floor((containerWidth * 0.2) / 10); // Rough estimate of characters fitting in 20%
        return question.length > maxLength ? `${question.slice(0, maxLength)}...` : question;
    };

      //Display mate profile 
      const handleProfileClick = (teamMate) => {
        // Check access control logic
     
            navigate(`/admin/profilemate/${teamMate.id}`);  // Navigate to the profile if user is admin or same agency
        
    };

    return (
        <div className='question'>
            <BoxContainer filled>
                {isPanelPage && (
                     <div className='question-header' >
                          <div className="additional-content">
          <div className="additional-content-left">
            <div className="navbar-setter-text">
             <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 17.3334C11.2306 17.3334 12.9223 16.8447 14.3612 15.929C15.8002 15.0133 16.9217 13.7118 17.5839 12.1891C18.2462 10.6664 18.4195 8.99084 18.0819 7.37433C17.7442 5.75782 16.9109 4.27297 15.6872 3.10753C14.4635 1.94209 12.9044 1.14842 11.207 0.826874C9.50971 0.505331 7.75037 0.670359 6.15152 1.30109C4.55267 1.93182 3.1861 2.99992 2.22464 4.37033C1.26318 5.74074 0.75 7.35191 0.75 9.00008C0.75 11.2102 1.67187 13.3298 3.31282 14.8926C4.12533 15.6665 5.08992 16.2803 6.15152 16.6991C7.21312 17.1179 8.35093 17.3334 9.5 17.3334ZM9.5 15.6667C9.24041 15.6667 8.98665 15.5934 8.77081 15.4561C8.55497 15.3187 8.38675 15.1235 8.28741 14.8951C8.18807 14.6667 8.16208 14.4154 8.21272 14.1729C8.26336 13.9304 8.38837 13.7077 8.57192 13.5329C8.75548 13.3581 8.98934 13.239 9.24394 13.1908C9.49854 13.1425 9.76244 13.1673 10.0023 13.2619C10.2421 13.3565 10.4471 13.5167 10.5913 13.7223C10.7355 13.9278 10.8125 14.1695 10.8125 14.4167C10.8125 14.7483 10.6742 15.0662 10.4281 15.3006C10.1819 15.5351 9.8481 15.6667 9.5 15.6667ZM6 6.49508C5.9871 5.85485 6.17272 5.22521 6.53364 4.68493C6.89456 4.14466 7.41474 3.71774 8.02912 3.45758C8.57393 3.22585 9.17123 3.12851 9.76595 3.17453C10.3607 3.22055 10.9336 3.40846 11.432 3.72092C11.8916 4.01069 12.2728 4.39973 12.5446 4.85636C12.8164 5.31298 12.9711 5.82429 12.9962 6.34866C13.0213 6.87302 12.916 7.39561 12.6889 7.87387C12.4617 8.35214 12.1192 8.77257 11.6892 9.10092C11.0862 9.54351 10.6525 10.1624 10.4546 10.8626C10.4001 11.0774 10.2582 11.2628 10.0601 11.378C9.86206 11.4932 9.62407 11.5287 9.3985 11.4768C9.17293 11.4248 8.97827 11.2897 8.85733 11.101C8.73639 10.9124 8.69909 10.6857 8.75362 10.4709C9.03845 9.41246 9.68489 8.47432 10.5911 7.80425C10.8065 7.64017 10.9781 7.42992 11.092 7.19066C11.2058 6.95139 11.2587 6.68988 11.2462 6.42747C11.2338 6.16505 11.1564 5.90915 11.0203 5.68064C10.8843 5.45214 10.6934 5.25749 10.4634 5.11258C10.2056 4.95192 9.90899 4.85685 9.60171 4.83642C9.29443 4.816 8.98678 4.87091 8.70812 4.99592C8.41264 5.13061 8.16448 5.34398 7.99366 5.61019C7.82284 5.8764 7.73669 6.18405 7.74562 6.49592C7.73054 6.70625 7.63232 6.90333 7.47073 7.04743C7.30915 7.19153 7.09622 7.27195 6.87485 7.27248C6.65348 7.27301 6.44013 7.19361 6.27779 7.05028C6.11545 6.90695 6.01619 6.71035 6 6.50008V6.49508Z" fill="#fff"></path><defs><linearGradient id="paint0_linear_679_2478" x1="-3.82661" y1="-17.3157" x2="33.4959" y2="-8.13557" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"></stop><stop offset="1" stop-color="#fff"></stop></linearGradient></defs></svg>
              <div className="actualwork_container-header-text ">
                Questions 
              </div>
            </div>
          </div>  
          <div className="add_question_button">  
          <button type='button' onClick={openpopUp}>
          Add Question
          <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_957_2475)">
                    <path d="M8.5 0.5C3.81281 0.5 0 4.31281 0 9C0 13.6872 3.81281 17.5 8.5 17.5C13.1872 17.5 17 13.6865 17 9C17 4.31348 13.1872 0.5 8.5 0.5ZM8.5 16.1832C4.5397 16.1832 1.3168 12.961 1.3168 9C1.3168 5.03903 4.5397 1.8168 8.5 1.8168C12.4603 1.8168 15.6832 5.03903 15.6832 9C15.6832 12.961 12.461 16.1832 8.5 16.1832Z" fill="white"/>
                    <path d="M11.792 8.28226H9.15842V5.64865C9.15842 5.28521 8.86411 4.99023 8.5 4.99023C8.1359 4.99023 7.84158 5.28521 7.84158 5.64865V8.28226H5.20798C4.84387 8.28226 4.54956 8.57723 4.54956 8.94068C4.54956 9.30412 4.84387 9.59909 5.20798 9.59909H7.84158V12.2327C7.84158 12.5961 8.1359 12.8911 8.5 12.8911C8.86411 12.8911 9.15842 12.5961 9.15842 12.2327V9.59909H11.792C12.1561 9.59909 12.4504 9.30412 12.4504 8.94068C12.4504 8.57723 12.1561 8.28226 11.792 8.28226Z" fill="white"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_957_2475">
                    <rect width="17" height="17" fill="white" transform="translate(0 0.5)"/>
                    </clipPath>
                    </defs>
                    </svg>
                    </button>
                    </div> 
                     </div>
                     </div>
                )}
                <div className='question-container' ref={containerRef} >
                    {teamMates.length > 0 ? (
                        (isPanelPage ? teamMates.slice(0, 4) : teamMates).map((teamMate) => (
                            <div
                             key={teamMate.index} 
                             className="question-container-mates_container" 
                              >
                                <div 
                                className="question-container-mates_container-info-profile" 
                                key={teamMate.id}
                                 onClick={() => handleProfileClick(teamMate)} 
                                 style={{ cursor: 'pointer' }}
                                >
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
                                
                                <div className="question-container-mates_container-faq_mate">
                                    {!checkedState[teamMate.index] ? (
                                        sliceQuestion(teamMate.question)
                                    ) : (
                                        <span className="question-answered_question">{ teamMate.question }</span>
                                    )}
                                </div>

                                <div className="question-container-mates_container-check">
                                    <div className="toggle-border">
                                        <input
                                            id={teamMate.index}
                                            type="checkbox"
                                            checked={checkedState[teamMate.index]}
                                            onChange={() => handleCheckboxChange(teamMate.index)}
                                            disabled={teamMate.answered}
                                        />
                                        <label htmlFor={teamMate.index}>
                                            <div className="handle"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className={`question-container-mates_container-msg_date ${!checkedState[teamMate.index] ? '' : 'question-answered_date'} `}>
                             
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.5 10H9.5C9.63261 10 9.75978 9.94732 9.85355 9.85355C9.94732 9.75978 10 9.63261 10 9.5V2C10 1.86739 9.94732 1.74021 9.85355 1.64645C9.75978 1.55268 9.63261 1.5 9.5 1.5H7.5V0.5C7.5 0.367392 7.44732 0.240215 7.35355 0.146447C7.25978 0.0526784 7.13261 0 7 0C6.86739 0 6.74021 0.0526784 6.64645 0.146447C6.55268 0.240215 6.5 0.367392 6.5 0.5V1.5H3.5V0.5C3.5 0.367392 3.44732 0.240215 3.35355 0.146447C3.25978 0.0526784 3.13261 0 3 0C2.86739 0 2.74021 0.0526784 2.64645 0.146447C2.55268 0.240215 2.5 0.367392 2.5 0.5V1.5H0.5C0.367392 1.5 0.240215 1.55268 0.146447 1.64645C0.0526784 1.74021 0 1.86739 0 2V9.5C0 9.63261 0.0526784 9.75978 0.146447 9.85355C0.240215 9.94732 0.367392 10 0.5 10ZM1 2.5H9V4H1V2.5ZM1 5H9V9H1V5Z" fill="#4BF0FCBF" />
                                    </svg>
                                    {teamMate.date}
                                </div>
                                
                                <div className="question-container-mates_container-button">
                                    {!checkedState[teamMate.index] ? (
                                        <button 
                                            type='button' 
                                            onClick={() => handleAnswerClick(teamMate.question)}
                                            disabled={teamMate.answered}
                                        >
                                            Answer Question
                                        </button>
                                    ) : (
                                        <span className="question-answered_button">Question Answerd</span>
                                    )}
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className='question-empty'>Questions will appear here as soon as teammates submit them.</p>
                    )}
                </div>
            </BoxContainer>
        </div>
    );
};

export default Question;
