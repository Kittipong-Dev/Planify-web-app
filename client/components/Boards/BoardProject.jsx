import React, { useState, useRef, useEffect } from 'react';
import '/styles/project.css';
import '/styles/sidebar.css';
import '/styles/board.css';
import BoardSection from './BoardSection';
import ProjectSection from '../ProjectSection';
import List from '../Working Area/List'

//good job
const BoardProject = () => {
  const [isBoardVisible, setIsBoardVisible] = useState(true);

  // Store boards and active board
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);

  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const settingsRef = useRef(null);

  // Close settings popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSection = () => {
    // Prevent toggling section if settings popup is open
    if (!settingsVisible) {
      setIsBoardVisible((prev) => !prev);
    }
  };

  const deleteProject = () => {
    if (!activeProject) return; // No project selected

    const updatedProjects = projects.filter((project) => project.id !== activeProject.id);
    setProjects(updatedProjects); // Update the project list

    // Remove boards associated with this project
    const updatedBoards = { ...boards };
    delete updatedBoards[activeProject.id];
    setBoards(updatedBoards);

    // Reset active project and active board
    setActiveProject(null);
    setActiveBoard(null);
    setSettingsVisible(false); // Close the settings popup
  };

  return (
    <div id="main-container">
      {/* Project Box */}
      <div id="project-container" className="clickable" onClick={toggleSection}>
        <div id={`project-box-${activeProject ? activeProject.id : 'none'}`} className="projectbox">
          {/* Triangle Symbol */}
          <div className={`triangle-symbol ${isBoardVisible ? 'triangle-right' : 'triangle-down'}`}></div>

          {/* Project Text Content */}
          <div id="project-box-content">
            <div id="project-box-name">{activeProject ? activeProject.name : 'project name'}</div>
            <div id="project-box-description">{activeProject ? activeProject.description : 'project description'}</div>
          </div>

          {/* Project Settings Icon (Click to Toggle Popup) */}
          <img
            src="/assets/setting.svg"
            alt="Settings"
            className="project-settings-icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevents toggleSection from being triggered
              setSettingsVisible(!settingsVisible);
            }}
          />

          {/* Settings Popup */}
          {settingsVisible && (
            <div
              className="project-settings-popup"
              ref={settingsRef}
              onClick={(e) => e.stopPropagation()} // Prevents toggling the board/project
            >
              <div className="project-settings-option" onClick={() => alert("Share Project Clicked")}>
                Share Project
              </div>
              <div className="project-settings-option" onClick={() => alert("Edit Project Clicked")}>
                Edit Project
              </div>
              <div className="project-settings-option delete" onClick={deleteProject}>
                Delete Project
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Conditionally Render Board or Project Section */}
      {isBoardVisible ? (
        activeProject ? ( // ✅ Only pass projectId if activeProject exists

          <>
            {activeBoard ? (
              <List
                lists={tasks?.[activeProject.id]?.[activeBoard.id] || []}
                setLists={(val) => setTasks((prevTasks) => {
                  const K = {
                    ...prevTasks,
                    [activeProject.id]: {
                      ...prevTasks[activeProject.id],
                      [activeBoard.id]:val
                    }
                  }
                  console.log(K,activeBoard.id)
                  return K
                }
                )}
              />
            ) : (
              <div>
                Please Create Board
              </div>
            )}

            


            <BoardSection
              projectId={activeProject.id}
              boards={boards[activeProject.id] || []}
              setBoards={setBoards}
              activeBoard={activeBoard}
              setActiveBoard={setActiveBoard}
            />
          </>
        ) : (
          <div className='please-create-project' id='please-create-project'>
            Please Create Project
          </div>
        )
      ) : (
        <>
          <ProjectSection
            projects={projects}
            setProjects={setProjects}
            activeProject={activeProject}
            setActiveProject={(proj)=>{setActiveProject(proj);setActiveBoard(null)}}
          />

        </>
      )}
    </div>
  );
};

export default BoardProject;  