<?php
namespace Market\Controller;

use Market\Model\Category;
use Market\Hydrator\Category as CategoryHydrator;
use PDO;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class CategoryCollectionController
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
        $statement = $this->pdo->prepare("
            select distinct `category` from category order by `category`;
        ");
        $statement->execute();
        $listings = array_map(function ($listing) {
            return (new CategoryHydrator())->hydrate($listing, new Category());
        }, $statement->fetchAll(PDO::FETCH_ASSOC));

        $response = $response->withStatus(200)
            ->withHeader('Content-type', 'text/json');

        $response->getBody()->write(json_encode($listings));
        return $response;
    }
}
