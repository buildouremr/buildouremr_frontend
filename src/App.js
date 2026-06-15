import { useState, useEffect } from 'react';
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import SessionExpiredModal from "./components/SessionExpiredModal";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }

    const handleSessionExpired = () => {
      setShowExpiredModal(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLoginSuccess = () => {
    setShowExpiredModal(false); // clear any stale modal state from a previous session
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

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
          window.location.reload(); // Ensures a clean reset of all state/cache
        }} 
      />
    </div>
  );
}

export default App;