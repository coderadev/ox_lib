import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((_theme, params: { canClose?: boolean }) => ({
  root: {
    '&&': {
      backgroundColor: 'transparent',
      color: params.canClose === false ? '#4a525c' : '#fff',
      width: 28,
      height: 28,
      minWidth: 28,
      padding: 0,
      borderRadius: 0,
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
    },
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      classNames={{ root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;
