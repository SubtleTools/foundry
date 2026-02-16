#!/usr/bin/env bun

/**
 * Pokemon Table Example
 *
 * Demonstrates styled table with conditional formatting and type colors
 * Port of: test/archive/go-reference/examples/table/pokemon/main.go
 */

import { Borders, HeaderRow, Renderer, Table, SetColorProfile, ColorProfile } from '@tsports/lipgloss';

function main() {
  const re = new Renderer();
  
  // Set color profile on renderer based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    re.setColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    re.setColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    re.setColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    re.setColorProfile(ColorProfile.ANSI);
  } else {
    // Default to TrueColor for better output
    re.setColorProfile(ColorProfile.TrueColor);
  }
  const baseStyle = re.newStyle().padding(0, 1);
  const headerStyle = baseStyle.color('252').bold(true);
  const selectedStyle = baseStyle.color('#01BE85').backgroundColor('#00432F');

  const typeColors: Record<string, string> = {
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

  const dimTypeColors: Record<string, string> = {
    Bug: '#97AD64',
    Electric: '#FCFF5F',
    Fire: '#BA5F75',
    Flying: '#C979B2',
    Grass: '#59B980',
    Ground: '#C77151',
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

  const capitalizeHeaders = (data: string[]): string[] => {
    return data.map((h) => h.toUpperCase());
  };

  const t = new Table()
    .border(Borders.Normal)
    .borderStyle(re.newStyle().color('238'))
    .headers(...capitalizeHeaders(headers))
    .width(80)
    .rows(...data)
    .styleFunc((row: number, col: number) => {
      if (row === HeaderRow) {
        return headerStyle;
      }

      if (data[row][1] === 'Pikachu') {
        return selectedStyle;
      }

      const even = row % 2 === 0;

      switch (col) {
        case 2:
        case 3: {
          // Type 1 + 2
          const colors = even ? dimTypeColors : typeColors;
          const type = data[row][col];
          const color = type ? colors[type] : undefined;
          return color ? baseStyle.color(color) : baseStyle;
        }
      }

      if (even) {
        return baseStyle.color('245');
      }
      return baseStyle.color('252');
    });

  console.log(t.toString());
}

// Run the example
main();
