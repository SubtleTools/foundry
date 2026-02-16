import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
  Dash,
  Roman,
  AdaptiveColor,
} from '../../../../src/index.js';
import { Hex } from '@tsports/go-colorful';

// Set color profile for consistent output

const purple = NewStyle().color(Colors[99] || '#800080').marginRight(1);
const pink = NewStyle().color(Colors[212] || '#FF87D7').marginRight(1);
const base = NewStyle().marginBottom(1).marginLeft(1);
const faint = NewStyle().faint(true);
const dim = Colors[250] || '#C0C0C0';
const highlight = '#EE6FF8';
const special = new AdaptiveColor('#43BF6D', '#73F59F'); // AdaptiveColor

const checklistEnumStyle = (items: any, index: number) => {
  if (index === 1 || index === 2 || index === 4) {
    return NewStyle().color(special).paddingRight(1); // Using light variant for consistency
  }
  return NewStyle().paddingRight(1);
};

const checklistEnum = (items: any, index: number) => {
  if (index === 1 || index === 2 || index === 4) {
    return '✓';
  }
  return '•';
};

const checklistStyle = (items: any, index: number) => {
  if (index === 1 || index === 2 || index === 4) {
    return NewStyle().strikethrough(true).color(new AdaptiveColor('#969B86', '#696969'));
  }
  return NewStyle();
};

// Color grid generation matching Go's colorGrid function with BlendLuv
function colorGrid(xSteps: number, ySteps: number): string[][] {
  const x0y0 = Hex("#F25D94");
  const x1y0 = Hex("#EDFF82");
  const x0y1 = Hex("#643AFF");
  const x1y1 = Hex("#14F9D5");

  // Blend x0y0 -> x0y1 for left column
  const x0 = [];
  for (let i = 0; i < ySteps; i++) {
    x0.push(x0y0.blendLuv(x0y1, i / ySteps));
  }

  // Blend x1y0 -> x1y1 for right column
  const x1 = [];
  for (let i = 0; i < ySteps; i++) {
    x1.push(x1y0.blendLuv(x1y1, i / ySteps));
  }

  // Create grid by blending each row from left to right
  const grid: string[][] = [];
  for (let x = 0; x < ySteps; x++) {
    const y0 = x0[x];
    grid[x] = [];
    for (let y = 0; y < xSteps; y++) {
      grid[x][y] = y0!.blendLuv(x1[x]!, y / xSteps).hex();
    }
  }

  return grid;
}

const colors = colorGrid(1, 5);

const titleStyle = NewStyle().italic(true).color("#FFF7DB");

const lipglossStyleFunc = (items: any, index: number) => {
  if (index === items.length() - 1) {
    return titleStyle.padding(1, 2).margin(0, 0, 1, 0).maxWidth(20).background(colors[index]![0]!);
  }
  return titleStyle.padding(0, 5 - index, 0, index + 2).maxWidth(20).background(colors[index]![0]!);
};

const history = "Medieval quince preserves, which went by the French name cotignac, produced in a clear version and a fruit pulp version, began to lose their medieval seasoning of spices in the 16th century. In the 17th century, La Varenne provided recipes for both thick and clear cotignac.";

