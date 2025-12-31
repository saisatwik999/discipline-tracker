import React from 'react';
import { useDate } from '../../context/DateContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const DateDisplay = ({ style, className }) => {
    const { selectedDate, setSelectedDate } = useDate();

    if (!selectedDate) return null;

    // Format for display: DD-MM-YYYY
    const [year, month, day] = selectedDate.split('-');
    const formatted = `${day}-${month}-${year}`;

    const changeDate = (days) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    return (
        <div className={className} style={{ ...style, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
            <button
                onClick={() => changeDate(-1)}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Previous Day"
            >
                <ChevronLeft size={16} />
            </button>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ opacity: 0.7 }} />
                <span style={{ fontWeight: 500 }}>{formatted}</span>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                        opacity: 0,
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        cursor: 'pointer'
                    }}
                    title="Pick Date"
                />
            </div>

            <button
                onClick={() => changeDate(1)}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Next Day"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};
