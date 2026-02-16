import {
  ColorProfile,
  NewStyle,
  NormalBorder,
  SetColorProfile,
} from '../../../../src/index.js';

// Set color profile for consistent output
SetColorProfile(ColorProfile.TrueColor);

const style = NewStyle().Border(NormalBorder()).Width(20);
const result = style.Render('Bordered Content');
process.stdout.write(result);
