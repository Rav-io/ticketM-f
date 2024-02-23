import React from 'react';
import Task from '../Task/Task';
import { useDrop } from 'react-dnd';
import './StatusColumn.css';

const StatusColumn = ({ status, tasks, onDrop }) => {
    const statusList = [
        { name: 'todo', value: 0 },
        { name: 'in progress', value: 1 },
        { name: 'in review', value: 2 },
        { name: 'done', value: 3 },
    ];

    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item) => onDrop(item.id, statusList.find(item => item.name === status).value),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
    });

  
    return (
        <div className={status.replace(/\s/g, '')} ref={drop}>
          <span className='taskStatus'>{status.toUpperCase()}:</span>
          {tasks
            .filter((task) => task.taskStatus === statusList.find(item => item.name === status).value)
            .map((task) => (
              <Task key={task.id} task={task} onDrop={onDrop}/>
            ))}
        </div>
    );
};

export default StatusColumn;