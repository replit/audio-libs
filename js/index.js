const { execSync } = require('child_process');

execSync('yarn run test:unit', {stdio: 'inherit'});

''