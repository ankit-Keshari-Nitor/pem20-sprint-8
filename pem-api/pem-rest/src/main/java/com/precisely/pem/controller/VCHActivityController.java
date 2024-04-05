package com.precisely.pem.controller;

import com.precisely.pem.dtos.responses.VCHActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.responses.VCHGetActivitiyDefnByIdResp;
import com.precisely.pem.dtos.shared.ErrorResponseDto;
import com.precisely.pem.services.VCHActivityDefinitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Activity Definition", description = "Activity Definition management APIs")
@RequestMapping("/sponsors/{sponsorContext}")
@RestController
public class VCHActivityController {
    @Autowired
    VCHActivityDefinitionService vchActivityDefinitionService;

    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = VCHCreateActivityDefinitionResp.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "422", content = { @Content(schema = @Schema()) }) })
    @PostMapping(path = "/v2/activityDefinitions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VCHCreateActivityDefinitionResp createActivityDefinition(@RequestParam(value = "name", required = true) @Size(min=1,max=80) String name, //Check on pattern matcher
                                                                    @RequestParam(value = "description", required = false) @Size(min=1,max=255) String description,
                                                                    @RequestParam(value = "file") MultipartFile file,
                                                                    @RequestParam(value = "application", defaultValue = "PEM", required = true) String app,
                                                                    @PathVariable(value = "sponsorContext", required = true) String sponsorContext) throws Exception {
        return vchActivityDefinitionService.createActivityDefinition(sponsorContext, name, description, file, app);
    }

    @Operation(summary = "Retrieve all Activity Definitions", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = VCHActivityDefnPaginationRes.class),
                            mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class),
                            mediaType = "application/json") }),
            @ApiResponse(responseCode = "401", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class),
                            mediaType = "application/json" )}) })
    @GetMapping(path = "/v2/activityDefinitions")
    public VCHActivityDefnPaginationRes getActivityDefinitionList(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                        @RequestParam(value = "name", required = false) String name,
                                                                        @RequestParam(value = "description", required = false) String description,
                                                                        @RequestParam(value = "status", defaultValue = "FINAL", required = false) String status,
                                                                        @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                        @RequestParam(value = "pageSize", defaultValue = "1", required = false) int pageSize,
                                                                        @RequestParam(value = "sortBy", defaultValue = "modifyTs", required = false) String sortBy,
                                                                        @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir){
        return vchActivityDefinitionService.getAllDefinitionList(sponsorContext,name,description,status,pageNo, pageSize, sortBy, sortDir);

    }

    @Operation(summary = "Retrieve Activity Definition By Id", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = VCHGetActivitiyDefnByIdResp.class),
                            mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class),
                            mediaType = "application/json") }),
            @ApiResponse(responseCode = "404", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class),
                            mediaType = "application/json" )}),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class),
                            mediaType = "application/json" )}) })
    @GetMapping(path = "/v2/activityDefinitions/{activityDefnKey}")
    public VCHGetActivitiyDefnByIdResp getActivityDefinitionById(@PathVariable(value = "sponsorContext")String sponsorKey,
                                                                 @RequestParam(value = "activityDefnKey", required = false) String activityDefnKey){
        return vchActivityDefinitionService.findByActivityDefnKeyAndSponsorKey(activityDefnKey,sponsorKey);

    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("File is either empty or file size exceeds 10MB.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

}
