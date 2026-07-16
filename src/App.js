import { useState, useEffect, useRef } from 'react';
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import SessionExpiredModal from "./components/SessionExpiredModal";
import LoginAPI from "./Login/API/loginAPI";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Use a ref to track auth state so the event handler always sees the latest value
  // (event handlers close over stale state if we use isLoggedIn directly)
  const wasAuthenticatedRef = useRef(false);

  // On mount, check if the user has a valid session by calling /me
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await LoginAPI.getCurrentUser();
        if (response?.data?.status === "SUCCESS") {
          // Restore UI state from backend response
          sessionStorage.setItem("userId", response.data.data.userId);
          sessionStorage.setItem("userName", response.data.data.userName);
          setIsLoggedIn(true);
          wasAuthenticatedRef.current = true;
        }
      } catch {
        // No valid session - stay on login page
        sessionStorage.clear();
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();

    const handleSessionExpired = () => {
      // Only show the modal if the user was previously authenticated.
      // This prevents the modal from appearing on the Login page,
      // during Forgot Password, or on any public route.
      if (wasAuthenticatedRef.current) {
        setShowExpiredModal(true);
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLoginSuccess = () => {
    setShowExpiredModal(false);
    setIsLoggedIn(true);
    wasAuthenticatedRef.current = true;
  };

  const handleLogout = async () => {
    try {
      await LoginAPI.logout();
    } catch {
      // Continue with client-side logout even if server call fails
    }
    sessionStorage.clear();
    setIsLoggedIn(false);
    wasAuthenticatedRef.current = false;
  };

  // Show nothing while checking session to avoid flash of login page
  if (checkingSession) {
    return null;
  }

  return (
    <div className="App">
      {
        isLoggedIn
          ? <Dashboard onLogout={handleLogout} />
          : <Login onLoginSuccess={handleLoginSuccess} />
      }

      <SessionExpiredModal 
        open={showExpiredModal} 
        onLogin={() => {
          setShowExpiredModal(false);
          handleLogout();
        }} 
      />
    </div>
  );
}

export default App;