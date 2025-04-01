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
      
      {/* Text với chữ H được thay bằng biểu tượng bệnh viện */}
      <div className="logo-text-container">
        <span className="logo-text">N</span>
        
        {/* Biểu tượng bệnh viện thay thế chữ H */}
        <svg className="hospital-icon" viewBox="0 0 24 24" width="24" height="25">
          <rect x="4" y="4" width="16" height="17" rx="2" fill="white"/>
          <path d="M12,8 L12,17 M8,12.5 L16,12.5" stroke="#4cb551" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M4,8 L20,8" stroke="white" strokeWidth="2"/>
        </svg>
        
        <span className="logo-text">À THUỐC TIỆN LỢI</span>
      </div>
    </div>
  );
};

export default PharmacyLogo;