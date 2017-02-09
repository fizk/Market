<?php
namespace Market\Controller;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class IndexController
{
    public function __invoke(RequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $response->withStatus(200)
            ->withHeader('Content-type', 'text/html')
            ->getBody()
            ->write(
                file_get_contents(__DIR__ . '/../view/index/index.html')
            );
        return $response;
    }
}
