import React from 'react';
import { Box, createStyles } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import type { ProgressbarProps } from '../../typings';

const FONT = "'Radial Display', 'Barlow Condensed', 'Arial Narrow', Impact, sans-serif";
const SCALE = 0.95;
const WIDTH = `calc(min(760px, 74vw) * ${SCALE})`;
const SHADOW = '0 2px 4px rgba(0, 0, 0, .85), 0 0 2px rgba(0, 0, 0, .9)';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'fixed',
    bottom: '4.8vh',
    left: '50%',
    width: WIDTH,
    pointerEvents: 'none',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#fff',
    fontFamily: FONT,
    fontSize: 31 * SCALE,
    fontWeight: 800,
    fontStyle: 'italic',
    lineHeight: 1,
    textTransform: 'uppercase',
    textShadow: SHADOW,
    gap: 16,
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cancel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 13 * SCALE,
    fontSize: 29 * SCALE,
    flexShrink: 0,
  },
  chip: {
    minWidth: 58 * SCALE,
    height: 34 * SCALE,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0 ${11 * SCALE}px`,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 23 * SCALE,
    fontWeight: 800,
    fontStyle: 'italic',
    textShadow: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, .55)',
  },
  track: {
    position: 'relative',
    width: '100%',
    height: 10 * SCALE,
    marginTop: 13 * SCALE,
    borderRadius: 999,
    backgroundColor: 'rgba(10, 12, 15, .55)',
  },
  fill: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 999,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WIDTH,
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #2fd8f2 0%, #31dfc4 38%, #34e894 70%, #3dfb85 100%)',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [canCancel, setCanCancel] = React.useState(false);
  const [runId, setRunId] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setCanCancel(!!data.canCancel);
    setRunId((id) => id + 1);
  });

  return (
    <AnimatePresence onExitComplete={() => fetchNui('progressComplete')}>
      {visible && (
        <motion.div
          key="progress"
          className={classes.wrapper}
          style={{ x: '-50%' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.14 } }}
          exit={{ opacity: 0, y: 6, transition: { duration: 0.12 } }}
        >
          <Box className={classes.row}>
            <span className={classes.label}>{label}</span>
            {canCancel && (
              <span className={classes.cancel}>
                <span className={classes.chip}>X</span>
                <span>{locale.ui.cancel || 'Cancel'}</span>
              </span>
            )}
          </Box>
          <Box className={classes.track}>
            <Box
              key={runId}
              className={classes.fill}
              onAnimationEnd={() => setVisible(false)}
              sx={{ animation: 'progress-bar linear', animationDuration: `${duration}ms` }}
            >
              <Box className={classes.gradient} />
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Progressbar;
