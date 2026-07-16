import useTeamSection from "./useTeamSection";
import { MdChat } from "react-icons/md";

// Show initials when no avatar image is provided
const AvatarFallback = ({ name }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return <div className="ts-avatar ts-avatar-initials">{initials}</div>;
};

// Skeleton row shown while loading
const SkeletonRow = () => (
  <div className="ts-member">
    <div className="ts-member-left">
      <div className="ts-skeleton ts-skeleton-avatar" />
      <div className="ts-member-info">
        <div className="ts-skeleton ts-skeleton-name" />
        <div className="ts-skeleton ts-skeleton-spec" />
      </div>
    </div>
    <div className="ts-skeleton ts-skeleton-btn" />
  </div>
);

const TeamSection = () => {
  const { teamMembers, loading, error, handleViewAll, handleChat } = useTeamSection();

  const renderBody = () => {
    if (loading) {
      return [1, 2, 3, 4].map((k) => <SkeletonRow key={k} />);
    }
    if (error) {
      return <p className="ts-state-msg ts-error-msg">Error: {error}</p>;
    }
    if (teamMembers.length === 0) {
      return <p className="ts-state-msg">No team members found.</p>;
    }
    return teamMembers.map((member) => (
      <div className="ts-member" key={member.id}>
        <div className="ts-member-left">
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="ts-avatar" />
          ) : (
            <AvatarFallback name={member.name} />
          )}
          <div className="ts-member-info">
            <div className="ts-name-row">
              <span className="ts-name">{member.name}</span>
              <span
                className={`ts-status-badge ${
                  member.status === "Available" ? "ts-available" : "ts-unavailable"
                }`}
              >
                {member.status}
              </span>
            </div>
            <span className="ts-specialty">{member.specialty}</span>
          </div>
        </div>
        <button className="ts-chat-btn" onClick={() => handleChat(member.id)}>
          <MdChat style={{ fontSize: "1.1rem" }} />
        </button>
      </div>
    ));
  };

  return (
    <>
      <div className="ts-container">
        <div className="ts-header">
          <h2 className="ts-title">Team Availability</h2>
          <span className="ts-view-all" onClick={handleViewAll}>View All</span>
        </div>
        <div className="ts-list">{renderBody()}</div>
      </div>

      <style>{`
        .ts-container {
          background: #fff;
          border-radius: 12px;
          padding: 22px;
          border: 1px solid #eef0f5;
          height: 100%;
          box-sizing: border-box;
        }
        .ts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .ts-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }
        .ts-view-all {
          font-size: 0.85rem;
          color: #374151;
          cursor: pointer;
          font-weight: 500;
          border: 1px solid #eef0f5;
          padding: 6px 14px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .ts-view-all:hover { color: #2E7DF7; border-color: #2E7DF7; }
        .ts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ts-member {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 8px;
          border-radius: 10px;
          transition: background 0.15s ease;
        }
        .ts-member:hover { background: #fafbfd; }
        .ts-member-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ts-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .ts-avatar-initials {
          background: linear-gradient(135deg, #2E7DF7, #6aa8ff);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.5px;
        }
        .ts-member-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ts-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ts-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1a1a2e;
        }
        .ts-status-badge {
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .ts-available   { background: #E8F8F0; color: #0D9B5C; }
        .ts-unavailable { background: #FFE8E8; color: #E74C3C; }
        .ts-specialty {
          font-size: 0.78rem;
          color: #9ca3af;
        }
        .ts-chat-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #E8F8F0;
          color: #0D9B5C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .ts-chat-btn:hover { background: #c6efd8; }

        /* ── State messages ─────────────────────────── */
        .ts-state-msg {
          text-align: center;
          padding: 24px 0;
          color: #9ca3af;
          font-size: 0.85rem;
          margin: 0;
        }
        .ts-error-msg { color: #E74C3C; }

        /* ── Skeleton shimmer ───────────────────────── */
        .ts-skeleton {
          border-radius: 6px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e7ec 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: ts-shimmer 1.4s infinite;
        }
        .ts-skeleton-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ts-skeleton-name  { width: 120px; height: 12px; margin-bottom: 6px; }
        .ts-skeleton-spec  { width: 80px;  height: 10px; }
        .ts-skeleton-btn   { width: 36px;  height: 36px; border-radius: 8px; }
        @keyframes ts-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export default TeamSection;
