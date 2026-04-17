import React, { createContext, useContext, useState } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [timeState, setTimeState] = useState({
    hour: 12,
    dow: 0,
    daysGap: 7,
  });

  const updateTimeState = (updates) => {
    setTimeState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <TimeContext.Provider value={{ ...timeState, updateTimeState }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
