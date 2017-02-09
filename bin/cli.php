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

$dom = new Query(file_get_contents('http://www.mymarketsvic.com.au/directory/victorian-weekend-markets-calendar.php'));
$result = $dom->execute('#content > a');

$list = [];

foreach ($result as $item) {
    $list[] = [
        'url' => $item->getAttribute('href'),
        'value' => $item->nodeValue,
    ];
}

$result = [];

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

    $element = [
        'id' => (int) $idMatch[2],
        'url' => $item['url'],
        'value' => $item['value'],
        'date' => date('Y-m-d', strtotime("{$date[0]} {$date[1]} " . date('Y'))),
        'time' => [
            date('H:i', strtotime("{$date[2]}{$date[3]}")),
            date('H:i', strtotime("{$date[4]}{$date[5]}")),
        ],
        'content' => implode("\n\n", $paragraphs),
        'location' => count($latLngMatch) >3 ? [
            (float) $latLngMatch[2],
            (float) $latLngMatch[3]
        ] : [0,0],
    ];
    echo '.';
    // print_r($element);

    $result[$element['id']] = $element;
}
file_put_contents('./market.json', json_encode($result));


$inserts = array_map(function($item) {
    return "({$item['id']}, \"{$item['value']}\", '{$item['date']} {$item['time'][0]}', '{$item['date']} {$item['time'][1]}', GEOMFROMTEXT('Point({$item['location'][0]} {$item['location'][1]})'), {$item['location'][0]}, {$item['location'][1]}, '{$item['url']}', '{$item['content']}' )";
}, $result);

file_put_contents(
    './market.sql',
    "insert into `listing` (`listing_id`, `name`, `open`, `close`, `location`, `lat`, `lng`, `url`, `content`) values " . implode(",\n", $inserts) . ";"
);
