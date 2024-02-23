import React from 'react';
import { useDrag } from 'react-dnd';

const Task = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className='singleTask' ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <strong>Task Name:</strong> {task.taskName}
      <strong>Task Description:</strong> {task.taskDescription}
      <strong>Task Status:</strong> {task.taskStatus}
      <strong>Users:</strong>
      {task.users.map((user) => (
        <div key={user.id}>{user.userName}</div>
      ))}
    </div>
  );
};

export default Task;