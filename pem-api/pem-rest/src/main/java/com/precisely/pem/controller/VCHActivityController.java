package com.precisely.pem.controller;

import com.precisely.pem.dtos.responses.VCHActivityDefinitionPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
import com.precisely.pem.services.VCHActivityDefinitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

@Tag(name = "Activity Definition", description = "Activity Definition management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityDefinitions")
@RestController
public class VCHActivityController {

    private static Logger LOG = LogManager.getLogger(VCHActivityController.class);

    public enum SORT_DIRECTION {
        ASC ("ASC"), DESC ("DESC");

        private String sort_direction;
        SORT_DIRECTION(String asc) {
            this.sort_direction = sort_direction;
        }

        public String getSort_direction() {
            return sort_direction;
        }

        public void setSort_direction(String sort_direction) {
            this.sort_direction = sort_direction;
        }
    }

    public enum SORT_BY {
        modifyTs ("modifyTs"), activityName ("activityName");

        private String sort_by;
        SORT_BY(String asc) {
            this.sort_by = sort_by;
        }

        public String getSort_by() {
            return sort_by;
        }

        public void setSort_by(String sort_by) {
            this.sort_by = sort_by;
        }
    }

    @Autowired
    VCHActivityDefinitionService vchActivityDefinitionService;

    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = VCHCreateActivityDefinitionResp.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "422", content = { @Content(schema = @Schema()) }) })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VCHCreateActivityDefinitionResp createActivityDefinition(@RequestPart(value = "name", required = true) String name,
                                                                    @RequestPart(value = "description", required = true) String description,
                                                                    @RequestPart(value = "file") MultipartFile file,
                                                                    @RequestPart(value = "application", required = true) String app,
                                                                    @PathVariable(value = "sponsorContext")String sponsorContext) throws IOException, SQLException {
        return vchActivityDefinitionService.createActivityDefinition(sponsorContext, name, description, file, app);
    }

    @Operation(summary = "Retrieve all Activity Definitions", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = VCHActivityDefinitionPaginationRes.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "204", description = "There are no Definitions", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema()) }) })
    @GetMapping
    public VCHActivityDefinitionPaginationRes getActivityDefinitionList(@RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                        @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                        @RequestParam(value = "sortBy",  required = false) SORT_BY sortBy,
                                                                        @RequestParam(value = "sortDir", required = false) SORT_DIRECTION sortDir,
                                                                        @PathVariable(value = "sponsorContext")String sponsorContext){
        VCHActivityDefinitionPaginationRes res = new VCHActivityDefinitionPaginationRes();
        LOG.info("Retrieve all Activity Definitions: Starts");
        res = vchActivityDefinitionService.getAllDefinitionList(sponsorContext, pageNo, pageSize, sortBy ==null? "modifyTs":sortBy.name(), sortDir ==null? "ASC":sortDir.name());
        LOG.info("Retrieve all Activity Definitions: Ends");
        return  res;
    }

    @Operation(summary = "Get Activity Definitions by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = VCHActivityDefnDto.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema()) }) })
    @GetMapping ("/{activityDefnKey}")
    public VCHActivityDefnDto getActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey) throws Exception {
       return  vchActivityDefinitionService.getActivityDefinitionByKey(sponsorContext, activityDefnKey);
    }
}
