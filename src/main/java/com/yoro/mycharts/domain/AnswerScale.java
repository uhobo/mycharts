package com.yoro.mycharts.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A AnswerScale.
 */
public class AnswerScale implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Field("score")
    private Integer score;

    @Field("description")
    private String description;


    // jhipster-needle-entity-add-field - JHipster will add fields here

   
    public Integer getScore() {
        return this.score;
    }

    public AnswerScale score(Integer score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getDescription() {
        return this.description;
    }

    public AnswerScale description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

   
  

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AnswerScale)) {
            return false;
        }
        return score != null && score.equals(((AnswerScale) o).score);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AnswerScale{" +
            ", score=" + getScore() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
