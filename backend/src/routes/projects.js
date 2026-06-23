import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper function to parse features safely (handles both JSON and comma-separated strings)
const parseFeatures = (features) => {
  if (!features) return [];
  
  // If it's already an array, return it
  if (Array.isArray(features)) return features;
  
  // If it's a string, try to parse it
  if (typeof features === 'string') {
    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // If JSON parsing fails, split by comma
      return features.split(',').map(f => f.trim()).filter(f => f);
    }
  }
  
  return [];
};

// Get all projects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE is_active = 1 ORDER BY created_at DESC'
    );
    
    const projects = rows.map(project => ({
      ...project,
      features: parseFeatures(project.features)
    }));
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get projects by category
router.get('/category/:category', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE category = ? AND is_active = 1',
      [req.params.category]
    );
    const projects = rows.map(project => ({
      ...project,
      features: parseFeatures(project.features)
    }));
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const project = {
      ...rows[0],
      features: parseFeatures(rows[0].features)
    };
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project (admin only)
router.post('/', auth, async (req, res) => {
  const { title, category, description, short_desc, demo_url, video_url, image_url, icon, features, is_upcoming } = req.body;
  
  try {
    // Ensure features is a valid JSON array
    let featuresJson = JSON.stringify([]);
    if (features) {
      if (Array.isArray(features)) {
        featuresJson = JSON.stringify(features);
      } else if (typeof features === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(features);
          featuresJson = JSON.stringify(parsed);
        } catch (e) {
          // If not valid JSON, split by comma
          featuresJson = JSON.stringify(features.split(',').map(f => f.trim()).filter(f => f));
        }
      }
    }
    
    const [result] = await pool.query(
      `INSERT INTO projects 
       (title, category, description, short_desc, demo_url, video_url, image_url, icon, features, is_upcoming) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category, description, short_desc, demo_url, video_url, image_url, icon, featuresJson, is_upcoming || 0]
    );
    res.status(201).json({ message: 'Project created', id: result.insertId });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update project (admin only)
router.put('/:id', auth, async (req, res) => {
  const { title, category, description, short_desc, demo_url, video_url, image_url, icon, features, is_active, is_upcoming } = req.body;
  
  try {
    // Ensure features is a valid JSON array
    let featuresJson = JSON.stringify([]);
    if (features) {
      if (Array.isArray(features)) {
        featuresJson = JSON.stringify(features);
      } else if (typeof features === 'string') {
        try {
          const parsed = JSON.parse(features);
          featuresJson = JSON.stringify(parsed);
        } catch (e) {
          featuresJson = JSON.stringify(features.split(',').map(f => f.trim()).filter(f => f));
        }
      }
    }
    
    const [result] = await pool.query(
      `UPDATE projects SET 
       title = ?, category = ?, description = ?, short_desc = ?, 
       demo_url = ?, video_url = ?, image_url = ?, icon = ?, 
       features = ?, is_active = ?, is_upcoming = ? 
       WHERE id = ?`,
      [title, category, description, short_desc, demo_url, video_url, image_url, icon, featuresJson, is_active, is_upcoming, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project updated' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;