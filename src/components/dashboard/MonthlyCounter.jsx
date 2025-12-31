import React from 'react';
import { Plus, Minus, AlertTriangle } from 'lucide-react';

export const MonthlyCounter = ({ habit, count, onIncrement }) => {
    const isOverLimit = count > habit.limit;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderColor: isOverLimit ? 'var(--status-warning)' : 'var(--glass-border)' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>{habit.label}</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => onIncrement(habit.id, -1)}
                    style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Minus size={20} />
                </button>

                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{count}</span>

                <button
                    className="btn btn-secondary"
                    onClick={() => onIncrement(habit.id, 1)}
                    style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}
                >
                    <Plus size={20} />
                </button>
            </div>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Limit: {habit.limit} / month
            </div>

            {isOverLimit && (
                <div className="animate-fade-in" style={{ marginTop: '1rem', color: 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <AlertTriangle size={16} />
                    <span>Limit Exceeded</span>
                </div>
            )}
        </div>
    );
};
