import React, { useState } from 'react';
import useLogin from './useLogin';
import ForgotPassword from './ForgotPassword';
import { MdOutlineMailOutline } from "react-icons/md";
import { FaLock } from "react-icons/fa6";

const Login = ({ onLoginSuccess }) => {
  const [showForgot, setShowForgot] = useState(false);
  const { email, password, handleChange, handleSubmit, emailError, passwordError, generalError, loading } = useLogin(onLoginSuccess);

  // Render ForgotPassword as its own full-page split layout
  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <div>
          <p style={styles.header}>Smart EMR</p>
          <p style={styles.content}>The One Stop Healthcare Solution</p>
          <button style={styles.readMoreButton}>Read More</button>
        </div>
        <div style={styles.arch2}></div>
        <div style={styles.arch}></div>
      </div>
      <div style={styles.rightSection}>
        <div style={styles.loginCard}>
          <>
            <div style={{ textAlign: 'left' }}>
              <p style={styles.helloAgain}>Hello Again!</p>
              <p style={styles.welcome}>Welcome Back</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form} id="login-form">
              {/* General authentication error banner — no field highlighting */}
              {generalError && (
                <p id="login-error" style={styles.errorText}>{generalError}</p>
              )}

              {/* Email field */}
              <div>
                <div style={{
                  ...styles.inputGroup,
                  border: emailError ? '1px solid red' : '1px solid #ccc'
                }}>
                  <span style={styles.icon}> <MdOutlineMailOutline style={styles.email} /> </span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={handleChange}
                    style={styles.input}
                    autoComplete="email"
                  />
                </div>
                {emailError && (
                  <p style={styles.fieldError}>{emailError}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div style={{
                  ...styles.inputGroup,
                  border: passwordError ? '1px solid red' : '1px solid #ccc'
                }}>
                  <span style={styles.icon}>
                    <FaLock style={styles.password} />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    style={styles.input}
                    autoComplete="current-password"
                  />
                </div>
                {passwordError && (
                  <p style={styles.fieldError}>{passwordError}</p>
                )}
              </div>

              <button
                id="login-submit"
                type="submit"
                style={{
                  ...styles.loginButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p id="forgot-password-link" style={styles.forgotPassword} onClick={() => setShowForgot(true)}>
              Forgot Password
            </p>
          </>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="container"] {
            flex-direction: column;
          }
          div[style*="leftSection"], div[style*="rightSection"] {
            width: 100%;
            height: 50%;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  leftSection: {
    flex: 5.5,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    background: "linear-gradient(180deg, #021B79 0%, #02298A 15%, #0575E6 100%)"
  },
  header: {
    fontWeight: '700',
    fontSize: '2.5rem',
    margin: '0px'
  },
  content: {
    fontSize: '1.2rem',
    marginTop: '10px',
  },
  arch: {
    position: "absolute",
    bottom: "-138px",
    left: "-120px",
    width: "403px",
    height: "370px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  arch2: {
    position: "absolute",
    bottom: "-180px",
    left: "-160px",
    width: "390px",
    height: "450px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  rightSection: {
    flex: 4.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loginCard: {
    width: '40%',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  helloAgain: {
    fontWeight: '700',
    fontSize: '1.5rem',
    margin: '0px'
  },
  welcome: {
    marginTop: '10px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '7px',
    padding: '10px',
  },
  icon: {
    marginRight: '10px',
  },
  email: {
    opacity: '0.3',
  },
  input: {
    border: 'none',
    outline: 'none',
    flex: 1,
  },
  password: {
    opacity: '0.3',
  },
  loginButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  forgotPassword: {
    marginTop: '15px',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  },
  readMoreButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '10px',
    textAlign: 'left'
  },
  fieldError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '4px',
    marginBottom: '0px',
    textAlign: 'left',
    paddingLeft: '2px',
  },
};

export default Login;
