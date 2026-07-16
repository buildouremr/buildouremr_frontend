import { useState } from 'react';
import LoginAPI from './API/loginAPI';
import HUtil from '../utils/useHutil';

const useLogin = (onLoginSuccess) => {

  // DATA
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  // ACTIONS
  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
      setEmailError('');
    }
    if (name === 'password') {
      setPassword(value);
      setPasswordError('');
    }
    // Clear general error when user types in any field
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearErrors();

    // Field-level validation
    let hasValidationError = false;

    if (!HUtil.isValidString(email)) {
      setEmailError("Email is required");
      hasValidationError = true;
    } else if (!HUtil.isValidEmail(email)) {
      setEmailError("Invalid email format");
      hasValidationError = true;
    }

    if (!HUtil.isValidString(password)) {
      setPasswordError("Password is required");
      hasValidationError = true;
    }

    if (hasValidationError) return;

    try {
      setLoading(true);

      const response = await LoginAPI.login({
        userEmail: email,
        password: password
      });

      const responseData = response?.data;
      const status = responseData?.status;

      if (status === "SUCCESS") {
        // JWT is now set as an HttpOnly cookie by the server.
        // We store the userId in sessionStorage for UI purposes only.
        const userData = responseData?.data;
        if (userData?.userId) {
          sessionStorage.setItem("userId", userData.userId);
        }
        if (userData?.userName) {
          sessionStorage.setItem("userName", userData.userName);
        }

        onLoginSuccess && onLoginSuccess();
      } else {
        setGeneralError("The Email or Password is Incorrect");
      }

    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.data;

      if (status === 401) {
        // Backend intentionally returns generic message — don't highlight any specific field
        setGeneralError(message || "The Email or Password is Incorrect");
      } else if (status === 403) {
        setGeneralError(message || "Account is locked. Contact support.");
      } else {
        setGeneralError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    emailError,
    passwordError,
    generalError,
    loading,
    handleChange,
    handleSubmit
  };
};

export default useLogin;
