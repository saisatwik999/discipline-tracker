import React, { useState } from 'react';
import { GracePeriodService } from '../../services/GracePeriodService';
import { StorageService } from '../../services/StorageService';
import { Star } from 'lucide-react';

export const GraceButton = ({ system, onUpdate }) => {
    const today = StorageService.getToday();
    const isGrace = GracePeriodService.isGraceDay(system, today);
    const canApply = GracePeriodService.canApplyGrace(system);

    const handleApply = () => {
        try {
            GracePeriodService.applyGrace(system);
            onUpdate();
        } catch (e) {
            alert(e.message);
        }
    };

    if (isGrace) {
        return (
            <div className="glass-panel" style={{ padding: '0.5rem 1rem', background: 'rgba(234, 179, 8, 0.2)', border: '1px solid var(--status-grace)', color: 'var(--status-grace)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <Star size={16} fill="currentColor" />
                <span>Grace Day Active</span>
                <button
                    onClick={() => {
                        GracePeriodService.removeGrace(system, today);
                        onUpdate();
                    }}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '8px', textDecoration: 'underline', fontSize: '0.8rem' }}
                >
                    Undo
                </button>
            </div>
        );
    }

    if (!canApply) return null; // Used up for month

    return (
        <button
            className="btn btn-secondary"
            onClick={handleApply}
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'var(--status-grace)', color: 'var(--status-grace)' }}
            title="Apply Grace Day (1 per month)"
        >
            <Star size={16} />
            Use Grace Day
        </button>
    );
};
