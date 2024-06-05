package com.precisely.pem.commonUtil;

import lombok.Getter;

@Getter
public enum PcptInstProgress {
    DELAYED("Delayed"), ONSCHEDULE("OnSchedule");
    private String pcptInstProgress;

    PcptInstProgress(String pcptInstProgress) {
        this.pcptInstProgress = pcptInstProgress;
    }

    public void setPcptInstProgress(String pcptInstProgress) {
        this.pcptInstProgress = pcptInstProgress;
    }
}
