package com.precisely.pem.controller;

import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "Activity Instances", description = "Activity Instance management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityInstances")
@RestController
@Log4j2
public class ActivityInstanceController {

    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @PostMapping
    public ResponseEntity<Object> createActivityDefinition(@Valid ActivityInstReq activityInstReq,
                                                           @PathVariable(value = "sponsorContext", required = true) String sponsorContext) throws Exception {
        return new ResponseEntity<>(null, null, HttpStatus.CREATED);
    }
}
