import { createStyles } from '@mantine/core';
import React from 'react';
import { NP } from '../theme';

interface Props {
  select?: boolean;
  close?: boolean;
  selectLabel?: string;
  closeLabel?: string;
  className?: string;
}

const useStyles = createStyles(() => ({
  bar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
    backgroundColor: 'rgba(18, 20, 24, 0.92)',
    fontFamily: NP.headingFont,
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: '#e6e8ea',
  },
  cap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    height: 18,
    padding: '0 3px',
    backgroundColor: '#f1f2f3',
    color: '#0b0e12',
    borderRadius: 2,
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 1,
  },
  sep: { color: '#5b6169', fontStyle: 'normal' },
  wrapper: { display: 'flex', justifyContent: 'flex-end', marginTop: 6 },
}));

const KeyHints: React.FC<Props> = ({ select = true, close = true, selectLabel = 'Select', closeLabel = 'Close', className }) => {
  const { classes, cx } = useStyles();
  if (!select && !close) return null;

  return (
    <div className={cx(classes.wrapper, className)}>
      <div className={classes.bar}>
        {select && (
          <>
            <span className={classes.cap}>↵</span>
            {selectLabel}
          </>
        )}
        {select && close && <span className={classes.sep}>/</span>}
        {close && (
          <>
            <span className={classes.cap}>ESC</span>
            {closeLabel}
          </>
        )}
      </div>
    </div>
  );
};

export default KeyHints;
