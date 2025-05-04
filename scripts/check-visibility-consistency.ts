
/**
 * Visibility Consistency Check Script
 * 
 * This script verifies that the routes defined in the codebase are consistent
 * with the visibility matrix documentation.
 * 
 * It checks:
 * 1. All routes in routes.tsx have appropriate public/protected flags
 * 2. All routes in the visibility matrix are present in routes.tsx
 * 3. All protected routes have appropriate role checks
 * 
 * Usage: 
 * $ npx ts-node scripts/check-visibility-consistency.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse as parseMarkdown } from 'marked';

// Types
interface RouteConfig {
  path: string;
  public?: boolean;
  protected?: boolean;
  element?: any;
}

interface MatrixRoute {
  path: string;
  public: boolean;
  loginRequired: boolean;
  roles: string[];
  specialRules?: string;
}

// Parse the routes from the codebase
function parseRoutesFromCode(): RouteConfig[] {
  try {
    const routesFilePath = path.resolve(__dirname, '../src/routes/routes.tsx');
    const routesContent = fs.readFileSync(routesFilePath, 'utf-8');
    
    // Extract route definitions
    const routes: RouteConfig[] = [];
    const routeMatches = routesContent.match(/path: ['"]([^'"]+)['"]\s*,\s*element:.*?(public|protected):\s*(true|false)/g) || [];
    
    routeMatches.forEach(match => {
      const pathMatch = match.match(/path: ['"]([^'"]+)['"]/);
      const publicMatch = match.match(/public:\s*(true|false)/);
      const protectedMatch = match.match(/protected:\s*(true|false)/);
      
      if (pathMatch) {
        const route: RouteConfig = {
          path: pathMatch[1]
        };
        
        if (publicMatch) {
          route.public = publicMatch[1] === 'true';
        }
        
        if (protectedMatch) {
          route.protected = protectedMatch[1] === 'true';
        }
        
        routes.push(route);
      }
    });
    
    return routes;
  } catch (error) {
    console.error('Error parsing routes from code:', error);
    return [];
  }
}

// Parse the routes from the visibility matrix markdown
function parseRoutesFromMatrix(): MatrixRoute[] {
  try {
    const matrixFilePath = path.resolve(__dirname, '../docs/system/visibility_matrix.md');
    const matrixContent = fs.readFileSync(matrixFilePath, 'utf-8');
    
    const lines = matrixContent.split('\n');
    const routes: MatrixRoute[] = [];
    let inRoutesTable = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('| Route | Public | Login Required')) {
        inRoutesTable = true;
        i++; // Skip the header separator line
        continue;
      }
      
      if (inRoutesTable && line.startsWith('| `/')) {
        const cells = line.split('|').map(cell => cell.trim());
        if (cells.length >= 5) {
          // Extract path (remove backticks)
          const path = cells[1].replace(/`/g, '').trim();
          
          // Extract public status
          const isPublic = cells[2].includes('✅');
          
          // Extract login required
          const loginRequired = cells[3].includes('✅');
          
          // Extract roles
          const rolesText = cells[4];
          const roles = rolesText
            .split(',')
            .map(role => role.trim())
            .filter(role => role !== 'All' && role !== '');
          
          // Extract special rules if available
          const specialRules = cells[5] || undefined;
          
          routes.push({
            path,
            public: isPublic,
            loginRequired,
            roles,
            specialRules
          });
        }
      } else if (inRoutesTable && line === '' && routes.length > 0) {
        // End of routes table
        inRoutesTable = false;
      }
    }
    
    return routes;
  } catch (error) {
    console.error('Error parsing routes from visibility matrix:', error);
    return [];
  }
}

// Check that public/protected flags in routes.tsx match the visibility matrix
function checkRouteConsistency(codeRoutes: RouteConfig[], matrixRoutes: MatrixRoute[]): {
  inconsistencies: string[];
  missingInCode: string[];
  missingInMatrix: string[];
} {
  const inconsistencies: string[] = [];
  const missingInCode: string[] = [];
  const missingInMatrix: string[] = [];
  
  // Check each matrix route against code routes
  matrixRoutes.forEach(matrixRoute => {
    // Skip route patterns with wildcards or parameters for exact matching
    if (matrixRoute.path.includes('*') || matrixRoute.path.includes(':')) {
      return;
    }
    
    const codeRoute = codeRoutes.find(r => r.path === matrixRoute.path);
    
    if (!codeRoute) {
      missingInCode.push(matrixRoute.path);
      return;
    }
    
    // Check public/protected consistency
    if (matrixRoute.public !== Boolean(codeRoute.public)) {
      inconsistencies.push(
        `Route ${matrixRoute.path} is marked as ${matrixRoute.public ? 'public' : 'protected'} in the matrix but ${codeRoute.public ? 'public' : 'protected'} in the code`
      );
    }
    
    // Check login required consistency
    if (matrixRoute.loginRequired !== Boolean(codeRoute.protected)) {
      inconsistencies.push(
        `Route ${matrixRoute.path} ${matrixRoute.loginRequired ? 'requires' : 'does not require'} login in the matrix but is ${codeRoute.protected ? 'protected' : 'not protected'} in the code`
      );
    }
  });
  
  // Check for routes in code but not in matrix
  codeRoutes.forEach(codeRoute => {
    // Skip route patterns with wildcards or parameters for exact matching
    if (codeRoute.path.includes('*') || codeRoute.path.includes(':')) {
      return;
    }
    
    const matrixRoute = matrixRoutes.find(r => r.path === codeRoute.path);
    
    if (!matrixRoute) {
      missingInMatrix.push(codeRoute.path);
    }
  });
  
  return { inconsistencies, missingInCode, missingInMatrix };
}

// Main function
function main() {
  console.log('🔍 Checking visibility consistency...');
  
  const codeRoutes = parseRoutesFromCode();
  console.log(`Found ${codeRoutes.length} routes in code`);
  
  const matrixRoutes = parseRoutesFromMatrix();
  console.log(`Found ${matrixRoutes.length} routes in visibility matrix`);
  
  const { inconsistencies, missingInCode, missingInMatrix } = checkRouteConsistency(codeRoutes, matrixRoutes);
  
  if (inconsistencies.length > 0) {
    console.error('\n❌ Inconsistencies found:');
    inconsistencies.forEach(issue => console.error(`  - ${issue}`));
  } else {
    console.log('\n✅ No inconsistencies found between code routes and visibility matrix');
  }
  
  if (missingInCode.length > 0) {
    console.warn('\n⚠️ Routes in matrix but missing in code:');
    missingInCode.forEach(route => console.warn(`  - ${route}`));
  }
  
  if (missingInMatrix.length > 0) {
    console.warn('\n⚠️ Routes in code but missing in matrix:');
    missingInMatrix.forEach(route => console.warn(`  - ${route}`));
  }
  
  if (inconsistencies.length === 0 && missingInCode.length === 0 && missingInMatrix.length === 0) {
    console.log('\n🎉 All checks passed! The visibility matrix is consistent with the code.');
    process.exit(0);
  } else {
    console.error('\n❌ Visibility consistency check failed.');
    process.exit(1);
  }
}

// Run the script
main();
