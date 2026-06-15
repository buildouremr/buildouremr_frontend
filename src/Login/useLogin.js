import { useState } from 'react';
import LoginAPI from './API/loginAPI';
import HUtil from '../utils/useHutil';

const useLogin = (onLoginSuccess) => {

  // DATA
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hasError, setHasError] = useState(false);

  const data = {
    email,
    password,
    error,
    hasError
  };

  // ACTIONS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setError('');
    setHasError(false);

    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setHasError(false);

    if (!HUtil.isValidString(email) || !HUtil.isValidString(password)) {
      setError("All fields are required");
      setHasError(true);
      return;
    }

    if (!HUtil.isValidEmail(email)) {
      setError("Invalid email format");
      setHasError(true);
      return;
    }

    try {
      const response = await LoginAPI.login({
        userEmail: email,
        password: password
      });

      const token = response?.data?.data;

      if (token && !token.includes("INVALID")) {
        localStorage.setItem("token", token);

        // ✅ Always call this
        onLoginSuccess && onLoginSuccess();

      } else {
        setError("The Email or Password is Incorrect");
        setHasError(true);
      }

    } catch (err) {
      console.error(err);

      const status = err?.response?.status;

      if (status === 401 || status === 403) {
        setError("The Email or Password is Incorrect");
      } else {
        setError("Something went wrong. Try again.");
      }

      setHasError(true);
    }
  };

  const action = {
    handleChange,
    handleSubmit
  };

  return {
    ...data,
    ...action
  };
};

export default useLogin;
