import {
  BorderStyles,
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

const style = NewStyle().color('#FF0000');
const result = style.render('Hex Color');
process.stdout.write(result);
