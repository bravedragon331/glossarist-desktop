import React from 'react';
import { Panel } from 'coulomb-panel/panel';
import { useHelp } from 'renderer/help';
import { PanelConfig } from './panel-config';
import styles from './styles.scss';


const SPanel: React.FC<{ cfg: PanelConfig }> = function ({ cfg }) {
  const panelRef = useHelp(`panels/${cfg.helpResourceID}`);

  return (
    <Panel
        className={`${cfg.className || ''}`}

        titleBarClassName={styles.panelTitleBar}
        contentsClassName={styles.panelContents}
        ref={panelRef as (item: HTMLDivElement) => void}

        isCollapsible={cfg.collapsed !== 'never' ? true : undefined}
        isCollapsedByDefault={cfg.collapsed === 'by-default' ? true : undefined}
        TitleComponent={cfg.TitleComponent}
        TitleComponentSecondary={cfg.TitleComponentSecondary}
        title={cfg.title}>
      <cfg.Contents {...cfg.props || {}} />
    </Panel>
  );
};


interface SidebarProps {
  position: 'left' | 'right'
  panelSet: PanelConfig[]
}
export const Sidebar: React.FC<SidebarProps> = function({ position, panelSet }) {
  const [firstPanel, ...restOfPanels] = panelSet;

  let lastPanel: PanelConfig | null;
  if (panelSet.length > 1) {
    lastPanel = restOfPanels.splice(restOfPanels.length - 1, 1)[0];
  } else {
    lastPanel = null;
  }

  return (
    <Panel
        isCollapsible
        iconExpanded={position === 'left' ? 'caret-left' : 'caret-right'}
        iconCollapsed={position === 'left' ? 'caret-right' : 'caret-left'}

        collapsedClassName={styles.panelCollapsed}
        titleBarClassName={styles.panelTitleBar}
        contentsClassName={styles.panelContents}

        className={`
          ${styles.moduleSidebar}
          ${position === 'left' ? styles.moduleSidebarLeft : styles.moduleSidebarRight}`}>

      <div className={styles.fixedPanel}>
        <SPanel cfg={firstPanel} />
      </div>

      <div className={styles.restOfPanels}>
        {[...restOfPanels.entries()].map(([idx, cfg]) =>
          <SPanel key={`${idx}-${cfg.helpResourceID}`} cfg={cfg} />
        )}
      </div>

      {lastPanel
        ? <div className={styles.fixedPanel}>
            <SPanel cfg={lastPanel} />
          </div>
        : null}

    </Panel>
  );
};
