import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaEdit, FaTrash, FaCheck, FaSpinner, FaPlus, FaTimes,
  FaProjectDiagram, FaComments, FaEnvelope, FaSignOutAlt
} from 'react-icons/fa';
import { api } from '../utils/api';
import { secureStorage } from '../utils/security';
import { sanitizeInput } from '../utils/security';

// Initial form state
const INITIAL_FORM_STATE = {
  title: '',
  category: '',
  description: '',
  short_desc: '',
  demo_url: '',
  video_url: '',
  image_url: '',
  icon: 'cube',
  features: '',
  is_upcoming: false
};

// Tab configuration
const TABS = {
  PROJECTS: 'projects',
  TESTIMONIALS: 'testimonials',
  CONTACTS: 'contacts'
};

// Tab Button Component
const TabButton = ({ tab, activeTab, setActiveTab, label, count, badge }) => (
  <button 
    onClick={() => setActiveTab(tab)}
    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
      activeTab === tab 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    }`}
  >
    {label}
    {count > 0 && (
      <span className={`text-xs px-2 py-1 rounded-full ${
        activeTab === tab ? 'bg-blue-500' : 'bg-gray-600'
      } text-white`}>
        {badge || count}
      </span>
    )}
  </button>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <FaSpinner className="text-4xl text-blue-600 animate-spin" />
  </div>
);

// Confirm Dialog
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState(TABS.PROJECTS);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [pRes, tRes, cRes] = await Promise.all([
        api.getProjects(),
        api.getAllTestimonials(),
        api.getContacts()
      ]);
      
      setProjects(pRes.data);
      setTestimonials(tRes.data);
      setContacts(cRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication
  useEffect(() => {
    const token = secureStorage.get('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, fetchData]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizedValue
    }));
  };

  // Handle project submit
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.category.trim() || !form.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = { 
    title: form.title,
    category: form.category,
    description: form.description,
    short_desc: form.short_desc || '',
    demo_url: form.demo_url || null,
    video_url: form.video_url || null,
    image_url: form.image_url || null,
    icon: form.icon || 'cube',
    features: form.features && form.features.trim() 
      ? form.features.split(',').map(f => f.trim()).filter(Boolean) 
      : [],
    is_upcoming: form.is_upcoming || false
};
      
      if (editing) {
        await api.updateProject(editing, payload);
        toast.success('Project updated successfully!');
      } else {
        await api.createProject(payload);
        toast.success('Project created successfully!');
      }
      
      setForm(INITIAL_FORM_STATE);
      setEditing(null);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error saving project';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = (type, id) => {
    setDeleteTarget({ type, id });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    const { type, id } = deleteTarget;
    try {
      switch(type) {
        case 'projects':
          await api.deleteProject(id);
          break;
        case 'testimonials':
          await api.deleteTestimonial(id);
          break;
        case 'contact':
          await api.deleteContact(id);
          break;
        default:
          break;
      }
      toast.success('Item deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Error deleting item');
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Handle approve testimonial
  const handleApprove = async (id) => {
    try {
      await api.approveTestimonial(id);
      toast.success('Testimonial approved');
      fetchData();
    } catch (error) {
      toast.error('Error approving testimonial');
    }
  };

  // Handle mark contact as read
  const handleMarkRead = async (id) => {
    try {
      await api.markContactRead(id);
      toast.success('Marked as read');
      fetchData();
    } catch (error) {
      toast.error('Error marking as read');
    }
  };

  // Handle logout
  const handleLogout = () => {
    secureStorage.remove('auth_token');
    secureStorage.remove('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Handle edit project
  const handleEditProject = (project) => {
    setEditing(project.id);
    setForm({
      ...project,
      features: project.features ? project.features.join(', ') : ''
    });
    setActiveTab(TABS.PROJECTS);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(null);
    setForm(INITIAL_FORM_STATE);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your content and monitor activity</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <TabButton 
              tab={TABS.PROJECTS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              label={<><FaProjectDiagram className="inline mr-1" /> Projects</>}
              count={projects.length}
            />
            <TabButton 
              tab={TABS.TESTIMONIALS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              label={<><FaComments className="inline mr-1" /> Testimonials</>}
              count={testimonials.filter(t => !t.is_approved).length}
              badge={`${testimonials.filter(t => !t.is_approved).length} pending`}
            />
            <TabButton 
              tab={TABS.CONTACTS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              label={<><FaEnvelope className="inline mr-1" /> Enquiries</>}
              count={contacts.filter(c => !c.is_read).length}
              badge={`${contacts.filter(c => !c.is_read).length} new`}
            />
          </div>

          {/* Tab Content */}
          {activeTab === TABS.PROJECTS && (
            <div className="space-y-8">
              {/* Project Form */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  {editing ? <FaEdit className="text-blue-600" /> : <FaPlus className="text-blue-600" />}
                  <h2 className="text-xl font-bold">{editing ? 'Edit Project' : 'Add New Project'}</h2>
                  {editing && (
                    <button 
                      onClick={cancelEditing}
                      className="ml-auto text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                <form onSubmit={handleProjectSubmit} className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Project Title *"
                    value={form.title || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="Category (HRMS, TODO, Estate, WhatsApp) *"
                    value={form.category || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                  <input
                    type="text"
                    name="icon"
                    placeholder="Icon (fontawesome icon name)"
                    value={form.icon || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <input
                    type="text"
                    name="short_desc"
                    placeholder="Short Description"
                    value={form.short_desc || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <textarea
                    name="description"
                    placeholder="Full Description *"
                    value={form.description || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition md:col-span-2"
                    rows="3"
                    required
                  />
                  <input
                    type="text"
                    name="demo_url"
                    placeholder="Demo URL (/demos/hrms)"
                    value={form.demo_url || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <input
                    type="text"
                    name="video_url"
                    placeholder="Video URL (YouTube embed)"
                    value={form.video_url || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL"
                    value={form.image_url || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <input
                    type="text"
                    name="features"
                    placeholder="Features (comma separated)"
                    value={form.features || ''}
                    onChange={handleFormChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_upcoming"
                      checked={form.is_upcoming || false}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Upcoming Project</span>
                  </label>
                  <div className="flex gap-2 md:col-span-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting && <FaSpinner className="animate-spin" />}
                      {editing ? 'Update Project' : 'Create Project'}
                    </button>
                    {editing && (
                      <button 
                        type="button" 
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left font-semibold text-gray-700">Title</th>
                        <th className="p-3 text-left font-semibold text-gray-700">Category</th>
                        <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                        <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-500">
                            No projects yet. Create your first project above!
                          </td>
                        </tr>
                      ) : (
                        projects.map(p => (
                          <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium">{p.title}</td>
                            <td className="p-3">
                              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3">
                              {p.is_upcoming ? (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Upcoming</span>
                              ) : (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
                              )}
                            </td>
                            <td className="p-3">
                              <button 
                                onClick={() => handleEditProject(p)} 
                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDelete('projects', p.id)} 
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === TABS.TESTIMONIALS && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left font-semibold text-gray-700">Client</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Feedback</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Rating</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500">
                          No testimonials yet.
                        </td>
                      </tr>
                    ) : (
                      testimonials.map(t => (
                        <tr key={t.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-3">
                            <div>
                              <div className="font-semibold">{t.client_name}</div>
                              <div className="text-sm text-gray-500">{t.client_company || '—'}</div>
                            </div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="truncate">{t.feedback}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex text-yellow-400">
                              {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                            </div>
                          </td>
                          <td className="p-3">
                            {t.is_approved ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Approved</span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span>
                            )}
                          </td>
                          <td className="p-3">
                            {!t.is_approved && (
                              <button 
                                onClick={() => handleApprove(t.id)} 
                                className="text-green-600 hover:text-green-800 mr-3 transition-colors"
                                title="Approve"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete('testimonials', t.id)} 
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === TABS.CONTACTS && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Type</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Subject</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-500">
                          No enquiries yet.
                        </td>
                      </tr>
                    ) : (
                      contacts.map(c => (
                        <tr key={c.id} className={`border-b hover:bg-gray-50 transition-colors ${!c.is_read ? 'bg-blue-50' : ''}`}>
                          <td className="p-3 font-medium">{c.name}</td>
                          <td className="p-3">
                            <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">
                              {c.email}
                            </a>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-sm ${
                              c.type === 'support' ? 'bg-purple-100 text-purple-600' :
                              c.type === 'demo' ? 'bg-green-100 text-green-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {c.type || 'general'}
                            </span>
                          </td>
                          <td className="p-3 max-w-xs truncate">{c.subject}</td>
                          <td className="p-3">
                            {c.is_read ? (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">Read</span>
                            ) : (
                              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">New</span>
                            )}
                          </td>
                          <td className="p-3">
                            {!c.is_read && (
                              <button 
                                onClick={() => handleMarkRead(c.id)} 
                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                title="Mark as read"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete('contact', c.id)} 
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={`Are you sure you want to delete this item? This action cannot be undone.`}
      />
    </>
  );
};

export default Admin;