const l = newList()
  .enumeratorStyle(purple)
  .item("Lip Gloss")
  .item("Blush")
  .item("Eye Shadow")
  .item("Mascara")
  .item("Foundation")
  .item(
    newList()
      .enumeratorStyle(pink)
      .item("Citrus Fruits to Try")
      .item(
        newList()
          .itemStyleFunc(checklistStyle)
          .enumeratorStyleFunc(checklistEnumStyle)
          .enumerator(checklistEnum)
          .item("Grapefruit")
          .item("Yuzu")
          .item("Citron")
          .item("Kumquat")
          .item("Pomelo")
      )
      .item("Actual Lip Gloss Vendors")
      .item(
        newList()
          .itemStyleFunc(checklistStyle)
          .enumeratorStyleFunc(checklistEnumStyle)
          .enumerator(checklistEnum)
          .item("Glossier")
          .item("Claire‘s Boutique")
          .item("Nyx")
          .item("Mac")
          .item("Milk")
          .item(
            newList()
              .enumeratorStyle(purple)
              .enumerator(Dash)
              .itemStyleFunc(lipglossStyleFunc)
              .item("Lip Gloss")
              .item("Lip Gloss")
              .item("Lip Gloss")
              .item("Lip Gloss")
              .item(
                newList()
                  .enumeratorStyle(NewStyle().color(colors[4]![0]!).marginRight(1))
                  .item("\nStyle Definitions for Nice Terminal Layouts\n─────")
                  .item("From Charm")
                  .item("https://github.com/charmbracelet/lipgloss")
                  .item(
                    newList()
                      .enumeratorStyle(NewStyle().color(colors[3]![0]!).marginRight(1))
                      .item("Emperors: Julio-Claudian dynasty")
                      .item(
                        NewStyle().padding(1).render(
                          newList(
                            "Augustus",
                            "Tiberius",
                            "Caligula",
                            "Claudius",
                            "Nero"
                          ).enumerator(Roman).toString()
                        )
                      )
                      .item(
                        NewStyle()
                          .bold(true)
                          .color("#FAFAFA")
                          .background("#7D56F4")
                          .align(HorizontalAlignment.Center, VerticalAlignment.Center)
                          .padding(1, 3)
                          .margin(0, 1, 1, 1)
                          .width(40)
                          .render(history)
                      )
                      .item(
                        newTable()
                          .width(30)
                          .borderStyle(purple.marginRight(0))
                          .styleFunc((row: number, col: number) => {
                            let style = NewStyle();
                            if (col === 0) {
                              style = style.align(HorizontalAlignment.Center);
                            } else {
                              style = style.align(HorizontalAlignment.Right).paddingRight(2);
                            }
                            if (row === 0) { // HeaderRow is -1 but here Go uses 0? Wait.
                              // In Go example: Headers("ITEM", "QUANTITY"). So row 0 is first data row?
                              // Go lipgloss table: Headers are rendered separately.
                              // Wait, Go example uses table.New().Headers(...).Row(...).
                              // In StyleFunc, row=0 is the first DATA row. Headers are handled by HeaderStyle or specific logic?
                              // In Go Lipgloss table, StyleFunc: "row is the row index (0 for the first row)".
                              // Headers are separate.
                              // But wait, the Go code:
                              /*
                              if row == 0 {
                                return style.Bold(true).Align(lipgloss.Center).PaddingRight(0)
                              }
                              */
                              // This styles the first data row (Apple).
                              
                              // Wait, looking at golden output:
                              /*
                              • ╭──────────────┬─────────────╮
                                │     ITEM     │   QUANTITY  │
                                ├──────────────┼─────────────┤
                                │    Apple     │      6      │
                              */
                              // The headers are styled?
                              
                              // In TS, HeaderRow is -1.
                              // If I want to match Go logic, I should check if Go's `StyleFunc` receives headers as -1?
                              // Go docs says: "HeaderRow denotes the header's row index... const HeaderRow int = -1".
                              
                              // So `row == 0` means first data row.
                              
                              return style.bold(true).align(HorizontalAlignment.Center).paddingRight(0);
                            }
                            return style.faint(true);
                          })
                          .headers("ITEM", "QUANTITY")
                          .row("Apple", "6")
                          .row("Banana", "10")
                          .row("Orange", "2")
                          .row("Strawberry", "12")
                      )
                      .item("Documents")
                      .item(
                        newList()
                          .enumerator((items: any, i: number) => {
                            if (i === 1) return "│\n│";
                            return " ";
                          })
                          .itemStyleFunc((items: any, i: number) => {
                            if (i === 1) return base.color(highlight);
                            return base.color(dim);
                          })
                          .enumeratorStyleFunc((items: any, i: number) => {
                            if (i === 1) return NewStyle().color(highlight);
                            return NewStyle().color(dim);
                          })
                          .item("Foo Document\n" + faint.render("1 day ago"))
                          .item("Bar Document\n" + faint.render("2 days ago"))
                          .item("Baz Document\n" + faint.render("10 minutes ago"))
                          .item("Qux Document\n" + faint.render("1 month ago"))
                      )
                      .item("EOF")
                  )
                  .item("go get github.com/charmbracelet/lipgloss/list\n")
              )
              .item("See ya later")
          )
      )
      .item("List")
  )
  .item("xoxo, Charm_™");

console.log(l.toString());
