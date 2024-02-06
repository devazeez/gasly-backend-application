// scripts/git-commit.js
const { execSync } = require('child_process');

// Get commit message and branch name from command line arguments
const commitMessage = process.argv[2];
const branchName = process.argv[3];

// Validate input
if (!commitMessage || !branchName) {
  console.error('Error: Please provide a commit message and branch name.');
  process.exit(1);
}

// Run Git commands
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  execSync(`git push origin ${branchName}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
