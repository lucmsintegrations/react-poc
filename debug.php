<?php
/**
 * Cookiebot Dashboard Debug Script
 * 
 * This script helps diagnose issues with the React dashboard integration.
 * It can be used to test various aspects of the build and integration process.
 */

// Check if PHP can access the manifest file
function check_manifest_access() {
    $cdn_url = 'https://storage.googleapis.com/cookiebot-dashboard/wp-dashboard';
    $manifest_url = $cdn_url . '/manifest.json';
    
    echo "Testing manifest access at: $manifest_url\n";
    
    $curl = curl_init($manifest_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, true);
    
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    echo "HTTP Status: $status\n";
    
    if ($status === 200) {
        $header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
        $body = substr($response, $header_size);
        
        $manifest = json_decode($body, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            echo "Manifest successfully parsed:\n";
            echo "Files included in manifest:\n";
            
            if (isset($manifest['files'])) {
                foreach ($manifest['files'] as $key => $value) {
                    echo "- $key: $value\n";
                }
            } else {
                echo "No 'files' section found in manifest\n";
            }
            
            echo "\nEntry points:\n";
            if (isset($manifest['entrypoints'])) {
                foreach ($manifest['entrypoints'] as $key => $value) {
                    echo "- $key\n";
                    if (isset($value['js'])) {
                        echo "  JS files:\n";
                        foreach ($value['js'] as $js) {
                            echo "  - $js\n";
                        }
                    }
                    if (isset($value['css'])) {
                        echo "  CSS files:\n";
                        foreach ($value['css'] as $css) {
                            echo "  - $css\n";
                        }
                    }
                }
            } else {
                echo "No 'entrypoints' section found in manifest\n";
            }
        } else {
            echo "Failed to parse manifest JSON: " . json_last_error_msg() . "\n";
            echo "Raw response body:\n$body\n";
        }
    } else {
        echo "Failed to access manifest file\n";
        echo "Response:\n$response\n";
    }
    
    curl_close($curl);
}

// Check if files referenced in manifest are accessible
function check_file_access($file_path) {
    $cdn_url = 'https://storage.googleapis.com/cookiebot-dashboard/wp-dashboard';
    $file_url = $cdn_url . '/' . $file_path;
    
    echo "Testing file access at: $file_url\n";
    
    $curl = curl_init($file_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, true);
    curl_setopt($curl, CURLOPT_NOBODY, true);
    
    curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    echo "HTTP Status: $status\n";
    
    if ($status === 200) {
        echo "File is accessible\n";
    } else {
        echo "File is not accessible\n";
    }
    
    curl_close($curl);
}

// Generate HTML to test the React component
function generate_test_html() {
    $cdn_url = 'https://storage.googleapis.com/cookiebot-dashboard/wp-dashboard';
    $manifest_url = $cdn_url . '/manifest.json';
    
    $curl = curl_init($manifest_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    curl_close($curl);
    
    if ($status !== 200) {
        echo "Failed to access manifest file. Cannot generate test HTML.\n";
        return;
    }
    
    $manifest = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Failed to parse manifest JSON. Cannot generate test HTML.\n";
        return;
    }
    
    // Get main JS and CSS files
    $js_file = isset($manifest['files']['main.js']) ? $cdn_url . '/' . $manifest['files']['main.js'] : null;
    $css_file = isset($manifest['files']['main.css']) ? $cdn_url . '/' . $manifest['files']['main.css'] : null;
    
    if (!$js_file) {
        echo "No main.js found in manifest. Cannot generate test HTML.\n";
        return;
    }
    
    // Get any chunk files
    $chunk_files = [];
    if (isset($manifest['entrypoints']) && isset($manifest['entrypoints']['main']) && isset($manifest['entrypoints']['main']['js'])) {
        foreach ($manifest['entrypoints']['main']['js'] as $chunk) {
            if ($chunk !== $manifest['files']['main.js']) {
                $chunk_files[] = $cdn_url . '/' . $chunk;
            }
        }
    }
    
    $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cookiebot Dashboard Test</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

HTML;
    
    if ($css_file) {
        $html .= "    <link rel=\"stylesheet\" href=\"$css_file\">\n";
    }
    
    $html .= <<<HTML
</head>
<body>
    <div id="cookiebot-dashboard-root"></div>
    
    <script>
        // Mock data that would be provided by WordPress
        window.cookiebotDashboard = {
            cbid: "test-cbid",
            userData: {
                steps: {
                    activate: true,
                    scan: false,
                    upgrade: false
                },
                configBannerUrl: "https://manage.cookiebot.com/en/manage",
                scanWebsiteUrl: "https://manage.cookiebot.com/en/scan",
                upgradeUrl: "https://www.cookiebot.com/en/pricing/"
            },
            scanStatus: "NOT_STARTED",
            bannerSettings: {
                enabled: true,
                autoBlock: true,
                darkTheme: false,
                showDoNotSellLink: false,
                respectDoNotTrack: false,
                autoCookieScan: true
            },
            ajaxUrl: "/wp-admin/admin-ajax.php",
            nonce: "test-nonce",
            cookiebotSiteUrl: "https://example.com"
        };
    </script>

HTML;
    
    // Add chunk files first
    foreach ($chunk_files as $chunk) {
        $html .= "    <script src=\"$chunk\"></script>\n";
    }
    
    // Add main JS last
    $html .= "    <script src=\"$js_file\"></script>\n";
    
    $html .= <<<HTML
</body>
</html>
HTML;
    
    $test_file = __DIR__ . '/test.html';
    file_put_contents($test_file, $html);
    
    echo "Test HTML file generated at: $test_file\n";
    echo "Open this file in a browser to test the React component.\n";
}

// Run the checks
echo "=== Cookiebot Dashboard Debug ===\n\n";
echo "Checking manifest access...\n";
check_manifest_access();

echo "\nChecking main.js access...\n";
check_file_access('static/js/main.12345678.js'); // This path needs to be updated with actual file path

echo "\nChecking main.css access...\n";
check_file_access('static/css/main.12345678.css'); // This path needs to be updated with actual file path

echo "\nGenerating test HTML...\n";
generate_test_html();

echo "\n=== Debug Complete ===\n"; 