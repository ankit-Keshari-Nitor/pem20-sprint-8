package com.precisely.pem.controller;

import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Activity Definition", description = "Activity Definition management APIs")
@RequestMapping("/sponsors/{sponsorContext}")
@RestController
public class VCHActivityController {
    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = VCHCreateActivityDefinitionResp.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "422", content = { @Content(schema = @Schema()) }) })
    @PostMapping(path = "/v2/activityDefinitions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VCHCreateActivityDefinitionResp createActivityDefinition(@RequestParam(value = "name", required = false) String name,
                                                                    @RequestParam(value = "description", required = false) String description,
                                                                    @RequestParam(value = "file") MultipartFile file,
                                                                    @RequestParam(value = "application", defaultValue = "PEM") String app,
                                                                    @PathVariable(value = "sponsorContext")String sponsorContext){


        return null;
    }
}
