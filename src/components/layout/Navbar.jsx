import React from 'react';
import { BookOpen, User, PieChart } from 'lucide-react';
import { SaveIndicator } from '../ui/SaveIndicator';

export const Navbar = ({ currentView, onViewChange, user }) => {
    return (
        <nav className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center', // Align items vertically
            justifyContent: 'center',
            padding: '1rem',
            marginBottom: '2rem',
            gap: '1rem',
            position: 'sticky',
            top: '1rem',
            zIndex: 100
        }}>
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                flex: 1,
                justifyContent: 'center',
                flexWrap: 'wrap' // Allow wrapping on small screens
            }}>
                <button
                    className={`btn ${currentView === 'study' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onViewChange('study')}
                    style={{ flex: '1 1 auto', minWidth: '120px' }}
                >
                    <BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Study
                </button>

                <button
                    className={`btn ${currentView === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onViewChange('normal')}
                    style={{
                        flex: '1 1 auto',
                        minWidth: '120px',
                        ...(currentView === 'normal' ? { background: 'var(--status-success)', boxShadow: '0 0 15px var(--accent-normal-glow)' } : {})
                    }}
                >
                    <User size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Habits
                </button>

                <button
                    className={`btn ${currentView === 'combined' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onViewChange('combined')}
                    style={{
                        flex: '1 1 auto',
                        minWidth: '120px',
                        ...(currentView === 'combined' ? { background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' } : {})
                    }}
                >
                    <PieChart size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Stats
                </button>
            </div>

            <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                <SaveIndicator user={user} />
            </div>
        </nav>
    );
};
