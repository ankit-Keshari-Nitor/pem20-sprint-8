package com.precisely.pem.service;

import com.precisely.pem.models.ApiConfig;
import com.precisely.pem.repositories.ApiConfigRepo;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public class SpringContext implements ApplicationContextAware {

    private static ApplicationContext context;

    public static JpaRepository<ApiConfig, String> getApiConfigBean(){
        return context.getBean(ApiConfigRepo.class);
    }

    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        setContext(context);
    }

    private static synchronized void setContext(ApplicationContext context) {
        SpringContext.context = context;
    }
}
