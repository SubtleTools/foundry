import {
  Color,
  ColorProfile,
  NewStyle,
  SetColorProfile,
} from '../../../../src/index.js';

// Set color profile for consistent output
// SetColorProfile(ColorProfile.TrueColor);

const style = NewStyle().Foreground(Color('red'));
const result = style.render('Red Text');
process.stdout.write(result);
