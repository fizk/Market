<?php
namespace Market\Controller;

use Market\Model\Listing;
use Market\Hydrator\Listing as ListingHydrator;
use PDO;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class ListingEntryController
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
        $id = (int) $request->getAttribute('id');

        $statement = $this->pdo->prepare("
			SELECT `listing_id`, `name`, `open`,`close`, `lat`, `lng`, `url`,`content`
            FROM `listing`
            WHERE `listing_id` = :listing_id
    	");
        $statement->execute(['listing_id' => $id]);
        $object = $statement->fetch(PDO::FETCH_ASSOC);

        $listing = $object
            ? (new ListingHydrator())->hydrate($object, new Listing())
            : null;

        $response = $response->withStatus($listing ? 200 : 404)
            ->withHeader('Content-type', 'text/json');

        $response->getBody()->write(json_encode($listing));
        return $response;
    }

}
