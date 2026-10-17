import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import mockAdapter from '../api/mockAdapter';
const StateContext = createContext();

const initialState = {
    notification: false,
    canvasVisible: false,
    popup: false,
    reminder: false,
    answer: false
};

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [activeNotify, setActiveNotify] = useState(initialState);
    const [showpopUp, setShowpopUp] = useState(initialState);
    const [showAnspopUp, setShowAnspopUp] = useState(initialState);
    const [screenSize, setscreenSize] = useState(undefined);
    const [percentage, setPercentage] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [hasNotification, setHasNotification] = useState(true);
    const [showReminder, setshowReminder] = useState(initialState);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [answeredQuestions, setAnsweredQuestions] = useState({});
    const [teamMate, setteamMate] = useState(null); // New state for teammate

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/Notifications', { adapter: mockAdapter });
            const notifications = response.data;
            setNotifications(notifications);
            setHasNotification(notifications.some(notif => !notif.read));
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
        setHasNotification(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);




    const updatePercentage = (newPercentage) => {
        setPercentage(newPercentage);
    };
    const handleClick = () => {
        setIsClicked((prevState) => ({ ...prevState, canvasVisible: true }));
    };

    const handleClickNotift = () => {
        setIsClicked((prevState) => ({ ...prevState, notification: true }));
    };

    const openCanvas = () => {
        setIsClicked((prevState) => ({ ...prevState, canvasVisible: true }));
    };

    const openpopUp = () => {
        setShowpopUp((prevState) => ({ ...prevState, popup: true }));
    };

    const closepopUp = () => {
        setShowpopUp((prevState) => ({ ...prevState, popup: false }));
    };

    const openAnspopUp = () => setShowAnspopUp({ answer: true });
    const closeAnspopUp = () => setShowAnspopUp({ answer: false });

    const markQuestionAsAnswered = (question) => {
        setAnsweredQuestions(prevState => ({
            ...prevState,
            [question]: true,
        }));
    };

    const sendReminder = () => {
        setshowReminder((prevState) => ({ ...prevState, reminder: true }));
    };

    const cancelReminder = () => {
        setshowReminder((prevState) => ({ ...prevState, reminder: false }));
    };

    const closeCanvas = () => {
        setIsClicked((prevState) => ({ ...prevState, canvasVisible: false }));
    };

    return (
        <StateContext.Provider value={{
            activeMenu, setActiveMenu, isClicked, setIsClicked, handleClick, screenSize, setscreenSize,
            openCanvas, closeCanvas, updatePercentage, percentage, activeNotify, setActiveNotify, handleClickNotift,
            notifications,
            fetchNotifications,
            markAllAsRead,
            hasNotification,
            setHasNotification,
            showpopUp, setShowpopUp,
            openpopUp, closepopUp,
            sendReminder, cancelReminder,
            showReminder, setshowReminder,
            showAnspopUp, setShowAnspopUp,
            openAnspopUp, closeAnspopUp,
            selectedQuestion, setSelectedQuestion,
            answeredQuestions, setAnsweredQuestions,
            markQuestionAsAnswered, teamMate, setteamMate

        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);