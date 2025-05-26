import React from 'react';
import { Eye, CheckCircle, Clock, XCircle, List } from 'lucide-react';
import { AnimeStatus } from '../../types/database.types';

interface StatusFilterProps {
  currentStatus: AnimeStatus | 'all';
  onStatusChange: (status: AnimeStatus | 'all') => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ currentStatus, onStatusChange }) => {
  const statuses: { id: AnimeStatus | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <List size={18} /> },
    { id: 'watching', label: 'Watching', icon: <Eye size={18} /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle size={18} /> },
    { id: 'plan_to_watch', label: 'Plan to Watch', icon: <Clock size={18} /> },
    { id: 'dropped', label: 'Dropped', icon: <XCircle size={18} /> },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statuses.map((status) => (
        <button
          key={status.id}
          onClick={() => onStatusChange(status.id)}
          className={`px-3 py-2 rounded-md flex items-center ${
            currentStatus === status.id
              ? 'bg-primary-400 text-white'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
          }`}
        >
          <span className="mr-2">{status.icon}</span>
          <span>{status.label}</span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;