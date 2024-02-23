import React from 'react';
import Task from '../Task/Task';
import { useDrop } from 'react-dnd';
import './StatusColumn.css';

const StatusColumn = ({ status, tasks, onDrop }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'TASK',
      drop: (item) => onDrop(item.id, status),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
  
    return (
      <div className={status.toLowerCase()} ref={drop} style={{ backgroundColor: isOver ? 'yellow' : 'white' }}>
        <span className='taskStatus'>{status}:</span>
        {tasks
          .filter((task) => task.taskStatus === status)
          .map((task) => (
            <Task key={task.id} task={task} />
          ))}
      </div>
    );
};

export default StatusColumn;