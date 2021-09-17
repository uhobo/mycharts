package com.yoro.mycharts.repository;

import com.yoro.mycharts.domain.Survey;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Survey entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SurveyRepository extends MongoRepository<Survey, String> {}
