import React, { useState } from 'react';
import { SYSTEMS, COMPLETION_TYPES, FREQUENCY } from '../../services/models';
import { HabitService } from '../../services/HabitService';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';

export const HabitManager = ({ system, onClose, onUpdate }) => {
    const [habits, setHabits] = useState(HabitService.getHabitsForSystem(system));
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [form, setForm] = useState({
        label: '',
        completionType: COMPLETION_TYPES.TICK,
        frequency: FREQUENCY.DAILY,
        includeInConsistency: true,
        placeholder: ''
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure? History will be preserved but it will disappear from today\'s list.')) {
            HabitService.deleteHabit(system, id);
            refresh();
        }
    };

    const refresh = () => {
        setHabits(HabitService.getHabitsForSystem(system));
        onUpdate(); // Trigger parent refresh
    };

    const handleEdit = (habit) => {
        setForm({
            label: habit.label,
            completionType: habit.completionType,
            frequency: habit.frequency || FREQUENCY.DAILY,
            includeInConsistency: habit.includeInConsistency !== false,
            placeholder: habit.placeholder || ''
        });
        setEditingId(habit.id);
        setIsAdding(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.label) return;

        if (editingId) {
            // Edit mode
            HabitService.updateHabit(system, editingId, form);
        } else {
            // Add mode
            HabitService.addHabit(system, form);
        }

        // Reset
        setForm({
            label: '',
            completionType: COMPLETION_TYPES.TICK,
            frequency: FREQUENCY.DAILY,
            includeInConsistency: true,
            placeholder: ''
        });
        setIsAdding(false);
        setEditingId(null);
        refresh();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ width: '90%', maxHeight: '90vh', maxWidth: '600px', padding: '2rem', overflowY: 'auto', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>Manage {system === SYSTEMS.STUDY ? 'Study' : 'Normal'} Habits</h2>
                    <button onClick={onClose} className="btn" style={{ padding: '0.5rem' }}><X /></button>
                </div>

                {!isAdding ? (
                    <div>
                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                            {habits.map(h => (
                                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{h.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {h.frequency} • {h.completionType} • {h.includeInConsistency ? 'Inc. Cons.' : 'Exc. Cons.'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary" onClick={() => handleEdit(h)} style={{ color: 'var(--accent-study)', padding: '0.5rem' }}><Edit2 size={16} /></button>
                                        <button className="btn btn-secondary" onClick={() => handleDelete(h.id)} style={{ color: 'var(--status-error)', padding: '0.5rem' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => { setIsAdding(true); setEditingId(null); setForm({ label: '', completionType: COMPLETION_TYPES.TICK, frequency: FREQUENCY.DAILY, includeInConsistency: true, placeholder: '' }); }}>
                            <Plus size={18} /> Add New Habit
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="animate-fade-in">
                        <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Habit" : "Create New Habit"}</h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Habit Name</label>
                                <input autoFocus className="input-field" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Read 10 pages" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'white' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Frequency</label>
                                    <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'white' }}>
                                        <option value={FREQUENCY.DAILY}>Daily</option>
                                        <option value={FREQUENCY.MONTHLY}>Monthly</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Completion Type</label>
                                    <select value={form.completionType} onChange={e => setForm({ ...form, completionType: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'white' }}>
                                        <option value={COMPLETION_TYPES.TICK}>Tick Only</option>
                                        <option value={COMPLETION_TYPES.DETAILS}>Description Only</option>
                                        <option value={COMPLETION_TYPES.BOTH}>Tick + Description</option>
                                    </select>
                                </div>
                            </div>

                            {(form.completionType !== COMPLETION_TYPES.TICK) && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Placeholder Text</label>
                                    <input value={form.placeholder} onChange={e => setForm({ ...form, placeholder: e.target.value })} placeholder="e.g. What did you learn?" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input type="checkbox" id="incCons" checked={form.includeInConsistency} onChange={e => setForm({ ...form, includeInConsistency: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                                <label htmlFor="incCons">Include in Consistency Calculation</label>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Habit</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
