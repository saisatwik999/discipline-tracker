import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { COMPLETION_TYPES } from '../../services/models';

export const HabitItem = ({ habit, status, onToggle }) => {
    const [details, setDetails] = useState('');
    const [inputOpen, setInputOpen] = useState(false);

    // Sync local state with props when switching dates
    React.useEffect(() => {
        if (status?.details && typeof status.details === 'string') {
            setDetails(status.details);
        } else {
            setDetails('');
        }
    }, [status]);


    const isCompleted = status?.status === 'completed';
    const { completionType, placeholder } = habit;

    const needsDetails = completionType === COMPLETION_TYPES.DETAILS || completionType === COMPLETION_TYPES.BOTH;

    const handleCheck = () => {
        if (needsDetails) {
            // Must open input if not already done
            if (!isCompleted) {
                setInputOpen(!inputOpen);
            } else {
                // Toggle off
                onToggle(habit.id, null); // Remove status
            }
        } else {
            // Tick only
            if (isCompleted) onToggle(habit.id, null);
            else onToggle(habit.id, 'completed');
        }
    };

    const submitDetails = () => {
        if (!details.trim()) return;
        onToggle(habit.id, 'completed', details);
        setInputOpen(false);
        setDetails(''); // Clear after submit
    };

    return (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: 1 }} onClick={handleCheck}>
                    <button
                        style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: isCompleted ? 'none' : '2px solid var(--text-muted)',
                            background: isCompleted ? 'var(--status-success)' : 'transparent',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            flexShrink: 0
                        }}
                    >
                        {isCompleted && <Check size={18} />}
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.05rem', textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                            {habit.label}
                        </span>
                        {needsDetails && !isCompleted && inputOpen && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-study)' }}>Adding details...</span>
                        )}
                    </div>
                </div>

                {isCompleted && status?.details && typeof status.details === 'string' && (
                    <span style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.5rem',
                        lineHeight: '1.4',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {status.details}
                    </span>
                )}
            </div>

            {needsDetails && inputOpen && !isCompleted && (
                <div className="animate-fade-in" style={{ marginTop: '1rem', marginLeft: '3rem' }}>
                    <textarea
                        placeholder={placeholder || "Enter details..."}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', marginBottom: '0.5rem', minHeight: '60px', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={submitDetails} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                            Confirm & Mark Done
                        </button>
                        <button className="btn btn-secondary" onClick={() => setInputOpen(false)} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
