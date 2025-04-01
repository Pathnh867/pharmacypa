import React from 'react';

const PharmacyLogo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" className="pharmacy-logo">
      {/* Gradients & Effects */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4cb551" />
          <stop offset="100%" stopColor="#3aa43f" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="rounded-rect">
          <rect x="0" y="0" width="320" height="80" rx="10" ry="10" />
        </clipPath>
      </defs>
      
      {/* Background with stylish design */}
      <g clipPath="url(#rounded-rect)">
        <rect x="0" y="0" width="320" height="80" fill="#4cb551" />
        <path d="M0,0 L320,80 M0,80 L320,0" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx="30" cy="40" r="60" fill="url(#bgGradient)" opacity="0.3" />
        <circle cx="290" cy="40" r="40" fill="url(#bgGradient)" opacity="0.2" />
      </g>
      
      {/* Main Container */}
      <g filter="url(#softShadow)">
        {/* Modern Pharmacy Symbol */}
        <g transform="translate(25, 25)">
          <circle cx="15" cy="15" r="15" fill="#ffffff" />
          <path d="M15,6 L15,24 M6,15 L24,15" stroke="#4cb551" strokeWidth="4" strokeLinecap="round" />
          <circle cx="15" cy="15" r="18" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
        </g>
        
        {/* Typography using properly drawn paths for Vietnamese accents */}
        <g transform="translate(65, 32)" fill="#ffffff">
          {/* NHÀ with proper accent */}
          <path d="M0,0 h3 v25 h-3 z M5,12 h7 v3 h-7 z M12,0 h3 v25 h-3 z" />
          <path d="M19,0 h3 v25 h-3 z M22,0 h3 L31,25 h-3 z M31,0 h3 v25 h-3 z" />
          <path d="M38,0 h3 v25 h-3 z M41,0 h9 v3 h-6 v8 h6 v3 h-6 v8 h6 v3 h-9 z" />
          {/* À accent mark */}
          <path d="M26.5,-5 l-3,4 h4 z" />
          
          {/* THUỐC with proper accents */}
          <path d="M60,0 h-8 v3 h2.5 v22 h3 v-22 h2.5 z" />
          <path d="M65,0 h3 v25 h-3 z M69,0 h9 v3 h-6 v8 h4 v3 h-4 v11 h-3 z" />
          <path d="M82,0 h3 v25 h-3 z M85,0 h3 l4,25 h-3 z M92,0 h3 v25 h-3 z" />
          <path d="M99,0 h3 l6,25 h-3 l-1.5,-6 h-6 l-1.5,6 h-3 z M104,16 l-2,-8 l-2,8 z" />
          {/* Ố accent mark */}
          <path d="M103.5,-5 l3,4 h-4 z" />
          
          {/* TIỆN LỢI with proper accents */}
          <path d="M118,0 h-8 v3 h3.5 v22 h3 v-22 h3.5 v-3 h-2 z" />
          <path d="M124,0 h3 v25 h-3 z" />
          <path d="M132,0 h3 v25 h-3 z M135,0 h3 l4,25 h-3 z M142,0 h3 v25 h-3 z" />
          <path d="M149,0 h10 v3 h-7 v8 h5 v3 h-5 v8 h7 v3 h-10 z" />
          {/* Ệ accent mark */}
          <path d="M138,-5 l3,4 h-4 z" />
          <circle cx="138" cy="29" r="1.5" />
          
          <path d="M164,0 h3 v25 h-3 z" />
          <path d="M172,0 h3 l6,25 h-3 l-1.5,-6 h-6 l-1.5,6 h-3 z M177,16 l-2,-8 l-2,8 z" />
          <path d="M185,0 h3 v25 h-3 z" />
          {/* Ợ accent mark */}
          <path d="M176,-5 l3,4 h-4 z" />
          <circle cx="176" cy="29" r="1.5" />
        </g>
      </g>
      
      {/* Decorative elements */}
      <line x1="65" y1="60" x2="243" y2="60" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="65" cy="66" r="1.5" fill="#ffffff" />
      <circle cx="155" cy="66" r="1.5" fill="#ffffff" />
      <circle cx="243" cy="66" r="1.5" fill="#ffffff" />
      
      {/* Subtle pattern */}
      <g opacity="0.06">
        <path d="M0,0 L320,80" stroke="#ffffff" strokeWidth="0.5" />
        <path d="M0,20 L320,100" stroke="#ffffff" strokeWidth="0.5" />
        <path d="M0,40 L320,120" stroke="#ffffff" strokeWidth="0.5" />
        <path d="M0,60 L320,140" stroke="#ffffff" strokeWidth="0.5" />
      </g>
    </svg>
  );
};

export default PharmacyLogo;
