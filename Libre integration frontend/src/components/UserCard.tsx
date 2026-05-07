import React from 'react';
import type { UserProfile } from '../types/glucose';
interface Props {
  user: UserProfile;
  onLogout: () => void;
}

export const UserCard: React.FC<Props> = ({ user, onLogout }) => {
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  const joined = user.created ? new Date(user.created).toLocaleDateString() : '—';

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6c63ff, #48bb78)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0,
      }}>
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.firstName} {user.lastName}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
          Joined {joined} · {user.country ?? '—'}
        </div>
      </div>

      <button
        onClick={onLogout}
        style={{
          padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--muted)', fontSize: 12,
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        Sign out
      </button>
    </div>
  );
};