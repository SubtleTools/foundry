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

const l = newList().item('First item').item('Second item').item('Third item');
const result = l.render();
process.stdout.write(result);
