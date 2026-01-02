import { Cloud, Check, RefreshCw } from 'lucide-react';
import { StorageService } from '../../services/StorageService';

export const SaveIndicator = ({ user }) => {
    const handleSync = async () => {
        if (!user) return;
        const btn = document.getElementById('sync-btn');
        if (btn) btn.style.transform = 'rotate(360deg)';
        await StorageService.pullFromCloud();
        window.location.reload(); // Refresh to show new data
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            background: 'var(--glass-bg)',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)',
            marginLeft: 'auto'
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
            <span>{user ? 'Synced' : 'Local'}</span>
            {user && (
                <button
                    id="sync-btn"
                    onClick={handleSync}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-study)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        transition: 'transform 0.5s ease'
                    }}
                    title="Force Cloud Refresh"
                >
                    <RefreshCw size={14} />
                </button>
            )}
        </div>
    );
};
