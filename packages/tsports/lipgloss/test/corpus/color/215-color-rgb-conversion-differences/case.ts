import { NewRenderer, NewStyle } from '../../../../src/index';

const re = NewRenderer();

// These are the specific RGB values that show conversion differences
// between Go and TypeScript implementations
const problematicColors = [
  'rgb(245,197,140)',
  'rgb(245,200,140)',
  'rgb(245,203,139)',
  'rgb(243,206,139)',
  'rgb(239,192,137)',
  'rgb(239,195,137)',
  'rgb(239,199,136)',
  'rgb(239,202,136)',
];

let index = 1;
for (const colorStr of problematicColors) {
  const style = NewStyle().color(colorStr);
  console.log(
    `Color ${index}: ${colorStr} rendered as: ${style.render('TEST')}`
  );
  index++;
}
