import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';
import KeyHints from '../../../components/KeyHints';
import { NP } from '../../../theme';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles(() => ({
  container: {
    position: 'absolute',
    top: '19%',
    right: '24%',
    width: 380,
  },
  panel: {
    backgroundColor: NP.header,
    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
  },
  header: {
    alignItems: 'center',
    gap: 8,
    padding: '16px 16px 12px 16px',
    backgroundColor: NP.header,
  },
  titleContainer: { flex: 1 },
  titleText: {
    fontFamily: NP.headingFont,
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 1.1,
    textTransform: 'uppercase',
    color: NP.text,
    '& p, & h1, & h2, & h3': { margin: 0, fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit', color: 'inherit' },
  },
  subtitleText: {
    marginTop: 4,
    fontFamily: NP.bodyFont,
    fontWeight: 500,
    fontSize: 12,
    color: NP.muted,
  },
  list: {
    maxHeight: 'min(520px, 62vh)',
    overflowY: 'auto',
    background:
      'linear-gradient(180deg, rgba(31,45,58,0.97) 0%, rgba(21,28,36,0.86) 45%, rgba(13,17,22,0.62) 100%)',
    paddingBottom: 6,
  },
  listStack: { gap: 0 },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Box className={classes.panel}>
          <Flex className={classes.header}>
            {contextMenu.menu && (
              <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
            )}
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText} component="div">
                <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
              </Text>
              {contextMenu.subtitle && <Text className={classes.subtitleText}>{contextMenu.subtitle}</Text>}
            </Box>
          </Flex>
          <Box className={classes.list}>
            <Stack className={classes.listStack}>
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`context-item-${index}`} />
              ))}
            </Stack>
          </Box>
        </Box>
        <KeyHints close={contextMenu.canClose !== false} />
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;
