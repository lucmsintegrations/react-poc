module.exports = function override(config, env) {
  // Override webpack configuration for production builds
  if (env === 'production') {
    // Set the CDN URL
    const cdnUrl = 'https://storage.googleapis.com/react-wp-poc-dashboard/';
    
    // Set the public path to the CDN URL
    config.output.publicPath = cdnUrl;
    
    // Override ManifestPlugin to update the asset manifest
    const plugins = config.plugins;
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      if (plugin.constructor.name === 'ManifestPlugin') {
        plugin.opts.publicPath = cdnUrl;
        // Ensure absolute paths in the manifest
        if (plugin.opts.generate) {
          const originalGenerate = plugin.opts.generate;
          plugin.opts.generate = (seed, files, entrypoints) => {
            const manifest = originalGenerate(seed, files, entrypoints);
            // Ensure all paths use the full CDN URL
            Object.keys(manifest.files).forEach(key => {
              const value = manifest.files[key];
              if (value.startsWith('/react-wp-poc-dashboard/')) {
                manifest.files[key] = value.replace('/react-wp-poc-dashboard/', cdnUrl);
              }
            });
            return manifest;
          };
        }
      }
    }
  }
  
  return config;
}; 