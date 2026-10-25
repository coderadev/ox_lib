import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, createStyles, keyframes } from '@mantine/core';
import React from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const FONT = "'Roboto Condensed', 'Barlow', 'Roboto', Arial, sans-serif";

const ACCENTS: Record<string, string> = {
  success: '#43df78',
  inform: '#13dff2',
  error: '#ff4e55',
  warning: '#ffc233',
};

const GLYPHS: Record<string, string> = {
  success: '✓',
  inform: '!',
  error: '×',
  warning: '!',
};

const useStyles = createStyles(() => ({
  container: {
    width: 'min(33vw, 650px)',
    minWidth: 320,
    display: 'grid',
    gridTemplateColumns: '64px 1fr',
    minHeight: 64,
    fontFamily: FONT,
  },
  iconBox: {
    display: 'grid',
    placeItems: 'center',
    backgroundColor: 'rgba(14, 14, 14, 0.8)',
  },
  messageBox: {
    marginLeft: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 24px',
    backgroundColor: 'rgba(14, 14, 14, 0.8)',
    minWidth: 0,
  },
  title: {
    color: '#f4f4f4',
    fontWeight: 600,
    fontSize: 'clamp(17px, 1.25vw, 25px)',
    lineHeight: 1.15,
    textShadow: '0 2px 2px rgba(0,0,0,.75)',
    overflowWrap: 'anywhere',
  },
  description: {
    color: '#f4f4f4',
    fontWeight: 500,
    fontSize: 'clamp(17px, 1.25vw, 25px)',
    lineHeight: 1.2,
    letterSpacing: '.1px',
    textShadow: '0 2px 2px rgba(0,0,0,.75)',
    overflowWrap: 'anywhere',
    '& p': { margin: 0 },
  },
  descriptionWithTitle: {
    fontSize: 'clamp(14px, 1vw, 20px)',
    color: '#c9cdd2',
  },
  glyph: {
    fontWeight: 600,
    fontSize: 43,
    lineHeight: 1,
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) =>
  keyframes({
    from: { opacity: visible ? 0 : 1, transform: `translate${from}` },
    to: { opacity: visible ? 1 : 0, transform: `translate${to}` },
  });

const getAnimation = (visible: boolean, position: string) => {
  const options = visible ? '0.28s ease forwards' : '0.32s ease forwards';
  const horizontal = position.includes('left') ? '-115%' : position.includes('right') ? '115%' : null;
  let from: string;
  let to: string;

  if (visible) {
    if (horizontal) {
      from = `X(${horizontal})`;
      to = 'X(0%)';
    } else {
      from = position.includes('bottom') ? 'Y(30px)' : 'Y(-30px)';
      to = 'Y(0px)';
    }
  } else if (horizontal) {
    from = 'X(0%)';
    to = `X(${horizontal})`;
  } else {
    from = 'Y(0px)';
    to = position === 'bottom-center' ? 'Y(100%)' : 'Y(-100%)';
  }

  return `${createAnimation(from, to, visible)} ${options}`;
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let position = data.position || 'top-left';

    // Backwards compat with old notifications
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    const type = data.type && ACCENTS[data.type] ? data.type : 'inform';
    const accent = data.iconColor ? tinycolor(data.iconColor).toRgbString() : ACCENTS[type];
    const glow = {
      color: accent,
      textShadow: `0 0 9px ${accent}, 0 0 18px ${tinycolor(accent).setAlpha(0.55).toRgbString()}`,
      filter: `drop-shadow(0 0 6px ${accent})`,
    };

    toast.custom(
      (t) => (
        <Box
          sx={{ animation: getAnimation(t.visible, position), ...data.style }}
          className={classes.container}
        >
          <Box className={classes.iconBox}>
            {data.icon ? (
              <LibIcon
                icon={data.icon}
                fixedWidth
                animation={data.iconAnimation}
                style={{ color: accent, fontSize: 34, filter: glow.filter }}
              />
            ) : (
              <span className={classes.glyph} style={{ color: glow.color, textShadow: glow.textShadow }}>
                {GLYPHS[type]}
              </span>
            )}
          </Box>
          <Box className={classes.messageBox}>
            {data.title && <div className={classes.title}>{data.title}</div>}
            {data.description && (
              <ReactMarkdown
                components={MarkdownComponents}
                className={`${classes.description} ${data.title ? classes.descriptionWithTitle : ''} description`}
              >
                {data.description}
              </ReactMarkdown>
            )}
          </Box>
        </Box>
      ),
      { id: toastId, duration, position }
    );
  });

  return <Toaster reverseOrder />;
};

export default Notifications;
