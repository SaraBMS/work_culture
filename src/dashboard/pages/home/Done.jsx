import React, { useEffect } from 'react';
import './done.css';
import { useStateContext } from '../../../hook/ContextProvider';
import { useGoals } from '../../../hook/CanvasProvider';
import useAxiosFetch from '../../../hook/useAxiosFetch';

const Done = () => {
  const { openCanvas, updatePercentage } = useStateContext();
  const { goals, toggleGoalCompletion, openGoal } = useGoals();
  const { fetchError, isLoading } = useAxiosFetch('http://localhost:3400/DashboardAPI');

  useEffect(() => {
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    const completionPercentage = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);
    updatePercentage(completionPercentage);
  }, [goals, updatePercentage]);

  const handleOpenCanvas = (id) => {
    openGoal(id);
    openCanvas();
  };

  const handleToggleGoalCompletion = (id) => {
    toggleGoalCompletion(id);
  };

  return (
    <div className="done_goals-container">
      <div className="done_goals-container-header">
        <h1>DONE</h1>
      </div>
      <div className="done_goals-container-goals_input">
      {isLoading && <p className='statusMsg'>Loading goals...</p>}
            {!isLoading && fetchError && <p className='statusMsg' style={{color:'red'}}>{fetchError}</p>}
            {!isLoading && !fetchError && (
                              goals.length === 0 ? (
                                <p className='lack_goals'>No Goals To Display.</p>
                            ) : (
                                goals.filter(goal => goal.completed).length === 0 ? (
                                    <p className='lack_goals'>No Goals To Display.</p>
                                ) : (
          goals.filter(goal => goal.completed).map(goal => (
            <label key={goal.id} htmlFor={`goal_done_${goal.id}`} className='goal-checkbox done_goal-checkbox' onDoubleClick={() => handleOpenCanvas(goal.id)}>
              <input
                type="checkbox"
                id={`goal_done_${goal.id}`}
                checked={goal.completed}
                readOnly
              />
              <span onClick={() => handleToggleGoalCompletion(goal.id)}></span>
              <span onClick={() => handleToggleGoalCompletion(goal.id)}>
                {goal.description || `Goal ${goal.id}`}
              </span>
            </label>
          )))))}
      </div>
    </div>
  );
};

export default Done;
