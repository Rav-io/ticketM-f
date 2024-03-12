import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Project {
    projectId:number;
    projectName:string;
    userIds:number[];
}

interface ProjectContextProps {
    projects: Project[] | null;
    setProjects: React.Dispatch<React.SetStateAction<Project[] | null>>;
    selectedProject: number | null;
    setSelectedProject: React.Dispatch<React.SetStateAction<number | null>>;
    showCreateTaskModal: boolean;
    setShowCreateTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
    statusId: number | null;
    setStatusId: React.Dispatch<React.SetStateAction<number | null>>;
    refreshTasks: boolean;
    setRefreshTasks: React.Dispatch<React.SetStateAction<boolean>>;
    newProjectAdded: boolean;
    setNewProjectAdded: React.Dispatch<React.SetStateAction<boolean>>;
    statusList: { name: string; value: number }[];
    currentUser: string | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);
 
interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [newProjectAdded, setNewProjectAdded] = useState(false);
    const [statusId, setStatusId] = useState<number | null>(null);
    const [refreshTasks, setRefreshTasks] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>('');

    const statusList = [
        { name: 'todo', value: 0 },
        { name: 'in progress', value: 1 },
        { name: 'in review', value: 2 },
        { name: 'done', value: 3 },
    ];

    const contextValue: ProjectContextProps = {
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
        newProjectAdded,
        setNewProjectAdded,
        statusList,
        currentUser,
        setCurrentUser
    };

    return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useContext error');
    }
    return context;
};
