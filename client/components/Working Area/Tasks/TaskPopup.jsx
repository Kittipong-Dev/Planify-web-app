// Task.js (React Component)
import React, { useState } from 'react';
import TaskLabel from './TaskLabel';
import Member from './Member';
import '/styles/popup.css';
import '/styles/task.css';

const TaskPopup = ({
  isVisible,
  onClose,
  onSave,
  members,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedMember, setAssignedMember] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const handleSave = () => {
    if (!taskName) {
      alert('Task name is required.');
      return;
    }
    const taskData = {
      name: taskName,
      details: taskDetails,
      startDate,
      dueDate,
      assignedMember,
      label: selectedLabel,
    };
    onSave(taskData);
    handleClose();
  };

  const handleClose = () => {
    setTaskName('');
    setTaskDetails('');
    setStartDate('');
    setDueDate('');
    setAssignedMember(null);
    setSelectedLabel(null);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="task-popup-overlay" onClick={handleClose}>
      <div className="task-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Create Task</h3>
        </div>

        <div className="popup-body">
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>

          <div className="form-group">
            <label>Task Details</label>
            <textarea
              value={taskDetails}
              onChange={(e) => setTaskDetails(e.target.value)}
              placeholder="Enter task details"
            />
          </div>

          <div className="form-group date-inputs">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
          </div>
          <div className="form-group date-inputs">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
          </div>

          <div className="form-group">
            <label>Assigned Member</label>
            <Member
              members={members.members}
              selectedMember={assignedMember}
              onMemberSelect={setAssignedMember}
              isVisible={true}
            />
          </div>

          <div className="form-group">
            <label>Task Label</label>
            <TaskLabel
              selectedLabel={selectedLabel}
              setSelectedLabel={setSelectedLabel}
              isVisible={true}
            />
          </div>
        </div>

        <div className="popup-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPopup;
