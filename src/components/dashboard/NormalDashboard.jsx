import React, { useState, useEffect } from 'react';
import { HabitService } from '../../services/HabitService';
import { StorageService } from '../../services/StorageService';
import { SYSTEMS, FREQUENCY } from '../../services/models'; // Import FREQUENCY
import { HabitItem } from '../habits/HabitItem';
import { MonthlyCounter } from './MonthlyCounter';
import { ConsistencyEngine } from '../../services/ConsistencyEngine';
import { HistoryCalendar } from './HistoryCalendar';
import { Flame, Settings } from 'lucide-react';
import { GraceButton } from './GraceButton';
import { HabitManager } from './HabitManager';
import { DateDisplay } from '../ui/DateDisplay';
import { useDate } from '../../context/DateContext';

export const NormalDashboard = () => {
    const { selectedDate } = useDate();
    const [dailyHabits, setDailyHabits] = useState([]);
    const [monthlyHabits, setMonthlyHabits] = useState([]);
    const [logs, setLogs] = useState({});
    const [consistency, setConsistency] = useState(0);
    const [streak, setStreak] = useState(0);
    const [monthlyCounts, setMonthlyCounts] = useState({});
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const today = StorageService.getToday();
        setDailyHabits(HabitService.getDailyHabits(SYSTEMS.NORMAL));
        setMonthlyHabits(HabitService.getMonthlyHabits(SYSTEMS.NORMAL));

        setLogs(HabitService.getLogForDate(SYSTEMS.NORMAL, selectedDate));

        // Load monthly counts
        const counts = {};
        // Iterate over habits instead of constant
        const mHabits = HabitService.getMonthlyHabits(SYSTEMS.NORMAL);
        mHabits.forEach(h => {
            counts[h.id] = HabitService.getMonthlyUsage(h.id);
        });
        setMonthlyCounts(counts);

        // Calculate live stats
        const allLogs = StorageService.getLogs(SYSTEMS.NORMAL);
        setConsistency(ConsistencyEngine.calculateDailyConsistency(SYSTEMS.NORMAL, today, allLogs));
        setStreak(ConsistencyEngine.calculateStreak(SYSTEMS.NORMAL));
    }, [updateTrigger, selectedDate]);

    const handleToggle = (habitId, status, details) => {
        HabitService.toggleHabit(SYSTEMS.NORMAL, habitId, status, details, selectedDate);
        setUpdateTrigger(prev => prev + 1);
    };

    const handleMonthlyChange = (habitId, delta) => {
        StorageService.updateMonthlyCount(
            new Date().toISOString().substring(0, 7), // YYYY-MM 
            habitId,
            delta
        );
        setUpdateTrigger(prev => prev + 1);
    };

    return (
        <div className="animate-fade-in">
            {showSettings && <HabitManager system={SYSTEMS.NORMAL} onClose={() => setShowSettings(false)} onUpdate={() => setUpdateTrigger(p => p + 1)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ margin: 0, color: 'var(--accent-normal)' }}>Normal Dashboard</h2>
                    <DateDisplay style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <GraceButton system={SYSTEMS.NORMAL} onUpdate={() => setUpdateTrigger(p => p + 1)} />
                    <button className="btn btn-secondary" onClick={() => setShowSettings(true)} style={{ padding: '0.5rem' }}>
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1rem 2rem', borderLeft: '4px solid var(--accent-normal)' }}>
                    <small style={{ color: 'var(--text-secondary)' }}>Daily Consistency</small>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{Math.round(consistency)}%</div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem 2rem' }}>
                    <small style={{ color: 'var(--text-secondary)' }}>Till-Now Consistency</small>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {Math.round(ConsistencyEngine.calculateTillNow(SYSTEMS.NORMAL))}%
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), transparent)' }}>
                    <div>
                        <small style={{ color: 'var(--text-secondary)' }}>Streak</small>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-grace)' }}>{streak} <span style={{ fontSize: '1rem' }}>days</span></div>
                    </div>
                    <Flame size={32} color="var(--status-grace)" />
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-normal)' }}>Daily Habits</h2>

            <div style={{ marginBottom: '3rem' }}>
                {dailyHabits.map(habit => (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        status={logs[habit.id]}
                        onToggle={handleToggle}
                    />
                ))}
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Monthly Limits</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {monthlyHabits.map(h => (
                    <MonthlyCounter
                        key={h.id}
                        habit={h}
                        count={monthlyCounts[h.id]}
                        onIncrement={(id, d) => handleMonthlyChange(id, d)}
                    />
                ))}
            </div>

            <HistoryCalendar system={SYSTEMS.NORMAL} />
        </div>
    );
};
