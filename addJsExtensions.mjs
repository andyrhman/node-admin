import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function addJSExtension(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            addJSExtension(fullPath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Replace relative imports to include .js extension
            content = content.replace(/from\s+['"](\.\/[^'"]*)['"]/g, (match, p1) => {
                return p1.endsWith('.js') ? match : `from '${p1}.js'`;
            }).replace(/from\s+['"](\.\.\/[^'"]*)['"]/g, (match, p1) => {
                return p1.endsWith('.js') ? match : `from '${p1}.js'`;
            });

            // Replace TypeORM entities and migrations paths
            content = content.replace(/entities:\s*\["src\/entity\/\*\.ts"\]/, `entities: ["dist/entity/*.js"]`);
            content = content.replace(/migrations:\s*\["src\/db\/migrations\/\*\.\{\.\w+,\.\w+\}"\]/, `migrations: ["dist/db/migrations/*.js"]`);

            // Change TypeORM synchronize to false
            content = content.replace(/synchronize:\s*true/, 'synchronize: false');

            // Remove console.error statements for production
            content = content.replace(/console\.error\(err\);?/g, '');

            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

addJSExtension(path.join(__dirname, 'dist'));
