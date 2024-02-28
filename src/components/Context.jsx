import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const ContextProvider = ({ children }) => {
  const [projects, setProjects] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectAdded, setNewProjectAdded] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [refreshTasks, setRefreshTasks] = useState(false);

  const statusList = [
    { name: 'todo', value: 0 },
    { name: 'in progress', value: 1 },
    { name: 'in review', value: 2 },
    { name: 'done', value: 3 },
  ];

  const contextValue = {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    showCreateTaskModal,
    setShowCreateTaskModal,
    statusId,
    setStatusId,
    refreshTasks,
    setRefreshTasks,
    showCreateProjectModal,
    setShowCreateProjectModal,
    newProjectAdded,
    setNewProjectAdded,
    statusList,
  };

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = () => useContext(ProjectContext);