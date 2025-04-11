
import React from "react";
import { FileText } from "lucide-react";

interface TicketButtonProps {
  isGenerating: boolean;
  disabled: boolean;
  onClick: () => void;
}

const TicketButton: React.FC<TicketButtonProps> = ({ 
  isGenerating, 
  disabled, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isGenerating || disabled}
      className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
        disabled 
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-railway-50 text-railway-700 hover:bg-railway-100'
      }`}
    >
      {isGenerating ? (
        <div className="w-4 h-4 border-2 border-t-railway-600 border-railway-200 rounded-full animate-spin mr-2"></div>
      ) : (
        <FileText className="w-4 h-4 mr-2" />
      )}
      E-Ticket
    </button>
  );
};

export default TicketButton;
