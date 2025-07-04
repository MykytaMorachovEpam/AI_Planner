import React from 'react';
import { useIntl } from 'react-intl';
import { TaskItem } from '../api/taskApi';

interface PrioritySelectProps {
  value: TaskItem['priority'];
  onChange: (priority: TaskItem['priority']) => void;
  disabled?: boolean;
}

const priorityColors = {
  Low: '#4CAF50',
  Medium: '#FFC107',
  High: '#FF9800',
  Critical: '#F44336',
};

export const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange, disabled }) => {
  const intl = useIntl();
  const priorities: TaskItem['priority'][] = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TaskItem['priority'])}
      disabled={disabled}
      aria-label={intl.formatMessage({ id: 'priority' })}
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: priorityColors[value] + '20',
        color: priorityColors[value],
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {priorities.map((priority) => (
        <option
          key={priority}
          value={priority}
          style={{
            backgroundColor: 'white',
            color: priorityColors[priority],
            fontWeight: 'bold',
          }}
        >
          {intl.formatMessage({ id: `priority.${priority.toLowerCase()}` })}
        </option>
      ))}
    </select>
  );
}; 