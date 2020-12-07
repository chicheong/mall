package com.wongs.service;

import com.wongs.domain.ProductItem;
import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.search.ProductItemSearchRepository;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.mapper.PriceMapper;
import com.wongs.service.mapper.ProductItemMapper;
import com.wongs.service.mapper.QuantityMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ProductItem}.
 */
@Service
@Transactional
public class ProductItemService {

    private final Logger log = LoggerFactory.getLogger(ProductItemService.class);

    private final ProductItemRepository productItemRepository;

    private final ProductItemMapper productItemMapper;
    private final PriceMapper priceMapper;
    private final QuantityMapper quantityMapper;

    private final ProductItemSearchRepository productItemSearchRepository;

    public ProductItemService(ProductItemRepository productItemRepository, ProductItemMapper productItemMapper, PriceMapper priceMapper, QuantityMapper quantityMapper, ProductItemSearchRepository productItemSearchRepository) {
        this.productItemRepository = productItemRepository;
        this.productItemMapper = productItemMapper;
        this.priceMapper = priceMapper;
        this.quantityMapper = quantityMapper;
        this.productItemSearchRepository = productItemSearchRepository;
    }

    /**
     * Save a productItem.
     *
     * @param productItemDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductItemDTO save(ProductItemDTO productItemDTO) {
        log.debug("Request to save ProductItem : {}", productItemDTO);
        ProductItem productItem = productItemMapper.toEntity(productItemDTO);
        productItem = productItemRepository.save(productItem);
        ProductItemDTO result = productItemMapper.toDto(productItem);
        productItemSearchRepository.save(productItem);
        return result;
    }

    /**
     * Get all the productItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ProductItems");
        return productItemRepository.findAll(pageable)
            .map(productItemMapper::toDto);
    }

    /**
     * Get one productItem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductItemDTO> findOne(Long id) {
        log.debug("Request to get ProductItem : {}", id);
		
        ProductItem productItem = productItemRepository.findOneWithEagerRelationships(id);
        ProductItemDTO productItemDTO = productItemMapper.toDto(productItem);
        productItemDTO.setPrices(priceMapper.toDto(productItem.getPrices()));
        productItemDTO.setQuantities(quantityMapper.toDto(productItem.getQuantities()));
		
        return Optional.ofNullable(productItemDTO);
    }

    /**
     * Delete the productItem by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ProductItem : {}", id);
        productItemRepository.deleteById(id);
        productItemSearchRepository.deleteById(id);
    }

    /**
     * Search for the productItem corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductItemDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ProductItems for query {}", query);
        return productItemSearchRepository.search(queryStringQuery(query), pageable)
            .map(productItemMapper::toDto);
    }
}
