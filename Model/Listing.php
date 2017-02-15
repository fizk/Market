<?php
namespace Market\Model;

use JsonSerializable;
use DateTime;

class Listing implements JsonSerializable
{
    /** @var int */
    private $listing_id;

    /** @var string */
    private $name;

    /** @var DateTime */
    private $open;

    /** @var DateTime */
    private $close;

    /** @var float */
    private $lat;

    /** @var float */
    private $lng;

    /** @var string */
    private $url;

    /** @var string */
    private $content;

    /** @var int */
    private $distance;

    /** @var array */
    private $categories = [];

    /**
     * @return int
     */
    public function getListingId(): int
    {
        return $this->listing_id;
    }

    /**
     * @param int $listing_id
     * @return Listing
     */
    public function setListingId(int $listing_id)
    {
        $this->listing_id = $listing_id;
        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return Listing
     */
    public function setName(string $name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getOpen(): DateTime
    {
        return $this->open;
    }

    /**
     * @param DateTime $open
     * @return Listing
     */
    public function setOpen(DateTime $open)
    {
        $this->open = $open;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getClose(): DateTime
    {
        return $this->close;
    }

    /**
     * @param DateTime $close
     * @return Listing
     */
    public function setClose(DateTime $close)
    {
        $this->close = $close;
        return $this;
    }

    /**
     * @return float
     */
    public function getLat(): float
    {
        return $this->lat;
    }

    /**
     * @param float $lat
     * @return Listing
     */
    public function setLat(float $lat)
    {
        $this->lat = $lat;
        return $this;
    }

    /**
     * @return float
     */
    public function getLng(): float
    {
        return $this->lng;
    }

    /**
     * @param float $lng
     * @return Listing
     */
    public function setLng(float $lng)
    {
        $this->lng = $lng;
        return $this;
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @param string $url
     * @return Listing
     */
    public function setUrl(string $url)
    {
        $this->url = $url;
        return $this;
    }

    /**
     * @return string
     */
    public function getContent(): ?string
    {
        return $this->content;
    }

    /**
     * @param string $content
     * @return Listing
     */
    public function setContent(?string $content)
    {
        $this->content = $content;
        return $this;
    }

    /**
     * @return int
     */
    public function getDistance(): ?int
    {
        return $this->distance;
    }

    /**
     * @param int $distance
     * @return Listing
     */
    public function setDistance(?int $distance)
    {
        $this->distance = $distance;
        return $this;
    }

    public function setCategories(?array $categories)
    {
        if ($categories) {
            $this->categories = $categories;
        }
        return $this;
    }

    public function jsonSerialize()
    {
        return [
            'listing_id' => $this->listing_id,
            'name' => $this->name,
            'open' => $this->open->format('Y-m-d H:i:s'),
            'close' => $this->close->format('Y-m-d H:i:s'),
            'lat' => $this->lat,
            'lng' => $this->lng,
            'url' => $this->url,
            'content' => $this->content,
            'distance' => $this->distance,
            'categories' => $this->categories,
        ];
    }
}
