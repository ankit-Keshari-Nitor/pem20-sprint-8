package com.precisely.pem.controller;

import com.precisely.pem.services.ActivityDefnService;
import org.mockito.InjectMocks;
import org.mockito.Mock;

public class BaseControllerTest {
    public static final String TEST_SPONSOR = "test_sponsor";
    public static final String TEST_NAME = "test";
    public static final String TEST_ACTIVITY_DEFN_KEY = "test_activity_defn_key";
    public static final String TEST_DESCRIPTION = "description";

    @InjectMocks
    protected ActivityController activityController;

    @Mock
    protected ActivityDefnService activityDefnService;
}
