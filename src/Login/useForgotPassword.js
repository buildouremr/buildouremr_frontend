import { useState, useEffect } from 'react';
import LoginAPI from './API/loginAPI';
import HUtil from '../utils/useHutil';

const useForgotPassword = () => {

    const [step, setStep] = useState(1);
    const [contact, setContact] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Countdown timer fires whenever we enter the OTP step (step 2)
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
    }, [step]);

    // STEP 1 → SEND OTP (isResend = true when called from "Resend OTP")
    const sendOtp = async (isResend = false) => {
        setError('');

        if (!HUtil.isValidString(contact)) {
            setError('Email address is required');
            return;
        }

        try {
            setLoading(true);

            await LoginAPI.sendOtp({
                userName: contact,
                contact: contact
            });

            if (!isResend) {
                setStep(2);
            }

        } catch (e) {
            setError(e?.response?.data || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP - re-calls sendOtp without advancing the step, resets timer
    const handleResendOtp = async () => {
        await sendOtp(true);
        setResendTimer(30);
        setCanResend(false);
    };

    // STEP 2 → VERIFY OTP
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
                otp: otp.replace(/\s/g, '')
            });

            const result = response?.data?.data;

            if (result && result.includes('OTP')) {
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

    // STEP 3 → RESET PASSWORD
    const resetPassword = async (onSuccess) => {
        setError('');

        if (!newPassword) {
            setError('Enter new password');
            return;
        }

        try {
            setLoading(true);

            await LoginAPI.resetPassword({
                userName: contact,
                password: newPassword
            });

            alert('Password reset successful');
            onSuccess && onSuccess();

        } catch (e) {
            setError('Failed to reset password');
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