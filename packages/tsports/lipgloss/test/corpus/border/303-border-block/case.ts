import {
  BlockBorder,
  ColorProfile,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  SetColorProfile,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output
SetColorProfile(ColorProfile.TrueColor);

const style = NewStyle().border(BlockBorder()).width(20);
const result = style.render('Bordered Content');
process.stdout.write(result);
