import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/StorageService';
import { MessageSquare } from 'lucide-react';

export const ReflectionInput = ({ system }) => {
    const [reflection, setReflection] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load existing reflection if any
        const logs = StorageService.getLogs(system);
        const today = StorageService.getToday();
        if (logs[today]?.reflection) {
            setReflection(logs[today].reflection.details || '');
            setSaved(true);
        }
    }, [system]);

    const handleSave = () => {
        if (!reflection.trim()) return;
        const today = StorageService.getToday();
        // We treat 'reflection' as a special habitId or just store in logs
        StorageService.logHabit(system, today, 'reflection', 'completed', reflection);
        setSaved(true);
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderTop: '4px solid #8b5cf6' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={20} />
                Daily Reflection
            </h3>

            {saved ? (
                <div className="animate-fade-in">
                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{reflection}"</p>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setSaved(false)}
                        style={{ marginTop: '1rem', fontSize: '0.8rem', padding: '0.4rem 1rem' }}
                    >
                        Edit
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="What did you learn today? What can be improved?"
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '1rem',
                            color: 'white',
                            marginBottom: '1rem',
                            resize: 'vertical'
                        }}
                    />
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Reflection
                    </button>
                </div>
            )}
        </div>
    );
};
