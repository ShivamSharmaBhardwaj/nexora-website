import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaEdit, FaTrash, FaCheck, FaSpinner, FaPlus, FaTimes,
  FaProjectDiagram, FaComments, FaEnvelope, FaSignOutAlt,
  FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown,
  FaEye, FaEyeSlash, FaCopy, FaDownload, FaUpload,
  FaToggleOn, FaToggleOff, FaClock, FaUser, FaCalendar,
  FaTag, FaLink, FaImage, FaVideo, FaCode, FaStar,
  FaStarHalf, FaStar as FaStarSolid, FaBell, FaCircle,
  FaChevronLeft, FaChevronRight, FaBars, FaThLarge,
  FaList, FaChartBar, FaChartLine, FaChartPie,
  FaExclamationTriangle, FaSync, FaWrench,
  FaDatabase, FaServer, FaShieldAlt, FaUserCog
} from 'react-icons/fa';
import { api } from '../utils/api';
import { secureStorage } from '../utils/security';
import { sanitizeInput } from '../utils/security';

// ============================================
// CONSTANTS & CONFIGURATIONS
// ============================================

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
  is_upcoming: false,
  is_featured: false,
  priority: 0,
  tech_stack: '',
  github_url: '',
  status: 'active'
};

const TABS = {
  PROJECTS: 'projects',
  TESTIMONIALS: 'testimonials',
  CONTACTS: 'contacts',
  STATISTICS: 'statistics',
  SETTINGS: 'settings'
};

const CATEGORY_OPTIONS = [
  'HRMS', 'TODO', 'Estate', 'WhatsApp', 
  'E-Commerce', 'Healthcare', 'Education', 'Finance',
  'AI', 'Blockchain', 'IoT', 'Mobile App', 'Desktop App'
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'upcoming', label: 'Upcoming', color: 'yellow' },
  { value: 'maintenance', label: 'Maintenance', color: 'orange' },
  { value: 'deprecated', label: 'Deprecated', color: 'red' },
  { value: 'archived', label: 'Archived', color: 'gray' }
];

// ============================================
// CUSTOM HOOKS
// ============================================

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// ============================================
// UI COMPONENTS
// ============================================

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Enhanced Loading Spinner
const EnhancedLoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <FaSpinner className="text-blue-600 text-2xl animate-pulse" />
      </div>
    </div>
    <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">{message}</p>
  </div>
);

