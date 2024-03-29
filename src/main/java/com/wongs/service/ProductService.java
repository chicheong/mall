package com.wongs.service;

import com.wongs.domain.Product;
import com.wongs.repository.ProductRepository;
import com.wongs.repository.search.ProductSearchRepository;
import com.wongs.service.dto.PriceDTO;
import com.wongs.service.dto.ProductDTO;
import com.wongs.service.mapper.ProductMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.*;
import com.wongs.domain.Price;
import com.wongs.domain.ProductItem;
import com.wongs.domain.ProductStyle;
import com.wongs.domain.Quantity;
import com.wongs.domain.Url;
import com.wongs.domain.enumeration.ProductStyleType;
import com.wongs.repository.PriceRepository;
import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.ProductRepository;
import com.wongs.repository.ProductStyleRepository;
import com.wongs.repository.QuantityRepository;
import com.wongs.repository.search.PriceSearchRepository;
import com.wongs.repository.search.ProductItemSearchRepository;
import com.wongs.repository.search.ProductSearchRepository;
import com.wongs.repository.search.ProductStyleSearchRepository;
import com.wongs.repository.search.QuantitySearchRepository;
import com.wongs.service.FileService.CATEGORY;
import com.wongs.service.FileService.TYPE;
import com.wongs.service.dto.ProductDTO;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.dto.ProductStyleDTO;
import com.wongs.service.dto.QuantityDTO;
import com.wongs.service.dto.UrlDTO;
import com.wongs.service.mapper.PriceMapper;
import com.wongs.service.mapper.ProductItemMapper;
import com.wongs.service.mapper.ProductMapper;
import com.wongs.service.mapper.ProductStyleMapper;
import com.wongs.service.mapper.QuantityMapper;
import com.wongs.service.mapper.UrlMapper;

/**
 * Service Implementation for managing {@link Product}.
 */
