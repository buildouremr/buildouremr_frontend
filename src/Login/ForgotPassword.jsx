import React, { useRef, useEffect } from 'react';
import useForgotPassword from './useForgotPassword';
import { MdOutlineMailOutline, MdErrorOutline } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';

const ForgotPassword = ({ onBack }) => {

    const {
        step,
        contact,
        otp,
        newPassword,
        error,
        loading,
        setContact,
        setOtp,
        setNewPassword,
        sendOtp,
        verifyOtp,
        resetPassword,
        handleResendOtp,
        resendTimer,
        canResend,
    } = useForgotPassword();

    // 4 individual refs for OTP boxes (hooks called at top level, not in a loop)
    const otpRef0 = useRef(null);
    const otpRef1 = useRef(null);
    const otpRef2 = useRef(null);
    const otpRef3 = useRef(null);
    const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3];

    // Auto-focus first box when OTP step loads
    useEffect(() => {
        if (step === 2) {
            setTimeout(() => otpRef0.current?.focus(), 120);
        }
    }, [step]);

    const getOtpChar = (index) => {
        return otp && otp[index] && otp[index] !== ' ' ? otp[index] : '';
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const arr = (otp || '').padEnd(4, ' ').split('');
        arr[index] = value || ' ';
        setOtp(arr.join('').trimEnd());
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !getOtpChar(index) && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div style={styles.container}>

            {/* ── Left Blue Panel ── */}
            <div style={styles.leftSection}>
                <div>
                    <p style={styles.brandName}>Smart EMR</p>
                    <p style={styles.brandTagline}>The one stop Healthcare solution</p>
                    <button style={styles.readMoreBtn}>Read More</button>
                </div>
                <div style={styles.arch2}></div>
                <div style={styles.arch}></div>
            </div>

            {/* ── Right White Panel ── */}
            <div style={styles.rightSection}>
                <div style={styles.formCard}>

                    {/* ════ STEP 1: Username + Email → Get OTP ════ */}
                    {step === 1 && (
                        <>
                            <div style={styles.titleRow}>
                                <IoArrowBack onClick={onBack} style={styles.backIcon} />
                                <div>
                                    <h2 style={styles.title}>OTP Verification</h2>
                                    <p style={styles.subtitle}>
                                        We will send you an one time password to this email
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div style={styles.errorBox}>
                                    <MdErrorOutline style={styles.errorIcon} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div style={styles.inputGroup}>
                                <MdOutlineMailOutline style={styles.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    style={styles.input}
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                style={{
                                    ...styles.primaryBtn,
                                    opacity: loading ? 0.75 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                                onClick={() => sendOtp(false)}
                                disabled={loading}
                            >
                                {loading ? 'Sending…' : 'Get OTP'}
                            </button>
                        </>
                    )}

                    {/* ════ STEP 2: 4-Box OTP Entry ════ */}
                    {step === 2 && (
                        <>
                            <div style={{ marginBottom: '8px' }}>
                                <h2 style={styles.title}>OTP Verification</h2>
                                <p style={styles.subtitle}>Enter OTP</p>
                            </div>

                            {/* Countdown timer */}
                            <div style={styles.timerRow}>
                                <span style={styles.timerText}>{formatTimer(resendTimer)}</span>
                            </div>

                            {/* 4 individual digit boxes */}
                            <div style={styles.otpRow}>
                                {[0, 1, 2, 3].map((i) => (
                                    <input
                                        key={i}
                                        ref={otpRefs[i]}
                                        maxLength={1}
                                        value={getOtpChar(i)}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        inputMode="numeric"
                                        style={{
                                            ...styles.otpBox,
                                            borderColor: error ? '#ffb3b3' : '#ddd',
                                            backgroundColor: error ? '#fff5f5' : '#fff',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Resend OTP link */}
                            <p
                                style={{
                                    ...styles.resendLink,
                                    opacity: canResend ? 1 : 0.4,
                                    cursor: canResend ? 'pointer' : 'default',
                                    pointerEvents: canResend ? 'auto' : 'none',
                                }}
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </p>

                            <button
                                style={{
                                    ...styles.primaryBtn,
                                    opacity: loading ? 0.75 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                                onClick={verifyOtp}
                                disabled={loading}
                            >
                                {loading ? 'Verifying…' : 'Verify OTP'}
                            </button>

                            {/* Error banner (below button, matches design) */}
                            {error && (
                                <div style={{ ...styles.errorBox, marginTop: '16px' }}>
                                    <MdErrorOutline style={styles.errorIcon} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </>
                    )}

                    {/* ════ STEP 3: Set New Password ════ */}
                    {step === 3 && (
                        <>
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={styles.title}>Reset Password</h2>
                                <p style={styles.subtitle}>Enter your new password below</p>
                            </div>

                            {error && (
                                <div style={styles.errorBox}>
                                    <MdErrorOutline style={styles.errorIcon} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div style={styles.inputGroup}>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={styles.input}
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                style={{
                                    ...styles.primaryBtn,
                                    opacity: loading ? 0.75 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                                onClick={() => resetPassword(onBack)}
                                disabled={loading}
                            >
                                {loading ? 'Resetting…' : 'Reset Password'}
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

/* ─── Styles ──────────────────────────────────────────────────── */
const styles = {
    container: {
        display: 'flex',
        height: '100vh',
    },

    /* Left blue gradient panel (mirrors Login.jsx) */
    leftSection: {
        flex: 5.5,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        background: 'linear-gradient(180deg, #021B79 0%, #02298A 15%, #0575E6 100%)',
    },
    brandName: {
        fontWeight: '700',
        fontSize: '2.5rem',
        margin: '0px',
    },
    brandTagline: {
        fontSize: '1.2rem',
        marginTop: '10px',
    },
    readMoreBtn: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    arch: {
        position: 'absolute',
        bottom: '-138px',
        left: '-120px',
        width: '403px',
        height: '370px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.25)',
    },
    arch2: {
        position: 'absolute',
        bottom: '-180px',
        left: '-160px',
        width: '390px',
        height: '450px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.15)',
    },

    /* Right white panel */
    rightSection: {
        flex: 4.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    formCard: {
        width: '58%',
        maxWidth: '360px',
    },

    /* Title row (back arrow + heading) */
    titleRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginBottom: '24px',
    },
    backIcon: {
        fontSize: '1.4rem',
        cursor: 'pointer',
        marginTop: '5px',
        color: '#222',
        flexShrink: 0,
    },
    title: {
        fontWeight: '700',
        fontSize: '1.6rem',
        margin: '0 0 6px 0',
        color: '#111',
    },
    subtitle: {
        margin: 0,
        color: '#999',
        fontSize: '0.86rem',
        lineHeight: '1.45',
    },

    /* Input */
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '11px 14px',
        marginBottom: '14px',
    },
    inputIcon: {
        color: '#bbb',
        marginRight: '10px',
        fontSize: '1.1rem',
        flexShrink: 0,
    },
    input: {
        border: 'none',
        outline: 'none',
        flex: 1,
        fontSize: '0.95rem',
        color: '#333',
        background: 'transparent',
    },

    /* Primary button */
    primaryBtn: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#1877F2',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '700',
        fontSize: '1rem',
        letterSpacing: '0.4px',
        transition: 'opacity 0.2s',
    },

    /* Timer */
    timerRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '14px',
    },
    timerText: {
        color: '#e53e3e',
        fontWeight: '600',
        fontSize: '0.92rem',
    },

    /* OTP 4-box row */
    otpRow: {
        display: 'flex',
        gap: '14px',
        justifyContent: 'center',
        marginBottom: '18px',
    },
    otpBox: {
        width: '54px',
        height: '54px',
        textAlign: 'center',
        fontSize: '1.35rem',
        fontWeight: '600',
        border: '1.5px solid #ddd',
        borderRadius: '8px',
        outline: 'none',
        color: '#222',
        transition: 'border-color 0.15s, background-color 0.15s',
    },

    /* Resend link */
    resendLink: {
        textAlign: 'center',
        color: '#1877F2',
        fontWeight: '500',
        fontSize: '0.92rem',
        marginBottom: '18px',
        transition: 'opacity 0.2s',
        userSelect: 'none',
    },

    /* Error banner */
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#fff5f5',
        border: '1px solid #ffc0c0',
        borderRadius: '8px',
        padding: '10px 14px',
        color: '#e53e3e',
        fontSize: '0.88rem',
        marginBottom: '14px',
    },
    errorIcon: {
        fontSize: '1.15rem',
        flexShrink: 0,
    },
};

export default ForgotPassword;