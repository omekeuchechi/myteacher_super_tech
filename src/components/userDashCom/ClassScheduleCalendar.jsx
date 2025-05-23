import React, { useState, useEffect } from 'react';

const ClassScheduleCalendar = ({ theme, classes }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-schedule" style={{
      background: theme === 'light' ? '#fff' : '#1c1c1c',
      color: theme === 'light' ? '#000' : '#fff',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '16px',
      fontFamily: 'sans-serif',
      marginTop: '30px',
    }}>
      <h3 style={{ marginBottom: '10px' }}>
        <i className="fas fa-calendar-alt" style={{ marginRight: '6px' }} />
        Class Schedule
      </h3>

      <p style={{ fontSize: '14px', marginBottom: '10px' }}>
        <strong>{now.toLocaleDateString()}</strong> | {now.toLocaleTimeString()}
      </p>

      {classes && classes.length > 0 ? (
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {classes.map(cls => {
            const timeLeft = Math.max(0, Math.floor((cls.startTime - now) / 1000));
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const s = timeLeft % 60;

            return (
              <div key={cls.id} style={{
                borderBottom: '1px solid #444',
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px'
              }}>
                <div>
                  <strong>{cls.title}</strong>
                  <div style={{ fontSize: '12px', color: theme === 'light' ? '#555' : '#aaa' }}>
                    {cls.platform} | {cls.startTime.toLocaleTimeString()}
                  </div>
                </div>
                <div>{h}h {m}m {s}s</div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No upcoming classes</p>
      )}
    </div>
  );
};

export default ClassScheduleCalendar;
