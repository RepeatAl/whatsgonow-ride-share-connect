
#!/usr/bin/env node
/**
 * Role Consistency Checker
 * 
 * This script checks the codebase for violations of the naming conventions
 * defined in /docs/conventions/roles_and_ids.md
 * 
 * Usage: npx ts-node scripts/check-role-consistency.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Define patterns to search for
const patterns = {
  // Deprecated ID fields
  deprecatedFields: [
    'from_user',
    'to_user',
    'profile_id',
  ],
  
  // Direct role comparisons instead of using IN
  directRoleComparisons: [
    "role === 'admin'",
    "role === 'super_admin'",
    "role == 'admin'",
    "role == 'super_admin'",
    "role==='admin'",
    "role==='super_admin'",
    ".role = 'admin'",
    ".role = 'super_admin'",
  ],
  
  // Policy files not containing the standard comment
  policyCommentCheck: {
    pattern: '-- Diese Policy folgt den Konventionen aus /docs/conventions/roles_and_ids.md',
    fileTypes: ['.sql'],
  }
};

// Get all files in the project (excluding node_modules, build directories, etc.)
function getFilesToCheck(): string[] {
  // Use git ls-files to get all tracked files
  const output = execSync('git ls-files', { encoding: 'utf-8' });
  const allFiles = output.split('\n').filter(Boolean);
  
  // Filter out unwanted directories and file types
  return allFiles.filter(file => {
    const isExcluded = 
      file.startsWith('node_modules/') ||
      file.startsWith('dist/') ||
      file.startsWith('build/') ||
      file.endsWith('.md') ||
      file.endsWith('.svg') ||
      file.endsWith('.png') ||
      file.endsWith('.jpg') ||
      file.endsWith('.jpeg') ||
      file.endsWith('.ico');
    
    return !isExcluded;
  });
}

// Check a file for pattern violations
function checkFile(filePath: string): { file: string, violations: string[] } {
  const violations: string[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for deprecated fields
    patterns.deprecatedFields.forEach(field => {
      if (content.includes(field)) {
        violations.push(`Contains deprecated field: ${field}`);
      }
    });
    
    // Check for direct role comparisons
    patterns.directRoleComparisons.forEach(comparison => {
      if (content.includes(comparison)) {
        violations.push(`Contains direct role comparison: ${comparison}`);
      }
    });
    
    // Check SQL files for policy comment
    const ext = path.extname(filePath);
    if (patterns.policyCommentCheck.fileTypes.includes(ext)) {
      if (!content.includes(patterns.policyCommentCheck.pattern)) {
        violations.push(`Missing policy convention comment`);
      }
    }
    
  } catch (error) {
    violations.push(`Error processing file: ${(error as Error).message}`);
  }
  
  return { file: filePath, violations };
}

// Main execution
function main() {
  console.log('🔍 Checking for role and ID convention violations...');
  
  const files = getFilesToCheck();
  console.log(`Found ${files.length} files to check.`);
  
  let totalViolations = 0;
  const filesWithViolations: { file: string, violations: string[] }[] = [];
  
  files.forEach(file => {
    const result = checkFile(file);
    if (result.violations.length > 0) {
      filesWithViolations.push(result);
      totalViolations += result.violations.length;
    }
  });
  
  console.log('\n--- Results ---');
  console.log(`Total violations found: ${totalViolations}`);
  
  if (filesWithViolations.length > 0) {
    console.log('\nViolations by file:');
    filesWithViolations.forEach(({ file, violations }) => {
      console.log(`\n📁 ${file}`);
      violations.forEach(v => console.log(`  ❌ ${v}`));
    });
    
    process.exit(1); // Exit with error code for CI integration
  } else {
    console.log('✅ No violations found. Good job!');
    process.exit(0);
  }
}

main();
