import React from 'react';
import Shell from '@b2bi/shell';

const Dashboard = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;
  return (
    <>
      <Shell.Page type="LIST" className="sfg--page--dashboard">
        <Shell.PageHeader title={'Dashboard'} description={''}></Shell.PageHeader>
        <Shell.PageBody></Shell.PageBody>
        <Shell.PageActions></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default Dashboard;