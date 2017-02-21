<?php
namespace Market\Hydrator;

/**
 * Created by PhpStorm.
 * User: einar.adalsteinsson
 * Date: 2/8/17
 * Time: 3:43 PM
 */
class Category
{
    public function hydrate($data, $object)
    {
        return $object
            ->setCategory($data['category']);
    }
}
