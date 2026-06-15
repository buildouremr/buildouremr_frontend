import useSidebar from "./useSidebar";
import {
  MdDashboard, MdCalendarMonth, MdPeopleAlt, MdLocalHospital,
  MdScience, MdMedication, MdGroups, MdSettings, MdDescription,
  MdTrackChanges, MdLayers, MdAdd, MdChevronRight
} from "react-icons/md";
import { RiLeafFill } from "react-icons/ri";

const iconMap = {
  dashboard: MdDashboard, calendar: MdCalendarMonth, people: MdPeopleAlt,
  medical: MdLocalHospital, science: MdScience, pharmacy: MdMedication,
  groups: MdGroups, settings: MdSettings, document: MdDescription,
  changelog: MdTrackChanges, layers: MdLayers,
};

const Sidebar = ({ activeMenu: propActiveMenu, onMenuChange, summaryData }) => {
  const { activeMenu, mainMenuItems, helpMenuItems, handleMenuClick } = useSidebar(propActiveMenu, onMenuChange, summaryData);

  return (
    <>
      <div className="sb-sidebar">
        <div className="sb-top">
          <div className="sb-logo">
            <RiLeafFill className="sb-logo-icon" />
            <span className="sb-logo-text">Dreams EMR</span>
            <span className="sb-logo-badge">E</span>
          </div>
          <div className="sb-menu">
            {mainMenuItems.map((item, i) => {
              const Icon = iconMap[item.icon];
              const isActive = activeMenu === item.name;
              return (
                <div key={i} className={`sb-item ${isActive ? "sb-active" : ""}`}
                  onClick={() => handleMenuClick(item.name)}>
                  <div className="sb-item-left">
                    <Icon className="sb-item-icon" />
                    <span>{item.name}</span>
                  </div>
                  <div className="sb-item-right">
                    {item.badge && <span className="sb-badge">{item.badge}</span>}
                    {item.tag && <span className="sb-tag" style={{ background: item.tagColor }}>{item.tag}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sb-help-label">HELP</div>
          <div className="sb-menu">
            {helpMenuItems.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={i} className={`sb-item ${activeMenu === item.name ? "sb-active" : ""}`}
                  onClick={() => handleMenuClick(item.name)}>
                  <div className="sb-item-left">
                    <Icon className="sb-item-icon" />
                    <span>{item.name}</span>
                  </div>
                  <div className="sb-item-right">
                    {item.badge && <span className="sb-badge sb-badge-green">{item.badge}</span>}
                    {item.hasArrow && <MdChevronRight style={{ color: "#9ca3af", fontSize: "1.1rem" }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="sb-bottom-card">
          <div className="sb-card-emoji">🚀</div>
          <p className="sb-card-title">Let's start!</p>
          <p className="sb-card-desc">Creating or adding new tasks couldn't be easier</p>
          <button className="sb-card-btn"><MdAdd className="sb-btn-icon" /> Add New Task</button>
        </div>
      </div>

      <style>{`
        .sb-sidebar {
          width: 240px; min-width: 240px; height: 100vh; background: #f7f9fc;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 18px 14px; box-sizing: border-box; border-right: 1px solid #eef0f5;
          overflow-y: auto;
        }
        .sb-logo {
          display: flex; align-items: center; gap: 8px; padding: 0 10px; margin-bottom: 24px;
        }
        .sb-logo-icon { font-size: 1.4rem; color: #28a745; }
        .sb-logo-text { font-size: 1.05rem; font-weight: 700; color: #1a1a2e; }
        .sb-logo-badge {
          background: #2E7DF7; color: #fff; font-size: 0.6rem; font-weight: 700;
          width: 18px; height: 18px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
        }
        .sb-menu { display: flex; flex-direction: column; gap: 2px; }
        .sb-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 12px; border-radius: 8px; cursor: pointer;
          transition: all 0.15s ease; font-size: 0.88rem; color: #4b5563;
        }
        .sb-item:hover { background: #eef2f9; }
        .sb-item-left { display: flex; align-items: center; gap: 10px; }
        .sb-item-right { display: flex; align-items: center; gap: 6px; }
        .sb-item-icon { font-size: 1.15rem; }
        .sb-active {
          background: #2E7DF7 !important; color: #fff !important;
        }
        .sb-active .sb-item-icon { color: #fff; }
        .sb-badge {
          background: #2E7DF7; color: #fff; font-size: 0.65rem; font-weight: 700;
          padding: 2px 7px; border-radius: 10px;
        }
        .sb-active .sb-badge { background: rgba(255,255,255,0.3); }
        .sb-badge-green { background: #28a745 !important; }
        .sb-tag {
          color: #fff; font-size: 0.6rem; font-weight: 600;
          padding: 2px 8px; border-radius: 4px;
        }
        .sb-help-label {
          font-size: 0.7rem; font-weight: 600; color: #9ca3af;
          padding: 16px 12px 8px 12px; letter-spacing: 0.5px;
        }
        .sb-bottom-card {
          background: linear-gradient(135deg, #2E7DF7, #1b5fd4);
          border-radius: 14px; padding: 20px 16px; text-align: center;
          margin-top: 16px;
        }
        .sb-card-emoji { font-size: 1.8rem; margin-bottom: 4px; }
        .sb-card-title { color: #fff; font-weight: 700; font-size: 0.95rem; margin: 4px 0; }
        .sb-card-desc { color: rgba(255,255,255,0.8); font-size: 0.72rem; margin: 0 0 12px 0; line-height: 1.4; }
        .sb-card-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 9px; border: none; border-radius: 8px;
          background: #fff; color: #2E7DF7; font-weight: 600; font-size: 0.82rem;
          cursor: pointer; transition: background 0.2s;
        }
        .sb-card-btn:hover { background: #f0f4ff; }
        .sb-btn-icon { font-size: 1.1rem; color: #28a745; }
      `}</style>
    </>
  );
};

export default Sidebar;