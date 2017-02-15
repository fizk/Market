<?php
namespace Market\Controller;

use Market\Model\Listing;
use Market\Hydrator\Listing as ListingHydrator;
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

        $statement = $this->pdo->prepare("
			SELECT `listing_id`, `name`, `open`,`close`, `lat`, `lng`, `url`,`content`,
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
            having `distance` <= {$radius}
            ORDER BY `distance` ASC;
    	");
        $statement->execute(['open' => $from, 'close' => $to]);
        $listings = array_map(function ($listing) {
            return (new ListingHydrator())->hydrate($listing, new Listing());
        }, $statement->fetchAll(PDO::FETCH_ASSOC));

        $listings = array_map(function($item) {
          $statement = $this->pdo->prepare("select `category` from `category` where `listing_id` = :listing_id");
          $statement->execute(['listing_id' => $item->getListingId()]);
          $categories = $statement->fetchAll(PDO::FETCH_ASSOC);
          return $item->setCategories(array_map(function($c) { return $c['category'];}, $categories));
        }, $listings);

        $response = $response->withStatus(200)
            ->withHeader('Content-type', 'text/json');

        $response->getBody()->write(json_encode($listings));
        return $response;
    }

}
