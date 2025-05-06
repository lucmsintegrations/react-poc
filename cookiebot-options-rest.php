<?php
// Register a REST API endpoint for reading/writing plugin options
add_action('rest_api_init', function () {
    register_rest_route('cookiebot/v1', '/option/(?P<key>[a-zA-Z0-9-_]+)', [
        'methods' => ['GET', 'POST'],
        'callback' => function (WP_REST_Request $request) {
            $key = sanitize_key($request['key']);
            if ($request->get_method() === 'GET') {
                $value = get_option($key);
                return rest_ensure_response(['key' => $key, 'value' => $value]);
            } elseif ($request->get_method() === 'POST') {
                $value = $request->get_param('value');
                update_option($key, $value);
                return rest_ensure_response(['success' => true, 'key' => $key, 'value' => $value]);
            }
            return new WP_Error('invalid_method', 'Invalid request method', ['status' => 405]);
        },
        'permission_callback' => '__return_true', // Secured by Application Passwords
    ]);
}); 