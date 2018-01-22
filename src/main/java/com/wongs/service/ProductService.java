package com.wongs.service;

import com.wongs.domain.Price;
import com.wongs.domain.Product;
import com.wongs.domain.ProductItem;
import com.wongs.domain.ProductStyle;
import com.wongs.repository.ProductRepository;
import com.wongs.repository.ProductStyleRepository;
import com.wongs.repository.PriceRepository;
import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.search.ProductSearchRepository;
import com.wongs.repository.search.ProductStyleSearchRepository;
import com.wongs.service.dto.ProductDTO;
import com.wongs.service.mapper.ProductMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

import java.util.List;
import java.util.Set;

/**
 * Service Implementation for managing Product.
 */
@Service
@Transactional
public class ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    private final ProductSearchRepository productSearchRepository;
    
    private final ProductItemRepository productItemRepository;
    
    private final ShopService shopService;
    
    private final ProductStyleRepository productStyleRepository;
    private final ProductStyleSearchRepository productStyleSearchRepository;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper, ProductSearchRepository productSearchRepository,
			ProductItemRepository productItemRepository, ShopService shopService, 
			ProductStyleRepository productStyleRepository, ProductStyleSearchRepository productStyleSearchRepository) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.productSearchRepository = productSearchRepository;
        this.productItemRepository = productItemRepository;
        this.shopService = shopService;
        this.productStyleRepository = productStyleRepository;
        this.productStyleSearchRepository = productStyleSearchRepository;
    }

    /**
     * Save a product.
     *
     * @param productDTO the entity to save
     * @return the persisted entity
     */
    public ProductDTO save(ProductDTO productDTO) {
        log.debug("Request to save Product : {}", productDTO);
        Product product = productMapper.productDTOToProduct(productDTO);
        if (productDTO.getShopId() != null) {
        	product.setShop(shopService.getOne(productDTO.getShopId()));
        }
        product = productRepository.save(product);
        productSearchRepository.save(product);
        for (ProductStyle productStyle : product.getStyles()) {
        	productStyle.setProduct(product);
        	productStyleRepository.save(productStyle);
        	productStyleSearchRepository.save(productStyle);
        }
        for (ProductItem productItem : product.getItems()) {
        	productItem.setProduct(product);
        	ProductItem nProductItem = productItemRepository.save(productItem);
        	if (productItem.getPrices() != null) {
        		for (Price price : productItem.getPrices()) {
        			price.setItem(nProductItem);
        		}
        	}
        }
        ProductDTO result = productMapper.productToProductDTO(product);
        return result;
    }

    /**
     * Get all the products.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Products");
        return productRepository.findAll(pageable)
            .map(productMapper::productToProductDTO);
    }

    /**
     * Get one product by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public ProductDTO findOne(Long id) {
        log.debug("Request to get Product : {}", id);
        Product product = productRepository.findOne(id);
        return productMapper.productToProductDTO(product);
    }

    
    /**
     *  Get one product by id with productItem.
     *
     *  @param id the id of the entity
     *  @return the entity with productItem
     */
    @Transactional(readOnly = true)
    public ProductDTO findOneWithItems(Long id) {
        log.debug("Request to get Product : {}", id);
        if (id == 0) { //TODO: remove this later
        	return productMapper.productToProductDTO(new Product());
        }else {
	        Product product = productRepository.findOne(id);
	        ProductDTO dto = productMapper.productToProductDTO(product);
	        return dto;
        }
    }
    
    
    /**
     * Delete the product by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Product : {}", id);
        productRepository.delete(id);
        productSearchRepository.delete(id);
    }

    /**
     * Search for the product corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Products for query {}", query);
        Page<Product> result = productSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(productMapper::productToProductDTO);
    }
    
    /**
     * Get products by shop id.
     *
     * @param id the id of the Shop
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Set<ProductDTO> findByShopId(Long id) {
        log.debug("Request to get Products By Shop Id : {}", id);
        Set<Product> products = productRepository.findByShopId(id);
        return productMapper.productsToProductDTOs(products);
    }
}
