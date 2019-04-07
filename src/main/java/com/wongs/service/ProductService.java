package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.io.Files;
import com.wongs.domain.Price;
import com.wongs.domain.Product;
import com.wongs.domain.ProductItem;
import com.wongs.domain.ProductStyle;
import com.wongs.domain.Quantity;
import com.wongs.domain.Url;
import com.wongs.domain.User;
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
import com.wongs.security.SecurityUtils;
import com.wongs.service.dto.ProductDTO;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.dto.ProductStyleDTO;
import com.wongs.service.dto.UrlDTO;
import com.wongs.service.mapper.PriceMapper;
import com.wongs.service.mapper.ProductItemMapper;
import com.wongs.service.mapper.ProductMapper;
import com.wongs.service.mapper.ProductStyleMapper;
import com.wongs.service.mapper.QuantityMapper;
import com.wongs.service.mapper.UrlMapper;
import com.wongs.service.util.FileUtil;
import com.wongs.service.util.FileUtil.FILETYPE;

/**
 * Service Implementation for managing Product.
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

    public ProductService(ProductMapper productMapper, ProductStyleMapper productStyleMapper, ProductItemMapper productItemMapper,
    		PriceMapper priceMapper, QuantityMapper quantityMapper, UrlMapper urlMapper,
    		ProductRepository productRepository, 
    		ProductSearchRepository productSearchRepository,
			ProductItemRepository productItemRepository, ProductItemSearchRepository productItemSearchRepository,
			ProductStyleRepository productStyleRepository, ProductStyleSearchRepository productStyleSearchRepository, 
			PriceRepository priceRepository, PriceSearchRepository priceSearchRepository, 
			QuantityRepository quantityRepository, QuantitySearchRepository quantitySearchRepository,
			ShopService shopService, UrlService urlService) {
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
    }

    /**
     * Save a product.
     *
     * @param productDTO the entity to save
     * @return the persisted entity
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
        	productItemIds.add(nProductItem.getId());
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
        for (UrlDTO urlDTO : productDTO.getUrls()) {
        	if (urlDTO.getId() == null) {
            	try {
    	        	urlDTO.setEntityId(product.getId());
    	        	urlDTO.setPath(FileUtil.saveAndGetFilePath(FILETYPE.IMAGE, urlDTO.getFileName(), urlDTO.getPath()));
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
        oProductItems.stream().filter(item -> !productItemIds.contains(item.getId())).forEach(item -> productItemRepository.delete(item));
        oProductStyles.stream().filter(style -> !productStyleIds.contains(style.getId())).forEach(style -> productStyleRepository.delete(style));
        oUrls.stream().filter(url -> !urlIds.contains(url.getId())).forEach(url -> urlService.delete(url.getId()));
//        return productMapper.toDto(product);
//        return this.findOneWithLists(product.getId());
        return productDTO;
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
	        Product product = productRepository.findOneWithEagerRelationships(id);
	        ProductDTO dto = productMapper.toDto(product);
	        product.getStyles().stream().filter(style -> ProductStyleType.COLOR.equals(style.getType())).forEach(style -> dto.getColors().add(productStyleMapper.toDto(style)));
	        product.getStyles().stream().filter(style -> ProductStyleType.SIZE.equals(style.getType())).forEach(style -> dto.getSizes().add(productStyleMapper.toDto(style)));
	        product.getItems().forEach(item -> {
	        	ProductItemDTO productItemDTO = productItemMapper.toDto(item);
	        	productItemDTO.setColor(productStyleMapper.toDto(item.getColor()));
	        	productItemDTO.setSize(productStyleMapper.toDto(item.getSize()));
	        	dto.getItems().add(productItemDTO);
	        });
	        Set<Url> urls = urlService.findByEntityTypeAndEntityId(Product.class.getSimpleName(), id);
	        urls.forEach(url -> dto.getUrls().add(urlMapper.toDto(url)));
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
    
    
    /**
     * @param id
     * @return list of in-charge users
     */
    public Set<User> getUsersInCharge(Product product) {
    	Set<User> usersInCharge = shopService.getUsersInCharge(product.getShop().getId());
    	
    	String permission = "";
    	SecurityUtils.getCurrentUserLogin().ifPresent((login) -> {
    		
    		usersInCharge.forEach((user) -> {
    			if(user.getLogin().equalsIgnoreCase(login))
    				permission = 

    		});
    	});
    	return usersInCharge;
    }
}
