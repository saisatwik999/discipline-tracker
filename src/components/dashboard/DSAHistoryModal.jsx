import React, { useRef, useEffect } from 'react';
import { X, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { useDate } from '../../context/DateContext';

export const DSAHistoryModal = ({ onClose, history }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Group history by month? Or just simple list
    // Simple list for now, sorted by date desc
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div ref={modalRef} className="glass-panel animate-scale-in" style={{
                width: '90%',
                maxWidth: '800px',
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                padding: '0'
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, color: 'var(--accent-study)' }}>DSA Challenge History</h2>
                    <button onClick={onClose} className="btn-icon">
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                    {sortedHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            <p>No history found. Start solving daily challenges!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {sortedHistory.map((item, index) => {
                                // Parse details string: "Selected: Option | Correct: Option"
                                let selected = "Unknown";
                                let correct = "Unknown";

                                if (item.details) {
                                    const parts = item.details.split('|');
                                    if (parts.length >= 2) {
                                        selected = parts[0].replace('Selected: ', '').trim();
                                        correct = parts[1].replace('Correct: ', '').trim();
                                    }
                                }

                                const isCorrect = selected === correct;

                                return (
                                    <div key={index} className="glass-panel" style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderLeft: `4px solid ${isCorrect ? 'var(--status-success)' : 'var(--status-error)'}`
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <Calendar size={14} />
                                                <span>{item.date}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: isCorrect ? 'var(--status-success)' : 'var(--status-error)',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem'
                                            }}>
                                                {isCorrect ? (
                                                    <><CheckCircle size={16} /> Correct</>
                                                ) : (
                                                    <><XCircle size={16} /> Incorrect</>
                                                )}
                                            </div>
                                        </div>

                                        <h4 style={{ margin: '0 0 1rem 0', lineHeight: '1.4' }}>{item.question?.question || "Question not found"}</h4>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                                            <div style={{
                                                padding: '0.8rem',
                                                background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                borderRadius: '8px',
                                                border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                                            }}>
                                                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.2rem' }}>You Selected</span>
                                                {selected}
                                            </div>
                                            <div style={{
                                                padding: '0.8rem',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(16, 185, 129, 0.3)'
                                            }}>
                                                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.2rem' }}>Correct Answer</span>
                                                {correct}
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                <strong>Explanation: </strong>
                                                {item.question?.explanation || item.question?.optionExplanations?.[item.question?.correct]}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
