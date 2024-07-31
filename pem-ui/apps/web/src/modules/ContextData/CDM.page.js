import React from 'react';
import { Grid, Column, Layer } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';
import { JSONPath } from 'jsonpath-plus';
import CDMTreeView from './CDMTreeView';
import ActivitySchema from './SampleActivitySchema';
import { transformDataToTree, generateContextDataMapping } from './ContextDataMappingUtil';

const CDMModalPage = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;
  const { modalConfig } = Shell.useModal();

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          data: [],
          originalData:[]
        },
        ui: {
          selectedJPath: '',
          selectedNode: ''
        },
        form: {
          property: {
            textProptery: '',
            booleanProperty: ''
          }
        },
        init: function () {
          if (context === 'PROPERTY') {
            this._processProperty();
          } else {
            this._processActivity();
          }
        },
        _processProperty: function () {
          console.log('contextDataMapping :::', modalConfig.data.data);
          console.log('contextDataMapping :::', JSON.stringify(modalConfig.data.data, null, 2));
          const transformedData = transformDataToTree(modalConfig.data.data);
          console.log('transformedData :::', transformedData);
          this.setModel('data', transformedData);
          this.setModel('originalData', { items: modalConfig.data.data});
        },
        _processActivity: function () {
          const contextDataMapping = generateContextDataMapping(ActivitySchema);
          console.log('contextDataMapping :::', contextDataMapping);
          console.log('contextDataMapping :::', JSON.stringify(contextDataMapping, null, 2));
          const transformedData = transformDataToTree(contextDataMapping.items);
          console.log('transformedData :::', transformedData);
          this.setModel('data', transformedData);
          this.setModel('originalData', { items: modalConfig.data.data});
        },
        uiOnRequestSubmit: function () {
          if (context === 'PROPERTY') {
            modalConfig.onAction('submit', { data: this.model.originalData.items });
          } else {
            modalConfig.onAction('submit', { data: this.ui.selectedJPath });
          }
          
        },
        uiSelectCDM: function () {},
        uiOnSelectJPath: function (event, selectedNode) {
          if (event.currentTarget.type === 'binding') {
            this.setUI('selectedJPath', selectedNode.activeNodeId);
          } else {
            this.setUI('selectedJPath', '');
          }
        },
        uiOnSelectNode: function (event, selectedNode) {
          this.setUI('selectedNode', selectedNode);
          this.form.property.reset();
          switch (selectedNode.value.type) {
            case 'TEXT':
              this.form.property.setValue('textProperty', selectedNode.value.value);
              break;
            case 'BOOLEAN':
              this.form.property.setValue('booleanProperty', selectedNode.value.value);
              break;
            case 'API_CONFIG':
              this.form.property.setValue('apiConfigProperty', selectedNode.value.value);
              break;
            case 'ACIVITY_FILE':
              this.form.property.setValue('activityFileProperty', selectedNode.value.value);
              break;
            case 'LOGO_FILE':
              this.form.property.setValue('logoFileProperty', selectedNode.value.value);
              break;
            default:
              break;
          }
        },
        uiOnPropertyChange: function(event, value) {
          console.log("uiOnPropertyChange", event, value);
          console.log(this.ui.selectedNode.activeNodeId);
          const propertyRef = JSONPath({ path: `${this.ui.selectedNode.activeNodeId}`, json: this.model.originalData, wrap: false })
          console.log(propertyRef);
          propertyRef[0].value = event.target.value;
        },
        uiOnRequestClose: function () {
          modalConfig.onAction('cancel', {
            data: this.model.originalData
          });
        }
      };
    })(pageArgs, pageUtil)
  );

  const pageConfig = {
    actionsConfig: {
      pageActions: [
        {
          id: 'cancel',
          label: 'shell:common.actions.cancel',
          type: 'button',
          kind: 'secondary',
          isVisible: context !== 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestClose.apply();
          }
        },
        {
          id: 'close',
          label: 'shell:common.actions.close',
          type: 'button',
          kind: 'secondary',
          isVisible: context === 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestClose.apply();
          }
        },
        {
          id: 'select',
          label: 'shell:common.actions.select',
          type: 'button',
          kind: 'primary',
          disabled: !page.ui.selectedJPath,
          isVisible: context !== 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestSubmit.apply();
          }
        },
        {
          id: 'update',
          label: 'shell:common.actions.update',
          type: 'button',
          kind: 'primary',
          isVisible: context === 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestSubmit.apply();
          }
        }
      ]
    }
  };

  return (
    <>
      <Shell.Page name="download-key">
        <Shell.PageHeader title="Context Data Mapping Selection" />
        <Shell.PageBody>
          
            <Grid className="sfg--grid--form">
              {context !== 'PROPERTY' && (
                <Column lg={context === 'PROPERTY' ? 6 : 16} md={context === 'PROPERTY' ? 6 : 16}>
                  <CDMTreeView data={page.model.data} onSelect={page.uiOnSelectJPath} />
                </Column>
              )}
              {context === 'PROPERTY' && (
                <>
                  <Column lg={6} md={6}>
                    <CDMTreeView data={page.model.data} onSelect={page.uiOnSelectNode} />
                  </Column>
                  <Column lg={10} md={10}>
                    <CDS.Form name="property" context={page.form.property}>
                      {page.ui.selectedNode && (
                        <>
                          {page.ui.selectedNode.value.type === 'TEXT' && <CDS.TextInput name="textProperty" labelText="Set value for selected node" rules={{onChange: page.uiOnPropertyChange}}></CDS.TextInput>}
                          {page.ui.selectedNode.value.type === 'BOOLEAN' && <CDS.Toggle name="booleanProperty" labelText="Set value for selected node" rules={{onChange: page.uiOnPropertyChange}}></CDS.Toggle>}

                        </>
                      )}
                    </CDS.Form>
                  </Column>
                </>
              )}
            </Grid>
          
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default CDMModalPage;
