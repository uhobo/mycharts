package com.yoro.mycharts.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.yoro.mycharts.IntegrationTest;
import com.yoro.mycharts.domain.Survey;
import com.yoro.mycharts.repository.SurveyRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link SurveyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SurveyResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/surveys";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private MockMvc restSurveyMockMvc;

    private Survey survey;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Survey createEntity() {
        Survey survey = new Survey().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION);
        return survey;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Survey createUpdatedEntity() {
        Survey survey = new Survey().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);
        return survey;
    }

    @BeforeEach
    public void initTest() {
        surveyRepository.deleteAll();
        survey = createEntity();
    }

    @Test
    void createSurvey() throws Exception {
        int databaseSizeBeforeCreate = surveyRepository.findAll().size();
        // Create the Survey
        restSurveyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey)))
            .andExpect(status().isCreated());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeCreate + 1);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testSurvey.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void createSurveyWithExistingId() throws Exception {
        // Create the Survey with an existing ID
        survey.setId("existing_id");

        int databaseSizeBeforeCreate = surveyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSurveyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey)))
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = surveyRepository.findAll().size();
        // set the field null
        survey.setTitle(null);

        // Create the Survey, which fails.

        restSurveyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey)))
            .andExpect(status().isBadRequest());

        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllSurveys() throws Exception {
        // Initialize the database
        surveyRepository.save(survey);

        // Get all the surveyList
        restSurveyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(survey.getId())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    void getSurvey() throws Exception {
        // Initialize the database
        surveyRepository.save(survey);

        // Get the survey
        restSurveyMockMvc
            .perform(get(ENTITY_API_URL_ID, survey.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(survey.getId()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    void getNonExistingSurvey() throws Exception {
        // Get the survey
        restSurveyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewSurvey() throws Exception {
        // Initialize the database
        surveyRepository.save(survey);

        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();

        // Update the survey
        Survey updatedSurvey = surveyRepository.findById(survey.getId()).get();
        updatedSurvey.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSurvey.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSurvey))
            )
            .andExpect(status().isOk());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSurvey.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void putNonExistingSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, survey.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSurveyWithPatch() throws Exception {
        // Initialize the database
        surveyRepository.save(survey);

        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();

        // Update the survey using partial update
        Survey partialUpdatedSurvey = new Survey();
        partialUpdatedSurvey.setId(survey.getId());

        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurvey))
            )
            .andExpect(status().isOk());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testSurvey.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void fullUpdateSurveyWithPatch() throws Exception {
        // Initialize the database
        surveyRepository.save(survey);

        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();

        // Update the survey using partial update
        Survey partialUpdatedSurvey = new Survey();
        partialUpdatedSurvey.setId(survey.getId());

        partialUpdatedSurvey.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurvey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurvey))
            )
            .andExpect(status().isOk());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSurvey.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void patchNonExistingSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, survey.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(survey)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSurvey() throws Exception {
        // Initialize the database
        surveyRepository.save(survey);

        int databaseSizeBeforeDelete = surveyRepository.findAll().size();

        // Delete the survey
        restSurveyMockMvc
            .perform(delete(ENTITY_API_URL_ID, survey.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
