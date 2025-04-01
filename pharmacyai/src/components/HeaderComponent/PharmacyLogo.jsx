import React from 'react';

const PharmacyLogo = () => {
  return (
    <div className="logo-flex">
      {/* Icon dược phẩm đơn giản */}
      <div className="logo-icon">
        <svg viewBox="0 0 30 30" width="30" height="30">
          <circle cx="15" cy="15" r="13" fill="white"/>
          <path d="M15,7 L15,23 M7,15 L23,15" stroke="#4cb551" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Text thông thường thay vì SVG */}
      <span className="logo-text">NHÀ THUỐC TIỆN LỢI</span>
    </div>
  );
};

export default PharmacyLogo;