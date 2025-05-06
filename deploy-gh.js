const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Main deployment function
async function deploy() {
  console.log('🚀 Starting GitHub Pages deployment process...');
  
  try {
    // 1. Build the React app
    console.log('\n📦 Building React app...');
    execSync('npx react-app-rewired build', { stdio: 'inherit' });
    
    // 2. Post-process the build files
    await postProcessBuildFiles();
    
    // 3. Deploy to GitHub Pages
    console.log('\n📤 Deploying to GitHub Pages...');
    
    // Create and switch to gh-pages branch
    try {
      execSync('git checkout -b gh-pages', { stdio: 'inherit' });
    } catch (e) {
      // If branch exists, just switch to it
      execSync('git checkout gh-pages', { stdio: 'inherit' });
    }
    
    // Copy build files to root
    execSync('cp -r build/* .', { stdio: 'inherit' });
    
    // Add all files
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit changes
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
    
    // Push to gh-pages branch
    execSync('git push origin gh-pages --force', { stdio: 'inherit' });
    
    // Switch back to main branch
    execSync('git checkout main', { stdio: 'inherit' });
    
    console.log('\n✅ Deployment completed successfully!');
    console.log('🔗 The app is available at: https://lucmsintegrations.github.io/react-cms-app/');
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Post-process build files
async function postProcessBuildFiles() {
  console.log('\n🔧 Post-processing build files...');
  
  // 1. Create or update manifest.json
  await createManifestFile();
  
  // 2. Create version.json file
  await createVersionFile();
}

// Create or update manifest.json
async function createManifestFile() {
  const buildDir = path.join(__dirname, 'build');
  const manifestPath = path.join(buildDir, 'manifest.json');
  
  try {
    // Get all JS and CSS files from the build directory
    const jsFiles = fs.readdirSync(path.join(buildDir, 'static/js'))
      .filter(file => file.endsWith('.js'))
      .map(file => `/static/js/${file}`);
    
    const cssFiles = fs.readdirSync(path.join(buildDir, 'static/css'))
      .filter(file => file.endsWith('.css'))
      .map(file => `/static/css/${file}`);
    
    // Find main entry points
    const mainJs = jsFiles.find(file => file.includes('main')) || jsFiles[0];
    const mainCss = cssFiles.find(file => file.includes('main')) || cssFiles[0];
    
    // Create manifest structure
    const manifest = {
      files: {
        'main.js': mainJs,
        'main.css': mainCss
      },
      entrypoints: {
        js: jsFiles,
        css: cssFiles
      }
    };
    
    // Write manifest file
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('  ✓ Created/updated manifest.json');
  } catch (error) {
    console.error('  ⚠️ Failed to create manifest file:', error.message);
    throw error;
  }
}

// Create version.json file
async function createVersionFile() {
  const versionPath = path.join(__dirname, 'build', 'version.json');
  const versionInfo = {
    buildTime: new Date().toISOString(),
    version: require('./package.json').version
  };
  
  try {
    fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));
    console.log('  ✓ Created version.json');
  } catch (error) {
    console.error('  ⚠️ Failed to create version.json:', error.message);
  }
}

// Run deployment
deploy(); 