// List.js (React Component)
import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import Draggable from './DraggableTask'
import Droppable from './DropZone';
import '/styles/list.css';


const List = ({ lists, setLists }) => {
  const [newListName, setNewListName] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);

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

    setLists([...lists, newList]);
    setNewListName('');
    setIsAddingList(false);
  };

  const handleDeleteList = (id) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  const handleAddTask = (listId, taskName, suppressUpdate = false, dat = lists) => {
    if (taskName.trim() === '') {
      alert('Task name cannot be empty.');
      return;
    }

    const result = dat.map((list) =>
      list.id === listId
        ? {
          ...list,
          tasks: [...list.tasks, { id: Date.now(), name: taskName }],
        }
        : list
    )
    if(!suppressUpdate){
      setLists(result)
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
    if(!suppressUpdate){
      setLists(result)
    }
    
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
    handleAddTask(newParentId, text, false ,res)

    console.log(lists)
  }

  return (
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
                    {task.name}
                  </Draggable>
                ))}

              </div>

              <div className="add-task">
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
  );
};

export default List;
