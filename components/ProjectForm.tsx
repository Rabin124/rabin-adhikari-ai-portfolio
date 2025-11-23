import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Sparkles, Save, X, Loader2 } from 'lucide-react';
import { generateProjectDescription } from '../services/gemini';

interface ProjectFormProps {
  initialData?: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    imageUrl: '',
    techStack: [],
    githubUrl: '',
    playStoreUrl: ''
  });
  
  const [techInput, setTechInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(prev => ({ ...prev, imageUrl: 'https://picsum.photos/800/600' }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        techStack: [...(prev.techStack || []), techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack?.filter(t => t !== techToRemove)
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.techStack?.length) {
      alert("Please enter a Title and at least one Tech Stack item to generate a description.");
      return;
    }

    setIsGenerating(true);
    try {
      const description = await generateProjectDescription(formData.title, formData.techStack);
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      alert("Failed to generate description. Please check your API configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const project: Project = {
      id: initialData?.id || crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || 'https://picsum.photos/800/600',
      techStack: formData.techStack || [],
      githubUrl: formData.githubUrl,
      playStoreUrl: formData.playStoreUrl,
      createdAt: initialData?.createdAt || Date.now()
    };

    onSave(project);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none transition-colors"
              placeholder="e.g. FitTrack Pro"
              required
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none transition-colors"
                placeholder="Add technology (e.g. Kotlin)"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack?.map(tech => (
                <span key={tech} className="bg-android-100 dark:bg-android-900/50 text-android-700 dark:text-android-100 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-android-200 dark:border-android-900">
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)} className="hover:text-android-900 dark:hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-android-600 dark:text-android-400 hover:text-android-700 dark:hover:text-android-300 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate with AI
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none resize-none transition-colors"
              placeholder="Project description..."
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none transition-colors"
              placeholder="https://..."
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none transition-colors"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Play Store URL</label>
              <input
                type="url"
                name="playStoreUrl"
                value={formData.playStoreUrl}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-android-500 outline-none transition-colors"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-android-600 hover:bg-android-500 text-white font-medium flex items-center gap-2 transition shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              Save Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProjectForm;