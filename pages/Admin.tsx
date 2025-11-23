import React, { useEffect, useState } from 'react';
import { User, UserRole, Project, Technology } from '../types';
import * as StorageService from '../services/storage';
import * as AuthService from '../services/auth';
import ProjectForm from '../components/ProjectForm';
import UserEditModal from '../components/UserEditModal';
import { Plus, Edit2, Trash2, Users, LayoutGrid, Shield, UserX, Cpu, Save, X, ExternalLink } from 'lucide-react';

interface AdminProps {
  user: User;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'users' | 'technologies'>('projects');
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Users State
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Technologies State
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [newTechName, setNewTechName] = useState('');
  const [newTechIcon, setNewTechIcon] = useState('');

  useEffect(() => {
    loadProjects();
    loadTechnologies();
    if (user.role === UserRole.ADMIN) {
      loadUsers();
    }
  }, [user.role]);

  const loadProjects = () => setProjects(StorageService.getProjects());
  const loadUsers = () => setAllUsers(AuthService.getAllUsers());
  const loadTechnologies = () => setTechnologies(StorageService.getTechnologies());

  // --- Project Handlers ---
  const handleCreateProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      StorageService.deleteProject(id);
      loadProjects();
    }
  };

  const handleSaveProject = (project: Project) => {
    StorageService.saveProject(project);
    setIsFormOpen(false);
    loadProjects();
  };

  // --- User Handlers ---
  const handleRoleChange = (username: string, newRole: string) => {
    try {
      AuthService.updateUserRole(username, newRole as UserRole);
      loadUsers();
      if (username === user.username && newRole !== UserRole.ADMIN) {
        window.location.reload(); 
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUserUpdate = (username: string, updates: Partial<User>) => {
    try {
      AuthService.updateUser(username, updates);
      loadUsers();
      setEditingUser(null);
      // If updating self, might need to refresh UI context
      if (username === user.username) {
        window.location.reload();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteUser = (username: string) => {
    if (confirm(`Are you sure you want to delete user @${username}?`)) {
      try {
        AuthService.deleteUser(username);
        loadUsers();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  // --- Technology Handlers ---
  const handleAddTechnology = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTechName && newTechIcon) {
      StorageService.addTechnology({ name: newTechName, icon: newTechIcon });
      setNewTechName('');
      setNewTechIcon('');
      loadTechnologies();
    }
  };

  const handleDeleteTechnology = (id: string) => {
    if (confirm('Delete this technology?')) {
      StorageService.deleteTechnology(id);
      loadTechnologies();
    }
  };

  const canManageProjects = user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR;
  const canManageUsers = user.role === UserRole.ADMIN;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user.name}. You have <span className="font-semibold text-android-600">{user.role}</span> access.
          </p>
        </div>
        
        {canManageUsers && (
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex space-x-1 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} />
                <span>Projects</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('technologies')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'technologies'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Cpu size={16} />
                <span>Skills</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Users</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Portfolio Projects</h2>
            {canManageProjects && (
              <button
                onClick={handleCreateProject}
                className="bg-android-600 hover:bg-android-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-lg shadow-android-600/20 hover:shadow-android-600/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add Project</span>
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tech Stack</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                    {canManageProjects && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-600" src={project.imageUrl} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{project.title}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">{project.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      {canManageProjects && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditProject(project)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                              >
                                <Trash2 size={18} />
                              </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {projects.length === 0 && (
                     <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No projects yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Technologies Tab */}
      {activeTab === 'technologies' && canManageUsers && (
        <div className="animate-slide-up">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             
             {/* Add New Tech Form */}
             <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 p-6 h-fit">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                   <Plus size={20} className="text-android-600" />
                   Add Skill
                </h3>
                <form onSubmit={handleAddTechnology} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      placeholder="e.g. React"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Devicon Class 
                      <a href="https://devicon.dev/" target="_blank" rel="noreferrer" className="text-android-600 hover:underline ml-2 text-xs inline-flex items-center">
                        Reference <ExternalLink size={10} className="ml-0.5" />
                      </a>
                    </label>
                    <input 
                      type="text" 
                      value={newTechIcon}
                      onChange={(e) => setNewTechIcon(e.target.value)}
                      placeholder="e.g. devicon-react-original colored"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none"
                      required
                    />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full bg-android-600 hover:bg-android-500 text-white font-medium py-2 rounded-lg transition shadow-md">
                      Add Technology
                    </button>
                  </div>
                </form>

                {/* Preview */}
                {newTechIcon && (
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center">
                     <span className="text-xs text-slate-500 mb-2">Icon Preview</span>
                     <i className={`${newTechIcon} text-5xl`}></i>
                  </div>
                )}
             </div>

             {/* Tech List */}
             <div className="md:col-span-2 bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Known Technologies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {technologies.map(tech => (
                    <div key={tech.id} className="relative group p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 transition hover:shadow-md">
                       <button 
                         onClick={() => handleDeleteTechnology(tech.id)}
                         className="absolute top-2 right-2 p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                         title="Delete"
                       >
                         <X size={14} />
                       </button>
                       <i className={`${tech.icon} text-4xl`}></i>
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">{tech.name}</span>
                    </div>
                  ))}
                  {technologies.length === 0 && <div className="col-span-full text-center text-slate-500 py-8">No technologies added.</div>}
                </div>
             </div>

           </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && canManageUsers && (
        <div className="animate-slide-up">
           <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">User Management</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage user roles and permissions.</p>
           </div>
           
           <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {allUsers.map((u) => (
                    <tr key={u.username} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {u.avatar ? (
                              <img className="h-10 w-10 rounded-full bg-slate-200" src={u.avatar} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-android-100 dark:bg-android-900 flex items-center justify-center text-android-600 dark:text-android-400">
                                <Users size={20} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                              {u.name}
                              {u.username === user.username && (
                                <span className="bg-android-100 text-android-700 text-[10px] px-1.5 py-0.5 rounded-full">You</span>
                              )}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center gap-2">
                            {u.role === UserRole.ADMIN ? (
                                <Shield size={16} className="text-purple-600" />
                            ) : u.role === UserRole.MODERATOR ? (
                                <Shield size={16} className="text-blue-600" />
                            ) : (
                                <Users size={16} className="text-slate-400" />
                            )}
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.username, e.target.value)}
                              disabled={u.username === 'admin'}
                              className="bg-transparent border-0 text-sm font-medium text-slate-900 dark:text-white focus:ring-0 cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
                            >
                              <option value={UserRole.ADMIN}>ADMIN</option>
                              <option value={UserRole.MODERATOR}>MODERATOR</option>
                              <option value={UserRole.GUEST}>GUEST</option>
                            </select>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingUser(u)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition"
                                title="Edit User Details"
                            >
                                <Edit2 size={18} />
                            </button>
                            {u.username !== 'admin' && (
                            <button
                                onClick={() => handleDeleteUser(u.username)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                                title="Delete User"
                            >
                                <UserX size={18} />
                            </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           </div>
        </div>
      )}

      {/* Project Form Modal */}
      {isFormOpen && (
        <ProjectForm
          initialData={editingProject}
          onSave={handleSaveProject}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <UserEditModal 
           user={editingUser}
           onSave={handleUserUpdate}
           onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default Admin;