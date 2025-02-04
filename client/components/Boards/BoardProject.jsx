import React, { useState, useRef, useEffect } from 'react';
import '/styles/project.css';
import '/styles/sidebar.css';
import '/styles/board.css';
import BoardSection from './BoardSection';
import ProjectSection from './ProjectSection';
import List from '../Working Area/List'
import TopBarBoardPanel from '../Working Area/TopBarBoardPanel'

//good job
const BoardProject = (members) => {
  const [isBoardVisible, setIsBoardVisible] = useState(true);

  // Store boards and active board
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);

  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const settingsRef = useRef(null);

  const fetchData = () => {
    fetch('/.proxy/api/api/v1/projects?page=1&limit=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.token,
      },
    }).then(d =>
      d.json()
    ).then(d => {
      console.log("updating board", d.data)
      const projdat = d.data.map(x => { return { ...x, id: x.projectId, projectId: undefined } })
      setProjects(projdat)
    }
    ).catch(e => console.log(e));

    if (activeProject) {
      fetch(`/.proxy/api/api/v1/projects/${activeProject.id}/boards/?page=1&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.token,
        },
      }).then(d =>
        d.json()
      ).then(d => {
        console.log("updating board", d.data)
        const boarddat = d.data.map(x => { return { ...x, id: x.boardId, boardId: undefined } })
        setBoards({
          ...boards, // everything else retain
          [activeProject.id]: boarddat // update current
        })
      }
      ).catch(e => console.log(e));

      if (activeBoard) {
        fetch(`/.proxy/api/api/v1/projects/${activeProject.id}/boards/${activeBoard.id}/lists?page=1&limit=10`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.token,
          },
        }).then(d =>
          d.json()
        ).then(d => {
          console.log("updating board", d.data)
          const listdat = d.data.map(x => { return { ...x, id: x.listId, listId: undefined, tasks: [] } })
          console.log("updating board1", d.data,members)
          Promise.all(
            listdat.map(async (i) => {
              return {
                ...i, tasks: ((await (await fetch(`/.proxy/api/api/v1/projects/${activeProject.id}/boards/${activeBoard.id}/lists/${i.id}/cards?page=1&limit=10`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.token,
                  },
                })).json()).data??[]).map(x=>{return{id:x.cardId ,name:{name:x.name,details:"",startDate:x.startDate,dueDate:x.endDate,label:x.styleId,assignedMember:members.members.find(y=>x.assignedTo.includes(y.id))}}})
              }
            })
          ).then((tasksdat => {
            console.log("updating board2", d.data)
            console.log({
              ...tasks, // everything else retain
              [activeProject.id]: {
                ...tasks[activeProject.id],
                [activeBoard.id]: tasksdat // update current
              }
            })
            setTasks({
              ...tasks, // everything else retain
              [activeProject.id]: {
                ...tasks[activeProject.id],
                [activeBoard.id]: tasksdat // update current
              }
            })
          }))
        }
        ).catch(e => console.log(e));
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, []) // on load

  useEffect(() => {
    fetchData()
  }, [activeBoard, activeProject]) // on load


  useEffect(() => {
    // First, we need to create an instance of EventSource and pass the data stream URL as a
    // parameter in its constructor
    const es = new EventSource(`/.proxy/api/api/v1/events?token=${window.token}`);
    // Whenever the connection is established between the server and the client we'll get notified
    es.onopen = () => console.log(">>> Connection opened!");
    // Made a mistake, or something bad happened on the server? We get notified here
    es.onerror = (e) => console.log("ERROR!", e);
    // This is where we get the messages. The event is an object and we're interested in its `data` property
    es.onmessage = (e) => {
      console.log(">>>", e.data);
      fetchData()
    };
    // Whenever we're done with the data stream we must close the connection
    return () => es.close();
  }, []);



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
              <>
                <TopBarBoardPanel BoardName={activeBoard.name} BoardDesc={activeBoard.description} />
                <List
                  activeBoardId={activeBoard.id}
                  activeProjectId={activeProject.id}
                  lists={tasks?.[activeProject.id]?.[activeBoard.id] || []}
                  setLists={(val) => setTasks((prevTasks) => {
                    const K = {
                      ...prevTasks,
                      [activeProject.id]: {
                        ...prevTasks[activeProject.id],
                        [activeBoard.id]: val
                      }
                    }
                    return K
                  }

                  )}
                  members={members}
                />
              </>
            ) : (
              <div>
                Please Select Board
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
            <br />
            Please Select Project
          </div>
        )
      ) : (
        <>
          <ProjectSection
            projects={projects}
            setProjects={setProjects}
            activeProject={activeProject}
            setActiveProject={(proj) => { setActiveProject(proj); setActiveBoard(null) }}
          />

        </>
      )}
    </div>
  );
};

export default BoardProject;  