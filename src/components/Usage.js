import React, { useState } from 'react';
import './Usage.css';

const Usage = ({ cbid }) => {
  const [activeTab, setActiveTab] = useState('automatic');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const manualCodeSnippet = `
<!-- Cookiebot consent management -->
<script id="Cookiebot" src="https://consent.cookiebot.com/${cbid}/cd.js" 
  data-cbid="${cbid}" 
  type="text/javascript" 
  async></script>
`;

  const wordpressCodeSnippet = `
// In your theme's functions.php file
function enqueue_cookiebot_script() {
  wp_enqueue_script(
    'cookiebot', 
    'https://consent.cookiebot.com/${cbid}/cd.js', 
    array(), 
    null, 
    true
  );
}
add_action('wp_enqueue_scripts', 'enqueue_cookiebot_script');
`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text.trim())
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="usage-container">
      <h2>Integrate Cookiebot on Your Site</h2>
      <p className="usage-description">
        The Cookiebot plugin automatically adds the necessary script to your WordPress site.
        If you're using another platform or need to implement it manually, use the options below.
      </p>

      <div className="usage-tabs">
        <button 
          className={`usage-tab ${activeTab === 'automatic' ? 'active' : ''}`}
          onClick={() => handleTabChange('automatic')}
        >
          WordPress Plugin
        </button>
        <button 
          className={`usage-tab ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => handleTabChange('manual')}
        >
          Manual Integration
        </button>
        <button 
          className={`usage-tab ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => handleTabChange('advanced')}
        >
          WordPress Code
        </button>
      </div>

      <div className="usage-content">
        {activeTab === 'automatic' && (
          <div className="usage-automatic">
            <h3>WordPress Plugin Integration</h3>
            <p>The Cookiebot WordPress plugin is already installed and configured with your Cookiebot ID:</p>
            <div className="cbid-display">
              <strong>Your Cookiebot ID:</strong> <code>{cbid || 'Not configured'}</code>
            </div>
            <p>Benefits of using the plugin:</p>
            <ul>
              <li>Automatic script placement in the <code>&lt;head&gt;</code> section</li>
              <li>Google Tag Manager integration support</li>
              <li>Cookie blocking for WordPress cookies</li>
              <li>Support for cookie consent modes</li>
            </ul>
            <p>The plugin ensures that all cookies are blocked until user consent is given, helping your site comply with privacy regulations.</p>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="usage-manual">
            <h3>Manual Integration</h3>
            <p>Add the following script to the <code>&lt;head&gt;</code> section of your website:</p>
            
            <div className="code-block">
              <pre>{manualCodeSnippet}</pre>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(manualCodeSnippet)}
              >
                Copy
              </button>
            </div>
            
            <p><strong>Note:</strong> For optimal performance, the script should be placed as high as possible in the <code>&lt;head&gt;</code> section of your HTML document.</p>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="usage-advanced">
            <h3>WordPress Code Integration</h3>
            <p>If you prefer to add the Cookiebot script using code rather than the plugin, you can add this to your theme:</p>
            
            <div className="code-block">
              <pre>{wordpressCodeSnippet}</pre>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(wordpressCodeSnippet)}
              >
                Copy
              </button>
            </div>
            
            <p><strong>Note:</strong> This method adds the script to the footer. For better performance, consider using the plugin or the manual method which places the script in the <code>&lt;head&gt;</code> section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Usage; 