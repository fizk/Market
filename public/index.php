<?php
chdir(dirname(__DIR__));

if (php_sapi_name() === 'cli-server') {
    $path = realpath(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    if (__FILE__ !== $path && is_file($path)) {
        return false;
    }
    unset($path);
}

require_once './vendor/autoload.php';

use Aura\Router\RouterContainer;
use Zend\Diactoros\Response;
use Market\Controller\IndexController;
use Market\Controller\ListingCollectionController;
use Market\Controller\ListingEntryController;

$config = require_once './config/config.php';


$routerContainer = new RouterContainer();
$map = $routerContainer->getMap();
$map->get('index', '/', $config['controllers'][IndexController::class]);
$map->get('listings', '/listings', $config['controllers'][ListingCollectionController::class]);
$map->get('listing', '/listings/{id}', $config['controllers'][ListingEntryController::class]);

$request = Zend\Diactoros\ServerRequestFactory::fromGlobals($_SERVER, $_GET, $_POST, $_COOKIE, $_FILES);
$matcher = $routerContainer->getMatcher();
$route = $matcher->match($request);

if ($route) {
	foreach ($route->attributes as $key => $val) {
    	$request = $request->withAttribute($key, $val);
	}
	$response = call_user_func($route->handler, $request, new Response());
    http_response_code($response->getStatusCode());
    foreach ($response->getHeaders() as $header => $value) {
        header("{$header}: {$value[0]}");
    }
	echo $response->getBody();
} else {
    http_response_code(404);
	echo '404';
}
