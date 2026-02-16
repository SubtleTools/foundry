import {
  Borders,
  Colors,
  HorizontalAlignment,
  NewRenderer,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';

import * as table from '../../../../src/table/index.js';

// Set color profile for consistent output

const re = NewRenderer();
const baseStyle = NewStyle().padding(0, 1);
const headerStyle = baseStyle.color(Colors[252] ?? 'white').bold(true);
const selectedStyle = baseStyle.color('#01BE85').backgroundColor('#00432F');
const typeColors: { [key: string]: string } = {
  Bug: '#D7FF87',
  Electric: '#FDFF90',
  Fire: '#FF7698',
  Flying: '#FF87D7',
  Grass: '#75FBAB',
  Ground: '#FF875F',
  Normal: '#929292',
    Poison: '#7D59FC',
  Water: '#00E2C7',
};
const dimTypeColors: { [key: string]: string } = {
  Bug: '#97AD64',
  Electric: '#FCFF5F',
  Fire: '#BA5F75',
    Flying: '#C979B2',
  Grass: '#59B980',
  Ground: '#C77252',
    Normal: '#717171',
  Poison: '#634BD0',
  Water: '#439F8E',
};

const headers = ['#', 'Name', 'Type 1', 'Type 2', 'Japanese', 'Official Rom.'];
const data = [
  ['1', 'Bulbasaur', 'Grass', 'Poison', 'フシギダネ', 'Fushigidane'],
  ['2', 'Ivysaur', 'Grass', 'Poison', 'フシギソウ', 'Fushigisou'],
  ['3', 'Venusaur', 'Grass', 'Poison', 'フシギバナ', 'Fushigibana'],
  ['4', 'Charmander', 'Fire', '', 'ヒトカゲ', 'Hitokage'],
  ['5', 'Charmeleon', 'Fire', '', 'リザード', 'Lizardo'],
  ['6', 'Charizard', 'Fire', 'Flying', 'リザードン', 'Lizardon'],
  ['7', 'Squirtle', 'Water', '', 'ゼニガメ', 'Zenigame'],
  ['8', 'Wartortle', 'Water', '', 'カメール', 'Kameil'],
  ['9', 'Blastoise', 'Water', '', 'カメックス', 'Kamex'],
  ['10', 'Caterpie', 'Bug', '', 'キャタピー', 'Caterpie'],
  ['11', 'Metapod', 'Bug', '', 'トランセル', 'Trancell'],
  ['12', 'Butterfree', 'Bug', 'Flying', 'バタフリー', 'Butterfree'],
  ['13', 'Weedle', 'Bug', 'Poison', 'ビードル', 'Beedle'],
  ['14', 'Kakuna', 'Bug', 'Poison', 'コクーン', 'Cocoon'],
  ['15', 'Beedrill', 'Bug', 'Poison', 'スピアー', 'Spear'],
  ['16', 'Pidgey', 'Normal', 'Flying', 'ポッポ', 'Poppo'],
  ['17', 'Pidgeotto', 'Normal', 'Flying', 'ピジョン', 'Pigeon'],
  ['18', 'Pidgeot', 'Normal', 'Flying', 'ピジョット', 'Pigeot'],
  ['19', 'Rattata', 'Normal', '', 'コラッタ', 'Koratta'],
  ['20', 'Raticate', 'Normal', '', 'ラッタ', 'Ratta'],
  ['21', 'Spearow', 'Normal', 'Flying', 'オニスズメ', 'Onisuzume'],
  ['22', 'Fearow', 'Normal', 'Flying', 'オニドリル', 'Onidrill'],
  ['23', 'Ekans', 'Poison', '', 'アーボ', 'Arbo'],
  ['24', 'Arbok', 'Poison', '', 'アーボック', 'Arbok'],
  ['25', 'Pikachu', 'Electric', '', 'ピカチュウ', 'Pikachu'],
  ['26', 'Raichu', 'Electric', '', 'ライチュウ', 'Raichu'],
  ['27', 'Sandshrew', 'Ground', '', 'サンド', 'Sand'],
  ['28', 'Sandslash', 'Ground', '', 'サンドパン', 'Sandpan'],
];

const CapitalizeHeaders = (data: string[]): string[] => {
  return data.map((item) => item.toUpperCase());
};

const t = newTable()
  .border(Borders.Normal)
  .borderStyle(NewStyle().color(Colors[238] ?? 'gray'))
  .headers(...CapitalizeHeaders(headers))
  .width(80)
  .rows(...data)
  .styleFunc((row: number, col: number) => {
    if (row === table.HeaderRow) {
      return headerStyle;
    }

    if (data[row] && data[row][1] === 'Pikachu') {
      return selectedStyle;
    }

    const even = row % 2 === 0;

    switch (col) {
      case 2:
      case 3: {
        // Type 1 + 2
        const c = even ? dimTypeColors : typeColors;
        // Match Go: c[data[row][col]] returns nil for missing keys, which means no color
        const typeValue = data[row]?.[col] || '';
        const color = c[typeValue];
        // Only set foreground if we have a color - matches Go's zero-value behavior
        if (color) {
          return baseStyle.color(color);
        }
        return baseStyle;
      }
    }

    if (even) {
      return baseStyle.color(Colors[245] || '#808080');
    }
    return baseStyle.color(Colors[252] || '#FFFFFF');
  });
console.log(t.toString());
