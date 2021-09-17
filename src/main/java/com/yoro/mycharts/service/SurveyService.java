package com.yoro.mycharts.service;

import com.yoro.mycharts.domain.Survey;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Survey}.
 */
public interface SurveyService {
    /**
     * Save a survey.
     *
     * @param survey the entity to save.
     * @return the persisted entity.
     */
    Survey save(Survey survey);

    /**
     * Partially updates a survey.
     *
     * @param survey the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Survey> partialUpdate(Survey survey);

    /**
     * Get all the surveys.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Survey> findAll(Pageable pageable);

    /**
     * Get the "id" survey.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Survey> findOne(String id);

    /**
     * Delete the "id" survey.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