@Service
@Transactional
public class ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductMapper productMapper;
    private final ProductStyleMapper productStyleMapper;
    private final ProductItemMapper productItemMapper;
    private final PriceMapper priceMapper;
    private final QuantityMapper quantityMapper;
    private final UrlMapper urlMapper;

    private final ProductRepository productRepository;
    private final ProductSearchRepository productSearchRepository;
    
    private final ProductItemRepository productItemRepository;
    private final ProductItemSearchRepository productItemSearchRepository;
    
    private final ProductStyleRepository productStyleRepository;
    private final ProductStyleSearchRepository productStyleSearchRepository;
    
    private final PriceRepository priceRepository;
    private final PriceSearchRepository priceSearchRepository;
    private final QuantityRepository quantityRepository;
    private final QuantitySearchRepository quantitySearchRepository;
    
    private final ShopService shopService;
    private final UrlService urlService;
    
    private final FileService fileService;

    public ProductService(ProductMapper productMapper, ProductStyleMapper productStyleMapper, ProductItemMapper productItemMapper,
    		PriceMapper priceMapper, QuantityMapper quantityMapper, UrlMapper urlMapper,
    		ProductRepository productRepository, 
    		ProductSearchRepository productSearchRepository,
			ProductItemRepository productItemRepository, ProductItemSearchRepository productItemSearchRepository,
			ProductStyleRepository productStyleRepository, ProductStyleSearchRepository productStyleSearchRepository, 
			PriceRepository priceRepository, PriceSearchRepository priceSearchRepository, 
			QuantityRepository quantityRepository, QuantitySearchRepository quantitySearchRepository,
			ShopService shopService, UrlService urlService,
			FileService fileService) {
    	this.productMapper = productMapper;
    	this.productStyleMapper = productStyleMapper;
    	this.productItemMapper = productItemMapper;
    	this.priceMapper = priceMapper;
    	this.quantityMapper = quantityMapper;
    	this.urlMapper = urlMapper;
    	this.productRepository = productRepository;
        this.productSearchRepository = productSearchRepository;
        this.productItemRepository = productItemRepository;
        this.productItemSearchRepository = productItemSearchRepository;
        this.shopService = shopService;
        this.productStyleRepository = productStyleRepository;
        this.productStyleSearchRepository = productStyleSearchRepository;
        this.priceRepository = priceRepository;
        this.priceSearchRepository = priceSearchRepository;
        this.quantityRepository = quantityRepository;
        this.quantitySearchRepository = quantitySearchRepository;
        this.urlService = urlService;
        this.fileService = fileService;
    }

    /**
     * Save a product.
     *
     * @param productDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductDTO save(ProductDTO productDTO) {
        log.debug("Request to save Product : {}", productDTO);
        Product oProduct = productDTO.getId() == null? new Product():productRepository.findOneWithEagerRelationships(productDTO.getId());
        //get Original item and style lists for delete
        List<ProductItem> oProductItems = new ArrayList<ProductItem>();
        List<Url> oUrls = new ArrayList<Url>();
        List<ProductStyle> oProductStyles = new ArrayList<ProductStyle>();
        oProduct.getStyles().forEach(style -> oProductStyles.add(style));
        oProduct.getItems().forEach(item -> {
        	ProductItem productItem = item;
        	item.getPrices().forEach(price -> productItem.getPrices().add(price));
        	item.getQuantities().forEach(quantity -> productItem.getQuantities().add(quantity));
        	oProductItems.add(productItem);
        });
        if (productDTO.getId() != null) {
        	Set<Url> urls = urlService.findByEntityTypeAndEntityId(Product.class.getSimpleName(), productDTO.getId());
        	oUrls.addAll(urls);
        }
        
        Product product = productMapper.toEntity(productDTO);
        if (productDTO.getShopId() != null) {
        	product.setShop(shopService.getOne(productDTO.getShopId()));
        }
        product = productRepository.save(product);
        productSearchRepository.save(product);
        //record indexes of new items
        List<Long> productStyleIds = new ArrayList<Long>();
        List<Long> productItemIds = new ArrayList<Long>();
        List<Long> urlIds = new ArrayList<Long>();
        for (ProductStyleDTO productStyleDTO : productDTO.getColors()) {
        	final ProductStyle productStyle = productStyleMapper.toEntity(productStyleDTO);
        	//Check object changed
        	if (oProductStyles.stream().filter(style -> style.equals(productStyle)).findAny().isPresent()) {
            	productStyleDTO.setId(productStyle.getId());
            	productStyleIds.add(productStyle.getId());
        	} else {
            	productStyle.setProduct(product);
            	ProductStyle nProductStyle = productStyleRepository.save(productStyle);
            	productStyleSearchRepository.save(productStyle);
            	productStyleDTO.setId(nProductStyle.getId());
            	productStyleIds.add(nProductStyle.getId());
        	}
        }
        for (ProductStyleDTO productStyleDTO : productDTO.getSizes()) {
        	final ProductStyle productStyle = productStyleMapper.toEntity(productStyleDTO);
        	//Check object changed
        	if (oProductStyles.stream().filter(style -> style.equals(productStyle)).findAny().isPresent()) {
            	productStyleDTO.setId(productStyle.getId());
            	productStyleIds.add(productStyle.getId());
        	} else {
            	productStyle.setProduct(product);
            	ProductStyle nProductStyle = productStyleRepository.save(productStyle);
            	productStyleSearchRepository.save(productStyle);
            	productStyleDTO.setId(nProductStyle.getId());
            	productStyleIds.add(nProductStyle.getId());
        	}
        }
        for (ProductItemDTO productItemDTO : productDTO.getItems()) {
        	ProductItem oProductItem = productItemDTO.getId() == null? new ProductItem():oProductItems.stream().filter(item -> item.getId().equals(productItemDTO.getId())).findFirst().get();
        	
        	List<Price> prices = new ArrayList<Price>();
        	List<Quantity> quantities = new ArrayList<Quantity>();
        	oProductItem.getPrices().stream().forEach(price -> prices.add(price));
        	oProductItem.getQuantities().stream().forEach(quantity -> quantities.add(quantity));

        	log.error("Sizesssss: " + prices.size() + " " + quantities.size());
        	ProductItem productItem = productItemMapper.toEntity(productItemDTO);
        	productItem.setProduct(product);
        	productItem.setColor(productDTO.getColors().size() == 0 ? null : productStyleRepository.findById(productDTO.getColors().stream().filter(styleDTO -> {
        		if (productItemDTO.getColor().getId() != null) {
        			return styleDTO.getId().equals(productItemDTO.getColor().getId());
        		}else 
        			return styleDTO.getTempId().equals(productItemDTO.getColor().getTempId());
        	}).findFirst().get().getId()).orElse(null));
        	productItem.setSize(productDTO.getSizes().size() == 0 ? null : productStyleRepository.findById(productDTO.getSizes().stream().filter(styleDTO -> {
        		if (productItemDTO.getSize().getId() != null) {
        			return styleDTO.getId().equals(productItemDTO.getSize().getId());
        		}else 
        			return styleDTO.getTempId().equals(productItemDTO.getSize().getTempId());
        	}).findFirst().get().getId()).orElse(null));
        	ProductItem nProductItem = productItemRepository.save(productItem);
        	productItemSearchRepository.save(productItem);
        	productItemIds.add(nProductItem.getId());
        	if (productItemDTO.isDirtyUrl()) {
        		UrlDTO urlDTO = productItemDTO.getUrl();
            	try {
    	        	urlDTO.setEntityId(nProductItem.getId());
    	        	urlDTO.setPath(fileService.saveAndGetFilePath(TYPE.IMAGE, CATEGORY.PRODUCT_ITEM, product.getId(), nProductItem.getId(), urlDTO.getFileName(), urlDTO.getPath()));
    	        	if (urlDTO.getId() == null) {
    		        	urlDTO.setCreatedBy(product.getCreatedBy());
    		        	urlDTO.setCreatedDate(product.getCreatedDate());
    	        	}
    	        	urlDTO.setLastModifiedBy(product.getLastModifiedBy());
    	        	urlDTO.setLastModifiedDate(product.getLastModifiedDate());
    	        	urlDTO = urlService.save(urlDTO);
    			} catch (IOException e) {
    				log.error(e.toString());
    			}
        	}
        	if (productItemDTO.isDirtyPrices()) {
        		List<Long> priceIds = new ArrayList<Long>();
	        	productItemDTO.getPrices().forEach(priceDTO -> {
	        		Price price = priceMapper.toEntity(priceDTO);
	        		price.setItem(nProductItem);
	        		price = priceRepository.save(price);
	            	priceSearchRepository.save(price);
	            	priceIds.add(price.getId());
	        	});
	        	prices.stream().filter(price -> !priceIds.contains(price.getId())).forEach(price -> priceRepository.delete(price));
        	}
        	if (productItemDTO.isDirtyQuantities()) {
        		List<Long> quantityIds = new ArrayList<Long>();
	        	productItemDTO.getQuantities().forEach(quantityDTO -> {
	        		Quantity quantity = quantityMapper.toEntity(quantityDTO);
	        		quantity.setItem(nProductItem);
	        		quantity = quantityRepository.save(quantity);
	        		quantitySearchRepository.save(quantity);
	        		quantityIds.add(quantity.getId());
	        	});
	        	quantities.stream().filter(quantity -> !quantityIds.contains(quantity.getId())).forEach(quantity -> quantityRepository.delete(quantity));
        	}
        }
        if (productDTO.getUrls() != null)
	        for (UrlDTO urlDTO : productDTO.getUrls()) {
	        	if (urlDTO.getId() == null) {
	            	try {
	    	        	urlDTO.setEntityId(product.getId());
	    	        	urlDTO.setPath(fileService.saveAndGetFilePath(TYPE.IMAGE, CATEGORY.PRODUCT, product.getId(), urlDTO.getFileName(), urlDTO.getPath()));
	    	        	urlDTO.setCreatedBy(product.getCreatedBy());
	    	        	urlDTO.setCreatedDate(product.getCreatedDate());
	    	        	urlDTO.setLastModifiedBy(product.getLastModifiedBy());
	    	        	urlDTO.setLastModifiedDate(product.getLastModifiedDate());
	    	        	urlDTO = urlService.save(urlDTO);
	    	        	urlIds.add(urlDTO.getId());
	    			} catch (IOException e) {
	    				log.error(e.toString());
	    			}
	        	} else {
	        		Url nUrl = urlMapper.toEntity(urlDTO);
	            	//Check object changed
	            	if (oUrls.stream().filter(url -> url.equals(nUrl)).findAny().isPresent()) {
	                	urlIds.add(nUrl.getId());
	            	} else {
	    	        	urlDTO.setCreatedBy(product.getCreatedBy());
	    	        	urlDTO.setCreatedDate(product.getCreatedDate());
	    	        	urlDTO.setLastModifiedBy(product.getLastModifiedBy());
	    	        	urlDTO.setLastModifiedDate(product.getLastModifiedDate());
	    	        	urlDTO = urlService.save(urlDTO);
	                	urlIds.add(urlDTO.getId());
	            	}
	        	}
	        }
        //delete items not in update list
        oProductItems.stream().filter(item -> !productItemIds.contains(item.getId())).forEach(item -> productItemRepository.delete(item)); //Cascade delete prices and quantities?
        oProductStyles.stream().filter(style -> !productStyleIds.contains(style.getId())).forEach(style -> productStyleRepository.delete(style)); //Cascade delete item, prices and quantities?
        oUrls.stream().filter(url -> !urlIds.contains(url.getId())).forEach(url -> urlService.delete(url.getId()));
//        return productMapper.toDto(product);
//        return this.findOneWithLists(product.getId());
        return productMapper.toDto(product);
    }

    /**
     * Get all the products.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Products");
        return productRepository.findAll(pageable)
            .map((product) -> {
            	return findOneWithLists(product.getId());
            });
    }

    /**
     * Get one product by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductDTO> findOne(Long id) {
        log.debug("Request to get Product : {}", id);
        return productRepository.findById(id)
            .map(productMapper::toDto);
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
	        Product product = productRepository.findOneWithEagerRelationships(id);
	        ProductDTO dto = productMapper.toDto(product);
	        product.getStyles().stream().filter(style -> ProductStyleType.COLOR.equals(style.getType())).forEach(style -> dto.getColors().add(productStyleMapper.toDto(style)));
	        product.getStyles().stream().filter(style -> ProductStyleType.SIZE.equals(style.getType())).forEach(style -> dto.getSizes().add(productStyleMapper.toDto(style)));
	        product.getItems().forEach(item -> {
	        	ProductItemDTO productItemDTO = productItemMapper.toDto(item);
	        	productItemDTO.setColor(productStyleMapper.toDto(item.getColor()));
	        	productItemDTO.setSize(productStyleMapper.toDto(item.getSize()));
	        	productItemDTO.setUrl(urlMapper.toDto(urlService.findOneByEntityTypeAndEntityId(ProductItem.class.getSimpleName(), productItemDTO.getId())));
	        	item.getPrices().forEach(price -> {
	        		PriceDTO priceDTO = priceMapper.toDto(price);
	        		productItemDTO.getPrices().add(priceDTO);
	        	});
	        	item.getQuantities().forEach(quantity -> {
	        		QuantityDTO quantityDTO = quantityMapper.toDto(quantity);
	        		productItemDTO.getQuantities().add(quantityDTO);
	        	});
	        	dto.getItems().add(productItemDTO);
	        });
	        Set<Url> urls = urlService.findByEntityTypeAndEntityId(Product.class.getSimpleName(), id);
	        urls.forEach(url -> dto.getUrls().add(urlMapper.toDto(url)));
	        dto.setPermission(this.getPermission(dto));
	        return dto;
        }
    }

    /**
     * Delete the product by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Product : {}", id);
        productRepository.deleteById(id);
        productSearchRepository.deleteById(id);
    }

    /**
     * Search for the product corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Products for query {}", query);
        return productSearchRepository.search(queryStringQuery(query), pageable)
            .map(productMapper::toDto);
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
    
    /**
     * product rights are determined by shop in-charge
     * 
     * @param product
     * @return permission code
     */
    public String getPermission(ProductDTO product) {
    	return shopService.getPermission(product.getShopId());
    }
    
    /**
     * product rights are determined by shop in-charge
     * 
     * @param product
     * @return permission code
     */
    public String getPermission(Long productId) {
    	return this.getPermission(this.findOne(productId).orElse(null));
    }
}
