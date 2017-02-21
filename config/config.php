<?php
/**
 * Created by PhpStorm.
 * User: einar.adalsteinsson
 * Date: 2/8/17
 * Time: 6:57 PM
 */

use Market\Controller\IndexController;
use Market\Controller\ListingCollectionController;
use Market\Controller\ListingEntryController;
use Market\Controller\CategoryCollectionController;

$dsn = isset($_ENV['DB_DSN']) ? $_ENV['DB_DSN'] : 'mysql:host=127.0.0.1;port=3306;dbname=market;charset=UTF8;';
$user = isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : 'root';
$password = isset($_ENV['DB_PASSWORD']) ? $_ENV['DB_PASSWORD'] : '';

$configs = [
    'db' => new PDO($dsn, $user, $password)
];

return [
    'controllers' => [
        IndexController::class => new IndexController(),
        ListingCollectionController::class => new ListingCollectionController($configs['db']),
        ListingEntryController::class => new ListingEntryController($configs['db']),
        CategoryCollectionController::class => new CategoryCollectionController($configs['db']),
    ]
];
