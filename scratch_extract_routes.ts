import fs from 'fs';
import path from 'path';

function findRoutes(dir: string, baseRoute: string = '') {
  let routes: string[] = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      routes = routes.concat(findRoutes(fullPath, baseRoute + '/' + file));
    } else if (file.endsWith('.routes.ts') || file === 'index.ts') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/);
        if (match) {
          const method = match[1].toUpperCase();
          const endpoint = match[2];
          routes.push(`${method} ${baseRoute}/${file.replace('.ts', '')}${endpoint}`);
        }
      }
    }
  }
  return routes;
}

const allRoutes = findRoutes('./src/routes');
console.log('--- ALL ROUTES IN CODEBASE ---');
allRoutes.forEach(r => console.log(r));
