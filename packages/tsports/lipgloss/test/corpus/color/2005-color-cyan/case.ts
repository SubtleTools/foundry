import {
  BorderStyles,
  ColorProfile,
  Color,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  SetColorProfile,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output
// SetColorProfile(ColorProfile.TrueColor);

const style = NewStyle().color(Color('cyan'));
const result = style.render('Cyan Text');
process.stdout.write(result);
