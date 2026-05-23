import React from 'react';

const SessionExpiredModal = ({ open, onLogin }) => {
    if (!open) return null;

    return (
        <div className="modal-overlay" style={styles.overlay}>
            <div className="modal-card" style={styles.card}>
                <h3 style={styles.title}>Session Expired</h3>
                <p style={styles.text}>
                    Your session has expired or is no longer valid.
                </p>
                <p style={styles.text}>
                    Please log in again to continue using Smart EMR.
                </p>
                <button onClick={onLogin} style={styles.button}>
                    Go to Login
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    card: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '400px',
        maxWidth: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    title: {
        marginTop: 0,
        color: '#d9534f',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    text: {
        color: '#555',
        marginBottom: '15px',
        fontSize: '1rem',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '7px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        marginTop: '10px',
    }
};

export default SessionExpiredModal;
