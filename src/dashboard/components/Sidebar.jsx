import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './sidebar.css';
import logo from '../../assets/images/logo.png';
import logoIcon from '../../assets/images/logoIcon.svg';
import Arrow from './Arrow';
import { useStateContext } from '../../hook/ContextProvider';
import { useAuth, useRole } from '../../hook/EmailProvider';

const Logo = ({ activeMenu }) => (
  <img
    src={activeMenu ? logo : logoIcon}
    alt='logo'
    className={`logo ${activeMenu ? 'expanded' : 'collapsed'}`}
  />
);

const ToggleButton = ({ activeMenu, setActiveMenu }) => (
  <button
    type='button'
    className={`arrow_close ${activeMenu ? 'open' : 'closed'}`}
    onClick={() => setActiveMenu(prevState => !prevState)}
  >
    <Arrow />
  </button>
); 

const LogoutButton = ({ activeMenu, onLogout }) => (
  <div className={`logout_button ${activeMenu ? '' : 'collapsed'}`}>
    <button type='button' onClick={onLogout}>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
          
      >
        <path
          d='M12.9582 2.41663C10.3119 2.41663 8.16658 4.56193 8.16658 7.20829C8.16658 7.73756 8.59564 8.16663 9.12491 8.16663C9.65418 8.16663 10.0832 7.73756 10.0832 7.20829C10.0832 5.62048 11.3705 4.33329 12.9582 4.33329H16.7916C18.3794 4.33329 19.6666 5.62048 19.6666 7.20829V16.7916C19.6666 18.3795 18.3794 19.6666 16.7916 19.6666H12.9582C11.3705 19.6666 10.0832 18.3795 10.0832 16.7916C10.0832 16.2623 9.65418 15.8333 9.12491 15.8333C8.59564 15.8333 8.16658 16.2623 8.16658 16.7916C8.16658 19.438 10.3119 21.5833 12.9582 21.5833H16.7916C19.4379 21.5833 21.5832 19.438 21.5832 16.7916V7.20829C21.5832 4.56193 19.4379 2.41663 16.7916 2.41663H12.9582Z'
          fill='white'
        />
        <path
          d='M13.9166 11.0416C14.4459 11.0416 14.8749 11.4707 14.8749 12C14.8749 12.5292 14.4459 12.9583 13.9166 12.9583V11.0416Z'
          fill='white'
        />
        <path
          d='M5.97958 11.0417C6.06489 10.9365 6.14663 10.8344 6.22395 10.7369C6.45921 10.4401 6.65839 10.1796 6.79903 9.99279C6.86942 9.89931 6.92531 9.82409 6.9639 9.77183L7.00853 9.71116L7.02049 9.6948L7.02473 9.68899C7.02477 9.68893 7.02521 9.68832 6.24991 9.12503L7.02473 9.68899C7.33582 9.2608 7.24139 8.66082 6.8132 8.34972C6.38503 8.03863 5.78576 8.13354 5.47464 8.56167L5.47194 8.56538L5.46213 8.5788L5.42211 8.6332C5.38671 8.68115 5.33436 8.7516 5.26785 8.83992C5.13471 9.01676 4.94545 9.26439 4.72209 9.54609C4.27049 10.1157 3.69852 10.8003 3.17643 11.3224L2.49878 12L3.17643 12.6777C3.69852 13.1998 4.27049 13.8844 4.72209 14.4539C4.94545 14.7357 5.13471 14.9833 5.26785 15.1601C5.33436 15.2485 5.38671 15.3189 5.42211 15.3668L5.46213 15.4213L5.47194 15.4347L5.47417 15.4378C5.78529 15.8658 6.38503 15.9614 6.8132 15.6503C7.24139 15.3392 7.33631 14.7399 7.02521 14.3117L6.24991 14.875C7.02521 14.3117 7.02526 14.3118 7.02521 14.3117L7.02049 14.3053L7.00853 14.2889L6.9639 14.2282C6.92531 14.1759 6.86942 14.1008 6.79903 14.0073C6.65839 13.8205 6.45921 13.5599 6.22395 13.2631C6.14663 13.1656 6.06489 13.0636 5.97958 12.9584H13.9166V11.0417H5.97958Z'
          fill='white'
        />
      </svg>
      {activeMenu && <span>Logout</span>}
    </button>
  </div>
);
const AskButton = ({ activeMenu,
  openpopUp  }) => (
  <div className={` item faq-item ${activeMenu ? '' : 'collapsed'}`}>
    <button
       type='button'
       onClick={openpopUp}>
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 17.3334C11.2306 17.3334 12.9223 16.8447 14.3612 15.929C15.8002 15.0133 16.9217 13.7118 17.5839 12.1891C18.2462 10.6664 18.4195 8.99084 18.0819 7.37433C17.7442 5.75782 16.9109 4.27297 15.6872 3.10753C14.4635 1.94209 12.9044 1.14842 11.207 0.826874C9.50971 0.505331 7.75037 0.670359 6.15152 1.30109C4.55267 1.93182 3.1861 2.99992 2.22464 4.37033C1.26318 5.74074 0.75 7.35191 0.75 9.00008C0.75 11.2102 1.67187 13.3298 3.31282 14.8926C4.12533 15.6665 5.08992 16.2803 6.15152 16.6991C7.21312 17.1179 8.35093 17.3334 9.5 17.3334ZM9.5 15.6667C9.24041 15.6667 8.98665 15.5934 8.77081 15.4561C8.55497 15.3187 8.38675 15.1235 8.28741 14.8951C8.18807 14.6667 8.16208 14.4154 8.21272 14.1729C8.26336 13.9304 8.38837 13.7077 8.57192 13.5329C8.75548 13.3581 8.98934 13.239 9.24394 13.1908C9.49854 13.1425 9.76244 13.1673 10.0023 13.2619C10.2421 13.3565 10.4471 13.5167 10.5913 13.7223C10.7355 13.9278 10.8125 14.1695 10.8125 14.4167C10.8125 14.7483 10.6742 15.0662 10.4281 15.3006C10.1819 15.5351 9.8481 15.6667 9.5 15.6667ZM6 6.49508C5.9871 5.85485 6.17272 5.22521 6.53364 4.68493C6.89456 4.14466 7.41474 3.71774 8.02912 3.45758C8.57393 3.22585 9.17123 3.12851 9.76595 3.17453C10.3607 3.22055 10.9336 3.40846 11.432 3.72092C11.8916 4.01069 12.2728 4.39973 12.5446 4.85636C12.8164 5.31298 12.9711 5.82429 12.9962 6.34866C13.0213 6.87302 12.916 7.39561 12.6889 7.87387C12.4617 8.35214 12.1192 8.77257 11.6892 9.10092C11.0862 9.54351 10.6525 10.1624 10.4546 10.8626C10.4001 11.0774 10.2582 11.2628 10.0601 11.378C9.86206 11.4932 9.62407 11.5287 9.3985 11.4768C9.17293 11.4248 8.97827 11.2897 8.85733 11.101C8.73639 10.9124 8.69909 10.6857 8.75362 10.4709C9.03845 9.41246 9.68489 8.47432 10.5911 7.80425C10.8065 7.64017 10.9781 7.42992 11.092 7.19066C11.2058 6.95139 11.2587 6.68988 11.2462 6.42747C11.2338 6.16505 11.1564 5.90915 11.0203 5.68064C10.8843 5.45214 10.6934 5.25749 10.4634 5.11258C10.2056 4.95192 9.90899 4.85685 9.60171 4.83642C9.29443 4.816 8.98678 4.87091 8.70812 4.99592C8.41264 5.13061 8.16448 5.34398 7.99366 5.61019C7.82284 5.8764 7.73669 6.18405 7.74562 6.49592C7.73054 6.70625 7.63232 6.90333 7.47073 7.04743C7.30915 7.19153 7.09622 7.27195 6.87485 7.27248C6.65348 7.27301 6.44013 7.19361 6.27779 7.05028C6.11545 6.90695 6.01619 6.71035 6 6.50008V6.49508Z" fill="url(#paint0_linear_679_2478)" />
            <defs>
                <linearGradient id="paint0_linear_679_2478" x1="-3.82661" y1="-17.3157" x2="33.4959" y2="-8.13557" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FEFC" />
                    <stop offset="1" stopColor="#0002FE" />
                </linearGradient>
            </defs>
        </svg>
        
      {activeMenu && <span>Ask Question</span>}
    </button>
  </div>
);

const Sidebar = ({ routes }) => {
  const { activeMenu, setActiveMenu, screenSize, setscreenSize, openpopUp } = useStateContext();
  const { role } = useRole(); 
  const { logout } = useAuth();
  const navigate = useNavigate();
  // const {role}  = {role : 'admin'};


  useEffect(() => {
    const handleResize = () => setscreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setscreenSize]);

  useEffect(() => {
    if (activeMenu && screenSize <= 900) setActiveMenu(false);
  }, [activeMenu, screenSize, setActiveMenu]);

  // Admin should be able to access the full dashboard tabs, not only admin-only pages.
  const filteredRoutes = role === 'admin'
    ? routes
    : routes.filter(route => route.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  
  return (
    <div className={`sidecontainer ${activeMenu ? 'active' : 'collapsed'}`}>
      <div className={`sidecontainer-sidebar ${activeMenu ? '' : 'collapsed'}`}>
        <div className='sidecontainer-sidebar-content'>
          <ToggleButton activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          <Logo activeMenu={activeMenu} />
        </div>
        <div className={`sidecontainer-sidebar-content-items ${activeMenu ? '' : 'collapsed'}`}>
          {filteredRoutes.map(route => (
            <div
              key={route.name}
              className={`item ${!activeMenu ? 'collapsed' : ''} ${route.name === 'Home' ? 'home_shadow' : ''}`}
            >
              <NavLink
                to={`/admin/${route.path}`} 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {route.icon}
                {activeMenu && <span>{route.name}</span>}
              </NavLink>
            </div>
          ))}
          {role !== 'admin' && <AskButton activeMenu={activeMenu} openpopUp={openpopUp} />}
          <LogoutButton activeMenu={activeMenu} onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
