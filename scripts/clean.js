const fs = require('fs');
const path = require('path');

const outDirs = [
	path.join(__dirname, '..', 'client', 'out'),
	path.join(__dirname, '..', 'server', 'out'),
];

outDirs.forEach(dir => {
	if (fs.existsSync(dir)) {
		fs.rmSync(dir, { recursive: true, force: true });
		console.log(`✓ Removed ${dir}`);
	} else {
		console.log(`  Skipped ${dir} (not found)`);
	}
});
