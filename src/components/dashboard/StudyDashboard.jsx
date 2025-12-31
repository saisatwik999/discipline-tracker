import React, { useState, useEffect } from 'react';
import { HabitService } from '../../services/HabitService';
import { StorageService } from '../../services/StorageService';
import { SYSTEMS, HABIT_TYPES } from '../../services/models';
import { HabitItem } from '../habits/HabitItem';
import { DSACard } from './DSACard';
import { ConsistencyEngine } from '../../services/ConsistencyEngine';
import { HistoryCalendar } from './HistoryCalendar';
import { Flame, Settings, History } from 'lucide-react';
import { ReflectionInput } from './ReflectionInput';
import { GraceButton } from './GraceButton';
import { HabitManager } from './HabitManager';
import { DateDisplay } from '../ui/DateDisplay';
import { useDate } from '../../context/DateContext';
import { DSAHistoryModal } from './DSAHistoryModal';

export const StudyDashboard = () => {
    const { selectedDate } = useDate();
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState({});
    const [consistency, setConsistency] = useState(0);
    const [streak, setStreak] = useState(0);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        setHabits(HabitService.getHabitsForSystem(SYSTEMS.STUDY));
        setLogs(HabitService.getLogForDate(SYSTEMS.STUDY, selectedDate));

        // Calculate live stats
        const allLogs = StorageService.getLogs(SYSTEMS.STUDY);
        setConsistency(ConsistencyEngine.calculateDailyConsistency(SYSTEMS.STUDY, selectedDate, allLogs));
        setStreak(ConsistencyEngine.calculateStreak(SYSTEMS.STUDY));
    }, [updateTrigger, selectedDate]);

    const handleToggle = (habitId, status, details) => {
        HabitService.toggleHabit(SYSTEMS.STUDY, habitId, status, details, selectedDate);
        setUpdateTrigger(prev => prev + 1); // Refresh UI
    };

    const handleOpenHistory = () => {
        const history = HabitService.getDSAHistory();
        setHistoryData(history);
        setShowHistory(true);
    };

    return (
        <div className="animate-fade-in">
            {showSettings && <HabitManager system={SYSTEMS.STUDY} onClose={() => setShowSettings(false)} onUpdate={() => setUpdateTrigger(p => p + 1)} />}

            {showHistory && (
                <DSAHistoryModal
                    history={historyData}
                    onClose={() => setShowHistory(false)}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ margin: 0, color: 'var(--accent-study)' }}>Study Dashboard</h2>
                    <DateDisplay style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <GraceButton system={SYSTEMS.STUDY} onUpdate={() => setUpdateTrigger(p => p + 1)} />
                    <button className="btn btn-secondary" onClick={() => setShowSettings(true)} style={{ padding: '0.5rem' }}>
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1rem 2rem', borderLeft: '4px solid var(--accent-study)' }}>
                    <small style={{ color: 'var(--text-secondary)' }}>Daily Consistency</small>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{Math.round(consistency)}%</div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem 2rem' }}>
                    <small style={{ color: 'var(--text-secondary)' }}>Till-Now Consistency</small>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {Math.round(ConsistencyEngine.calculateTillNow(SYSTEMS.STUDY))}%
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, color: 'var(--accent-study)' }}>Today's Tasks</h2>
                <button className="btn btn-secondary" onClick={handleOpenHistory} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <History size={16} />
                    DSA History
                </button>
            </div>

            {habits.map(habit => {
                if (habit.type === HABIT_TYPES.DSA_SYSTEM) {
                    return (
                        <DSACard
                            key={habit.id}
                            habitId={habit.id}
                            status={logs[habit.id]}
                            onComplete={handleToggle}
                        />
                    );
                }
                return (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        status={logs[habit.id]}
                        onToggle={handleToggle}
                    />
                );
            })}


            <HistoryCalendar system={SYSTEMS.STUDY} />
        </div>
    );
};
