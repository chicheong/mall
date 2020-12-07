package com.wongs.service;

import com.wongs.domain.Card;
import com.wongs.repository.CardRepository;
import com.wongs.repository.search.CardSearchRepository;
import com.wongs.service.dto.CardDTO;
import com.wongs.service.mapper.CardMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Card}.
 */
@Service
@Transactional
public class CardService {

    private final Logger log = LoggerFactory.getLogger(CardService.class);

    private final CardRepository cardRepository;

    private final CardMapper cardMapper;

    private final CardSearchRepository cardSearchRepository;

    public CardService(CardRepository cardRepository, CardMapper cardMapper, CardSearchRepository cardSearchRepository) {
        this.cardRepository = cardRepository;
        this.cardMapper = cardMapper;
        this.cardSearchRepository = cardSearchRepository;
    }

    /**
     * Save a card.
     *
     * @param cardDTO the entity to save.
     * @return the persisted entity.
     */
    public CardDTO save(CardDTO cardDTO) {
        log.debug("Request to save Card : {}", cardDTO);
        Card card = cardMapper.toEntity(cardDTO);
        card = cardRepository.save(card);
        CardDTO result = cardMapper.toDto(card);
        cardSearchRepository.save(card);
        return result;
    }

    /**
     * Get all the cards.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CardDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Cards");
        return cardRepository.findAll(pageable)
            .map(cardMapper::toDto);
    }

    /**
     * Get one card by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CardDTO> findOne(Long id) {
        log.debug("Request to get Card : {}", id);
        return cardRepository.findById(id)
            .map(cardMapper::toDto);
    }

    /**
     * Delete the card by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Card : {}", id);
        cardRepository.deleteById(id);
        cardSearchRepository.deleteById(id);
    }

    /**
     * Search for the card corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CardDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Cards for query {}", query);
        return cardSearchRepository.search(queryStringQuery(query), pageable)
            .map(cardMapper::toDto);
    }
}
