import React from 'react';
import { SYSTEMS } from '../../services/models';
import { ConsistencyEngine } from '../../services/ConsistencyEngine';
import { StorageService } from '../../services/StorageService';
import { useDate } from '../../context/DateContext';

export const HistoryCalendar = ({ system }) => {
    const { selectedDate, setSelectedDate } = useDate();
    const data = StorageService.getData();
    const today = new Date();

    // Generate 30 days ending at the SELECTED DATE (or today if selected is future? No, just around selected)
    // Actually, usually "History" ends at the selected date so you can see the streak leading up to it.
    const referenceDate = selectedDate ? new Date(selectedDate) : today;

    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(referenceDate);
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }

    const logs = StorageService.getLogs(system);
    const graceDays = data.graceDays?.[system] || [];

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Last 30 Days History</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '8px' }}>
                {days.map(dateStr => {
                    const consistency = ConsistencyEngine.calculateDailyConsistency(system, dateStr, logs);
                    const isGrace = graceDays.includes(dateStr);
                    const isSelected = selectedDate === dateStr;

                    let bg = 'rgba(255,255,255,0.05)'; // Default empty/future
                    // Logic:
                    // 100% -> Green
                    // Grace -> Yellow
                    // Partial -> Orange/Red depending on % ? Or just Red if < 100?
                    // Requirement: "Green Completed, Yellow Grace, Red Missed/Violation"

                    if (isGrace) bg = 'var(--status-grace)';
                    else if (consistency === 100) bg = 'var(--status-success)';
                    else if (consistency > 0) bg = 'var(--status-warning)'; // Partial
                    else if (new Date(dateStr) < new Date(today.toISOString().split('T')[0])) bg = 'var(--status-error)'; // Past & 0%

                    return (
                        <div
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            title={`${dateStr}: ${Math.round(consistency)}% ${isGrace ? '(Grace)' : ''}`}
                            style={{
                                aspectRatio: '1',
                                borderRadius: '6px',
                                background: bg,
                                opacity: new Date(dateStr) > today ? 0.3 : 1,
                                border: isSelected ? '2px solid white' : 'none',
                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                                cursor: 'pointer'
                            }}
                        >
                            {dateStr.split('-')[2]}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 10, height: 10, background: 'var(--status-success)', borderRadius: 2 }} /> Completed</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 10, height: 10, background: 'var(--status-grace)', borderRadius: 2 }} /> Grace</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 10, height: 10, background: 'var(--status-error)', borderRadius: 2 }} /> Missed</div>
            </div>
        </div>
    );
};