// Toast with better error handling
const showToast = (message, type = 'success', duration = 4000) => {
  try {
    toast[type](message, {
      duration,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: '#333',
        color: '#fff',
        padding: '16px 24px',
        maxWidth: '500px',
      },
      iconTheme: {
        primary: type === 'success' ? '#10B981' : 
                 type === 'error' ? '#EF4444' : 
                 type === 'warning' ? '#F59E0B' : '#3B82F6',
        secondary: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Toast error:', error);
    alert(message);
  }
};

// Custom Modal Component
const CustomModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN ADMIN COMPONENT
// ============================================

const Admin = () => {
  // State Management
  const [activeTab, setActiveTab] = useState(TABS.PROJECTS);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', category: 'all' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [modalContent, setModalContent] = useState(null);
  const [stats, setStats] = useState({});
  const [exportLoading, setExportLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm);

  // ============================================
  // DATA FETCHING WITH RETRY LOGIC
  // ============================================

  const fetchData = useCallback(async (retry = 0) => {
    try {
      setLoading(true);
      setError(null);

      const token = secureStorage.get('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const results = await Promise.allSettled([
        api.getProjects(),
        api.getAllTestimonials(),
        api.getContacts()
      ]);

      if (results[0].status === 'fulfilled') {
        const projectData = results[0].value;
        let projectsArray = [];
        if (Array.isArray(projectData)) {
          projectsArray = projectData;
        } else if (projectData?.data && Array.isArray(projectData.data)) {
          projectsArray = projectData.data;
        } else if (projectData?.results && Array.isArray(projectData.results)) {
          projectsArray = projectData.results;
        }
        setProjects(projectsArray);
      } else {
        console.error('Projects fetch error:', results[0].reason);
        if (retry < 2) {
          setTimeout(() => fetchData(retry + 1), 2000);
          return;
        }
        setProjects([]);
        showToast('Failed to load projects. Please try again.', 'warning');
      }

      if (results[1].status === 'fulfilled') {
        const testimonialData = results[1].value;
        let testimonialsArray = [];
        if (Array.isArray(testimonialData)) {
          testimonialsArray = testimonialData;
        } else if (testimonialData?.data && Array.isArray(testimonialData.data)) {
          testimonialsArray = testimonialData.data;
        } else if (testimonialData?.results && Array.isArray(testimonialData.results)) {
          testimonialsArray = testimonialData.results;
        }
        setTestimonials(testimonialsArray);
      } else {
        console.error('Testimonials fetch error:', results[1].reason);
        setTestimonials([]);
      }

      if (results[2].status === 'fulfilled') {
        const contactData = results[2].value;
        let contactsArray = [];
        if (Array.isArray(contactData)) {
          contactsArray = contactData;
        } else if (contactData?.data && Array.isArray(contactData.data)) {
          contactsArray = contactData.data;
        } else if (contactData?.results && Array.isArray(contactData.results)) {
          contactsArray = contactData.results;
        }
        setContacts(contactsArray);
      } else {
        console.error('Contacts fetch error:', results[2].reason);
        setContacts([]);
      }

      setStats({
        totalProjects: projects.length || 0,
        activeProjects: projects.filter(p => p.status === 'active' || p.is_upcoming === false).length || 0,
        pendingTestimonials: testimonials.filter(t => !t.is_approved).length || 0,
        unreadContacts: contacts.filter(c => !c.is_read).length || 0,
        totalTestimonials: testimonials.length || 0,
        totalContacts: contacts.length || 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load data');
      if (retry < 2) {
        setTimeout(() => fetchData(retry + 1), 2000);
      } else {
        showToast('Error loading data. Please refresh the page.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, projects.length, testimonials.length, contacts.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizedValue
    }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.category.trim() || !form.description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = { 
        ...form,
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        short_desc: form.short_desc?.trim() || '',
        demo_url: form.demo_url?.trim() || null,
        video_url: form.video_url?.trim() || null,
        image_url: form.image_url?.trim() || null,
        icon: form.icon?.trim() || 'cube',
        features: form.features && typeof form.features === 'string' && form.features.trim() 
          ? form.features.split(',').map(f => f.trim()).filter(Boolean) 
          : (Array.isArray(form.features) ? form.features : []),
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
        is_upcoming: form.is_upcoming || false,
        is_featured: form.is_featured || false,
        priority: parseInt(form.priority) || 0,
        status: form.status || 'active'
      };
      
      let response;
      if (editing) {
        response = await api.updateProject(editing, payload);
        if (response?.status === 200 || response?.status === 201) {
          showToast('Project updated successfully!', 'success');
        } else {
          throw new Error('Update failed with status: ' + response?.status);
        }
      } else {
        response = await api.createProject(payload);
        if (response?.status === 200 || response?.status === 201) {
          showToast('Project created successfully!', 'success');
        } else {
          throw new Error('Creation failed with status: ' + response?.status);
        }
      }
      
      setForm(INITIAL_FORM_STATE);
      setEditing(null);
      await fetchData();
    } catch (error) {
      let errorMsg = 'Error saving project';
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.errors) {
            const errors = error.response.data.errors;
            if (Array.isArray(errors)) {
              errorMsg = errors.map(e => e.message || e).join(', ');
            } else if (typeof errors === 'object') {
              errorMsg = Object.entries(errors)
                .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
                .join(', ');
            }
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (error.response.data.detail) {
            errorMsg = error.response.data.detail;
          }
        }
        if (error.response.status === 400) {
          errorMsg = 'Bad request: Please check all fields are correct.';
        } else if (error.response.status === 401) {
          errorMsg = 'Authentication failed. Please login again.';
          navigate('/login');
        } else if (error.response.status === 403) {
          errorMsg = 'You do not have permission to perform this action.';
        } else if (error.response.status === 404) {
          errorMsg = 'Resource not found. The project may have been deleted.';
        } else if (error.response.status === 500) {
          errorMsg = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMsg = 'No response from server. Please check your connection.';
      } else {
        errorMsg = error.message || 'An unexpected error occurred';
      }
      showToast(errorMsg, 'error');
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!id) {
      showToast('Invalid item ID', 'error');
      return;
    }
    setDeleteTarget({ type, id });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    const { type, id } = deleteTarget;
    try {
      let response;
      switch(type) {
        case 'projects':
          response = await api.deleteProject(id);
          break;
        case 'testimonials':
          response = await api.deleteTestimonial(id);
          break;
        case 'contact':
          response = await api.deleteContact(id);
          break;
        default:
          showToast('Unknown item type', 'error');
          return;
      }
      
      if (response?.status === 200 || response?.status === 204) {
        showToast('Item deleted successfully', 'success');
        await fetchData();
      } else {
        throw new Error('Delete failed with status: ' + response?.status);
      }
    } catch (error) {
      console.error('Delete error:', error);
      let errorMsg = 'Error deleting item';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      showToast(errorMsg, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveTestimonial(id);
      showToast('Testimonial approved', 'success');
      await fetchData();
    } catch (error) {
      console.error('Approve error:', error);
      showToast('Error approving testimonial', 'error');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markContactRead(id);
      showToast('Marked as read', 'success');
      await fetchData();
    } catch (error) {
      console.error('Mark read error:', error);
      showToast('Error marking as read', 'error');
    }
  };

  const handleLogout = () => {
    try {
      secureStorage.remove('auth_token');
      secureStorage.remove('user');
      showToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const handleEditProject = (project) => {
    if (!project || !project.id) {
      showToast('Invalid project data', 'error');
      return;
    }
    setEditing(project.id);
    setForm({
      ...INITIAL_FORM_STATE,
      ...project,
      features: project.features ? project.features.join(', ') : '',
      tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      priority: project.priority || 0,
      status: project.status || 'active',
      is_upcoming: project.is_upcoming || false,
      is_featured: project.is_featured || false,
    });
    setActiveTab(TABS.PROJECTS);
  };

  const cancelEditing = () => {
    setEditing(null);
    setForm(INITIAL_FORM_STATE);
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) return;
    try {
      await Promise.all(selectedItems.map(id => api.deleteProject(id)));
      showToast(`${selectedItems.length} items deleted successfully`, 'success');
      setSelectedItems([]);
      await fetchData();
    } catch (error) {
      console.error('Bulk delete error:', error);
      showToast('Error deleting items', 'error');
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (!status || !selectedItems.length) return;
    try {
      await Promise.all(selectedItems.map(id => 
        api.updateProject(id, { status })
      ));
      showToast(`${selectedItems.length} items updated to ${status}`, 'success');
      setSelectedItems([]);
      await fetchData();
    } catch (error) {
      console.error('Bulk update error:', error);
      showToast('Error updating items', 'error');
    }
  };

  const handleExport = async (type) => {
    setExportLoading(true);
    try {
      let data = [];
      let filename = '';
      
      switch(type) {
        case 'projects':
          data = projects;
          filename = `projects_export_${new Date().toISOString().slice(0,10)}.json`;
          break;
        case 'testimonials':
          data = testimonials;
          filename = `testimonials_export_${new Date().toISOString().slice(0,10)}.json`;
          break;
        case 'contacts':
          data = contacts;
          filename = `contacts_export_${new Date().toISOString().slice(0,10)}.json`;
          break;
        default:
          data = { projects, testimonials, contacts, exported_at: new Date().toISOString() };
          filename = `full_export_${new Date().toISOString().slice(0,10)}.json`;
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Export successful!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Error exporting data', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredProjects.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProjects.map(p => p.id));
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchData(0);
  };

  // ============================================
  // MEMOIZED COMPUTATIONS
  // ============================================

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];
    
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(search) ||
        p.category?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'upcoming') {
        filtered = filtered.filter(p => p.is_upcoming);
      } else {
        filtered = filtered.filter(p => p.status === filters.status);
      }
    }
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    
    return filtered;
  }, [projects, debouncedSearch, filters, sortBy, sortOrder]);

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderStatusBadge = (status, isUpcoming) => {
    if (isUpcoming) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">Upcoming</span>;
    }
    
    const statusConfig = STATUS_OPTIONS.find(s => s.value === status);
    const color = statusConfig?.color || 'gray';
    
    const colors = {
      green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
      gray: 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[color]}`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  const renderRatingStars = (rating) => {
    if (!rating || isNaN(rating)) return <span className="text-gray-400">No rating</span>;
    
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1 text-yellow-400">
        {[...Array(Math.min(fullStars, 5))].map((_, i) => (
          <FaStarSolid key={`full-${i}`} size={14} />
        ))}
        {hasHalf && fullStars < 5 && <FaStarHalf size={14} />}
        {[...Array(Math.max(0, emptyStars))].map((_, i) => (
          <FaStar key={`empty-${i}`} size={14} className="text-gray-300 dark:text-gray-600" />
        ))}
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  if (loading) return <EnhancedLoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaSync className={retryCount > 0 ? 'animate-spin' : ''} />
              Retry
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between py-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaProjectDiagram className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your content and monitor activity</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Toggle dark mode"
                >
                  {isDarkMode ? <FaEye className="text-yellow-400" /> : <FaEyeSlash className="text-gray-600" />}
                </button>
                
                <button
                  onClick={() => handleExport('full')}
                  disabled={exportLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {exportLoading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                  Export
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.totalProjects || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <FaProjectDiagram size={24} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.activeProjects || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <FaCheck size={24} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Testimonials</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.pendingTestimonials || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  <FaComments size={24} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread Enquiries</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.unreadContacts || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <FaEnvelope size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {Object.entries(TABS).map(([key, value]) => {
              const getCount = () => {
                switch(value) {
                  case TABS.PROJECTS: return projects.length;
                  case TABS.TESTIMONIALS: return testimonials.filter(t => !t.is_approved).length;
                  case TABS.CONTACTS: return contacts.filter(c => !c.is_read).length;
                  default: return 0;
                }
              };
              
              const getLabel = () => {
                switch(value) {
                  case TABS.PROJECTS: return <><FaProjectDiagram className="inline mr-2" /> Projects</>;
                  case TABS.TESTIMONIALS: return <><FaComments className="inline mr-2" /> Testimonials</>;
                  case TABS.CONTACTS: return <><FaEnvelope className="inline mr-2" /> Enquiries</>;
                  case TABS.STATISTICS: return <><FaChartBar className="inline mr-2" /> Statistics</>;
                  case TABS.SETTINGS: return <><FaWrench className="inline mr-2" /> Settings</>;
                  default: return value;
                }
              };
              
              const count = getCount();
              
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(value)}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === value
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {getLabel()}
                  {count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === value 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === TABS.PROJECTS && (
            <>
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex-1 min-w-[200px] relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form */}
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    {editing ? <FaEdit className="text-white" /> : <FaPlus className="text-white" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editing ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  {editing && (
                    <button
                      onClick={cancelEditing}
                      className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                <form onSubmit={handleProjectSubmit} className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Project Title *"
                      value={form.title || ''}
                      onChange={handleFormChange}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <select
                      name="category"
                      value={form.category || ''}
                      onChange={handleFormChange}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select Category *</option>
                      {CATEGORY_OPTIONS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    name="icon"
                    placeholder="Icon Name (e.g., cube, code)"
                    value={form.icon || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  
                  <select
                    name="status"
                    value={form.status || 'active'}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="short_desc"
                    placeholder="Short Description"
                    value={form.short_desc || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white md:col-span-2"
                  />

                  <textarea
                    name="description"
                    placeholder="Full Description *"
                    value={form.description || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white md:col-span-2"
                    rows="3"
                    required
                  />

                  <input
                    type="text"
                    name="demo_url"
                    placeholder="Demo URL (e.g., /demos/project)"
                    value={form.demo_url || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  
                  <input
                    type="text"
                    name="video_url"
                    placeholder="Video URL (YouTube embed)"
                    value={form.video_url || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />

                  <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL"
                    value={form.image_url || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  
                  <input
                    type="text"
                    name="github_url"
                    placeholder="GitHub URL"
                    value={form.github_url || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />

                  <input
                    type="text"
                    name="features"
                    placeholder="Features (comma separated)"
                    value={form.features || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  
                  <input
                    type="text"
                    name="tech_stack"
                    placeholder="Tech Stack (comma separated)"
                    value={form.tech_stack || ''}
                    onChange={handleFormChange}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_upcoming"
                        checked={form.is_upcoming || false}
                        onChange={handleFormChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Upcoming</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={form.is_featured || false}
                        onChange={handleFormChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Priority:</span>
                      <input
                        type="number"
                        name="priority"
                        min="0"
                        max="10"
                        value={form.priority || 0}
                        onChange={handleFormChange}
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 md:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                      {isSubmitting && <FaSpinner className="animate-spin" />}
                      {editing ? 'Update Project' : 'Create Project'}
                    </button>
                    {editing && (
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Projects Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <th className="p-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === filteredProjects.length && filteredProjects.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Title</th>
                        <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Category</th>
                        <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                        <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Priority</th>
                        <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                            {projects.length === 0 ? 'No projects yet. Create your first project!' : 'No projects match your filters.'}
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map(p => (
                          <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(p.id)}
                                onChange={() => {
                                  setSelectedItems(prev =>
                                    prev.includes(p.id)
                                      ? prev.filter(id => id !== p.id)
                                      : [...prev, p.id]
                                  );
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                                  <FaProjectDiagram className="text-blue-600 dark:text-blue-400 text-sm" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">{p.title}</div>
                                  {p.short_desc && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                      {p.short_desc}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3">
                              {renderStatusBadge(p.status, p.is_upcoming)}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  p.priority > 5 ? 'bg-red-500' :
                                  p.priority > 3 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`} />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{p.priority || 0}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditProject(p)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete('projects', p.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                                <button
                                  onClick={() => {
                                    setModalContent({
                                      title: p.title,
                                      content: p
                                    });
                                  }}
                                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredProjects.length} of {projects.length} projects
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                      <FaChevronLeft />
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Testimonials Tab */}
          {activeTab === TABS.TESTIMONIALS && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Client</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Feedback</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Rating</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                          No testimonials yet.
                        </td>
                      </tr>
                    ) : (
                      testimonials.map(t => (
                        <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{t.client_name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{t.client_company || '—'}</div>
                            </div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="truncate text-gray-600 dark:text-gray-300">{t.feedback}</div>
                          </td>
                          <td className="p-3">
                            {renderRatingStars(t.rating)}
                          </td>
                          <td className="p-3">
                            {t.is_approved ? (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">Approved</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">Pending</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {!t.is_approved && (
                                <button
                                  onClick={() => handleApprove(t.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <FaCheck />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete('testimonials', t.id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === TABS.CONTACTS && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Email</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                          No enquiries yet.
                        </td>
                      </tr>
                    ) : (
                      contacts.map(c => (
                        <tr key={c.id} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!c.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                          <td className="p-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                          <td className="p-3">
                            <a href={`mailto:${c.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                              {c.email}
                            </a>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              c.type === 'support' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                              c.type === 'demo' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                              'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}>
                              {c.type || 'general'}
                            </span>
                          </td>
                          <td className="p-3 max-w-xs truncate text-gray-600 dark:text-gray-300">{c.subject}</td>
                          <td className="p-3">
                            {c.is_read ? (
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">Read</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full animate-pulse">New</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {!c.is_read && (
                                <button
                                  onClick={() => handleMarkRead(c.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="Mark as read"
                                >
                                  <FaCheck />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete('contact', c.id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* STATISTICS TAB - NEW */}
          {/* ============================================ */}
          {activeTab === TABS.STATISTICS && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Projects</p>
                      <p className="text-4xl font-bold mt-2">{projects.length}</p>
                    </div>
                    <FaProjectDiagram className="text-5xl text-blue-200/50" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-green-300">↑ 12%</span>
                    <span className="text-blue-100 text-sm">from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Active Projects</p>
                      <p className="text-4xl font-bold mt-2">
                        {projects.filter(p => p.status === 'active' || !p.is_upcoming).length}
                      </p>
                    </div>
                    <FaCheck className="text-5xl text-green-200/50" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-green-300">↑ 8%</span>
                    <span className="text-green-100 text-sm">from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Testimonials</p>
                      <p className="text-4xl font-bold mt-2">{testimonials.length}</p>
                    </div>
                    <FaComments className="text-5xl text-purple-200/50" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-green-300">↑ 5%</span>
                    <span className="text-purple-100 text-sm">from last month</span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Status Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Status Distribution</h3>
                  <div className="space-y-3">
                    {['active', 'upcoming', 'maintenance', 'deprecated', 'archived'].map(status => {
                      const count = projects.filter(p => p.status === status).length;
                      const total = projects.length || 1;
                      const percentage = Math.round((count / total) * 100);
                      const colors = {
                        active: 'bg-green-500',
                        upcoming: 'bg-yellow-500',
                        maintenance: 'bg-orange-500',
                        deprecated: 'bg-red-500',
                        archived: 'bg-gray-500'
                      };
                      const labels = {
                        active: 'Active',
                        upcoming: 'Upcoming',
                        maintenance: 'Maintenance',
                        deprecated: 'Deprecated',
                        archived: 'Archived'
                      };
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{labels[status]}</span>
                            <span className="text-gray-900 dark:text-white font-medium">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`${colors[status]} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {projects.slice(0, 5).map((project, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaProjectDiagram className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {project.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Status: {project.status || 'active'} • Priority: {project.priority || 0}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                          project.status === 'upcoming' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400'
                        }`}>
                          {project.status || 'active'}
                        </span>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">No projects yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{projects.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {projects.filter(p => p.is_featured).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Featured</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {testimonials.filter(t => !t.is_approved).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Reviews</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {contacts.filter(c => !c.is_read).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SETTINGS TAB - NEW */}
          {/* ============================================ */}
          {activeTab === TABS.SETTINGS && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Settings</h3>
                
                {/* Appearance Settings */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Appearance</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark/light theme</p>
                    </div>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        isDarkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                        isDarkMode ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Data Management */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Data Management</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleExport('projects')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaDownload /> Export Projects
                    </button>
                    <button
                      onClick={() => handleExport('testimonials')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaDownload /> Export Testimonials
                    </button>
                    <button
                      onClick={() => handleExport('contacts')}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <FaDownload /> Export Contacts
                    </button>
                    <button
                      onClick={() => handleExport('full')}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      <FaDownload /> Export All Data
                    </button>
                  </div>
                </div>

                {/* Account Settings */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Account</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to logout?')) {
                          handleLogout();
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Logged in as: {secureStorage.get('user')?.name || 'Admin'}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Version</p>
                    <p className="font-medium text-gray-900 dark:text-white">2.0.0</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Database</p>
                    <p className="font-medium text-gray-900 dark:text-white">SQLite</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Items</p>
                    <p className="font-medium text-gray-900 dark:text-white">{projects.length + testimonials.length + contacts.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Delete Confirmation Modal */}
        <CustomModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Confirm Delete"
          size="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-3xl text-red-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </CustomModal>

        {/* View Details Modal */}
        {modalContent && (
          <CustomModal
            isOpen={!!modalContent}
            onClose={() => setModalContent(null)}
            title={modalContent.title}
            size="lg"
          >
            <div className="space-y-4">
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl overflow-auto text-sm">
                {JSON.stringify(modalContent.content, null, 2)}
              </pre>
            </div>
          </CustomModal>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Admin;