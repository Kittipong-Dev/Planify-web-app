import * as React from "react";
import '../../../styles/task.css'
function TaskDetails({ taskName, startDate, dueDate, color, users }) {
    return (
        <div className="task-card">
            <div className="blue-bar" style={{'background-color':color}}></div>
            <div className="task-details">
                <div className="title">{taskName}</div>
                <div className="task-footer">
                    <div className="date-range">{startDate + " - " + dueDate}</div>
                    <div className="user-profiles">
                        {[users].map((profile, index) => (
                            <div key={index} className="user-profile"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;