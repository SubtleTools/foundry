import {
  Color,
  ColorProfile,
  HorizontalAlignment,
  NewStyle,
  RoundedBorder,
  SetColorProfile,
} from '../../../../src/index.js';

// Set color profile for consistent output
// Note: FORCE_COLOR=3 handles color profile via lipgloss getColorProfileWithForceColor

const style = NewStyle()
  .Foreground(Color('#FFFFFF'))
  .Background(Color('#0000FF'))
  .border(RoundedBorder())
  .Padding(2)
  .Width(30)
  .align(HorizontalAlignment.Center);
const result = style.render('Complex Styled Content');
process.stdout.write(result);
