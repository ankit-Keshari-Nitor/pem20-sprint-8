package com.precisely.pem.commonUtil;

public enum SortByModifyTs {
    modifyTs ("modifyTs");

    private String sort_by;
    SortByModifyTs(String asc) {
        this.sort_by = sort_by;
    }

    public String getSort_by() {
        return sort_by;
    }
}
