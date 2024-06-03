package com.precisely.pem.commonUtil;

public enum Application {
    PEM ("PEM"), PP ("PP");

    private String app;

    Application(String app) {
        this.app = app;
    }

    public String getApp() {
        return app;
    }

    public void setApp(String app) {
        this.app = app;
    }
}
