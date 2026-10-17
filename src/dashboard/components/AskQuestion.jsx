import React, { useState, useEffect } from 'react';
import './askquestion.css';
import { useStateContext } from '../../hook/ContextProvider';
import { useEmail } from '../../hook/EmailProvider';
import api from '../../api/QuestionAPI';

const AskQuestion = () => {
    const { yourQue, setYourQue, email } = useEmail();
    const { showpopUp, closepopUp } = useStateContext();
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        setPopupVisible(showpopUp.popup);
    }, [showpopUp.popup]);

    const handleSubmitQue = async (e) => {
        e.preventDefault();
        const trimmedQuestion = yourQue.trim();
        const currentDate = new Date().toLocaleDateString();

        if (!trimmedQuestion || !email) {
            return;
        }
    
        try {
            const response = await api.post('/QuestionAPI', {
                question: trimmedQuestion,
                date: currentDate,
                email,
            });

            if (response.status === 200) {
                setYourQue('');
                closepopUp();
            } else {
                console.log('Server error:', response.data.error || 'Unknown error');
            }
        } catch (err) {
            console.log(`Server error: ${err.message}`);
        }
    };

    return (
        isPopupVisible && (
            <div className={`askquestion ${showpopUp.popup ? 'show' : ''}`}>
                <div className="askquestion-container">
                    <div className="askquestion-container-header">
                        <h2>Ask Your Question</h2>
                    </div>
                    <form onSubmit={handleSubmitQue}>
                        <div className="askquestion-container-question_field">
                            <label htmlFor="yourQuestion">Your Question</label>
                            <textarea
                                id="yourQuestion"
                                required
                                value={yourQue}
                                onChange={(e) => setYourQue(e.target.value)}
                                placeholder='Write your question here...'
                            />
                        </div>
                        <div className="askquestion-container-buttons">
                            <button type='button' className='cancel_button' onClick={closepopUp}>
                                Cancel
                            </button>
                            <button type='submit' className='save_button' disabled={!yourQue.trim()}>
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default AskQuestion;
