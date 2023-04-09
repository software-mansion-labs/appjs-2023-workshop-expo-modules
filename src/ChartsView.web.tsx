import * as React from 'react';

import { ChartsViewProps } from './Charts.types';

export default function ChartsView(props: ChartsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
