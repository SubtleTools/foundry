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

const style = NewStyle().width(20).alignCenter();
const result = style.render('Centered');
process.stdout.write(result);
