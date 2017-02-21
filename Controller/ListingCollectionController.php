<?php
namespace Market\Controller;

use Market\Model\Listing;
use Market\Model\Category;
use Market\Hydrator\Listing as ListingHydrator;
use Market\Hydrator\Category as CategoryHydrator;
use PDO;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class ListingCollectionController
{
    /** @var PDO  */
    private $pdo;

    /**
     * ListingCollectionController constructor.
     * @param PDO $pdo
     */
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * @param RequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function __invoke(RequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $queryParams = $request->getQueryParams();
        $lat = (float) isset($queryParams['lat']) ? $queryParams['lat'] : 0;
        $lng = (float) isset($queryParams['lng']) ? $queryParams['lng'] : 0;
        $radius = (int) isset($queryParams['radius']) ? $queryParams['radius'] : 0 ;
        $from = isset($queryParams['from']) ? $queryParams['from'] : 0 ;
        $to = isset($queryParams['to']) ? $queryParams['to'] : 0 ;
        $category = isset($queryParams['category']) && !empty($queryParams['category']) ? $queryParams['category'] : null ;

        $statement = $this->createStatement($lat, $lng, $category);
        $statement->execute($category
            ? ['open' => $from, 'close' => $to, 'radius' => $radius, 'category' => $category]
            : ['open' => $from, 'close' => $to, 'radius' => $radius]
        );

        // $statement->execute(['open' => $from, 'close' => $to, 'radius' => $radius]);
        $listings = array_map(function ($listing) {
            return (new ListingHydrator())->hydrate($listing, new Listing());
        }, $statement->fetchAll(PDO::FETCH_ASSOC));

        $listings = array_map(function($item) {
            $statement = $this->pdo->prepare("select `category` from `category` where `listing_id` = :listing_id");
            $statement->execute(['listing_id' => $item->getListingId()]);
            $categories = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $item->setCategories(array_map(function($category) {
                return (new CategoryHydrator())->hydrate($category, new Category());
            }, $categories));
        }, $listings);

        $response = $response->withStatus(200)
            ->withHeader('Content-type', 'text/json');

        $response->getBody()->write(json_encode($listings));
        return $response;
    }

    private function createStatement($lat, $lng, $category = null)
    {
        if ($category) {
            return $this->pdo->prepare("
                SELECT L.`listing_id`, L.`name`, L.`open`, L.`close`, L.`lat`, L.`lng`, L.`url`, L.`content`, L.`avatar`,
                  round(
                    GLength(
                      LineStringFromWKB(
                        LineString(
                          `location`,
                          GeomFromText('POINT({$lat} {$lng})')
                        )
                      )
                    ) * 100
                  )
                  AS `distance`
                FROM `listing` L
                left join `category` C on (C.`listing_id` = L.`listing_id`)
                WHERE `open` > :open AND `close` < :close and `category` = :category
                having `distance` <= :radius
                ORDER BY `distance` ASC;
            ");
        } else {
            return $this->pdo->prepare("
                SELECT `listing_id`, `name`, `open`,`close`, `lat`, `lng`, `url`,`content`, `avatar`,
                  round(
                    GLength(
                      LineStringFromWKB(
                        LineString(
                          `location`,
                          GeomFromText('POINT({$lat} {$lng})')
                        )
                      )
                    ) * 100
                  )
                  AS `distance`
                FROM `listing`
                WHERE `open` > :open AND `close` < :close
                having `distance` <= :radius
                ORDER BY `distance` ASC;
            ");
        }
    }

}
