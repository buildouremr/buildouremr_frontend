import { useState } from "react";
import useSidebar from "./useSidebar";
import { LayoutDashboard, Calendar, Users, Stethoscope, TestTube, Pill, Settings, FileText, Activity, Layers, ChevronRight, Leaf, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

const iconMap = {
  dashboard: LayoutDashboard, calendar: Calendar, people: Users,
  medical: Stethoscope, science: TestTube, pharmacy: Pill,
  groups: Users, settings: Settings, document: FileText,
  changelog: Activity, layers: Layers,
};

const Sidebar = ({ activeMenu: propActiveMenu, onMenuChange, summaryData }) => {
  const { activeMenu, mainMenuItems, helpMenuItems, handleMenuClick } = useSidebar(propActiveMenu, onMenuChange, summaryData);
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  return (
    <div className="sb-wrapper" style={{ width: isPinned ? 240 : 80, minWidth: isPinned ? 240 : 80, transition: 'width 0.3s ease', position: 'relative' }}>
      <div
        className={`sb-sidebar ${isExpanded ? "expanded" : "collapsed"} ${isPinned ? "pinned" : ""}`}
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => !isPinned && setIsHovered(false)}
      >
        <div className="sb-top">
          <div className="sb-logo">
            <div className="sb-logo-left">
              <Leaf className="sb-logo-icon" />
              {isExpanded && <span className="sb-logo-text">Dreams EMR</span>}
            </div>
            {isExpanded && (
              <button
                className="sb-toggle-btn"
                onClick={() => { setIsPinned(!isPinned); setIsHovered(false); }}
              >
                {isPinned ? <ArrowLeftFromLine size={16} /> : <ArrowRightFromLine size={16} />}
              </button>
            )}
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
                    {isExpanded && <span>{item.name}</span>}
                  </div>
                  {isExpanded && (
                    <div className="sb-item-right">
                      {item.badge && <span className="sb-badge">{item.badge}</span>}
                      {item.tag && <span className="sb-tag" style={{ background: item.tagColor }}>{item.tag}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {isExpanded && <div className="sb-help-label">HELP</div>}
          <div className="sb-menu">
            {helpMenuItems.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={i} className={`sb-item ${activeMenu === item.name ? "sb-active" : ""}`}
                  onClick={() => handleMenuClick(item.name)}>
                  <div className="sb-item-left">
                    <Icon className="sb-item-icon" />
                    {isExpanded && <span>{item.name}</span>}
                  </div>
                  {isExpanded && (
                    <div className="sb-item-right">
                      {item.badge && <span className="sb-badge sb-badge-green">{item.badge}</span>}
                      {item.hasArrow && <ChevronRight style={{ color: "#9ca3af", fontSize: "1.1rem" }} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* {isExpanded && (
          <div className="sb-bottom-card">
            <div className="sb-card-emoji">&#9733;</div>
            <p className="sb-card-title">Let's start!</p>
            <p className="sb-card-desc">Creating or adding new tasks couldn't be easier</p>
            <button className="sb-card-btn"><Plus className="sb-btn-icon" /> Add New Task</button>
          </div>
        )} */}
      </div>

      <style>{`
        .sb-sidebar {
          width: 240px; height: 100vh; background: #f7f9fc;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 18px 14px; box-sizing: border-box; border-right: 1px solid #eef0f5;
          overflow-y: auto; overflow-x: hidden;
          position: absolute; top: 0; left: 0;
          transition: width 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease;
          z-index: 100;
        }
        .sb-sidebar.collapsed {
          width: 80px;
          padding: 18px 14px;
        }
        .sb-sidebar.expanded:not(.pinned) {
          box-shadow: 4px 0 15px rgba(0,0,0,0.08);
        }
        .sb-logo {
          display: flex; align-items: center; justify-content: space-between; 
          padding: 0 4px; margin-bottom: 24px;
        }
        .sb-logo-left {
          display: flex; align-items: center; gap: 8px;
        }
        .sb-logo-icon { font-size: 1.4rem; color: #28a745; flex-shrink: 0; }
        .sb-logo-text { font-size: 1.05rem; font-weight: 700; color: #1a1a2e; white-space: nowrap; }
        .sb-logo-badge {
          background: #2E7DF7; color: #fff; font-size: 0.6rem; font-weight: 700;
          width: 18px; height: 18px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
        }
        .sb-menu { display: flex; flex-direction: column; gap: 4px; }
        .sb-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 12px; border-radius: 8px; cursor: pointer;
          transition: all 0.15s ease; font-size: 0.88rem; color: #4b5563;
          white-space: nowrap;
        }
        .sb-item:hover { background: #eef2f9; }
        .sb-item-left { display: flex; align-items: center; gap: 12px; }
        .sb-item-right { display: flex; align-items: center; gap: 6px; }
        .sb-item-icon { font-size: 1.15rem; flex-shrink: 0; }
        .sb-active {
          background: #2E7DF7 !important; color: #fff !important;
        }
        .sb-toggle-btn {
          background: #2E7DF7; color: #fff; border: none; border-radius: 6px;
          width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: background 0.2s;
        }
        .sb-toggle-btn:hover { background: #1b5fd4; }
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
    </div>
  );
};

export default Sidebar;