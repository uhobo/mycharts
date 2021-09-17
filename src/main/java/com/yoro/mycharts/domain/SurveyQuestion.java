package com.yoro.mycharts.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A SurveyQuestion.
 */
public class SurveyQuestion implements Serializable {

    private static final long serialVersionUID = 1L;

    

    @NotNull
    @Field("question_id")
    private Integer questionId;

    @NotNull
    @Field("description")
    private String description;

   


    public Integer getQuestionId() {
        return this.questionId;
    }

    public SurveyQuestion questionId(Integer questionId) {
        this.setQuestionId(questionId);
        return this;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getDescription() {
        return this.description;
    }

    public SurveyQuestion description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

   


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SurveyQuestion)) {
            return false;
        }
        return questionId != null && questionId.equals(((SurveyQuestion) o).questionId);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SurveyQuestion{" +
            ", questionId=" + getQuestionId() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
