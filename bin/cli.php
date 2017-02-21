<?php
/**
 * Created by PhpStorm.
 * User: einar.adalsteinsson
 * Date: 1/2/17
 * Time: 4:49 PM
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Zend\Dom\Query;

function extractDate($string) {
    $result = [];
    preg_match('/([a-zA-Z]{3}) ([0-9]{1,2})([a-z]{1,3}) ([a-zA-Z]{3}) (from) (([0-9]{1,2})(\.[0-9]{0,2})?(am|pm)) (to) (([0-9]{1,2})(\.[0-9]{0,2})?(am|pm))/', $string, $result);
    return count($result) > 14 ? [
        $result[2],
        $result[4],
        $result[7],
        $result[9],
        $result[12],
        $result[14],
    ] : [1, 1, 0, 'am', 0, 'am'];
}

echo "[" . date('Y-m-d H:i:s') . "] ";

$dom = new Query(file_get_contents('http://www.mymarketsvic.com.au/directory/victorian-weekend-markets-calendar.php'));
$result = $dom->execute('#content > a');

$list = [];

foreach ($result as $item) {
    $list[] = [
        'url' => $item->getAttribute('href'),
        'value' => $item->nodeValue,
    ];
}

$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=market;charset=UTF8;','root','');

foreach ($list as $item) {
    $html = @file_get_contents($item['url']);
    if ($html === false) {
        continue;
    }
    $matches = [];
    preg_match('/(<strong>Next market is on<\/strong>)(.*)?(<BR\/>)/', $html, $matches);

    $latLngMatch = [];
    preg_match('/(position: new google.maps.LatLng\()(-?[0-9\.]*),(-?[0-9\.]*)\)/', $html, $latLngMatch);

    $idMatch = [];
    preg_match('/(id=)([0-9]*)/', $item['url'], $idMatch);

    $date = extractDate($matches[2]);

    $dom = new Query($html);
    $paragraphNodes = $dom->execute('p');
    $paragraphs = [];
    foreach ($paragraphNodes as $key => $value) {
        $paragraphs[] = addslashes($value->nodeValue);
    }

    $excludedCategories = ['PLEASE CHECK THE DATES', 'Market', 'No Longer Operating'];
    $categoriesElements = $dom->execute('#content a[href*="directory/category"]');
    $categories = [];
    foreach($categoriesElements as $c) {
        if (!in_array($c->nodeValue, $excludedCategories)) {
            $categories[] = $c->nodeValue;
        }
    }

    $element = [
        'id' => (int) $idMatch[2],
        'url' => $item['url'],
        'value' => $item['value'],
        'date' => date('Y-m-d', strtotime("{$date[0]} {$date[1]} " . date('Y'))),
        'time' => [
            date('H:i', strtotime("{$date[2]}{$date[3]}")),
            date('H:i', strtotime("{$date[4]}{$date[5]}")),
        ],
        'avatar' => @file_get_contents("http://www.mymarketsvic.com.au/directory/files/logo/{$idMatch[2]}.jpg") != false,
        'categories' => $categories,
        'content' => trim(implode("\n\n", $paragraphs)),
        'location' => count($latLngMatch) >3 ? [
            (float) $latLngMatch[2],
            (float) $latLngMatch[3]
        ] : [0,0],
    ];
    $statement = $pdo->prepare("
        insert into `listing`
            (`listing_id`,`name`,`open`,`close`,`location`,`lat`,`lng`,`url`,`content`, `avatar`) values
            (:listing_id, :name, :open, :close, GEOMFROMTEXT('Point({$element['location'][0]} {$element['location'][1]})'), :lat, :lng, :url, :content, :avatar)
            ON DUPLICATE KEY UPDATE `open` = :open, `close` = :close, `content` = :content, `avatar` = :avatar
    ");
    $statement->execute([
        'listing_id' => $element['id'],
        'name' => $element['value'],
        'open' => "{$element['date']} {$element['time'][0]}",
        'close' => "{$element['date']} {$element['time'][1]}",
        'lat' => $element['location'][0],
        'lng' => $element['location'][1],
        'url' => $element['url'],
        'content' => $element['content'],
        'avatar' => $element['avatar']
    ]);

    $emptyCategory = $pdo->prepare("delete from `category` where `listing_id` = :listing_id");
    $emptyCategory->execute(['listing_id' => $element['id']]);

    $fillCategory = $pdo->prepare("insert into `category` set `listing_id` = :listing_id, `category` = :category");
    foreach ($element['categories'] as $key => $value) {
        $fillCategory->execute(['listing_id' => $element['id'], 'category' => $value]);
    }
    echo '.';
}
