import { Box, createStyles } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { findIconDefinition, IconName, IconPrefix, IconProp } from '@fortawesome/fontawesome-svg-core';
import { AnimatePresence, motion } from 'framer-motion';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';

const RADIUS = 55;
const INNER_RADIUS = 23.5;
const SECTOR_SPACE = 2.35;
const SIZE = 400;
const PAGE_ITEMS = 6;
const DISPLAY_FONT = "'Radial Display', 'Barlow Condensed', Impact, sans-serif";

const useStyles = createStyles(() => ({
  holder: {
    position: 'absolute',
    top: '24%',
    left: '71%',
    width: SIZE,
    height: SIZE,
    transform: 'translateX(-50%)',
    transformOrigin: 'center center',
    userSelect: 'none',
    isolation: 'isolate',
    '@media (max-width: 1500px)': {
      top: '23%',
      left: '69%',
      transform: 'translateX(-50%) scale(0.9)',
      transformOrigin: 'top center',
    },
  },
  svg: {
    position: 'absolute',
    inset: 0,
    overflow: 'visible',
  },
  sectorPath: {
    fill: 'rgba(10, 11, 13, 0.54)',
    stroke: 'rgba(4, 5, 7, 0.28)',
    strokeWidth: 1.2,
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
    cursor: 'pointer',
    transition: 'fill 90ms ease',
  },
  sectorSelectedPath: { fill: '#f5f6f3' },
  label: {
    fill: '#f5f6f3',
    fontFamily: DISPLAY_FONT,
    fontStyle: 'italic',
    fontWeight: 800,
    letterSpacing: '0.1px',
    paintOrder: 'stroke fill',
    stroke: 'rgba(0, 0, 0, 0.72)',
    strokeWidth: 0.18,
    textTransform: 'uppercase',
    pointerEvents: 'none',
  },
  labelSelected: { fill: '#111516', stroke: 'none' },
  iconShadow: {
    fill: '#f5f6f3',
    filter: 'drop-shadow(0 1.25px 0 rgba(0,0,0,0.82)) drop-shadow(0 0 1.1px rgba(0,0,0,0.88))',
    pointerEvents: 'none',
  },
  iconSelected: { fill: '#111516', filter: 'none' },
  ringOuter: {
    fill: 'none',
    stroke: 'rgba(4, 5, 7, 0.2)',
    strokeWidth: 4.6,
    opacity: 0.82,
    pointerEvents: 'none',
    vectorEffect: 'non-scaling-stroke',
  },
  arc: {
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 4,
    strokeLinecap: 'butt',
    pointerEvents: 'none',
    vectorEffect: 'non-scaling-stroke',
  },
  centerCircle: {
    fill: 'rgba(10, 11, 13, 0.54)',
    stroke: 'rgba(4, 5, 7, 0.28)',
    strokeWidth: 2,
    vectorEffect: 'non-scaling-stroke',
    cursor: 'pointer',
    transition: 'fill 100ms ease',
    '&:hover': { fill: 'rgba(10, 11, 13, 0.92)' },
  },
  centerText: {
    fill: '#f5f6f3',
    fontFamily: DISPLAY_FONT,
    fontStyle: 'italic',
    fontWeight: 800,
    fontSize: 5.15,
    letterSpacing: '0.12px',
    paintOrder: 'stroke fill',
    stroke: 'rgba(0, 0, 0, 0.65)',
    strokeWidth: 0.16,
    dominantBaseline: 'central',
    pointerEvents: 'none',
  },
  controls: {
    position: 'absolute',
    top: 'calc(105% + 50px)',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 235,
    height: 44,
    padding: '0 16px',
    color: '#111516',
    backgroundColor: '#f5f6f3',
    boxShadow: '0 3px 9px rgba(0, 0, 0, 0.17)',
    fontFamily: DISPLAY_FONT,
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 800,
    letterSpacing: '0.25px',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 21,
    margin: '0 17px',
    backgroundColor: 'rgba(17, 21, 22, 0.2)',
    transform: 'skewX(-17deg)',
  },
  mouse: {
    display: 'block',
    width: 40,
    height: 40,
    flex: '0 0 40px',
    margin: '0 4px 0 -6px',
    objectFit: 'contain',
    pointerEvents: 'none',
    filter: 'brightness(0)',
  },
}));

