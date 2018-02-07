package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.Product;
import com.wongs.domain.ProductItem;
import com.wongs.domain.ProductStyle;
import com.wongs.domain.enumeration.ProductStyleType;
import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.ProductRepository;
import com.wongs.repository.ProductStyleRepository;
import com.wongs.repository.search.ProductItemSearchRepository;
import com.wongs.repository.search.ProductSearchRepository;
import com.wongs.repository.search.ProductStyleSearchRepository;
import com.wongs.service.dto.ProductDTO;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.dto.ProductStyleDTO;
import com.wongs.service.mapper.PriceMapper;
import com.wongs.service.mapper.ProductItemMapper;
import com.wongs.service.mapper.ProductMapper;
import com.wongs.service.mapper.ProductStyleMapper;
import com.wongs.service.mapper.QuantityMapper;

/**
 * Service Implementation for managing Product.
 */
@Service
@Transactional
public class ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;
    private final ProductStyleMapper productStyleMapper;
    private final ProductItemMapper productItemMapper;
    private final PriceMapper priceMapper;
    private final QuantityMapper quantityMapper;

    private final ProductSearchRepository productSearchRepository;
    
    private final ProductItemRepository productItemRepository;
    private final ProductItemSearchRepository productItemSearchRepository;
    
    private final ShopService shopService;
    
    private final ProductStyleRepository productStyleRepository;
    private final ProductStyleSearchRepository productStyleSearchRepository;

    public ProductService(ProductMapper productMapper, ProductStyleMapper productStyleMapper, ProductItemMapper productItemMapper,
    		PriceMapper priceMapper, QuantityMapper quantityMapper, ProductRepository productRepository, 
    		ProductSearchRepository productSearchRepository,
			ProductItemRepository productItemRepository, ProductItemSearchRepository productItemSearchRepository, ShopService shopService, 
			ProductStyleRepository productStyleRepository, ProductStyleSearchRepository productStyleSearchRepository) {
    	this.productMapper = productMapper;
    	this.productStyleMapper = productStyleMapper;
    	this.productItemMapper = productItemMapper;
    	this.priceMapper = priceMapper;
    	this.quantityMapper = quantityMapper;
    	this.productRepository = productRepository;
        this.productSearchRepository = productSearchRepository;
        this.productItemRepository = productItemRepository;
        this.productItemSearchRepository = productItemSearchRepository;
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
        Product product = productMapper.toEntity(productDTO);
        if (productDTO.getShopId() != null) {
        	product.setShop(shopService.getOne(productDTO.getShopId()));
        }
        product = productRepository.save(product);
        productSearchRepository.save(product);
        for (ProductStyleDTO productStyleDTO : productDTO.getColors()) {
        	ProductStyle productStyle = productStyleMapper.toEntity(productStyleDTO);
        	productStyle.setProduct(product);
        	productStyle = productStyleRepository.save(productStyle);
        	productStyleSearchRepository.save(productStyle);
        	productStyleDTO.setId(productStyle.getId());
        }
        for (ProductStyleDTO productStyleDTO : productDTO.getSizes()) {
        	ProductStyle productStyle = productStyleMapper.toEntity(productStyleDTO);
        	productStyle.setProduct(product);
        	productStyle = productStyleRepository.save(productStyle);
        	productStyleSearchRepository.save(productStyle);
        	productStyleDTO.setId(productStyle.getId());
        }
        for (ProductItemDTO productItemDTO : productDTO.getItems()) {
        	ProductItem productItem = productItemMapper.toEntity(productItemDTO);
        	productItem.setProduct(product);
        	productItem.setColor(productStyleRepository.findOne(productDTO.getColors().stream().filter(styleDTO -> {
        		if (productItemDTO.getColor().getId() != null) {
        			return styleDTO.getId().equals(productItemDTO.getColor().getId());
        		}else 
        			return styleDTO.getTempId().equals(productItemDTO.getColor().getTempId());
        	}).findFirst().get().getId()));
        	productItem.setSize(productStyleRepository.findOne(productDTO.getSizes().stream().filter(styleDTO -> {
        		if (productItemDTO.getSize().getId() != null) {
        			return styleDTO.getId().equals(productItemDTO.getSize().getId());
        		}else 
        			return styleDTO.getTempId().equals(productItemDTO.getSize().getTempId());
        	}).findFirst().get().getId()));
        	ProductItem nProductItem = productItemRepository.save(productItem);
        	productItemSearchRepository.save(productItem);
//        	if (productItem.getPrices() != null) {
//        		for (Price price : productItem.getPrices()) {
//        			price.setItem(nProductItem);
//        		}
//        	}
        }
        return findOneWithLists(product.getId());
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
            .map(productMapper::toDto);
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
        return productMapper.toDto(product);
    }

    
    /**
     *  Get one product by id with productItem.
     *
     *  @param id the id of the entity
     *  @return the entity with productItem
     */
    @Transactional(readOnly = true)
    public ProductDTO findOneWithLists(Long id) {
        log.debug("Request to get Product : {}", id);
        if (id == 0) { //TODO: remove this later
        	return productMapper.toDto(new Product());
        }else {
	        Product product = productRepository.findOne(id);
	        ProductDTO dto = productMapper.toDto(product);
	        product.getStyles().stream().filter(style -> ProductStyleType.COLOR.equals(style.getType())).forEach(style -> dto.getColors().add(productStyleMapper.toDto(style)));
	        product.getStyles().stream().filter(style -> ProductStyleType.SIZE.equals(style.getType())).forEach(style -> dto.getSizes().add(productStyleMapper.toDto(style)));
	        product.getItems().forEach(item -> {
	        	ProductItemDTO productItemDTO = productItemMapper.toDto(item);
	        	productItemDTO.setColor(productStyleMapper.toDto(item.getColor()));
	        	productItemDTO.setSize(productStyleMapper.toDto(item.getSize()));
	        	dto.getItems().add(productItemDTO);
	        });
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
        return result.map(productMapper::toDto);
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
        return productMapper.toDto(products);
    }
}
