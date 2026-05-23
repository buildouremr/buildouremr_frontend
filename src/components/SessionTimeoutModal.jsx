import React from 'react';

const SessionTimeoutModal = ({
    open,
    onContinue,
    countdown
}) => {

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card">

                <h3>Session Expiring</h3>

                <p>
                    No activity detected for 10 minutes.
                </p>

                <p>
                    You will be logged out in {countdown} seconds.
                </p>

                <button onClick={onContinue}>
                    Stay Logged In
                </button>

            </div>
        </div>
    );
};

export default SessionTimeoutModal;