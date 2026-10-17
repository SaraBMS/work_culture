import React, { useState, useEffect } from 'react';
import './notification.css';
import BoxContainer from '../pages/home/BoxContainer';
import RefreshNotifi from '../../assets/images/RefreshNotifi.svg';
import { useStateContext } from '../../hook/ContextProvider';
import { useEmail, useRole } from '../../hook/EmailProvider';
import useAxiosFetch from '../../hook/useAxiosFetch';
import MonthSelect from '../pages/home/MonthSelect';
import api from '../../api/SignUpAPI';

const Notification = ({className}) => {
  const { activeNotify, markAllAsRead, setHasNotification } = useStateContext();
  const { name } = useEmail();
  const { role } = useRole();
  const { fetchError, isLoading } = useAxiosFetch('http://localhost:3400/DashboardAPI');
  const [selectedValue, setSelectedValue] = useState('All');


  // Notifications array with conditional logic based on role
  const initialNotifications = [
   
  ];
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);

  // Initialize filteredNotifications on component mount
  useEffect(() => {
    setFilteredNotifications(notifications);
  }, [notifications]);

 

  // Function to update notifications (for marking as read, etc.)
  // const updateNotification = (updatedNotification) => {
  //   setNotifications((prevNotifications) =>
  //     prevNotifications.map((notification) =>
  //       notification.id === updatedNotification.id ? updatedNotification : notification
  //     )
  //   );
  // };
  
 
  // Fetch notifications based on role
  useEffect(() => {
    if (role === 'admin' || activeNotify.notification) {
      fetchNotifications();
    }
  }, [role, activeNotify.notification]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/Notifications');
      setNotifications(response.data);
      setFilteredNotifications(response.data); // Initialize filteredNotifications with fetched data
      setHasNotification(response.data.some(notif => !notif.read)); // Set notification state
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Handle filtering based on selected value
  const handleTypeOfNotifySelect = (value) => {
    setSelectedValue(value);

    const filtered = value === 'All'
      ? notifications
      : notifications.filter(notification => notification.type === value);

    setFilteredNotifications(filtered);
  };
  

  return (
    (role === 'admin' || activeNotify.notification) && (
      <div className={`notification  ${className} ${ activeNotify.notification ? 'show' : 'hide'}` }>
        <BoxContainer className='notify_shadow'>
          {isLoading && <p className='statusMsg'>Loading Notifications...</p>}
          {!isLoading && fetchError && <p className='statusMsg' style={{ color: 'red' }}>{fetchError}</p>}
          {!isLoading && !fetchError && (
            <div className="notification-container">
              <div className={ `notification-container-header ${role ==='admin' ? 'admin_select' : ''}` }>
              <div className="notification-container-header-main">
              {role === 'admin'  && (
              <div className="notification-container-header-history">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_960_9796)">
                <path d="M14.1457 1.54175C11.6267 1.55401 9.18291 2.40156 7.19722 3.95162C5.21154 5.50168 3.79615 7.66666 3.17281 10.1074L2.41031 8.95425C2.33813 8.83352 2.24224 8.72867 2.12843 8.64601C2.01462 8.56335 1.88525 8.50459 1.74812 8.47329C1.61098 8.44198 1.46893 8.43877 1.33052 8.46385C1.19212 8.48894 1.06023 8.54179 0.942802 8.61923C0.825377 8.69667 0.724852 8.79709 0.647289 8.91443C0.569726 9.03177 0.516732 9.16361 0.491502 9.30199C0.466273 9.44037 0.469331 9.58242 0.500492 9.71959C0.531652 9.85675 0.59027 9.98619 0.672811 10.1001L2.96448 13.573C3.12367 13.7958 3.35836 13.9531 3.62489 14.0157C3.89705 14.0697 4.17953 14.0155 4.41239 13.8647L7.8499 11.549C7.96842 11.475 8.07083 11.3779 8.15105 11.2635C8.23127 11.1491 8.28765 11.0197 8.31684 10.8831C8.34602 10.7464 8.34741 10.6053 8.32093 10.4681C8.29445 10.3309 8.24064 10.2004 8.16269 10.0844C8.08475 9.96847 7.98427 9.86937 7.86723 9.79303C7.75019 9.71669 7.61899 9.66468 7.48144 9.64009C7.34389 9.6155 7.2028 9.61884 7.06656 9.6499C6.93032 9.68097 6.80173 9.73913 6.68844 9.82092L5.12489 10.8751C5.54102 9.1859 6.42357 7.64771 7.67186 6.43598C8.92014 5.22426 10.4839 4.38781 12.1847 4.02207C13.8855 3.65633 15.6548 3.77603 17.2909 4.3675C18.9269 4.95898 20.3638 5.99841 21.4375 7.36721C22.5112 8.73601 23.1786 10.3791 23.3634 12.1089C23.5482 13.8387 23.2431 15.5857 22.4828 17.1504C21.7226 18.7152 20.5378 20.0348 19.0637 20.9586C17.5895 21.8824 15.8854 22.3732 14.1457 22.3751C12.6544 22.3711 11.1861 22.007 9.86567 21.3139C8.54522 20.6207 7.41166 19.619 6.56135 18.3938C6.4852 18.2769 6.38632 18.1765 6.2706 18.0985C6.15488 18.0205 6.02466 17.9665 5.88769 17.9398C5.75072 17.9132 5.60978 17.9143 5.47324 17.9431C5.3367 17.9719 5.20735 18.0279 5.09286 18.1077C4.97837 18.1875 4.88109 18.2895 4.80678 18.4076C4.73246 18.5257 4.68264 18.6576 4.66027 18.7953C4.6379 18.933 4.64344 19.0739 4.67655 19.2094C4.70966 19.345 4.76967 19.4725 4.85302 19.5845C6.23538 21.5773 8.22055 23.0742 10.5168 23.8552C12.813 24.6361 15.2992 24.6598 17.6099 23.9229C19.9206 23.186 21.9341 21.7273 23.3542 19.7612C24.7744 17.7951 25.5265 15.4253 25.4999 13.0001C25.5102 9.97603 24.3205 7.07138 22.192 4.9233C20.0634 2.77521 17.1697 1.55911 14.1457 1.54175Z" fill="white"/>
                <path d="M14.0417 6.698C13.7654 6.698 13.5004 6.80774 13.3051 7.0031C13.1097 7.19845 13 7.4634 13 7.73966V13.0001C13.0044 13.2754 13.1136 13.5388 13.3052 13.7365L16.4302 16.8897C16.6263 17.0827 16.89 17.1915 17.1652 17.1928C17.4403 17.1942 17.7051 17.088 17.9031 16.897C18.0992 16.7024 18.2101 16.438 18.2112 16.1618C18.2124 15.8856 18.1038 15.6202 17.9094 15.424L15.0833 12.572V7.73966C15.0833 7.4634 14.9736 7.19845 14.7782 7.0031C14.5829 6.80774 14.3179 6.698 14.0417 6.698Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_960_9796">
                <rect width="25" height="25" fill="white" transform="translate(0.5 0.5)"/>
                </clipPath>
                </defs>
              </svg>
                </div>
              )}
                <div className="notification-container-header-text">
                  <h3>{role === 'admin' ? 'History Reminder' : 'Notification'}</h3>
                </div>
                {role !== 'admin' && (
                <div className="notification-container-header-button">
                  <button type='button' onClick={markAllAsRead}>
                    <img src={RefreshNotifi} alt="refresh" />
                  </button>
                </div>)}
              </div>
              {role === 'admin' && (
              <div className="notification-container-header-select">
                <MonthSelect type="notification"  onChange={handleTypeOfNotifySelect}  />
              </div>)}
              </div>
              <div className="notification-container-content">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <div key={notification.id} className="notification-container-content-notifi_field"
                    style={{
                      borderRadius: role === 'admin' ? '8px' : '0px', // Fixed spacing in the ternary operation
                      border: role === 'admin' ? `0.4px solid ${notification.border} ` : '' // Fixed border syntax order
                    }}>
                    
                      <div className='notification-container-content-notifi_field-mark_container-mark'
                        style={{ backgroundColor: notification.color }}>
                        {notification.type === 'Good Job' ? (
                          <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.633 5.59855C22.9007 5.28265 23.0317 4.87105 22.9935 4.45801C22.9539 4.04497 22.7503 3.66503 22.4287 3.40311L19.6863 1.18391C19.0243 0.648546 18.0529 0.750726 17.5175 1.41202L9.1207 11.7891L5.1371 8.43083C4.37866 7.79112 3.25899 7.83933 2.5574 8.53948L0.451181 10.645C0.148237 10.9479 -0.0143889 11.3638 0.000722323 11.792C0.0165531 12.2209 0.210121 12.621 0.534652 12.9016L8.52777 19.7844C8.83863 20.0528 9.24303 20.1859 9.65176 20.1535C10.0605 20.1219 10.4404 19.929 10.7059 19.616L22.633 5.59855Z" fill="white" />
                          </svg>
                        ) : (
                          '!'
                        )}
                      </div>

                      <div className="notification-container-content-notifi_field-text">
                        <div className="notification-container-content-notifi_field-text-header">
                          <h3>{notification.type}</h3>
                        </div>
                        <div className="notification-container-content-notifi_field-text-paragraph">
                          <p>{notification.message}</p>
                        </div>
                        {notification.date && (
                          <div className="notification-container-content-notifi_field-text-date">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0.5 10H9.5C9.63261 10 9.75978 9.94732 9.85355 9.85355C9.94732 9.75978 10 9.63261 10 9.5V2C10 1.86739 9.94732 1.74021 9.85355 1.64645C9.75978 1.55268 9.63261 1.5 9.5 1.5H7.5V0.5C7.5 0.367392 7.44732 0.240215 7.35355 0.146447C7.25978 0.0526784 7.13261 0 7 0C6.86739 0 6.74021 0.0526784 6.64645 0.146447C6.55268 0.240215 6.5 0.367392 6.5 0.5V1.5H3.5V0.5C3.5 0.367392 3.44732 0.240215 3.35355 0.146447C3.25978 0.0526784 3.13261 0 3 0C2.86739 0 2.74021 0.0526784 2.64645 0.146447C2.55268 0.240215 2.5 0.367392 2.5 0.5V1.5H0.5C0.367392 1.5 0.240215 1.55268 0.146447 1.64645C0.0526784 1.74021 0 1.86739 0 2V9.5C0 9.63261 0.0526784 9.75978 0.146447 9.85355C0.240215 9.94732 0.367392 10 0.5 10ZM1 2.5H9V4H1V2.5ZM1 5H9V9H1V5Z" fill="#4BF0FC" fillOpacity="0.75" />
                            </svg>
                            {notification.date}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No notifications available.</p>
                )}
              </div>
            </div>
          )}
        </BoxContainer>
      </div>
    )
  );
};

export default Notification;
