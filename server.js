import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

const CONFIG_DIR = path.join(__dirname, 'src/components/sections/Workflow/configs');

// Ensure configs directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Serve static files from the dist directory after build
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/save-config', (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Missing name or content' });
  }

  const filePath = path.join(CONFIG_DIR, `${name.trim()}.json`);

  fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error saving config:', err);
      return res.status(500).json({ error: 'Failed to save config' });
    }

    return res.json({ status: 'success', message: `Saved to ${filePath}` });
  });
});

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});