import React,{ useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import './navbar.css';
import profile from '../../assets/images/profile_pic.svg';
import arrowLeft from '../../assets/images/arrowLeft.svg';
import arrowRight from '../../assets/images/arrowRight.svg';
import { useStateContext } from '../../hook/ContextProvider';
import { useRole } from '../../hook/EmailProvider';
import { useImage, useEmail } from '../../hook/EmailProvider';
import api from '../../api/SignUpAPI';
import Refresh from '../../assets/images/refreshButton.svg';
import notificationBell from '../../assets/images/notificationBell.svg';
import NotifiBell from '../../assets/images/NotifiBell.svg';

const Navbar = ({teamMateId }) => {
  const { activeMenu, activeNotify, setActiveNotify, hasNotification, setHasNotification } = useStateContext();
  const { image } = useImage();
  const location = useLocation();
  const { pathname } = location;
  const {role} = useRole();
  // const {role}  = {role : 'admin'};
  const notificationRef = useRef(null);

  const isProfileMatePage = pathname.includes('/admin/profilemate/');
  const [teamMateName, setTeamMateName] = useState('');
  const { sendReminder, setteamMate, teamMate } = useStateContext();

  const handleSendReminder = () => {
    setteamMate(teamMate); // Set teammate details in context
    sendReminder(); // Trigger reminder display
};

  useEffect(() => {
    if (teamMateId) {
      const fetchTeamMate = async () => {
        try {
          const response = await api.get(`/SignUpAPI/${teamMateId}`);
          setTeamMateName(response.data ? response.data.name : '');  // Set the team mate's name
        } catch (error) {
          console.error('Error fetching teamMate:', error);
        }
      };
      fetchTeamMate();
    }
  }, [teamMateId]);

  // Toggle the notification visibility and icon
  const toggleNotification = () => {
    setActiveNotify((prevState) => ({
      ...prevState,
      notification: !prevState.notification,
    }));

    // Remove the notification red circle (once opened)
    if (hasNotification) {
      setHasNotification(false);
    }
  };

  // Close notification panel if clicked outside
  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setActiveNotify((prevState) => ({
        ...prevState,
        notification: false,
      }));
    }
  };

  // Adding event listener for clicks outside notification
  // useEffect(() => {
  //   if (activeNotify.notification) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   } else {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   }

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [activeNotify.notification]);

  const renderNotificationBell = () => (
    <button
      type='button'
      className='notification-btn'
      onClick={toggleNotification}
    >
      <img
        src={hasNotification ? NotifiBell : notificationBell}
        alt="notification"
        className='notifi_img'
      />
    </button>
  );

  const renderAdditionalContent = () => (
    <div className={`navcontainer ${activeMenu ? "active" : ''}`} ref={notificationRef}>
      <img src={image || profile} alt="your_image" className="pro_img" />
      
      {/* Conditional rendering for notification bell */}
      {(role !== 'admin' ) && renderNotificationBell()}
    </div>
  );
  

  let pageContent = null;

  switch (pathname) {
    case "/admin/home/setter":
      pageContent = (
        <div className="additional-content">
          <div className="additional-content-left">
            <div className="navbar-setter-text">
              <span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.82 4H21C21 4 20.96 7.45 16.88 10C17.18 9.4 17.38 8.74 17.44 8.04L17.82 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.18 4H3C3 4 3.04 7.45 7.12 10C6.82 9.4 6.62 8.74 6.56 8.04L6.18 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.59 12.76C13.47 13.07 13.36 13.46 13.31 13.89C13.26 14.28 13.27 14.63 13.31 14.92C13.36 15.36 13.47 15.75 13.6 16.06C13.4 16.02 13.2 16 13 16H11C10.8 16 10.6 16.02 10.4 16.06C10.53 15.75 10.64 15.36 10.69 14.92C10.73 14.63 10.74 14.28 10.69 13.89C10.64 13.46 10.53 13.07 10.41 12.76C10.92 12.92 11.45 13 12 13C12.55 13 13.08 12.92 13.59 12.76Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 13C9.18 13 6.82 10.85 6.56 8.04L6 2H18L17.44 8.04C17.18 10.85 14.82 13 12 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 19H8C8 17.34 9.34 16 11 16H13C14.66 16 16 17.34 16 19Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 22H5C5 20.34 6.34 19 8 19H16C17.66 19 19 20.34 19 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className="actualwork_container-header-text">
                Current Setter 22 <span> (Actual Work)</span>
              </div>
            </div>
          </div>
          <div className="additional-content-rigth">
          <button className="navbar-setter-button">This Setter</button>
          <div className="SetterChange">
            <button><img src={arrowLeft} alt="arrowLeft" /></button>
            <div className="SetterChange-text">
              Setter 22
              <span className='date'> 12Apr-17Apr</span>
            </div>
            <button><img src={arrowRight} alt="arrowRight" /></button>
          </div>
          </div>
          {renderAdditionalContent()}
        </div>
      );
      break;
    case "/admin/calendar":
      pageContent = (
        <div className="additional-content">
        <div className="additional-content-left">
          <div className="navbar-setter-text">
            <span>
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_149_6698)">
                <path d="M23.841 16.224C25.6189 16.224 27.0605 14.7834 27.0605 13.0055C27.0605 11.2276 25.6189 9.78601 23.841 9.78601C22.0636 9.78601 20.6219 11.2276 20.6219 13.0055C20.622 14.7834 22.0636 16.224 23.841 16.224Z" fill="white"/>
                <path d="M27.9633 19.3262C27.8198 18.4643 27.1073 17.2578 26.568 16.7189C26.4969 16.6475 26.1794 16.631 26.0937 16.6841C25.438 17.0874 24.6677 17.3247 23.8411 17.3247C23.0154 17.3247 22.2451 17.0874 21.5893 16.6841C21.5032 16.631 21.1861 16.6475 21.1151 16.7189C20.9643 16.8697 20.7998 17.0704 20.6394 17.3031C21.0733 18.1202 21.4175 18.9881 21.5417 19.7354C21.6658 20.4846 21.6255 21.1939 21.4248 21.8406C22.1378 22.0985 22.9928 22.2117 23.841 22.2117C26.0534 22.2117 28.3175 21.4446 27.9633 19.3262Z" fill="white"/>
                <path d="M13.9173 14.8659C16.7986 14.8659 19.1346 12.5299 19.1346 9.64861C19.1346 6.76822 16.7986 4.43219 13.9173 4.43219C11.0365 4.43219 8.70129 6.76822 8.70129 9.64861C8.70129 12.5299 11.0364 14.8659 13.9173 14.8659Z" fill="white"/>
                <path d="M18.335 15.665C18.2218 15.5523 17.7077 15.5235 17.5679 15.61C16.5043 16.2644 15.2562 16.6475 13.9172 16.6475C12.5792 16.6475 11.3305 16.2644 10.2675 15.61C10.1278 15.5234 9.61365 15.5523 9.50045 15.665C8.6243 16.5402 7.46957 18.4969 7.23726 19.8917C6.66446 23.3275 10.3344 24.5679 13.9172 24.5679C17.501 24.5679 21.1709 23.3275 20.5981 19.8917C20.3658 18.4969 19.2111 16.5402 18.335 15.665Z" fill="white"/>
                <path d="M4.15896 16.224C5.93641 16.224 7.37798 14.7834 7.37798 13.0055C7.37798 11.2276 5.93641 9.78601 4.15896 9.78601C2.38102 9.78601 0.939453 11.2276 0.939453 13.0055C0.939453 14.7834 2.38102 16.224 4.15896 16.224Z" fill="white"/>
                <path d="M6.29423 19.7354C6.42624 18.9505 6.79872 18.0263 7.2657 17.1717C7.13554 16.9939 7.00544 16.839 6.88535 16.7189C6.81431 16.6475 6.49723 16.631 6.4111 16.6841C5.75534 17.0874 4.98506 17.3247 4.15896 17.3247C3.33274 17.3247 2.56197 17.0874 1.90676 16.6841C1.82101 16.631 1.50306 16.6475 1.43202 16.7189C0.891323 17.2578 0.180659 18.4643 0.0367214 19.3262C-0.316997 21.4446 1.94663 22.2117 4.15896 22.2117C4.94848 22.2117 5.74577 22.1145 6.42624 21.8923C6.21181 21.2325 6.16642 20.5066 6.29423 19.7354Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_149_6698">
                <rect width="28" height="28" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
                </defs>
            </svg>
            </span>
            <div className="additional_content_container-header-text ">
                Setters
                
            </div>
            <div className="additional-content-left-refresh">
            <button type='button' >
                <img src={Refresh} alt="refresh" />
            </button>
            </div>
          </div>
        </div>
        <div className="additional-content-rigth">
        <button className="navbar-setter-button">This Setter</button>
        <div className="SetterChange">
          <button type='button'><img src={arrowLeft} alt="arrowLeft" /></button>
          <div className="SetterChange-text">
            Setter 22
            <span className='date'> 12Apr-17Apr</span>
          </div>
          <button type='button'><img src={arrowRight} alt="arrowRight" /></button>
        </div>
        </div>      
          {renderAdditionalContent()}
        </div>
      );
      break;
    case "/admin/team":
      pageContent = (
        <div className="additional-content">
        <div className="additional-content-left">
          <div className="navbar-setter-text">
            <span>
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_149_6698)">
                <path d="M23.841 16.224C25.6189 16.224 27.0605 14.7834 27.0605 13.0055C27.0605 11.2276 25.6189 9.78601 23.841 9.78601C22.0636 9.78601 20.6219 11.2276 20.6219 13.0055C20.622 14.7834 22.0636 16.224 23.841 16.224Z" fill="white"/>
                <path d="M27.9633 19.3262C27.8198 18.4643 27.1073 17.2578 26.568 16.7189C26.4969 16.6475 26.1794 16.631 26.0937 16.6841C25.438 17.0874 24.6677 17.3247 23.8411 17.3247C23.0154 17.3247 22.2451 17.0874 21.5893 16.6841C21.5032 16.631 21.1861 16.6475 21.1151 16.7189C20.9643 16.8697 20.7998 17.0704 20.6394 17.3031C21.0733 18.1202 21.4175 18.9881 21.5417 19.7354C21.6658 20.4846 21.6255 21.1939 21.4248 21.8406C22.1378 22.0985 22.9928 22.2117 23.841 22.2117C26.0534 22.2117 28.3175 21.4446 27.9633 19.3262Z" fill="white"/>
                <path d="M13.9173 14.8659C16.7986 14.8659 19.1346 12.5299 19.1346 9.64861C19.1346 6.76822 16.7986 4.43219 13.9173 4.43219C11.0365 4.43219 8.70129 6.76822 8.70129 9.64861C8.70129 12.5299 11.0364 14.8659 13.9173 14.8659Z" fill="white"/>
                <path d="M18.335 15.665C18.2218 15.5523 17.7077 15.5235 17.5679 15.61C16.5043 16.2644 15.2562 16.6475 13.9172 16.6475C12.5792 16.6475 11.3305 16.2644 10.2675 15.61C10.1278 15.5234 9.61365 15.5523 9.50045 15.665C8.6243 16.5402 7.46957 18.4969 7.23726 19.8917C6.66446 23.3275 10.3344 24.5679 13.9172 24.5679C17.501 24.5679 21.1709 23.3275 20.5981 19.8917C20.3658 18.4969 19.2111 16.5402 18.335 15.665Z" fill="white"/>
                <path d="M4.15896 16.224C5.93641 16.224 7.37798 14.7834 7.37798 13.0055C7.37798 11.2276 5.93641 9.78601 4.15896 9.78601C2.38102 9.78601 0.939453 11.2276 0.939453 13.0055C0.939453 14.7834 2.38102 16.224 4.15896 16.224Z" fill="white"/>
                <path d="M6.29423 19.7354C6.42624 18.9505 6.79872 18.0263 7.2657 17.1717C7.13554 16.9939 7.00544 16.839 6.88535 16.7189C6.81431 16.6475 6.49723 16.631 6.4111 16.6841C5.75534 17.0874 4.98506 17.3247 4.15896 17.3247C3.33274 17.3247 2.56197 17.0874 1.90676 16.6841C1.82101 16.631 1.50306 16.6475 1.43202 16.7189C0.891323 17.2578 0.180659 18.4643 0.0367214 19.3262C-0.316997 21.4446 1.94663 22.2117 4.15896 22.2117C4.94848 22.2117 5.74577 22.1145 6.42624 21.8923C6.21181 21.2325 6.16642 20.5066 6.29423 19.7354Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_149_6698">
                <rect width="28" height="28" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
                </defs>
            </svg>
            </span>
            <div className="additional_content_container-header-text ">
                Team Mates
            </div>
            <div className="additional-content-left-refresh">
            <button type='button' >
                <img src={Refresh} alt="refresh" />
            </button>
            </div>
          </div>
        </div>
        <div className="additional-content-rigth">
        <button className="navbar-setter-button">This Setter</button>
        <div className="SetterChange">
          <button type='button'><img src={arrowLeft} alt="arrowLeft" /></button>
          <div className="SetterChange-text">
            Setter 22
            <span className='date'> 12Apr-17Apr</span>
          </div>
          <button type='button'><img src={arrowRight} alt="arrowRight" /></button>
        </div>
        </div>      
          {renderAdditionalContent()}
        </div>
      );
      break;
    case "/admin/profile":
      pageContent = (
        <div className="additional-content">
        <div className="additional-content-left">
          <div className="navbar-setter-text">
            <span>
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_149_6698)">
                <path d="M23.841 16.224C25.6189 16.224 27.0605 14.7834 27.0605 13.0055C27.0605 11.2276 25.6189 9.78601 23.841 9.78601C22.0636 9.78601 20.6219 11.2276 20.6219 13.0055C20.622 14.7834 22.0636 16.224 23.841 16.224Z" fill="white"/>
                <path d="M27.9633 19.3262C27.8198 18.4643 27.1073 17.2578 26.568 16.7189C26.4969 16.6475 26.1794 16.631 26.0937 16.6841C25.438 17.0874 24.6677 17.3247 23.8411 17.3247C23.0154 17.3247 22.2451 17.0874 21.5893 16.6841C21.5032 16.631 21.1861 16.6475 21.1151 16.7189C20.9643 16.8697 20.7998 17.0704 20.6394 17.3031C21.0733 18.1202 21.4175 18.9881 21.5417 19.7354C21.6658 20.4846 21.6255 21.1939 21.4248 21.8406C22.1378 22.0985 22.9928 22.2117 23.841 22.2117C26.0534 22.2117 28.3175 21.4446 27.9633 19.3262Z" fill="white"/>
                <path d="M13.9173 14.8659C16.7986 14.8659 19.1346 12.5299 19.1346 9.64861C19.1346 6.76822 16.7986 4.43219 13.9173 4.43219C11.0365 4.43219 8.70129 6.76822 8.70129 9.64861C8.70129 12.5299 11.0364 14.8659 13.9173 14.8659Z" fill="white"/>
                <path d="M18.335 15.665C18.2218 15.5523 17.7077 15.5235 17.5679 15.61C16.5043 16.2644 15.2562 16.6475 13.9172 16.6475C12.5792 16.6475 11.3305 16.2644 10.2675 15.61C10.1278 15.5234 9.61365 15.5523 9.50045 15.665C8.6243 16.5402 7.46957 18.4969 7.23726 19.8917C6.66446 23.3275 10.3344 24.5679 13.9172 24.5679C17.501 24.5679 21.1709 23.3275 20.5981 19.8917C20.3658 18.4969 19.2111 16.5402 18.335 15.665Z" fill="white"/>
                <path d="M4.15896 16.224C5.93641 16.224 7.37798 14.7834 7.37798 13.0055C7.37798 11.2276 5.93641 9.78601 4.15896 9.78601C2.38102 9.78601 0.939453 11.2276 0.939453 13.0055C0.939453 14.7834 2.38102 16.224 4.15896 16.224Z" fill="white"/>
                <path d="M6.29423 19.7354C6.42624 18.9505 6.79872 18.0263 7.2657 17.1717C7.13554 16.9939 7.00544 16.839 6.88535 16.7189C6.81431 16.6475 6.49723 16.631 6.4111 16.6841C5.75534 17.0874 4.98506 17.3247 4.15896 17.3247C3.33274 17.3247 2.56197 17.0874 1.90676 16.6841C1.82101 16.631 1.50306 16.6475 1.43202 16.7189C0.891323 17.2578 0.180659 18.4643 0.0367214 19.3262C-0.316997 21.4446 1.94663 22.2117 4.15896 22.2117C4.94848 22.2117 5.74577 22.1145 6.42624 21.8923C6.21181 21.2325 6.16642 20.5066 6.29423 19.7354Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_149_6698">
                <rect width="28" height="28" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
                </defs>
            </svg>
            </span>
            <div className="additional_content_container-header-text ">
               Profile
            </div>
            <div className="additional-content-left-refresh">
            <button type='button' >
                <img src={Refresh} alt="refresh" />
            </button>
            </div>
          </div>
        </div>     
          {renderAdditionalContent()}
        </div>
      );
      break;
    case "/admin/about-us":
      pageContent = (
        <div className="additional-content">
        <div className="additional-content-left">
          <div className="navbar-setter-text">
            <span>
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_149_6698)">
                <path d="M23.841 16.224C25.6189 16.224 27.0605 14.7834 27.0605 13.0055C27.0605 11.2276 25.6189 9.78601 23.841 9.78601C22.0636 9.78601 20.6219 11.2276 20.6219 13.0055C20.622 14.7834 22.0636 16.224 23.841 16.224Z" fill="white"/>
                <path d="M27.9633 19.3262C27.8198 18.4643 27.1073 17.2578 26.568 16.7189C26.4969 16.6475 26.1794 16.631 26.0937 16.6841C25.438 17.0874 24.6677 17.3247 23.8411 17.3247C23.0154 17.3247 22.2451 17.0874 21.5893 16.6841C21.5032 16.631 21.1861 16.6475 21.1151 16.7189C20.9643 16.8697 20.7998 17.0704 20.6394 17.3031C21.0733 18.1202 21.4175 18.9881 21.5417 19.7354C21.6658 20.4846 21.6255 21.1939 21.4248 21.8406C22.1378 22.0985 22.9928 22.2117 23.841 22.2117C26.0534 22.2117 28.3175 21.4446 27.9633 19.3262Z" fill="white"/>
                <path d="M13.9173 14.8659C16.7986 14.8659 19.1346 12.5299 19.1346 9.64861C19.1346 6.76822 16.7986 4.43219 13.9173 4.43219C11.0365 4.43219 8.70129 6.76822 8.70129 9.64861C8.70129 12.5299 11.0364 14.8659 13.9173 14.8659Z" fill="white"/>
                <path d="M18.335 15.665C18.2218 15.5523 17.7077 15.5235 17.5679 15.61C16.5043 16.2644 15.2562 16.6475 13.9172 16.6475C12.5792 16.6475 11.3305 16.2644 10.2675 15.61C10.1278 15.5234 9.61365 15.5523 9.50045 15.665C8.6243 16.5402 7.46957 18.4969 7.23726 19.8917C6.66446 23.3275 10.3344 24.5679 13.9172 24.5679C17.501 24.5679 21.1709 23.3275 20.5981 19.8917C20.3658 18.4969 19.2111 16.5402 18.335 15.665Z" fill="white"/>
                <path d="M4.15896 16.224C5.93641 16.224 7.37798 14.7834 7.37798 13.0055C7.37798 11.2276 5.93641 9.78601 4.15896 9.78601C2.38102 9.78601 0.939453 11.2276 0.939453 13.0055C0.939453 14.7834 2.38102 16.224 4.15896 16.224Z" fill="white"/>
                <path d="M6.29423 19.7354C6.42624 18.9505 6.79872 18.0263 7.2657 17.1717C7.13554 16.9939 7.00544 16.839 6.88535 16.7189C6.81431 16.6475 6.49723 16.631 6.4111 16.6841C5.75534 17.0874 4.98506 17.3247 4.15896 17.3247C3.33274 17.3247 2.56197 17.0874 1.90676 16.6841C1.82101 16.631 1.50306 16.6475 1.43202 16.7189C0.891323 17.2578 0.180659 18.4643 0.0367214 19.3262C-0.316997 21.4446 1.94663 22.2117 4.15896 22.2117C4.94848 22.2117 5.74577 22.1145 6.42624 21.8923C6.21181 21.2325 6.16642 20.5066 6.29423 19.7354Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_149_6698">
                <rect width="28" height="28" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
                </defs>
            </svg>
            </span>
            <div className="additional_content_container-header-text ">
               About Us
            </div>
          </div>
        </div>     
          {renderAdditionalContent()}
        </div>
      );
      break;
      case "/admin/control-panel":
        pageContent = (
          <div className="additional-content">
          <div className="additional-content-left">
            <div className="navbar-setter-text">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.8" fillRule="evenodd" clipRule="evenodd" d="M2.929 2.93L2.93 2.928L2.932 2.929L3.459 2.401C3.56234 2.29779 3.70108 2.23777 3.84706 2.23313C3.99304 2.22848 4.13531 2.27956 4.245 2.376L5.455 3.437C5.787 3.742 6.229 3.929 6.715 3.929C7.229 3.929 7.695 3.719 8.031 3.381C8.349 3.061 8.551 2.627 8.57 2.146H8.574L8.679 0.539C8.68865 0.393353 8.75332 0.256826 8.85991 0.157106C8.96651 0.0573849 9.10703 0.00193485 9.253 0.00200009H9.999H10.746C11.049 0.00200009 11.3 0.237 11.32 0.539L11.425 2.146H11.43C11.449 2.63 11.653 3.066 11.974 3.386C12.31 3.721 12.774 3.929 13.286 3.929C13.778 3.929 14.226 3.737 14.558 3.425L15.754 2.375C15.8638 2.27869 16.0062 2.22779 16.1521 2.23262C16.2981 2.23745 16.4368 2.29765 16.54 2.401L17.068 2.929L17.07 2.927V2.929L17.069 2.931L17.597 3.458C17.7004 3.56121 17.7606 3.69988 17.7654 3.84586C17.7702 3.99184 17.7193 4.13419 17.623 4.244L16.563 5.456C16.2463 5.79833 16.0706 6.24764 16.071 6.714C16.071 7.229 16.281 7.694 16.619 8.031C16.939 8.349 17.372 8.551 17.854 8.57V8.574L19.46 8.679C19.763 8.699 19.998 8.95 19.998 9.253V10H20V10.002H19.998V10.748C19.9981 10.894 19.9426 11.0345 19.8429 11.1411C19.7432 11.2477 19.6066 11.3124 19.461 11.322L17.854 11.429V11.43C17.37 11.45 16.934 11.653 16.614 11.974C16.279 12.31 16.071 12.774 16.071 13.286C16.071 13.772 16.258 14.214 16.564 14.546H16.562L17.624 15.757C17.824 15.985 17.812 16.329 17.598 16.543L17.07 17.071V17.073L16.541 17.6C16.4378 17.7031 16.2994 17.7631 16.1536 17.7679C16.0079 17.7727 15.8658 17.722 15.756 17.626L14.588 16.605C14.2412 16.2625 13.7734 16.0706 13.286 16.071C12.771 16.071 12.306 16.281 11.969 16.619C11.651 16.939 11.449 17.374 11.429 17.857H11.425L11.32 19.464C11.3107 19.6038 11.2508 19.7354 11.1513 19.8341C11.0519 19.9328 10.9199 19.9918 10.78 20H9.22C9.08014 19.9918 8.9481 19.9328 8.84867 19.8341C8.74924 19.7354 8.68926 19.6038 8.68 19.464L8.575 17.857H8.571C8.55352 17.3883 8.35873 16.9436 8.026 16.613C7.85397 16.441 7.64973 16.3046 7.42495 16.2116C7.20017 16.1186 6.95926 16.0708 6.716 16.071C6.212 16.071 5.756 16.271 5.421 16.597L4.244 17.627C4.13412 17.7229 3.99192 17.7734 3.84617 17.7684C3.70043 17.7634 3.56203 17.7032 3.459 17.6L2.931 17.072L2.93 17.071L2.402 16.543C2.29865 16.4398 2.23845 16.3011 2.23362 16.1551C2.22879 16.0092 2.27969 15.8668 2.376 15.757L3.438 14.547L3.437 14.546C3.75453 14.2033 3.93066 13.7532 3.93 13.286C3.93 12.771 3.72 12.306 3.382 11.969C3.05248 11.6402 2.61114 11.4478 2.146 11.43V11.429L0.539 11.322C0.393353 11.3124 0.256826 11.2477 0.157106 11.1411C0.0573849 11.0345 0.00193485 10.894 0.00200009 10.748V10.002H0V10L0.000999928 9.253C0.000999928 8.95 0.236 8.699 0.539 8.679L2.145 8.574V8.57C2.61304 8.55202 3.05687 8.35726 3.387 8.025C3.722 7.689 3.929 7.225 3.929 6.715C3.929 6.225 3.739 5.78 3.43 5.448L2.376 4.244C2.27969 4.13419 2.22879 3.99184 2.23362 3.84586C2.23845 3.69988 2.29865 3.56121 2.402 3.458L2.93 2.931L2.929 2.93ZM14.286 10C14.286 11.1367 13.8344 12.2269 13.0307 13.0307C12.2269 13.8344 11.1367 14.286 10 14.286C8.86328 14.286 7.77312 13.8344 6.96934 13.0307C6.16556 12.2269 5.714 11.1367 5.714 10C5.714 8.86328 6.16556 7.77312 6.96934 6.96934C7.77312 6.16556 8.86328 5.714 10 5.714C11.1367 5.714 12.2269 6.16556 13.0307 6.96934C13.8344 7.77312 14.286 8.86328 14.286 10Z" fill="#01B9FD" />
        </svg>
              <div className="actualwork_container-header-text ">
                Contol Panel <span> (Admin)</span>
              </div>
            </div>
          </div>     
            {renderAdditionalContent()}
          </div>
        );
      break;
      case "/admin/question":
        pageContent = (
          <div className="additional-content">
          <div className="additional-content-left">
            <div className="navbar-setter-text">
             <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 17.3334C11.2306 17.3334 12.9223 16.8447 14.3612 15.929C15.8002 15.0133 16.9217 13.7118 17.5839 12.1891C18.2462 10.6664 18.4195 8.99084 18.0819 7.37433C17.7442 5.75782 16.9109 4.27297 15.6872 3.10753C14.4635 1.94209 12.9044 1.14842 11.207 0.826874C9.50971 0.505331 7.75037 0.670359 6.15152 1.30109C4.55267 1.93182 3.1861 2.99992 2.22464 4.37033C1.26318 5.74074 0.75 7.35191 0.75 9.00008C0.75 11.2102 1.67187 13.3298 3.31282 14.8926C4.12533 15.6665 5.08992 16.2803 6.15152 16.6991C7.21312 17.1179 8.35093 17.3334 9.5 17.3334ZM9.5 15.6667C9.24041 15.6667 8.98665 15.5934 8.77081 15.4561C8.55497 15.3187 8.38675 15.1235 8.28741 14.8951C8.18807 14.6667 8.16208 14.4154 8.21272 14.1729C8.26336 13.9304 8.38837 13.7077 8.57192 13.5329C8.75548 13.3581 8.98934 13.239 9.24394 13.1908C9.49854 13.1425 9.76244 13.1673 10.0023 13.2619C10.2421 13.3565 10.4471 13.5167 10.5913 13.7223C10.7355 13.9278 10.8125 14.1695 10.8125 14.4167C10.8125 14.7483 10.6742 15.0662 10.4281 15.3006C10.1819 15.5351 9.8481 15.6667 9.5 15.6667ZM6 6.49508C5.9871 5.85485 6.17272 5.22521 6.53364 4.68493C6.89456 4.14466 7.41474 3.71774 8.02912 3.45758C8.57393 3.22585 9.17123 3.12851 9.76595 3.17453C10.3607 3.22055 10.9336 3.40846 11.432 3.72092C11.8916 4.01069 12.2728 4.39973 12.5446 4.85636C12.8164 5.31298 12.9711 5.82429 12.9962 6.34866C13.0213 6.87302 12.916 7.39561 12.6889 7.87387C12.4617 8.35214 12.1192 8.77257 11.6892 9.10092C11.0862 9.54351 10.6525 10.1624 10.4546 10.8626C10.4001 11.0774 10.2582 11.2628 10.0601 11.378C9.86206 11.4932 9.62407 11.5287 9.3985 11.4768C9.17293 11.4248 8.97827 11.2897 8.85733 11.101C8.73639 10.9124 8.69909 10.6857 8.75362 10.4709C9.03845 9.41246 9.68489 8.47432 10.5911 7.80425C10.8065 7.64017 10.9781 7.42992 11.092 7.19066C11.2058 6.95139 11.2587 6.68988 11.2462 6.42747C11.2338 6.16505 11.1564 5.90915 11.0203 5.68064C10.8843 5.45214 10.6934 5.25749 10.4634 5.11258C10.2056 4.95192 9.90899 4.85685 9.60171 4.83642C9.29443 4.816 8.98678 4.87091 8.70812 4.99592C8.41264 5.13061 8.16448 5.34398 7.99366 5.61019C7.82284 5.8764 7.73669 6.18405 7.74562 6.49592C7.73054 6.70625 7.63232 6.90333 7.47073 7.04743C7.30915 7.19153 7.09622 7.27195 6.87485 7.27248C6.65348 7.27301 6.44013 7.19361 6.27779 7.05028C6.11545 6.90695 6.01619 6.71035 6 6.50008V6.49508Z" fill="url(#paint0_linear_679_2478)"></path><defs><linearGradient id="paint0_linear_679_2478" x1="-3.82661" y1="-17.3157" x2="33.4959" y2="-8.13557" gradientUnits="userSpaceOnUse"><stop stop-color="#00FEFC"></stop><stop offset="1" stop-color="#0002FE"></stop></linearGradient></defs></svg>
              <div className="actualwork_container-header-text ">
                Questions <span> (Admin)</span>
              </div>
            </div>
          </div>     
            {renderAdditionalContent()}
          </div>
        );
        break;
        case "/admin/analytics":
          pageContent = (
            <div className="additional-content">
            <div className="additional-content-left">
              <div className="navbar-setter-text">
              <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1186_987)">
                      <path d="M0.47228 11.376H2.36105C2.62184 11.376 2.83333 11.5873 2.83333 11.8481V16.5704C2.83333 16.8311 2.62184 17.0426 2.36105 17.0426H0.47228C0.211497 17.0426 0 16.8311 0 16.5704V11.8481C0 11.5873 0.211497 11.376 0.47228 11.376Z" fill="#23C1FF" />
                      <path d="M5.19427 7.59814H7.08322C7.344 7.59814 7.5555 7.80964 7.5555 8.07042V16.5704C7.5555 16.8312 7.344 17.0427 7.08322 17.0427H5.19427C4.93349 17.0427 4.72217 16.8312 4.72217 16.5704V8.07042C4.72217 7.80964 4.93349 7.59814 5.19427 7.59814Z" fill="#23C1FF" />
                      <path d="M9.91662 9.48706H11.8056C12.0663 9.48706 12.2777 9.69856 12.2777 9.95934V16.5704C12.2777 16.8312 12.0663 17.0427 11.8056 17.0427H9.91662C9.65583 17.0427 9.44434 16.8312 9.44434 16.5704V9.95934C9.44434 9.69856 9.65583 9.48706 9.91662 9.48706Z" fill="#23C1FF" />
                      <path d="M14.6388 6.65356H16.5276C16.7883 6.65356 16.9998 6.86506 16.9998 7.12584V16.5702C16.9998 16.831 16.7883 17.0425 16.5276 17.0425H14.6388C14.378 17.0425 14.1665 16.831 14.1665 16.5702V7.12584C14.1665 6.86506 14.378 6.65356 14.6388 6.65356Z" fill="#23C1FF" />
                      <path d="M15.5833 0.987061C14.8013 0.987925 14.1675 1.62172 14.1667 2.40373C14.1686 2.55798 14.1959 2.71086 14.2476 2.85612L11.8836 4.26137C11.5734 3.93228 11.1236 3.77284 10.6753 3.83284C10.2269 3.89285 9.83504 4.16505 9.62216 4.56418L7.53711 3.53142C7.54731 3.47072 7.55336 3.40951 7.55561 3.34811C7.55665 2.77467 7.212 2.25725 6.68247 2.03711C6.15295 1.81714 5.54302 1.93802 5.13749 2.34337C4.73179 2.74873 4.61057 3.35849 4.83036 3.88818L2.12569 5.90666C1.91125 5.77886 1.66638 5.71072 1.41667 5.70934C0.634318 5.70934 0 6.34349 0 7.12601C0 7.90836 0.634318 8.54267 1.41667 8.54267C2.19902 8.54267 2.83333 7.90836 2.83333 7.12601C2.83212 6.95549 2.79996 6.78689 2.73839 6.62796L5.47004 4.58925C6.0044 4.88722 6.67089 4.79989 7.11031 4.37413L9.48139 5.54851C9.63945 6.25252 10.302 6.72498 11.0191 6.64508C11.7363 6.56519 12.2786 5.95871 12.2777 5.23706C12.2777 5.20109 12.2698 5.1672 12.2672 5.13192L14.8383 3.60336C15.0612 3.7443 15.3194 3.81953 15.5833 3.82039C16.3657 3.82039 17 3.18608 17 2.40373C17 1.62138 16.3657 0.987061 15.5833 0.987061Z" fill="#23C1FF" />
                  </g>
                  <defs>
                      <clipPath id="clip0_1186_987">
                          <rect width="17" height="17" fill="white" transform="translate(0 0.5)" />
                      </clipPath>
                  </defs>
              </svg>
                <div className="actualwork_container-header-text ">
                  Analytics <span> (Admin)</span>
                </div>
              </div>
            </div>     
              {renderAdditionalContent()}
            </div>
          );
        break;
    default:
  
          
      // If no path matches, render only additional content fixed navbar
      pageContent = renderAdditionalContent();
      break;
  }
 

  if  (isProfileMatePage) {
    // Handle dynamic route like /admin/profilemate/:id
    pageContent = (
      <div className="additional-content">
        <div className="additional-content-left">
          <div className="navbar-setter-text">
            <span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.82 4H21C21 4 20.96 7.45 16.88 10C17.18 9.4 17.38 8.74 17.44 8.04L17.82 4Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.18 4H3C3 4 3.04 7.45 7.12 10C6.82 9.4 6.62 8.74 6.56 8.04L6.18 4Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.59 12.76C13.47 13.07 13.36 13.46 13.31 13.89C13.26 14.28 13.27 14.63 13.31 14.92C13.36 15.36 13.47 15.75 13.6 16.06C13.4 16.02 13.2 16 13 16H11C10.8 16 10.6 16.02 10.4 16.06C10.53 15.75 10.64 15.36 10.69 14.92C10.73 14.63 10.74 14.28 10.69 13.89C10.64 13.46 10.53 13.07 10.41 12.76C10.92 12.92 11.45 13 12 13C12.55 13 13.08 12.92 13.59 12.76Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13C9.18 13 6.82 10.85 6.56 8.04L6 2H18L17.44 8.04C17.18 10.85 14.82 13 12 13Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 19H8C8 17.34 9.34 16 11 16H13C14.66 16 16 17.34 16 19Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 22H5C5 20.34 6.34 19 8 19H16C17.66 19 19 20.34 19 22Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="actualwork_container-header-text">
           { teamMateName } <span>(Setter 22)</span>
            </div>
          </div>
        </div>
        <div className="additional-content-right-teammate">
        {role ==='admin' && (
             <div className="team_mates-mates_container-feild-container-button mate_button">
                <button type='button' onClick={handleSendReminder}>Send Reminder</button>
             </div>
       )}
        </div>
        {renderAdditionalContent()}
      </div>
    );}

  return (
    <div className="navbar">
      {pageContent}
    </div>
  );
};

export default Navbar;
