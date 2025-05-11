
#!/usr/bin/env node

/**
 * Dieses Skript prüft, ob package.json und package-lock.json synchron sind.
 * Es wird als Pre-Commit-Hook verwendet und kann auch manuell ausgeführt werden.
 */
const { execSync } = require('child_process');
const chalk = require('chalk');

try {
  console.log(chalk.blue('🔍 Prüfe Synchronisation von package.json und package-lock.json...'));
  execSync('npm ci --dry-run', { stdio: 'pipe' });
  console.log(chalk.green('✅ package.json und package-lock.json sind synchron!'));
} catch (error) {
  console.error(chalk.red('❌ package.json und package-lock.json sind nicht synchron!'));
  console.error(chalk.yellow('Führe npm install aus, um die Dateien zu synchronisieren.'));
  console.error('\nFehlermeldung:', error.message);
  process.exit(1);
}
