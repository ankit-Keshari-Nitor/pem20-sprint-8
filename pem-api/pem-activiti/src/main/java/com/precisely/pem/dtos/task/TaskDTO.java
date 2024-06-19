package com.precisely.pem.dtos.task;

import org.activiti.api.task.model.Task;

import java.util.Map;

public abstract class TaskDTO implements Task {

    private Map<String, Object> variables;

    public Map<String, Object> getVariables() {
        return variables;
    }

    public void setVariables(Map<String, Object> variables) {
        this.variables = variables;
    }
}
