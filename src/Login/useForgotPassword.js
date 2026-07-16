import { useState, useEffect } from 'react';
import LoginAPI from './API/loginAPI';
import HUtil from '../utils/useHutil';

const MIN_PASSWORD_LENGTH = 6;

const useForgotPassword = () => {

    const [step, setStep] = useState(1);
    const [contact, setContact] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [resendCount, setResendCount] = useState(0);

    // Countdown timer fires whenever we enter the OTP step (step 2)
    // OR when resendCount changes (user clicked Resend OTP)
    useEffect(() => {
        if (step !== 2) return;

        setResendTimer(30);
        setCanResend(false);

        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [step, resendCount]);

    // STEP 1 - SEND OTP (isResend = true when called from "Resend OTP")
    const sendOtp = async (isResend = false) => {
        setError('');

        if (!HUtil.isValidString(contact)) {
            setError('Email address is required');
            return;
        }

        if (contact.includes('@') && !HUtil.isValidEmail(contact)) {
            setError('Invalid email format');
            return;
        }

        try {
            setLoading(true);

            await LoginAPI.sendOtp({
                userEmail: contact
            });

            if (!isResend) {
                setStep(2);
            }

        } catch (e) {
            const status = e?.response?.status;
            if (status === 429) {
                setError('Please wait 30 seconds before requesting another OTP');
            } else {
                setError(e?.response?.data?.data || 'Failed to send OTP');
            }
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP - re-calls sendOtp without advancing the step
    // Incrementing resendCount triggers the useEffect to restart the timer
    const handleResendOtp = async () => {
        if (loading) return; // Prevent duplicate requests while loading
        await sendOtp(true);
        setResendCount(prev => prev + 1);
    };

    // STEP 2 - VERIFY OTP
    const verifyOtp = async () => {
        setError('');

        if (!otp || otp.replace(/\s/g, '').length < 4) {
            setError('Please enter the 4-digit OTP');
            return;
        }

        try {
            setLoading(true);

            const response = await LoginAPI.verifyOtp({
                key: contact,
                OTP: otp.replace(/\s/g, '')
            });

            const result = response?.data?.data;

            // Fixed: exact match instead of .includes() which matched both VALID and INVALID
            if (result === 'OTP_VALID') {
                setStep(3);
            } else {
                setError('You have entered an invalid OTP');
            }

        } catch (e) {
            setError('You have entered an invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // STEP 3 - RESET PASSWORD
    const resetPassword = async (onSuccess) => {
        setError('');

        if (!newPassword) {
            setError('Enter new password');
            return;
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }

        try {
            setLoading(true);

            await LoginAPI.resetPassword({
                userEmail: contact,
                password: newPassword
            });

            alert('Password reset successful. Please login with your new password.');
            onSuccess && onSuccess();

        } catch (e) {
            const message = e?.response?.data?.data;
            if (message && message.includes('OTP verification required')) {
                setError('OTP verification expired. Please start again.');
            } else {
                setError(message || 'Failed to reset password');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
};

export default useForgotPassword;