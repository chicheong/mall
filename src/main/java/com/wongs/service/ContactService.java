package com.wongs.service;

import com.wongs.domain.Contact;
import com.wongs.repository.ContactRepository;
import com.wongs.repository.search.ContactSearchRepository;
import com.wongs.service.dto.ContactDTO;
import com.wongs.service.mapper.ContactMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Contact}.
 */
@Service
@Transactional
public class ContactService {

    private final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactRepository contactRepository;

    private final ContactMapper contactMapper;

    private final ContactSearchRepository contactSearchRepository;

    public ContactService(ContactRepository contactRepository, ContactMapper contactMapper, ContactSearchRepository contactSearchRepository) {
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
        this.contactSearchRepository = contactSearchRepository;
    }

    /**
     * Save a contact.
     *
     * @param contactDTO the entity to save.
     * @return the persisted entity.
     */
    public ContactDTO save(ContactDTO contactDTO) {
        log.debug("Request to save Contact : {}", contactDTO);
        Contact contact = contactMapper.toEntity(contactDTO);
        contact = contactRepository.save(contact);
        ContactDTO result = contactMapper.toDto(contact);
        contactSearchRepository.save(contact);
        return result;
    }

    /**
     * Get all the contacts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ContactDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Contacts");
        return contactRepository.findAll(pageable)
            .map(contactMapper::toDto);
    }

    /**
     * Get one contact by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ContactDTO> findOne(Long id) {
        log.debug("Request to get Contact : {}", id);
        return contactRepository.findById(id)
            .map(contactMapper::toDto);
    }

    /**
     * Delete the contact by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Contact : {}", id);
        contactRepository.deleteById(id);
        contactSearchRepository.deleteById(id);
    }

    /**
     * Search for the contact corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ContactDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Contacts for query {}", query);
        return contactSearchRepository.search(queryStringQuery(query), pageable)
            .map(contactMapper::toDto);
    }
}
