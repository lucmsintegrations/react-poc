/**
 * Deployment script for Cookiebot Dashboard React app to CDN
 * Builds the app and deploys to Google Cloud Storage bucket
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const bucketName = 'react-wp-poc-dashboard';
const cdnUrl = `https://storage.googleapis.com/${bucketName}/`;

// Main deployment function
async function deploy() {
  console.log('🚀 Starting deployment process...');
  
  try {
    // 1. Build the React app
    console.log('\n📦 Building React app...');
    const currentDir = process.cwd();
    process.chdir(__dirname);
    execSync('npx react-app-rewired build', { stdio: 'inherit' });
    
    // 2. Ensure manifest.json exists and is correct
    await ensureManifestFile();
    
    // 3. Create version file for cache busting
    await createVersionFile();
    
    // 4. Deploy to Google Cloud Storage
    console.log(`\n☁️ Uploading to GCS bucket: ${bucketName}...`);
    execSync(`gsutil -m -h "Cache-Control:no-cache, max-age=0" cp -r build/* gs://${bucketName}/`, { stdio: 'inherit' });
    
    process.chdir(currentDir);
    
    // 5. Set public read access for all files
    console.log('\n🔓 Setting public access...');
    execSync(`gsutil -m acl ch -r -u AllUsers:R gs://${bucketName}/`, { stdio: 'inherit' });
    
    console.log('\n✅ Deployment completed successfully!');
    console.log(`🔗 The app is available at: ${cdnUrl}index.html`);
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Ensure manifest.json exists and is correct
async function ensureManifestFile() {
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