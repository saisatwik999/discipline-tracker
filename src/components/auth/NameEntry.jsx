import { useState } from 'react';

export const NameEntry = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();

        if (!trimmed) {
            setError('Please enter your name to continue');
            return;
        }

        if (trimmed.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }

        onComplete(trimmed);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '2rem'
        }}>
            <div className="card animate-fade-in" style={{
                maxWidth: '450px',
                width: '100%',
                padding: '3rem 2rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                background: 'rgba(30, 30, 50, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h1 style={{
                    marginBottom: '1rem',
                    fontSize: '2rem',
                    fontWeight: '800',
                    background: 'linear-gradient(90deg, #fff, #a5b4fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Welcome
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '2.5rem',
                    lineHeight: '1.6'
                }}>
                    Enter your name to securely load your personal progress and history.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)'
                        }}>
                            YOUR NAME
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g. Sai"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: error ? '1px solid var(--status-error)' : '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(0, 0, 0, 0.2)',
                                color: 'white',
                                fontSize: '1.1rem',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            autoFocus
                        />
                        {error && (
                            <span style={{
                                color: 'var(--status-error)',
                                fontSize: '0.85rem',
                                marginTop: '0.5rem',
                                display: 'block'
                            }}>
                                {error}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                        }}
                    >
                        Start Journey
                    </button>
                </form>
            </div>
        </div>
    );
};
