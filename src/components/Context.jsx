import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const ContextProvider = ({ children }) => {
  const [projects, setProjects] = useState(null);

  const contextValue = {
    projects,
    setProjects,
  };

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = () => useContext(ProjectContext);