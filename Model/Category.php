<?php
namespace Market\Model;

use JsonSerializable;
use DateTime;

class Category implements JsonSerializable
{
    /** @var string */
    private $category;

    /**
     * @param int $distance
     * @return Listing
     */
    public function setCategory(string $category)
    {
        $this->category = $category;
        return $this;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function jsonSerialize()
    {
        return [
            'category' => $this->category,
        ];
    }
}
