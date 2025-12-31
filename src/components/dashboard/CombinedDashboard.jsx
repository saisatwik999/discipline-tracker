import React, { useState, useEffect } from 'react';
import { ConsistencyEngine } from '../../services/ConsistencyEngine';
import { SYSTEMS } from '../../services/models';
import { StorageService } from '../../services/StorageService';
import { Flame } from 'lucide-react';

const CombinedStatCard = ({ title, studyVal, normalVal, color1, color2 }) => (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>Study</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color1 }}>{studyVal}</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: `${Math.min(100, parseFloat(studyVal))}%`, height: '100%', background: color1 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>Normal</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color2 }}>{normalVal}</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, parseFloat(normalVal))}%`, height: '100%', background: color2 }} />
        </div>
    </div>
);

export const CombinedDashboard = () => {
    const [stats, setStats] = useState({
        studyDaily: 0,
        normalDaily: 0,
        studyTillNow: 0,
        normalTillNow: 0,
        studyStreak: 0,
        normalStreak: 0
    });

    useEffect(() => {
        const today = StorageService.getToday();
        const studyLogs = StorageService.getLogs(SYSTEMS.STUDY);
        const normalLogs = StorageService.getLogs(SYSTEMS.NORMAL);

        setStats({
            studyDaily: ConsistencyEngine.calculateDailyConsistency(SYSTEMS.STUDY, today, studyLogs),
            normalDaily: ConsistencyEngine.calculateDailyConsistency(SYSTEMS.NORMAL, today, normalLogs),
            studyTillNow: ConsistencyEngine.calculateTillNow(SYSTEMS.STUDY),
            normalTillNow: ConsistencyEngine.calculateTillNow(SYSTEMS.NORMAL),
            studyStreak: ConsistencyEngine.calculateStreak(SYSTEMS.STUDY),
            normalStreak: ConsistencyEngine.calculateStreak(SYSTEMS.NORMAL)
        });
    }, []);

    // Calculate Overall Consistency (Average of both Till-Nows)
    const overallConsistency = (stats.studyTillNow + stats.normalTillNow) / 2;

    return (
        <div className="animate-fade-in">
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div
                    className="glass-panel"
                    style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        padding: '2rem 4rem',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <span style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Overall Life Consistency</span>
                    <span style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {Math.round(overallConsistency)}%
                    </span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <CombinedStatCard
                    title="Daily Consistency"
                    studyVal={`${Math.round(stats.studyDaily)}%`}
                    normalVal={`${Math.round(stats.normalDaily)}%`}
                    color1="var(--accent-study)"
                    color2="var(--accent-normal)"
                />

                <CombinedStatCard
                    title="Till-Now Consistency"
                    studyVal={`${Math.round(stats.studyTillNow)}%`}
                    normalVal={`${Math.round(stats.normalTillNow)}%`}
                    color1="var(--accent-study)"
                    color2="var(--accent-normal)"
                />

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current Streaks</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '80%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Flame size={32} color="var(--accent-study)" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.studyStreak}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Study Days</div>
                        </div>
                        <div style={{ width: '1px', height: '50px', background: 'var(--glass-border)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <Flame size={32} color="var(--accent-normal)" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.normalStreak}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Normal Days</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
