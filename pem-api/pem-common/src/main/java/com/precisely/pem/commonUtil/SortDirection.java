package com.precisely.pem.commonUtil;

public enum SortDirection {
    ASC ("ASC"), DESC ("DESC");

    private String sort_direction;
    SortDirection(String asc) {
        this.sort_direction = sort_direction;
    }

    public String getSort_direction() {
        return sort_direction;
    }

    public void setSort_direction(String sort_direction) {
        this.sort_direction = sort_direction;
    }
}
