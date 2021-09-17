package com.yoro.mycharts.service.impl;

import com.yoro.mycharts.domain.Survey;
import com.yoro.mycharts.repository.SurveyRepository;
import com.yoro.mycharts.service.SurveyService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Survey}.
 */
@Service
public class SurveyServiceImpl implements SurveyService {

    private final Logger log = LoggerFactory.getLogger(SurveyServiceImpl.class);

    private final SurveyRepository surveyRepository;

    public SurveyServiceImpl(SurveyRepository surveyRepository) {
        this.surveyRepository = surveyRepository;
    }

    @Override
    public Survey save(Survey survey) {
        log.debug("Request to save Survey : {}", survey);
        return surveyRepository.save(survey);
    }

    @Override
    public Optional<Survey> partialUpdate(Survey survey) {
        log.debug("Request to partially update Survey : {}", survey);

        return surveyRepository
            .findById(survey.getId())
            .map(existingSurvey -> {
                if (survey.getTitle() != null) {
                    existingSurvey.setTitle(survey.getTitle());
                }
                if (survey.getDescription() != null) {
                    existingSurvey.setDescription(survey.getDescription());
                }

                return existingSurvey;
            })
            .map(surveyRepository::save);
    }

    @Override
    public Page<Survey> findAll(Pageable pageable) {
        log.debug("Request to get all Surveys");
        return surveyRepository.findAll(pageable);
    }

    @Override
    public Optional<Survey> findOne(String id) {
        log.debug("Request to get Survey : {}", id);
        return surveyRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Survey : {}", id);
        surveyRepository.deleteById(id);
    }
}
