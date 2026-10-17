import React, { useState, useEffect } from 'react';
import todoPlusButton from '../../../assets/images/todoPlusButton.svg';
import './todo.css';
import { useStateContext } from '../../../hook/ContextProvider';
import { useGoals } from '../../../hook/CanvasProvider';
import useAxiosFetch from '../../../hook/useAxiosFetch';

const Todo = () => {
    const { openCanvas, updatePercentage } = useStateContext();
    const { goals, toggleGoalCompletion, openGoal } = useGoals();
    const [removingGoal, setRemovingGoal] = useState(null);
    const { fetchError, isLoading } = useAxiosFetch('http://localhost:3400/DashboardAPI');

    const handleOpenCanvas = (id) => {
        openGoal(id);
        openCanvas();
    };

    const handleAddNewGoal = () => {
        openGoal(null);
        openCanvas();
    };

    // Ensure the goals are correctly updated
    useEffect(() => {
        const completedGoals = goals.filter(goal => goal.completed).length;
        const totalGoals = goals.length;
        const completionPercentage = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);
        updatePercentage(completionPercentage);
    }, [goals, updatePercentage]);

    const handleToggleGoalCompletion = (id) => {
        toggleGoalCompletion(id); // Toggle completion status
        setRemovingGoal(id); // Set the goal to be removed after a delay
        setTimeout(() => {
            setRemovingGoal(null);
        }, 1000); // Match this to the fade-out animation duration
    };

    return (
        <div className="todo_goals-container">
            <div className="todo_goals-container-header">
                <h1>TO DO</h1>
            </div>
            <div className="todo_goals-container-goals_input">
            {isLoading && <p className='statusMsg'>Loading goals...</p>}
            {!isLoading && fetchError && <p className='statusMsg' style={{color:'red'}}>{fetchError}</p>}
            {!isLoading && !fetchError && 
                (goals.length ? (
                    goals.filter(goal => !goal.completed || removingGoal === goal.id).map(goal => (
                        <label key={goal.id} htmlFor={`goal${goal.id}`}
                            className={`goal-checkbox todo_goal-checkbox ${removingGoal === goal.id ? 'fade-out' : ''}`}
                            onDoubleClick={() => handleOpenCanvas(goal.id)}>
                            <input
                                type="checkbox"
                                id={`goal${goal.id}`}
                                checked={!!goal.completed} // Ensure it's always a boolean
                                readOnly
                            />
                            <span
                                className='todo_span'
                                onClick={() => handleToggleGoalCompletion(goal.id)}
                            ></span>
                            <span onClick={() => handleToggleGoalCompletion(goal.id)}>
                                {goal.description || `Goal ${goal.id}`}
                            </span>
                        </label>
                    ))
                ) : (  <p className='lack_goals'> No Goals To Display.</p>))}
            </div>
            <div className='goal-checkbox plus todo_goal-checkbox'>
                <button type='button' onClick={handleAddNewGoal}>
                    <img src={todoPlusButton} alt='plusGoalButton' />
                </button>
            </div>
        </div>
    );
};

export default Todo;
