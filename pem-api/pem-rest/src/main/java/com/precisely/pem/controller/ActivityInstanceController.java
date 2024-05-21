package com.precisely.pem.controller;

import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.services.ActivityInstService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "Activity Instances", description = "Activity Instance management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityInstances")
@RestController
@Log4j2
public class ActivityInstanceController {

    @Autowired
    ActivityInstService activityInstService;

    @Operation(summary = "Create an Activity Instance")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @PostMapping
    public ResponseEntity<Object> createActivityInstance(@Valid @RequestBody ActivityInstReq activityInstReq,
                                                         @PathVariable(value = "sponsorContext", required = true) String sponsorContext) throws Exception {
        ActivityInstResp activityInstResp = activityInstService.createActivityInstance(sponsorContext,activityInstReq);
        Link link = linkTo(methodOn(ActivityController.class).getActivityDefinitionByKey(sponsorContext,activityInstResp.getActivityInstKey())).withSelfRel();
        activityInstResp.setLocation(link.getHref());
        HttpHeaders headers = new HttpHeaders();
        headers.set("location", activityInstResp.getLocation());
        return new ResponseEntity<>(activityInstResp, headers, HttpStatus.CREATED);
    }
}
