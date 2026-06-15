import usePriorityCenter from "./usePriorityCenter";

const PriorityCenter = () => {
  const { priorities, handleView } = usePriorityCenter();

  return (
    <>
      <div className="pc-container">
        <div className="pc-header">
          <h2 className="pc-title">Priority Center</h2>
        </div>
        <div className="pc-list">
          {priorities.map((item) => (
            <div className="pc-item" key={item.id}>
              <div className="pc-item-left">
                <div
                  className="pc-icon-wrap"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                </div>
                <span className="pc-item-text">{item.title}</span>
              </div>
              <button
                className="pc-view-btn"
                onClick={() => handleView(item.id)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pc-container {
          background: #fff;
          border-radius: 12px;
          padding: 22px;
          border: 1px solid #eef0f5;
          height: 100%;
          box-sizing: border-box;
        }
        .pc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .pc-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }
        .pc-view-all {
          font-size: 0.85rem;
          color: #374151;
          cursor: pointer;
          font-weight: 500;
          border: 1px solid #eef0f5;
          padding: 6px 14px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .pc-view-all:hover {
          color: #2E7DF7;
          border-color: #2E7DF7;
        }
        .pc-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pc-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: #fafbfd;
          border-radius: 10px;
          transition: background 0.15s ease;
        }
        .pc-item:hover {
          background: #f0f4fa;
        }
        .pc-item-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .pc-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pc-item-text {
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
        }
        .pc-view-btn {
          padding: 7px 22px;
          background: #2E7DF7;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .pc-view-btn:hover {
          background: #1b6ae0;
        }
      `}</style>
    </>
  );
};

export default PriorityCenter;
