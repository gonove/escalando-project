
import React from "react";
import { cn } from "@/lib/utils";

interface SessionPreviewProps {
  sessions: any[];
  viewAll: boolean;
  therapists: any[];
  isPastSession: boolean;
}

const SessionPreview: React.FC<SessionPreviewProps> = ({
  sessions,
  viewAll,
  therapists,
  isPastSession,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 p-0.5 overflow-hidden">
      {sessions.slice(0, 2).map((session, idx) => {
        const therapist = therapists.find(t => t.id === session.therapistId);
        return (
          <div
            key={idx}
            className={cn(
              "text-xs p-0.5 mb-0.5 rounded truncate",
              isPastSession && (!session.reportStatus || session.reportStatus === 'pending')
                ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-900/50"
                : "bg-escalando-100 text-escalando-800 border border-escalando-200 dark:bg-escalando-900/30 dark:text-escalando-100 dark:border-escalando-900/50"
            )}
            title={`${session.patientName} - ${therapist?.name}`}
          >
            <span className="font-medium">{session.patientName}</span>
            {viewAll && (
              <span className="text-xs text-escalando-600 dark:text-escalando-200 ml-1">
                ({therapist?.name.split(' ')[0]})
              </span>
            )}
          </div>
        );
      })}

      {sessions.length > 2 && (
        <div className="text-xs text-center bg-gray-100 rounded dark:bg-muted/20">
          +{sessions.length - 2} más
        </div>
      )}
    </div>
  );
};

export default SessionPreview;
