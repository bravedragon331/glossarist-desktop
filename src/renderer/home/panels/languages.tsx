import React, { useContext, useEffect, useRef } from 'react';
import { Tree, ITreeNode, Icon } from '@blueprintjs/core';
import { LangConfigContext } from '@riboseinc/coulomb/localizer/renderer/context';
import { availableLanguages } from 'app';
import { ConceptContext } from '../contexts';
import { PanelConfig } from '../panel-config';
import sharedStyles from '../styles.scss';


const TitleSecondary: React.FC<{ isCollapsed?: boolean }> = function ({ isCollapsed }) {
  const lang = useContext(LangConfigContext);
  return isCollapsed ? <>{lang.available[lang.selected]}</> : null;
}


const Panel: React.FC<{}> = function () {
  const concept = useContext(ConceptContext);
  const lang = useContext(LangConfigContext);
  const treeRef = useRef<Tree>(null);

  useEffect(() => {
    setTimeout(() => {
      const currentNode = treeRef.current?.getNodeContentElement(lang.selected);
      currentNode?.scrollIntoViewIfNeeded();
    }, 100);
  }, []);

  function handleNodeClick(nodeData: ITreeNode) {
    const langID = nodeData.id as keyof typeof availableLanguages;
    setImmediate(() => lang.select(langID));
  }

  function langToNode(_langID: string) {
    const langID = _langID as keyof typeof availableLanguages;
    return {
      id: langID,
      hasCaret: false,
      label: lang.available[langID],
      //secondaryLabel: <Text ellipsize>{(concept.active || {})[langID]?.term}</Text>,
      isSelected: lang.selected === langID,
      secondaryLabel: (concept.active || {})[langID] === undefined
        ? <Icon icon="translate" intent="danger" />
        : null,
    } as ITreeNode;
  }

  const treeState: ITreeNode[] = [...Object.keys(lang.available)].
  map(langToNode);

  return (
    <Tree
      ref={treeRef}
      contents={treeState}
      onNodeClick={handleNodeClick}
    />
  );
};


export default {
  Contents: Panel,
  title: "Language",
  className: sharedStyles.languagesPanel,
  TitleComponentSecondary: TitleSecondary,
  helpResourceID: 'language',
} as PanelConfig;