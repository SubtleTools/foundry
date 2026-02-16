import {
  ColorProfile,
  Colors,
  DoubleBorder,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  SetColorProfile,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output
SetColorProfile(ColorProfile.TrueColor);

const style = NewStyle().border(DoubleBorder()).width(20);
const result = style.render('Bordered Content');
process.stdout.write(result);
