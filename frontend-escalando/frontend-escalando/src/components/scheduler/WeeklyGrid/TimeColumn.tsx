
import React from "react";

interface TimeColumnProps {
  hours: string[];
}

const TimeColumn: React.FC<TimeColumnProps> = ({ hours }) => {
  return (
    <div className="col-span-1 divide-y divide-border">
      {hours.map((hour, hourIndex) => (
        <div
          key={hourIndex}
          className="h-16 flex items-center justify-center p-1"
        >
          <span className="text-xs font-medium">{hour}</span>
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
