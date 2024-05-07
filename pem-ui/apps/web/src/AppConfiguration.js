import React, { useEffect } from 'react';
import Shell from '@b2bi/shell';

import { sideNavConfig, headerMenuList } from './modules/configurations';

const AppConfiguration = ({ children, ...props }) => {
  const { setSideNav, setHeaderMenuList } = Shell.useConfiguration();
  const { appDetails } = Shell.useApplicationInfo();

  useEffect(() => {
    console.log('App Context is changing');

    setHeaderMenuList([...headerMenuList, ...Shell.headerMenuList]);
    setSideNav([...sideNavConfig, ...Shell.sideNavConfig]);
  }, [appDetails, setHeaderMenuList, setSideNav]);

  //setHeaderMenuList(headerMenuList);
  //setSideNav(sideNavConfig);

  return <>{children}</>;
};

export default AppConfiguration;
