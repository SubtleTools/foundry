import {
  BorderStyles,
  Color,
  ColorProfile,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  SetColorProfile,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output
// SetColorProfile(ColorProfile.TrueColor);

const style = NewStyle().color(Color('red'));
const result = style.render('Red Text');
process.stdout.write(result);
