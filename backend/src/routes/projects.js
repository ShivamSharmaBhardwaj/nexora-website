import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper function to parse features
const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return features.split(',').map(f => f.trim()).filter(f => f);
    }
  }
  return [];
};

// Get all projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE is_active = $1 ORDER BY created_at DESC',
      [true]
    );
    
    const projects = result.rows.map(project => ({
      ...project,
      features: parseFeatures(project.features)
    }));
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE LOWER(category) = LOWER($1) AND is_active = $2',
      [req.params.category, true]
    );
    const projects = result.rows.map(project => ({
      ...project,
      features: parseFeatures(project.features)
    }));
    res.json(projects);
  } catch (error) {
    console.error('Error fetching by category:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const project = {
      ...result.rows[0],
      features: parseFeatures(result.rows[0].features)
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
    
    const result = await pool.query(
      `INSERT INTO projects 
       (title, category, description, short_desc, demo_url, video_url, image_url, icon, features, is_upcoming) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id`,
      [title, category, description, short_desc, demo_url, video_url, image_url, icon, featuresJson, is_upcoming || false]
    );
    res.status(201).json({ message: 'Project created', id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update project (admin only)
router.put('/:id', auth, async (req, res) => {
  const { title, category, description, short_desc, demo_url, video_url, image_url, icon, features, is_active, is_upcoming } = req.body;
  
  try {
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
    
    const result = await pool.query(
      `UPDATE projects SET 
       title = $1, category = $2, description = $3, short_desc = $4, 
       demo_url = $5, video_url = $6, image_url = $7, icon = $8, 
       features = $9, is_active = $10, is_upcoming = $11 
       WHERE id = $12`,
      [title, category, description, short_desc, demo_url, video_url, image_url, icon, featuresJson, is_active, is_upcoming, req.params.id]
    );
    
    if (result.rowCount === 0) {
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
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;