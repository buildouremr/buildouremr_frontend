import useTopbar from "./useTopbar";
import { Search, Bell, Settings } from 'lucide-react';

const Topbar = () => {
  const { search, handleSearch } = useTopbar();

  return (
    <>
      <div className="tb-topbar">
        <div className="tb-search-wrap">
          <Search className="tb-search-icon" />
          <input type="text" placeholder="Search Keyword" value={search}
            onChange={handleSearch} className="tb-search-input" />
        </div>
        <div className="tb-right">
          <button className="tb-icon-btn"><Settings style={{ fontSize: "1.2rem", color: "#6b7280" }} /></button>
          <button className="tb-icon-btn tb-notif-btn">
            <Bell style={{ fontSize: "1.2rem", color: "#6b7280" }} />
            <span className="tb-notif-dot"></span>
          </button>
          <button className="tb-icon-btn"><Settings style={{ fontSize: "1.2rem", color: "#6b7280" }} /></button>
          <img src="https://i.pravatar.cc/34?img=11" alt="profile" className="tb-profile" />
        </div>
      </div>
      <style>{`
        .tb-topbar {
          height: 58px; background: #fff; display: flex; justify-content: space-between;
          align-items: center; padding: 0 28px; border-bottom: 1px solid #eef0f5;
        }
        .tb-search-wrap {
          display: flex; align-items: center; gap: 8px; background: #f5f7fa;
          padding: 8px 14px; border-radius: 8px; border: 1px solid #e5e7eb; width: 260px;
        }
        .tb-search-icon { font-size: 1.1rem; color: #9ca3af; }
        .tb-search-input {
          border: none; outline: none; background: transparent; font-size: 0.85rem;
          color: #374151; width: 100%;
        }
        .tb-search-input::placeholder { color: #9ca3af; }
        .tb-right { display: flex; align-items: center; gap: 8px; }
        .tb-icon-btn {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e5e7eb;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; transition: background 0.15s;
        }
        .tb-icon-btn:hover { background: #f5f7fa; }
        .tb-notif-btn { position: relative; }
        .tb-notif-dot {
          position: absolute; top: 7px; right: 8px; width: 7px; height: 7px;
          background: #e74c3c; border-radius: 50%; border: 1.5px solid #fff;
        }
        .tb-profile { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; margin-left: 4px; cursor: pointer; }
      `}</style>
    </>
  );
};

export default Topbar;