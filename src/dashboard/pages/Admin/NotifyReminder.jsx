import React, { useState, useEffect } from 'react';
import './notifyreminder.css';
import { useStateContext } from '../../../hook/ContextProvider'; 
import { useEmail, useRole } from '../../../hook/EmailProvider';
import api from '../../../api/SignUpAPI';
// Example reminders data
const defaultReminders = [
    { id: 1, type: 'Hard Reminder', color: "#FF003D" },
        { id: 2, type: 'Soft Reminder', color: '#FFC85C' },
        { id: 3, type: 'Good Job', color: '#22A364' },
    ];

    const NotifyReminder = () => {
        const { showReminder, cancelReminder } = useStateContext();
        const { name, email, setNotifications } = useEmail();  
        const [isReminderVisible, setReminderVisible] = useState(false);
        const [selectedNotification, setSelectedNotification] = useState(null);
        const { role } = useRole();
        const [notificationMessage, setNotificationMessage] = useState(null); 
        const [notificationVisible, setNotificationVisible] = useState(false); 
        const [reminders, setReminders] = useState(defaultReminders);
    
        useEffect(() => {
            if (showReminder.reminder) {
                setReminderVisible(true);
            }
        }, [showReminder]);
    
        const handleSelectNotification = (reminder) => {
            setSelectedNotification(reminder);
        };
    
        const handleSendNotification = async () => {
            if (!selectedNotification ) {
                alert('Please select a notification type and ensure name and email are provided');
                return;
            }
    
            const newNotification = {
                id: Date.now(),
                type: selectedNotification.type,
                message: role === 'admin'
                    ? `${selectedNotification.type} has been sent from the admin to ${name} (${email})`
                    : `${selectedNotification.type} has been sent to you by the admin`,
                date: new Date().toLocaleDateString(),
                read: false,
                color: selectedNotification.color,
                border: role === 'admin' ? selectedNotification.color : 'none',
                email: email
            };
    
            try {
                const response = await api.post('/Notifications', newNotification);
                console.log('API Response:', response);
    
                if (response.status === 201) {
                    setNotificationMessage('Notification sent successfully');
                    setNotificationVisible(true);
                    setSelectedNotification('')
    
                    setNotifications(prevNotifications => {
                        const updatedNotifications = [...prevNotifications, response.data];
                        console.log('Updated Notifications Array:', updatedNotifications);
                        return updatedNotifications;
                    });
                } else {
                    setNotificationMessage('Failed to send notification');
                    setNotificationVisible(true);
                }
            } catch (error) {
                setNotificationMessage('Error sending notification');
                setNotificationVisible(true);
                console.error('Error sending notification:', error);
            }
    
            setReminderVisible(false);
            cancelReminder();
    
            setTimeout(() => {
                setNotificationVisible(false);
            }, 3000);
        };
    
        return (
            isReminderVisible && (
                <div className={`notifireminder ${showReminder.reminder ? 'show' : ''}`}>
                    <div className="notifireminder-container">
                        <div className="notifireminder-container-header">
                            <h2>What kind of Reminder do you want to send to {name}?</h2>
                        </div>
                        <div className="notifireminder-container-notifications">
                            {reminders && reminders.length > 0 ? (
                                reminders.map(reminder => (
                                    <div
                                        key={reminder.id}
                                        className={`notifireminder-container-notifications-content ${selectedNotification?.id === reminder.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectNotification(reminder)}
                                    >
                                        <div className="notifireminder-container-content-notifi_field">
                                            <div
                                                className='notifireminder-container-content-notifi_field-mark_container-mark'
                                                style={{ backgroundColor: reminder.color }}
                                            >
                                                {reminder.type === 'Good Job' ? (
                                                    <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M22.633 5.59855C22.9007 5.28265 23.0317 4.87105 22.9935 4.45801C22.9539 4.04497 22.7503 3.66503 22.4287 3.40311L19.6863 1.18391C19.0243 0.648546 18.0529 0.750726 17.5175 1.41202L9.1207 11.7891L5.1371 8.43083C4.37866 7.79112 3.25899 7.83933 2.5574 8.53948L0.451181 10.645C0.148237 10.9479 -0.0143889 11.3638 0.000722323 11.792C0.0165531 12.2209 0.210121 12.621 0.534652 12.9016L8.52777 19.7844C8.83863 20.0528 9.24303 20.1859 9.65176 20.1535C10.0605 20.1219 10.4404 19.929 10.7059 19.616L22.633 5.59855Z" fill="white" />
                                                    </svg>
                                                ) : (
                                                    '!'
                                                )}
                                            </div>
                                            <div className="notifireminder-container-content-notifi_field-text">
                                                <div className="notifireminder-container-content-notifi_field-text-header">
                                                    <h3>{reminder.type}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No reminders available</p>
                            )}
                        </div>
                        <div className="notifireminder-container-buttons">
                            <button type='button' className='cancel_button' onClick={cancelReminder}>
                                Cancel
                            </button>
                            <button type='button' className='save_button' onClick={handleSendNotification}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )
        );
    };
    
    export default NotifyReminder;