const degToRad = (deg: number) => deg * (Math.PI / 180);
const pos = (angleDeg: number, length: number) => ({
  x: Math.sin(degToRad(angleDeg)) * length,
  y: Math.cos(degToRad(angleDeg)) * length,
});
const pt = (p: { x: number; y: number }) => `${+p.x.toFixed(4)} ${+p.y.toFixed(4)}`;

const sectorPath = (start: number, end: number) => {
  if (Math.abs(end - start) >= 359.99) {
    return (
      `M0 ${RADIUS}A${RADIUS} ${RADIUS} 0 1 0 0 ${-RADIUS}A${RADIUS} ${RADIUS} 0 1 0 0 ${RADIUS}` +
      `L0 ${INNER_RADIUS}A${INNER_RADIUS} ${INNER_RADIUS} 0 1 1 0 ${-INNER_RADIUS}A${INNER_RADIUS} ${INNER_RADIUS} 0 1 1 0 ${INNER_RADIUS}Z`
    );
  }
  const large = Math.abs(end - start) > 180 ? 1 : 0;
  return (
    `M${pt(pos(start, RADIUS))}A${RADIUS} ${RADIUS} 0 ${large} 0 ${pt(pos(end, RADIUS))}` +
    `L${pt(pos(end, INNER_RADIUS))}A${INNER_RADIUS} ${INNER_RADIUS} 0 ${large} 1 ${pt(pos(start, INNER_RADIUS))}Z`
  );
};

const arcPath = (start: number, end: number, radius: number) => {
  const size = Math.abs(end - start);
  if (size >= 359.99) {
    return `M0 ${radius}A${radius} ${radius} 0 1 0 0 ${-radius}A${radius} ${radius} 0 1 0 0 ${radius}`;
  }
  return `M${pt(pos(end, radius))}A${radius} ${radius} 0 ${size > 180 ? 1 : 0} 1 ${pt(pos(start, radius))}`;
};

const resolveIcon = (icon: string | IconProp | undefined) => {
  const fallback = findIconDefinition({ prefix: 'fas', iconName: 'circle-question' });
  if (!icon) return null;
  let prefix: IconPrefix = 'fas';
  let name: string;
  if (Array.isArray(icon)) {
    prefix = icon[0] as IconPrefix;
    name = icon[1] as string;
  } else {
    name = icon as string;
  }
  return findIconDefinition({ prefix, iconName: name as IconName }) || fallback;
};

