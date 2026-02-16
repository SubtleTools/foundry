import {
  ColorProfile,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  RoundedBorder,
  SetColorProfile,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output
SetColorProfile(ColorProfile.TrueColor);

const style = NewStyle().border(RoundedBorder()).width(20);
const result = style.render('Bordered Content');
process.stdout.write(result);
