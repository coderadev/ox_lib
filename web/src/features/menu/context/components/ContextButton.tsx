import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';
import { NP } from '../../../../theme';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((_theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: 'inherit',
    whiteSpace: 'pre-wrap',
    fontFamily: NP.headingFont,
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  button: {
    '&&': {
      height: 'fit-content',
      minHeight: 30,
      width: '100%',
      padding: '5px 16px',
      borderRadius: 0,
      backgroundColor: 'transparent',
      color: params.disabled ? '#4a525c' : '#ffffff',
      transition: 'background-color 60ms linear, color 60ms linear',
      '&:hover': {
        backgroundColor: params.readOnly || params.disabled ? 'transparent' : '#ffffff',
        color: params.readOnly || params.disabled ? undefined : '#0b0e12',
        cursor: params.readOnly ? 'unset' : 'pointer',
        '& .ctx-desc': { color: params.readOnly || params.disabled ? undefined : '#4b535c' },
      },
      '&:active': { transform: 'unset' },
      '&:disabled, &[data-disabled]': { backgroundColor: 'transparent', color: '#4a525c', cursor: 'not-allowed' },
    },
  },
  iconImage: {
    maxWidth: '18px',
  },
  description: {
    color: params.disabled ? '#3b424a' : NP.muted,
    fontFamily: NP.bodyFont,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 12,
    textTransform: 'none',
    letterSpacing: 0,
  },
  dropdown: {
    padding: 10,
    color: '#ffffff',
    fontFamily: NP.bodyFont,
    fontWeight: 500,
    fontSize: 14,
    maxWidth: 256,
    width: 'fit-content',
    border: 'none',
  },
  buttonStack: {
    gap: 2,
    flex: '1',
  },
  buttonGroup: {
    gap: 10,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    fontFamily: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 'inherit',
    '& p': { margin: 0 },
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    opacity: 0.8,
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="sm"
                            style={{ color: button.iconColor }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText} component="div">
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={`${classes.description} ctx-desc`} component="div">
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress value={button.progress} size="xs" color={button.colorScheme || 'blue'} />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth fontSize={12} />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <>
                  <Text key={`context-metadata-${index}`}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'dark.3'}
                    />
                  )}
                </>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
