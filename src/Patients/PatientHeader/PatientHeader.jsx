import { Plus } from 'lucide-react';

const PatientHeader = ({ onCreatePatient }) => {
  return (
    <>
      <div className="ph-container">
        <h1 className="ph-title">Patients</h1>
        <div className="ph-right">
          <button className="ph-new-btn" onClick={onCreatePatient}>
            <Plus style={{ fontSize: "1.1rem" }} />
            <span>Create new patient</span>
          </button>
        </div>
      </div>

      <style>{`
        .ph-container {
          padding: 24px 28px 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ph-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }
        .ph-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ph-new-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border: none;
          background: #2E7DF7;
          color: #fff;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .ph-new-btn:hover { background: #1b65d4; }
      `}</style>
    </>
  );
};

export default PatientHeader;
