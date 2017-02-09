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
            having `distance` <= {$radius}
            ORDER BY `distance` ASC;
    	");
        $statement->execute();
        $listings = array_map(function ($listing) {
            return (new ListingHydrator())->hydrate($listing, new Listing());
        }, $statement->fetchAll(PDO::FETCH_ASSOC));

        $response = $response->withStatus(200)
            ->withHeader('Content-type', 'text/json');

        $response->getBody()->write(json_encode($listings));
        return $response;
    }

}
