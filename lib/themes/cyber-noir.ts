export const cyberNoirTheme = {
  dark: {
    primary: '#0A0B0D',
    secondary: '#1A1B1E',
    accent: '#00F5FF',
    text: '#F2F3F5',
    status: {
      online: '#00FF8C',
      idle: '#FFB800',
      offline: '#404040'
    }
  },
  light: {
    primary: '#F8F9FA',
    secondary: '#E5E7EB',
    accent: '#008B94',
    text: '#1A1B1E'
  }
};

export const cyberNoirStyles = {
  neonGlow: (color: string) => `
    box-shadow: 0 0 5px ${color},
                0 0 10px ${color},
                0 0 15px ${color};
  `,
  gridOverlay: `
    background-image: linear-gradient(0deg, transparent 24%, 
      var(--grid-color) 25%, 
      var(--grid-color) 26%, 
      transparent 27%, 
      transparent 74%, 
      var(--grid-color) 75%, 
      var(--grid-color) 76%, 
      transparent 77%),
    linear-gradient(90deg, transparent 24%, 
      var(--grid-color) 25%, 
      var(--grid-color) 26%, 
      transparent 27%, 
      transparent 74%, 
      var(--grid-color) 75%, 
      var(--grid-color) 76%, 
      transparent 77%);
    background-size: 50px 50px;
  `
};

export const animations = {
  statusPulse: `
    @keyframes statusPulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
  `,
  glowExpand: `
    @keyframes glowExpand {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  mobileSlide: `
    @keyframes mobileSlide {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
  `
}; 