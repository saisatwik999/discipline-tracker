import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, Activity, BookOpen } from 'lucide-react';
import { HabitService } from '../../services/HabitService';
import { useDate } from '../../context/DateContext';

export const DSACard = ({ habitId, status, onComplete }) => {
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Use Date Context to get the correct question for the viewed date
    const { selectedDate } = useDate();

    useEffect(() => {
        const q = HabitService.getDailyQuestion(selectedDate);
        setQuestion(q);

        // Reset state when date changes
        setSelectedOption(null);
        setShowExplanation(false);
    }, [selectedDate]);

    // Check if previously completed for this date
    useEffect(() => {
        if (status?.status === 'completed') {
            setShowExplanation(true);

            // Recover selected option from details if possible
            if (status.details && question) {
                const parts = status.details.split(' | ');
                const selectedPart = parts[0]?.replace('Selected: ', '');
                const idx = question.options.indexOf(selectedPart);
                if (idx !== -1) {
                    setSelectedOption(idx);
                }
            }
        }
    }, [status, question]);

    if (!question) return null;

    const isCompleted = status?.status === 'completed';

    const handleOptionSelect = (idx) => {
        if (isCompleted || showExplanation) return;

        setSelectedOption(idx);
        setShowExplanation(true);

        // Mark as completed
        const details = `Selected: ${question.options[idx]} | Correct: ${question.options[question.correct]}`;
        onComplete(habitId, 'completed', details);
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-study)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem', opacity: 0.1 }}>
                <BookOpen size={100} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                    <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                        <HelpCircle size={22} color="var(--accent-study)" />
                    </div>
                    Daily DSA Challenge
                    <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: question.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.2)' : question.difficulty === 'Medium' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: question.difficulty === 'Easy' ? '#10B981' : question.difficulty === 'Medium' ? '#EAB308' : '#EF4444',
                        fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        border: '1px solid currentColor'
                    }}>
                        <Activity size={12} /> {question.difficulty || 'Normal'}
                    </span>
                </h3>
            </div>

            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem', fontWeight: '500' }}>{question.question}</p>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
                {question.options.map((opt, idx) => {
                    let isSelected = idx === selectedOption;
                    let isCorrect = idx === question.correct;

                    let style = {
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    };

                    if (showExplanation) {
                        style.cursor = 'default';
                        if (isCorrect) {
                            style.borderColor = 'var(--status-success)';
                            style.background = 'rgba(16, 185, 129, 0.1)';
                            style.borderWidth = '2px';
                            style.color = 'var(--text-primary)';
                        } else if (isSelected) {
                            style.borderColor = 'var(--status-error)';
                            style.background = 'rgba(239, 68, 68, 0.1)';
                            style.color = 'var(--text-primary)';
                        } else {
                            style.opacity = 0.5;
                        }
                    } else {
                        // Standard unselected state - STRICTLY NO HIGHLIGHTS
                        style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        style.background = 'rgba(255, 255, 255, 0.02)';
                        style.color = 'var(--text-secondary)';
                        style.outline = 'none';
                        style.WebkitTapHighlightColor = 'transparent';
                    }

                    return (
                        <div key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            style={style}
                            className="option-item"
                            onMouseEnter={(e) => { if (!showExplanation) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={(e) => { if (!showExplanation) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                            <span style={{
                                fontWeight: showExplanation && (isSelected || isCorrect) ? 'bold' : 'normal',
                                color: (showExplanation && (isSelected || isCorrect)) ? 'var(--text-primary)' : 'inherit'
                            }}>{opt}</span>
                            {showExplanation && isCorrect && <CheckCircle size={20} color="var(--status-success)" />}
                            {showExplanation && isSelected && !isCorrect && <XCircle size={20} color="var(--status-error)" />}
                        </div>
                    );
                })}
            </div>

            {showExplanation && (
                <div className="animate-scale-in" style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    border: `1px solid ${selectedOption === question.correct ? 'var(--status-success)' : 'var(--status-error)'}`,
                    boxShadow: selectedOption === question.correct ? '0 0 15px rgba(16, 185, 129, 0.1)' : '0 0 15px rgba(239, 68, 68, 0.1)'
                }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '4px', height: '20px', background: 'var(--accent-study)', borderRadius: '2px' }}></div>
                            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                                {selectedOption === question.correct ? 'Correct! Well Done' : 'Not Quite Right'}
                            </h4>
                        </div>
                        <span style={{
                            fontSize: '0.8rem',
                            color: selectedOption === question.correct ? 'var(--status-success)' : 'var(--status-error)',
                            fontWeight: 'bold'
                        }}>
                            {selectedOption === question.correct ? 'Verified' : `Correct Answer: ${question.options[question.correct]}`}
                        </span>
                    </div>

                    <p style={{ lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        {question.explanation}
                    </p>

                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        {question.optionExplanations && question.options.map((opt, i) => (
                            <div key={i} style={{
                                fontSize: '0.9rem',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                background: i === question.correct ? 'rgba(16, 185, 129, 0.05)' : i === selectedOption ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                                borderLeft: i === question.correct ? '2px solid var(--status-success)' : i === selectedOption ? '2px solid var(--status-error)' : '2px solid transparent'
                            }}>
                                <span style={{ color: i === question.correct ? 'var(--status-success)' : i === selectedOption ? 'var(--status-error)' : 'var(--text-secondary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                                    {i === question.correct ? "Correct Answer" : i === selectedOption ? "Your Choice" : "Option " + (i + 1)}
                                </span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {question.optionExplanations[i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
