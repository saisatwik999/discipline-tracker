import React from 'react';
import { Cloud, Check } from 'lucide-react';

export const SaveIndicator = ({ user }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            background: 'var(--glass-bg)',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)',
            marginLeft: 'auto' // Push to right if in flex container
        }}>
            <div style={{ position: 'relative', width: '18px', height: '18px' }}>
                <Cloud size={18} />
                <Check size={10} style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -40%)',
                    strokeWidth: 4
                }} />
            </div>
            <span>Saved to {user || 'Disk'}</span>
        </div>
    );
};
