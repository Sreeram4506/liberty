import React from 'react';

export default function FirearmPolicyNotice() {
  return (
    <div style={{ borderBottom: '2px solid var(--color-accent)', background: 'var(--color-surface)' }}>
      <div className="wrap" style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--color-accent)' }}>In-Store Pickup Only:</strong> All used firearms must be picked up physically in-store. No shipping available.
        </p>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--color-accent)' }}>15% Restocking Fee:</strong> Ensure you are legally qualified to own a firearm before purchasing. Orders that cannot be fulfilled due to background check failure or legal disqualification will be refunded minus a 15% restocking fee.
        </p>
      </div>
    </div>
  );
}
