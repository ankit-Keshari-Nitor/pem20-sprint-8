package com.precisely.pem.filter;

import com.precisely.pem.models.Company;
import com.precisely.pem.services.SponsorService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Order(value = Ordered.HIGHEST_PRECEDENCE)
@Component
@WebFilter(filterName = "LoggingFilter", urlPatterns = "/*")
public class LoggingFilter extends OncePerRequestFilter {

    private static Logger LOG = LogManager.getLogger(LoggingFilter.class);
    @Autowired
    private SponsorService sponsorService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try  {
            String sponsorContext = getSponsorContextFromURL(request);

            if ("".equals(sponsorContext)) {
                LOG.info("URL not compatible to extract Log Context Info, Using Header sponsor..");
                if(Objects.nonNull(request.getHeader("sponsor"))){
                    sponsorContext = request.getHeader("sponsor");
                }else
                    sponsorContext = "b2b";
            }
            //Extract Company Name from DB and add into ThreadContext
            setSponsorDetailsInContext(sponsorContext);

            // Continue with the filter chain
            filterChain.doFilter(request, response);
        } catch (Exception exp){
            LOG.error(" Log Context addition failed.");
        } finally {
            // Clear MDC context when request completes
            ThreadContext.clearStack();
        }
    }

    private static String getSponsorContextFromURL(HttpServletRequest request) {
        StringBuffer url = request.getRequestURL();

        int startIndex = url.indexOf("/sponsors/");
        if(startIndex == -1){
            return "";
        }
        startIndex += "/sponsors/".length();

        int endIndex = url.indexOf("/", startIndex);

        if(endIndex == -1){
            return "";
        }

        return url.substring(startIndex, endIndex);
    }

    private void setSponsorDetailsInContext(String sponsorContext) {
       String sponsorKey = sponsorService.getSponsorKey(sponsorContext);
       if(Objects.nonNull(sponsorKey)){
           Company company = sponsorService.getCompanyByKey(sponsorKey);
           if(Objects.nonNull(company)){
               // Set MDC context for logging here
               ThreadContext.put("sponsor", company.getCompanyName());
           }else {
               LOG.info("Company Name Not Found for Log Context Info.");
               ThreadContext.put("sponsor", "None");
           }
       }
    }
}
