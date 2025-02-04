// List.js (React Component)
import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import Draggable from './DraggableTask'
import Droppable from './DropZone';
import labels from '../Config/LabelColors'
import '/styles/list.css';
import TaskPopup from './Tasks/TaskPopup';
import TaskDetails from './Tasks/TaskComponent';

const List = ({ lists, activeBoardId, activeProjectId, setLists, members }) => {
  const [newListName, setNewListName] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupFor, setPopupFor] = useState(0);

  const handleAddList = () => {
    if (newListName.trim() === '') {
      alert('List name cannot be empty.');
      return;
    }

    const newList = {
      id: Date.now(),
      name: newListName,
      tasks: [],
    };

    const postList = {
      name: newListName,
      order: (lists.length??0)+1,
    };

    fetch(`/.proxy/api/api/v1/projects/${activeProjectId}/boards/${activeBoardId}/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.token,
        
      },
      body: JSON.stringify(postList)

    }).then(x => x.json()).then(x => {
      const newList2 = {
        id: x.listId,
        name: newListName,
        tasks: [],
      };
      setLists([...lists, newList2]);
    })
    .catch(e => console.log(e));

    setLists([...lists, newList]);
    setNewListName('');
    setIsAddingList(false);
  };

  const handleDeleteList = (id) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  const handleAddTask = (listId, taskData, suppressUpdate = false, dat = lists) => {

    const result = dat.map((list) =>
      list.id === listId
        ? {
          ...list,
          tasks: [...list.tasks, { id: Date.now(), name: taskData }],
        }
        : list
    )
    const list = dat.find(x =>
      x.id==listId
    )

    if (!suppressUpdate) {
      
      //{"name":"sepi","details":"rara ah ah ah umma gagaga lala uwawa","startDate":"2025-01-26","dueDate":"2025-07-26","assignedMember":{"id":1,"name":"Alice"},"label":6}
      const postcard = { // haha postcard
        "listId": listId,
        "name": taskData.name,
        "description": taskData.details,
        "styleId": taskData.label,
        "startDate": taskData.startDate,
        "endDate": taskData.dueDate,
        "reminderDaysInterval": 1,
        "assignedTo": [taskData.assignedMember.id],
        "files": [],
        "order": (list.length??0)+1
      }
      fetch(`/.proxy/api/api/v1/projects/${activeProjectId}/boards/${activeBoardId}/lists/${listId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.token,
          
        },
        body: JSON.stringify(postcard)

      }).then(x => x.json()).then(x => {
        const result2 = dat.map((list) =>
          list.id === listId
            ? {
              ...list,
              tasks: [...list.tasks, { id: x.cardId, name: taskData }],
            }
            : list
        )
        setLists(result2)
      })
      .catch(e => {console.log(e);setLists(result)});
    }
    return result
  };
  const handleDeleteTask = (listId, id, suppressUpdate = false, dat = lists) => {
    const result = dat.map((list) =>
      list.id === listId
        ? {
          ...list,
          tasks: list.tasks.filter(x => x.id != id),
        }
        : list
    )
    if (!suppressUpdate) {
      setLists(result)
    }
    fetch(`/.proxy/api/api/v1/projects/${activeProjectId}/boards/${activeBoardId}/lists/${listId}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.token,
      }

    }).catch(e => console.log(e));

    return result
  };

  function findParentOfChild(childid) {
    return lists.find(parent =>
      parent.tasks.some(task => task.id === childid)
    );
  }

  function handleDragEnd(over) {
    console.log(over)
    const id = over.active.id
    const oldParent = findParentOfChild(id)
    const oldParentId = oldParent.id
    const newParentId = over.over.id


    const text = oldParent.tasks.find(x => x.id == id).name

    console.log(oldParentId, newParentId)

    const res = handleDeleteTask(oldParentId, id, true)
    handleAddTask(newParentId, text, false, res)
  }

  return (
    <>
      <TaskPopup isVisible={popupVisible}
        onClose={() => setPopupVisible(false)}
        onSave={(e) => handleAddTask(popupFor, e)}
        members={members} />
      <div className="list-container">
        <DndContext onDragEnd={handleDragEnd}>
          {lists.map((list) => (
            <Droppable key={list.id} id={list.id}>
              <div className="list">
                <div className="list-header">
                  <h3>{list.name}</h3>
                  <button onClick={() => handleDeleteList(list.id)} className='delete-button'>Delete List</button>
                </div>

                <div className="tasks">

                  {list.tasks.map((task) => (
                    <Draggable key={task.id} id={task.id}>
                      <TaskDetails
                        taskName={task.name.name}
                        startDate={task.name.startDate}
                        dueDate={task.name.dueDate}
                        users={task.name.assignedMember}
                        color={labels[task.name.label].color}
                      />
                    </Draggable>
                  ))}

                </div>

                {/* <div className="add-task">
                  <input
                    type="text"
                    placeholder="New Task Name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTask(list.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>*/}
                <div className="add-task">
                  <button
                    type="text"
                    placeholder="New Task Name"
                    onClick={() => { setPopupVisible(true); setPopupFor(list.id) }}
                  >New Task Name
                  </button>
                </div>
              </div>
            </Droppable>
          ))}

          {isAddingList ? (
            <div className="add-list-form">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name"
                className='add-list-input'
              />
              <button onClick={handleAddList} className='confirm-list-button'>Add List</button>
              <button onClick={() => setIsAddingList(false)} className='cancel-list-button'>Cancel</button>
            </div>
          ) : (
            <button className="add-list-button" onClick={() => setIsAddingList(true)}>
              + Add List
            </button>
          )}
        </DndContext>
      </div>
    </>
  );
};

export default List;
