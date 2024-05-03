package com.precisely.pem.commonUtil;

public enum SortBy {
    modifyTs ("modifyTs"), activityName ("activityName");

    private String sort_by;
    SortBy(String asc) {
        this.sort_by = sort_by;
    }

    public String getSort_by() {
        return sort_by;
    }

    public void setSort_by(String sort_by) {
        this.sort_by = sort_by;
    }
}
