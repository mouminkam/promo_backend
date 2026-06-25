import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import listEndpoints from 'express-list-endpoints';

async function main() {
  const app = require('../src/app').default;
  const endpoints = listEndpoints(app);
  
  const foldersMap = new Map<string, any[]>();
  
  endpoints.forEach((ep) => {
    // Example path: /api/v1/auth/login
    const pathParts = ep.path.split('/').filter(Boolean);
    
    // index 0: api, index 1: v1, index 2: module name
    const moduleName = pathParts.length > 2 ? pathParts[2] : 'general';
    
    if (!foldersMap.has(moduleName)) {
      foldersMap.set(moduleName, []);
    }
    
    ep.methods.forEach(method => {
      // If method is middleware like '*' or 'USE', skip it
      if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        
        // Convert Express /:id to Postman {{id}}
        const mappedSegments = pathParts.slice(2).map(p => {
          if (p.startsWith(':')) {
             return `{{${p.replace(':', '')}}}`;
          }
          return p;
        });

        const request: any = {
          name: `${method} /${mappedSegments.join('/')}`,
          request: {
            method: method,
            header: [{ key: 'Content-Type', value: 'application/json' }],
            url: {
              raw: `{{baseUrl}}/${mappedSegments.join('/')}`,
              host: ['{{baseUrl}}'],
              path: mappedSegments
            }
          }
        };
        
        foldersMap.get(moduleName)?.push(request);
      }
    });
  });
  
  const folders = Array.from(foldersMap.entries()).map(([name, items]) => {
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      item: items
    };
  });
  
  const collection = {
    info: {
      name: 'Promoo API Collection (100% Auto-Generated)',
      description: 'Auto-generated using express-list-endpoints to ensure absolutely no endpoints are missed.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    variable: [
      { key: 'baseUrl', value: 'http://localhost:3000/api/v1', type: 'string' },
      { key: 'token', value: '', type: 'string' },
      { key: 'id', value: '', type: 'string' }
    ],
    auth: {
      type: 'bearer',
      bearer: [{ key: 'token', value: '{{token}}', type: 'string' }]
    },
    item: folders
  };
  
  const outPath = path.join(__dirname, '..', 'promoo_postman_collection.json');
  fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), 'utf-8');
  
  let totalReqs = 0;
  folders.forEach(f => totalReqs += f.item.length);
  
  console.log(`✅ Generated perfect Postman collection at ${outPath}`);
  console.log(`   Total Folders: ${folders.length}`);
  console.log(`   Total Endpoints Found: ${totalReqs}`);
}

main().catch(console.error);
