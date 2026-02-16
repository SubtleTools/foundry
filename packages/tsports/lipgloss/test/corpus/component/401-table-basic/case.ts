import {
  Borders,
  ColorProfile,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newTable,
  newList,
  SetColorProfile,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output
SetColorProfile(ColorProfile.TrueColor);

const t = newTable()
  .setBorder(Borders.Normal)
  .setHeaders('Name', 'Age')
  .row('Alice', '30')
  .row('Bob', '25');
const result = t.render();
process.stdout.write(result);
