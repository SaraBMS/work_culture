import React, { useState } from 'react';
import BoxContainer from './home/BoxContainer';
import { useAuth, useEmail, useRole } from '../../hook/EmailProvider';
import { useStateContext } from '../../hook/ContextProvider';

const cardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '20px',
};

const panelStyle = {
  padding: '24px',
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(2, 14, 24, 0.95) 0%, rgba(3, 9, 17, 0.98) 100%)',
  border: '1px solid rgba(1, 185, 253, 0.22)',
  boxShadow: '0 0 30px rgba(1, 185, 253, 0.08)',
};

const titleStyle = {
  margin: 0,
  color: '#fff',
  fontSize: '20px',
  fontWeight: 600,
};

const labelStyle = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '12px',
  marginBottom: '6px',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const valueStyle = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: 500,
};

const chipStyle = (active) => ({
  padding: '10px 14px',
  borderRadius: '999px',
  border: `1px solid ${active ? 'rgba(1, 185, 253, 0.65)' : 'rgba(255,255,255,0.14)'}`,
  background: active ? 'rgba(1, 185, 253, 0.16)' : 'rgba(255,255,255,0.04)',
  color: active ? '#01B9FD' : '#E7F7FF',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
});

const statRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '14px',
  marginTop: '18px',
};

const statCardStyle = {
  padding: '16px',
  borderRadius: '18px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const Settings = () => {
  const { user } = useAuth();
  const { name, email, agency } = useEmail();
  const { role } = useRole();
  const { notifications, hasNotification } = useStateContext();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reminderHistory, setReminderHistory] = useState(true);
  const [compactPanels, setCompactPanels] = useState(false);

  const displayName = name || user?.name || (role === 'admin' ? 'Admin Manager' : 'Team Member');
  const displayEmail = email || user?.email || (role === 'admin' ? 'admin@workculture.app' : 'member@workculture.app');
  const displayAgency = (agency || user?.selectedOption2 || 'ProSyro').trim();
  const displayPhone = user?.number || '+963 999 000 000';
  const displayBio = user?.bio || 'Keeping the workspace organized, responsive, and full of ready-to-use data.';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'WC';

  return (
    <div className='profile' style={{ width: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ ...titleStyle, fontSize: '28px', marginBottom: '8px' }}>Settings</h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.58)', fontSize: '14px' }}>
          Manage your account, workspace options, and admin access details.
        </p>
      </div>

      <div style={cardGridStyle}>
        <BoxContainer filled>
          <div style={panelStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '20px',
                  background: 'linear-gradient(135deg, rgba(1,185,253,0.95), rgba(35,193,255,0.25))',
                  boxShadow: '0 0 24px rgba(1,185,253,0.28)',
                }}
              >
                {initials}
              </div>
              <div>
                <h2 style={titleStyle}>{displayName}</h2>
                <p style={{ margin: '6px 0 0', color: '#01B9FD', fontSize: '14px' }}>
                  {role === 'admin' ? 'Administrator Access' : 'User Access'}
                </p>
              </div>
            </div>

            <div style={statRowStyle}>
              <div style={statCardStyle}>
                <div style={labelStyle}>Email</div>
                <div style={valueStyle}>{displayEmail}</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Agency</div>
                <div style={valueStyle}>{displayAgency}</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Phone</div>
                <div style={valueStyle}>{displayPhone}</div>
              </div>
            </div>

            <div style={{ marginTop: '18px' }}>
              <div style={labelStyle}>Bio</div>
              <div style={{ ...valueStyle, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)' }}>
                {displayBio}
              </div>
            </div>
          </div>
        </BoxContainer>

        <BoxContainer filled>
          <div style={panelStyle}>
            <h2 style={titleStyle}>Workspace Status</h2>
            <div style={statRowStyle}>
              <div style={statCardStyle}>
                <div style={labelStyle}>Visible Tabs</div>
                <div style={valueStyle}>{role === 'admin' ? 'All dashboard tabs' : 'User dashboard tabs'}</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Notifications</div>
                <div style={valueStyle}>{notifications.length} items</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Unread Status</div>
                <div style={valueStyle}>{hasNotification ? 'Needs review' : 'All caught up'}</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Screen Mode</div>
                <div style={valueStyle}>Responsive desktop</div>
              </div>
            </div>
          </div>
        </BoxContainer>

        <BoxContainer filled>
          <div style={panelStyle}>
            <h2 style={titleStyle}>Preferences</h2>
            <p style={{ margin: '10px 0 18px', color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>
              These controls work locally so the page never looks empty.
            </p>

            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ ...statCardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={labelStyle}>Email Alerts</div>
                  <div style={valueStyle}>Reminder and question updates</div>
                </div>
                <button type='button' style={chipStyle(emailAlerts)} onClick={() => setEmailAlerts((prev) => !prev)}>
                  {emailAlerts ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div style={{ ...statCardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={labelStyle}>Reminder History</div>
                  <div style={valueStyle}>Keep admin reminder cards visible</div>
                </div>
                <button type='button' style={chipStyle(reminderHistory)} onClick={() => setReminderHistory((prev) => !prev)}>
                  {reminderHistory ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div style={{ ...statCardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={labelStyle}>Panel Density</div>
                  <div style={valueStyle}>Use a tighter card layout on desktop</div>
                </div>
                <button type='button' style={chipStyle(compactPanels)} onClick={() => setCompactPanels((prev) => !prev)}>
                  {compactPanels ? 'Compact' : 'Comfortable'}
                </button>
              </div>
            </div>
          </div>
        </BoxContainer>

        <BoxContainer filled>
          <div style={panelStyle}>
            <h2 style={titleStyle}>Quick Summary</h2>
            <div style={statRowStyle}>
              <div style={statCardStyle}>
                <div style={labelStyle}>Primary Role</div>
                <div style={valueStyle}>{role === 'admin' ? 'Admin' : 'User'}</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Question Flow</div>
                <div style={valueStyle}>{role === 'admin' ? 'Answer and manage' : 'Ask and follow up'}</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Data Source</div>
                <div style={valueStyle}>Local JSON mock API</div>
              </div>
              <div style={statCardStyle}>
                <div style={labelStyle}>Session State</div>
                <div style={valueStyle}>Saved locally</div>
              </div>
            </div>
          </div>
        </BoxContainer>
      </div>
    </div>
  );
};

export default Settings;
