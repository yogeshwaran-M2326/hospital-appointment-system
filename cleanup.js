const fs = require('fs');
const path = require('path');

function isDirEmpty(dirPath) {
  try {
    return fs.readdirSync(dirPath).length === 0;
  } catch (e) {
    return false;
  }
}

function walkAndDelete(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.angular') continue;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkAndDelete(fullPath);
      // Check if it's empty after deleting contents
      if (isDirEmpty(fullPath)) {
        try {
          fs.rmdirSync(fullPath);
          console.log(`Deleted empty folder: ${fullPath}`);
        } catch (e) {
          // ignore
        }
      }
    } else {
      // It's a file
      if (file.endsWith('.spec.ts')) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted test file: ${fullPath}`);
      } else if (stat.size === 0) {
        // Empty file
        fs.unlinkSync(fullPath);
        console.log(`Deleted empty file: ${fullPath}`);
      }
    }
  }
}

walkAndDelete(path.join(__dirname, 'frontend/src'));
walkAndDelete(path.join(__dirname, 'backend'));
