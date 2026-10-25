import { MantineThemeOverride } from '@mantine/core';

export const NP = {
  cyan: '#3bddf1',
  cyanHover: '#63e7f6',
  panel: '#131921',
  header: '#151b21',
  row: '#1f2d3a',
  text: '#ffffff',
  muted: '#8a9099',
  dim: '#4a525c',
  inputBg: '#ffffff',
  inputText: '#0f1419',
  inputIcon: '#6b7178',
  track: '#363c42',
  headingFont: "'Barlow Condensed', 'Roboto', sans-serif",
  bodyFont: "'Barlow', 'Roboto', sans-serif",
};

export const primaryButtonStyles = {
  root: {
    backgroundColor: NP.cyan,
    color: '#0b0e12',
    '&:hover': { backgroundColor: NP.cyanHover },
  },
};

const label = {
  fontFamily: NP.headingFont,
  fontStyle: 'italic',
  fontWeight: 600,
  fontSize: 12,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.4,
  color: NP.muted,
  marginBottom: 4,
};

const description = {
  fontFamily: NP.bodyFont,
  fontSize: 11,
  fontWeight: 500,
  color: NP.muted,
  marginTop: -2,
  marginBottom: 4,
};

const fieldStyles = () => ({
  label,
  description,
  required: { color: NP.cyan },
  input: {
    backgroundColor: NP.inputBg,
    color: NP.inputText,
    border: 'none',
    borderRadius: 0,
    minHeight: 40,
    height: 40,
    fontFamily: NP.bodyFont,
    fontWeight: 500,
    fontSize: 14,
    '&::placeholder': { color: '#a3a8ae' },
    '&:focus, &:focus-within': { boxShadow: `inset 0 0 0 2px ${NP.cyan}`, border: 'none' },
    '&:disabled': { backgroundColor: '#c9ccd0', color: '#6b7178', opacity: 1 },
  },
  icon: { color: NP.inputIcon },
  rightSection: { color: NP.inputIcon },
});

const dropdownStyles = () => ({
  dropdown: {
    backgroundColor: NP.panel,
    border: 'none',
    borderRadius: 0,
    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
    padding: 0,
  },
  item: {
    fontFamily: NP.headingFont,
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 14,
    textTransform: 'uppercase' as const,
    color: NP.text,
    borderRadius: 0,
    padding: '6px 12px',
    '&[data-hovered]': { backgroundColor: '#fff', color: NP.inputText },
    '&[data-selected]': { backgroundColor: NP.cyan, color: '#0b0e12' },
    '&[data-selected][data-hovered]': { backgroundColor: NP.cyanHover, color: '#0b0e12' },
  },
  nothingFound: { color: NP.muted },
});

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: NP.bodyFont,
  headings: { fontFamily: NP.headingFont },
  defaultRadius: 0,
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },
  colors: {
    blue: ['#e6fcff', '#c4f7fc', '#9cf1fa', '#74eaf6', '#55e3f3', '#47e0f2', '#3bddf1', '#2cc3d6', '#20a3b3', '#167985'],
    dark: ['#d5d7da', '#b5b9be', '#8a9099', '#4a525c', '#2a323b', '#1f2d3a', '#151b21', '#131921', '#0e1217', '#080a0d'],
  },
  components: {
    Button: {
      styles: () => ({
        root: {
          border: 'none',
          borderRadius: 0,
          height: 40,
          fontFamily: NP.headingFont,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: 0.5,
          backgroundColor: NP.row,
          color: NP.text,
          '&:hover': { backgroundColor: '#2a3a4a' },
          '&:active': { transform: 'translateY(1px)' },
        },
      }),
    },
    TextInput: { styles: fieldStyles },
    Textarea: {
      styles: () => {
        const base = fieldStyles();
        return { ...base, input: { ...base.input, height: 'auto', minHeight: 70, paddingTop: 8 } };
      },
    },
    NumberInput: { styles: fieldStyles },
    ColorInput: { styles: () => ({ ...fieldStyles(), ...dropdownStyles() }) },
    DatePicker: { styles: () => ({ ...fieldStyles(), ...dropdownStyles() }) },
    DateRangePicker: { styles: () => ({ ...fieldStyles(), ...dropdownStyles() }) },
    TimeInput: { styles: fieldStyles },
    PasswordInput: {
      styles: () => {
        const base = fieldStyles();
        return {
          label,
          description,
          required: base.required,
          input: { ...base.input, '&:focus-within': base.input['&:focus, &:focus-within'] },
          innerInput: { color: NP.inputText, height: 38, fontFamily: NP.bodyFont, fontWeight: 500 },
          icon: base.icon,
          visibilityToggle: { color: NP.inputIcon },
        };
      },
    },
    Select: { styles: () => ({ ...fieldStyles(), ...dropdownStyles() }) },
    MultiSelect: {
      styles: () => {
        const base = fieldStyles();
        return {
          ...base,
          ...dropdownStyles(),
          input: { ...base.input, height: 'auto', minHeight: 40 },
          value: { backgroundColor: NP.row, color: NP.text, borderRadius: 0, fontFamily: NP.bodyFont },
          searchInput: { color: NP.inputText },
        };
      },
    },
    Checkbox: {
      styles: () => ({
        input: {
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: 2,
          '&:checked': { backgroundColor: NP.cyan },
        },
        icon: { color: '#0b0e12' },
        label: { color: NP.text, fontFamily: NP.bodyFont, fontWeight: 600, fontSize: 14 },
      }),
    },
    Slider: {
      styles: () => ({
        track: { height: 4, '&::before': { backgroundColor: NP.track, borderRadius: 0 } },
        bar: { backgroundColor: NP.cyan, borderRadius: 0 },
        thumb: { width: 14, height: 14, backgroundColor: '#fff', border: `3px solid ${NP.cyan}`, boxShadow: 'none' },
        mark: { width: 4, height: 4, border: 'none', backgroundColor: NP.dim, borderRadius: 4 },
        markFilled: { backgroundColor: '#fff' },
        markLabel: { color: NP.muted, fontFamily: NP.bodyFont, fontSize: 12, fontWeight: 500 },
        label: { backgroundColor: '#fff', color: NP.inputText, borderRadius: 0, fontFamily: NP.bodyFont, fontWeight: 600 },
      }),
    },
    Modal: {
      styles: () => ({
        modal: {
          backgroundColor: NP.panel,
          borderRadius: 0,
          boxShadow: 'none',
          padding: '18px 16px 16px !important',
          position: 'relative',
          overflow: 'visible',
        },
        header: { marginBottom: 12 },
        title: {
          fontFamily: NP.headingFont,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 24,
          textTransform: 'uppercase',
          color: NP.text,
          textAlign: 'left',
          width: '100%',
          lineHeight: 1.1,
        },
        body: { color: NP.text },
      }),
    },
    HoverCard: {
      styles: () => ({
        dropdown: { backgroundColor: NP.panel, borderRadius: 0, borderLeft: `3px solid ${NP.cyan}`, boxShadow: '0 6px 18px rgba(0,0,0,0.5)' },
      }),
    },
    Progress: {
      styles: () => ({ root: { borderRadius: 0, backgroundColor: NP.track }, bar: { borderRadius: 0 } }),
    },
  },
};