const splitLines = (text: string, max = 13): string[] => {
  const words = String(text).split(' ');
  const lines: string[] = [];
  let current = words[0] || '';
  for (let i = 1; i < words.length; i++) {
    if (current.length + words[i].length + 1 <= max) current += ' ' + words[i];
    else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines.slice(0, 3);
};

interface WheelProps {
  items: RadialMenuItem[];
  sub: boolean;
  page: number;
  onSelect: (index: number) => void;
  onCenter: () => void;
}

const Wheel: React.FC<WheelProps> = ({ items, sub, page, onSelect, onCenter }) => {
  const { classes, cx } = useStyles();
  const [selected, setSelected] = useState(0);
  const count = Math.max(items.length, 1);
  const density = Math.max(0.68, Math.min(1, 8 / count));
  const step = 360 / count;
  const gap = items.length > 1 ? Math.min(3.4, step * 0.1) : 0;

  useEffect(() => setSelected(0), [items]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) =>
      setSelected((s) => (s + (e.deltaY < 0 ? 1 : -1) + items.length) % Math.max(items.length, 1));
    const onKey = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key) && Number(e.key) <= items.length) onSelect(Number(e.key) - 1);
      else if (e.key === 'Backspace') onCenter();
    };
    document.addEventListener('wheel', onWheel);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKey);
    };
  }, [items, onSelect, onCenter]);

  const sel = items.length ? Math.min(selected, items.length - 1) : -1;
  const angles = items.map((_, i) => {
    const center = 180 - step * i;
    return { start: center - step / 2 + gap / 2, end: center + step / 2 - gap / 2 };
  });
  const centerRadius = INNER_RADIUS - SECTOR_SPACE;

  return (
    <svg className={classes.svg} style={{ overflow: "visible" }} viewBox="-50 -50 100 100" width={SIZE} height={SIZE}>
      {items.map((item, i) => {
        const { start, end } = angles[i];
        const c = pos((start + end) / 2, INNER_RADIUS + (RADIUS - INNER_RADIUS) / 2);
        const isSel = i === sel;
        const lines = splitLines(item.label);
        const fontSize = 3.05 * density * (lines.length > 1 ? 0.88 : 1);
        const iconSize = 10 * density;
        const iconDef = typeof item.icon === 'string' && isIconUrl(item.icon) ? null : resolveIcon(item.icon);
        const hasLabel = !!item.label;
        const iconY = hasLabel ? c.y - iconSize * 0.8 : c.y - 5;
        const textY = c.y + 5 * density;

        return (
          <g
            key={i}
            onMouseEnter={() => setSelected(i)}
            onPointerMove={() => i !== sel && setSelected(i)}
            onClick={() => onSelect(i)}
          >
            <path d={sectorPath(start, end)} className={cx(classes.sectorPath, isSel && classes.sectorSelectedPath)} />
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <image
                href={item.icon}
                x={c.x - iconSize / 2}
                y={iconY}
                width={iconSize}
                height={iconSize}
                pointerEvents="none"
              />
            ) : (
              iconDef && (
                <svg
                  x={c.x - iconSize / 2}
                  y={iconY}
                  width={iconSize}
                  height={iconSize}
                  viewBox={`0 0 ${iconDef.icon[0]} ${iconDef.icon[1]}`}
                  className={cx(classes.iconShadow, isSel && classes.iconSelected)}
                >
                  <path d={iconDef.icon[4] as string} />
                </svg>
              )
            )}
            {hasLabel && (
              <text
                x={c.x}
                y={textY}
                textAnchor="middle"
                fontSize={fontSize}
                className={cx(classes.label, isSel && classes.labelSelected)}
              >
                {lines.map((line, li) => (
                  <tspan key={li} x={c.x} dy={li === 0 ? 0 : '1.1em'}>
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );
      })}

      <circle r={RADIUS + 2.25} className={classes.ringOuter} />

      {sel >= 0 && (
        <>
          <path d={arcPath(angles[sel].start, angles[sel].end, INNER_RADIUS + 0.05)} className={classes.arc} />
        </>
      )}

      <g onClick={onCenter}>
        <circle r={centerRadius} className={classes.centerCircle} />
        <text className={classes.centerText} textAnchor="middle" x={0} y={0}>
          {sub || page > 1 ? 'BACK' : 'MENU'}
        </text>
      </g>
      {sel >= 0 && (
        <path d={arcPath(angles[sel].start, angles[sel].end, centerRadius)} className={cx(classes.arc)} style={{ strokeWidth: 4.5 }} />
      )}
    </svg>
  );
};

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });
  const menuRef = useRef(menu);
  menuRef.current = menu;

  const changePage = async (increment?: boolean) => {
    setVisible(false);

    const didTransition: boolean = await fetchNui('radialTransition');

    if (!didTransition) return;

    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  const handleSelect = async (index: number) => {
    const item = menuItems[index];
    if (!item) return;
    const m = menuRef.current;
    const clickIndex = m.page === 1 ? index : PAGE_ITEMS * (m.page - 1) - (m.page - 1) + index;
    if (!item.isMore) fetchNui('radialClick', clickIndex);
    else await changePage(true);
  };

  const handleCenter = async () => {
    const m = menuRef.current;
    if (m.page > 1) await changePage();
    else if (m.sub) fetchNui('radialBack');
    else {
      setVisible(false);
      fetchNui('radialClose');
    }
  };

  const backLabel = menu.sub || menu.page > 1 ? 'BACK' : 'CLOSE';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="radial"
          className={classes.holder}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          onContextMenu={async (e) => {
            e.preventDefault();
            await handleCenter();
          }}
        >
          <motion.div
            style={{ position: 'absolute', inset: 0 }}
            initial={{ scale: 0.72, rotate: -9 }}
            animate={{ scale: 1, rotate: 0, transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={{ scale: 0.72, rotate: -9, transition: { duration: 0.12 } }}
          >
            <Wheel items={menuItems} sub={!!menu.sub} page={menu.page} onSelect={handleSelect} onCenter={handleCenter} />
          </motion.div>
          <Box className={classes.controls}>
            <img className={classes.mouse} src={`${import.meta.env.BASE_URL}img/mouse_left_outline.png`} alt="" />
            <span>SELECT</span>
            <span className={classes.divider} />
            <img className={classes.mouse} src={`${import.meta.env.BASE_URL}img/mouse_right_outline.png`} alt="" />
            <span>{backLabel}</span>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RadialMenu;
