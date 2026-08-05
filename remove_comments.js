const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  
  let newContent = content;

  if (ext === '.ts' || ext === '.js') {
    const lines = content.split('\n');
    let inBlockComment = false;
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (trimmed.startsWith('/*')) {
        inBlockComment = true;
      }
      
      if (!inBlockComment && !trimmed.startsWith('//')) {
        newLines.push(line);
      }
      
      if (inBlockComment && trimmed.endsWith('*/')) {
        inBlockComment = false;
      }
    }
    
    newContent = newLines.join('\n');
  } else if (ext === '.html') {
    const lines = content.split('\n');
    const newLines = lines.filter(line => {
      const trimmed = line.trim();
      return !(trimmed.startsWith('<!--') && trimmed.endsWith('-->'));
    });
    newContent = newLines.join('\n');
  }
  
  // Remove multiple empty lines
  newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Cleaned: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.angular') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(fullPath);
      if (ext === '.ts' || ext === '.js' || ext === '.html') {
        processFile(fullPath);
      }
    }
  }
}

walk(path.join(__dirname, 'frontend/src'));
walk(path.join(__dirname, 'backend/src'));
walk(path.join(__dirname, 'backend'));
