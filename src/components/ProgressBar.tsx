import React from 'react';

interface ProgressBarProps {
  now: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ now }) => (
  <div style={{ width: '100%', backgroundColor: '#e0e0df', borderRadius: '5px', margin: '10px 0' }}>
    <div
      style={{
        width: `${now}%`,
        //backgroundColor: now == 100 ? '#76c7c0' : '#f76c6c',
        backgroundColor: `#${((((100 - now) / 100) * 15) | 0).toString(16)}${(((now / 100) * 15) | 0).toString(16)}0`,
        height: '10px',
        borderRadius: '5px',
        transition: 'width 0.2s ease-in-out'
      }}
    />
  </div>
);

export default ProgressBar;
