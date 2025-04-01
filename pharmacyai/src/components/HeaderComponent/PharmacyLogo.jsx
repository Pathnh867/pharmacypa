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
      
      {/* Text với chữ H được thay bằng biểu tượng ngôi nhà */}
      <div className="logo-text-container">
        <span className="logo-text">N</span>
        
        {/* Biểu tượng ngôi nhà thay thế chữ H */}
        <svg className="house-icon" viewBox="0 0 24 24" width="24" height="24">
          <path d="M3,12 L12,3 L21,12 M5,10 L5,21 L19,21 L19,10" 
                stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
          {/* Dấu cộng cho biểu tượng hospital (tùy chọn) */}
          <path d="M12,12 L12,18 M9,15 L15,15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        
        <span className="logo-text">À THUỐC TIỆN LỢI</span>
      </div>
    </div>
  );
};

export default PharmacyLogo;