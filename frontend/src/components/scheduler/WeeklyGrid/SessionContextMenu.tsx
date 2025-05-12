
import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Info, Calendar } from "lucide-react";

interface SessionContextMenuProps {
  children: React.ReactNode;
  hasActiveSessions: boolean;
  onViewDetails: () => void;
  onShowSessionDetails: () => void;
}

const SessionContextMenu: React.FC<SessionContextMenuProps> = ({
  children,
  hasActiveSessions,
  onViewDetails,
  onShowSessionDetails,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      {hasActiveSessions && (
        <ContextMenuContent className="w-48">
          <ContextMenuItem 
            onClick={onViewDetails}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            <span>Ver detalles</span>
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={onShowSessionDetails}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Detalles de sesión</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export default SessionContextMenu;
