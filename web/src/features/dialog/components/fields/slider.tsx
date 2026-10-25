import { Box, Slider, Text } from '@mantine/core';
import { NP } from '../../../../theme';
import { ISlider } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';

interface Props {
  row: ISlider;
  index: number;
  control: Control<FormValues>;
}

const SliderField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default ?? props.row.min ?? 0,
  });

  return (
    <Box>
      <Text
        sx={{
          fontFamily: NP.headingFont,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          color: NP.muted,
          marginBottom: 8,
        }}
      >
        {props.row.label}
      </Text>
      <Slider
        mb={22}
        value={controller.field.value}
        name={controller.field.name}
        ref={controller.field.ref}
        onBlur={controller.field.onBlur}
        onChange={controller.field.onChange}
        defaultValue={props.row.default ?? props.row.min ?? 0}
        min={props.row.min}
        max={props.row.max}
        step={props.row.step}
        disabled={props.row.disabled}
        marks={[
          { value: props.row.min ?? 0, label: props.row.min ?? 0 },
          { value: props.row.max ?? 100, label: props.row.max ?? 100 },
        ]}
      />
    </Box>
  );
};

export default SliderField;
