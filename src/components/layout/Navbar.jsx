import React from 'react';
import { BookOpen, User, PieChart } from 'lucide-react';

export const Navbar = ({ currentView, onViewChange }) => {
    return (
        <nav className="glass-panel" style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '1rem',
            marginBottom: '2rem',
            gap: '1rem',
            position: 'sticky',
            top: '1rem',
            zIndex: 100
        }}>
            <button
                className={`btn ${currentView === 'study' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onViewChange('study')}
            >
                <BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Study System
            </button>

            <button
                className={`btn ${currentView === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onViewChange('normal')}
                style={currentView === 'normal' ? { background: 'var(--status-success)', boxShadow: '0 0 15px var(--accent-normal-glow)' } : {}}
            >
                <User size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Normal Habits
            </button>

            <button
                className={`btn ${currentView === 'combined' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onViewChange('combined')}
                style={currentView === 'combined' ? { background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' } : {}}
            >
                <PieChart size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Combined
            </button>
        </nav>
    );
};
