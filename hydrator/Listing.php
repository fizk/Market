<?php
namespace Market\Hydrator;

/**
 * Created by PhpStorm.
 * User: einar.adalsteinsson
 * Date: 2/8/17
 * Time: 3:43 PM
 */
class Listing
{
    public function hydrate($data, $object)
    {
        return $object
            ->setListingId($data['listing_id'])
            ->setName($data['name'])
            ->setOpen(new \DateTime($data['open']))
            ->setClose(new \DateTime($data['close']))
            ->setLat($data['lat'])
            ->setLng($data['lng'])
            ->setUrl($data['url'])
            ->setContent($data['content'])
            ->setDistance(isset($data['distance']) ? $data['distance'] : null);
    }
}
