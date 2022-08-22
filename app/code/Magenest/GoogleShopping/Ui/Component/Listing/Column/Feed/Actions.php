<?php
namespace Magenest\GoogleShopping\Ui\Component\Listing\Column\Feed;

use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Ui\Component\Listing\Columns\Column;

/**
 * Class Actions
 * @package Magenest\GoogleShopping\Ui\Component\Listing\Column\Feed
 */
class Actions extends Column
{
    /** @var UrlInterface  */
    protected $urlBuilder;

    /**
     * Actions constructor.
     * @param UrlInterface $urlBuilder
     * @param ContextInterface $context
     * @param UiComponentFactory $uiComponentFactory
     * @param array $components
     * @param array $data
     */
    public function __construct(
        UrlInterface $urlBuilder,
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        array $components = [],
        array $data = []
    ) {
        $this->urlBuilder = $urlBuilder;
        parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    /**
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as & $item) {
                if (isset($item['id'])) {
                    $item[$this->getData('name')] = [
                        'edit' => [
                            'href' => $this->urlBuilder->getUrl(
                                'googleshopping/feed/edit',
                                [
                                    'id' => $item['id']
                                ]
                            ),
                            'label' => __('Edit')
                        ],
                        'duplicate' => [
                            'href' => $this->urlBuilder->getUrl(
                                'googleshopping/feed/duplicate',
                                [
                                    'id' => $item['id']
                                ]
                            ),
                            'label' => __('Duplicate')
                        ],
                        'sync' => [
                            'href' => $this->urlBuilder->getUrl(
                                'googleshopping/feed/sync',
                                [
                                    'id' => $item['id']
                                ]
                            ),
                            'label' => __('Sync products')
                        ],
                        'delete' => [
                            'href' => $this->urlBuilder->getUrl(
                                'googleshopping/feed/delete',
                                [
                                    'id' => $item['id']
                                ]
                            ),
                            'label' => __('Delete'),
                            'confirm' => [
                                'title' => __('Delete Feed'),
                                'message' => __('Are you sure you want to delete ?')
                            ]
                        ]
                    ];
                }
            }
        }
        return $dataSource;
    }
}
