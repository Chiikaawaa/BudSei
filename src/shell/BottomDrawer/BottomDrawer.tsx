import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { ExecutionLog } from './ExecutionLog';
import { TimelineScrubber } from './TimelineScrubber';

export const BottomDrawer = React.memo(function BottomDrawer() {
  const bottomDrawerTab = useUiStore((s) => s.bottomDrawerTab);

  if (bottomDrawerTab === 'timeline') {
    return <TimelineScrubber />;
  }

  return <ExecutionLog />;
});
