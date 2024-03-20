import React from 'react';

import PageDesigner from '@b2bi/page-designer';
import componentMapper from '@b2bi/carbon-mappers';

export default function Designer() {
  return <PageDesigner componentMapper={componentMapper} />;
}