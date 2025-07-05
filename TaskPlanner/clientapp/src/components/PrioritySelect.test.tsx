import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { PrioritySelect } from './PrioritySelect';
import { TaskItem } from '../api/taskApi';

const messages = {
  'priority': 'Priority',
  'priority.low': 'Low',
  'priority.medium': 'Medium',
  'priority.high': 'High',
  'priority.critical': 'Critical',
};

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <IntlProvider messages={messages} locale="en">
      {component}
    </IntlProvider>
  );
};

describe('PrioritySelect', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with the correct priority options', () => {
    renderWithIntl(<PrioritySelect value="Medium" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    
    expect(select).toBeInTheDocument();
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Low');
    expect(options[1]).toHaveTextContent('Medium');
    expect(options[2]).toHaveTextContent('High');
    expect(options[3]).toHaveTextContent('Critical');
  });

  it('displays the selected value', () => {
    renderWithIntl(<PrioritySelect value="High" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('High');
  });

  it('calls onChange when a new priority is selected', async () => {
    renderWithIntl(<PrioritySelect value="Medium" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'High');
    
    expect(mockOnChange).toHaveBeenCalledWith('High');
  });

  it('is disabled when disabled prop is true', () => {
    renderWithIntl(<PrioritySelect value="Medium" onChange={mockOnChange} disabled />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('applies color styling based on priority', () => {
    renderWithIntl(<PrioritySelect value="Critical" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveStyle({ backgroundColor: expect.stringContaining('F44336') });
  });

  it('renders with proper accessibility attributes', () => {
    renderWithIntl(<PrioritySelect value="Medium" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-label', expect.stringMatching(/priority/i));
  });
}); 