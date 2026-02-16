import * as lipgloss from '../../../../src/index.js';
// @ts-ignore
import type { Color } from 'image/color';
// @ts-ignore
import * as colorful from '@tsports/go-colorful';
// @ts-ignore
import * as gamut from '@tsports/gamut';

lipgloss.setHasDarkBackground(true);

// Constants
const width = 96;
const columnWidth = 30;

// Style definitions
const normal = lipgloss.Color("#EEEEEE");
const subtle = new lipgloss.AdaptiveColor("#D9DCCF", "#383838");
const highlight = new lipgloss.AdaptiveColor("#874BFD", "#7D56F4");
const special = new lipgloss.AdaptiveColor("#43BF6D", "#73F59F");
const blends = gamut.Blends(gamut.Hex("#F25D94"), gamut.Hex("#EDFF82"), 50);

const base = lipgloss.NewStyle().foreground(normal);

const divider = lipgloss.NewStyle()
    .padding(0, 1)
    .foreground(subtle)
    .render("•");

const url = (s: string) => lipgloss.NewStyle().foreground(special).render(s);

// Tabs
const activeTabBorder = {
    top:         "─",
    bottom:      " ",
    left:        "│",
    right:       "│",
    topLeft:     "╭",
    topRight:    "╮",
    bottomLeft:  "┘",
    bottomRight: "└",
};

const tabBorder = {
    top:         "─",
    bottom:      "─",
    left:        "│",
    right:       "│",
    topLeft:     "╭",
    topRight:    "╮",
    bottomLeft:  "┴",
    bottomRight: "┴",
};

const tab = lipgloss.NewStyle()
    .border(tabBorder, true)
    .borderForeground(highlight)
    .padding(0, 1);

const activeTab = tab.border(activeTabBorder as any, true);

const tabGap = tab
    .borderTop(false)
    .borderLeft(false)
    .borderRight(false);

const titleStyle = lipgloss.NewStyle()
    .marginLeft(1)
    .marginRight(5)
    .padding(0, 1)
    .italic(true)
    .foreground(lipgloss.Color("#FFF7DB"))
    .SetString("Lip Gloss");

const descStyle = base.marginTop(1);

const infoStyle = base
    .borderStyle(lipgloss.NormalBorder())
    .borderTop(true)
    .borderForeground(subtle);

const dialogBoxStyle = lipgloss.NewStyle()
    .border(lipgloss.RoundedBorder())
    .borderForeground(lipgloss.Color("#874BFD"))
    .padding(1, 0)
    .borderTop(true)
    .borderLeft(true)
    .borderRight(true)
    .borderBottom(true);

const buttonStyle = lipgloss.NewStyle()
    .foreground(lipgloss.Color("#FFF7DB"))
    .background(lipgloss.Color("#888B7E"))
    .padding(0, 3)
    .marginTop(1);

const activeButtonStyle = buttonStyle
    .foreground(lipgloss.Color("#FFF7DB"))
    .background(lipgloss.Color("#F25D94"))
    .marginRight(2)
    .underline(true);

const listIndex = lipgloss.NewStyle()
    .border(lipgloss.NormalBorder(), false, true, false, false)
    .borderForeground(subtle)
    .marginRight(2)
    .height(8)
    .width(columnWidth + 1);

const listHeader = (s: string) => base
    .borderStyle(lipgloss.NormalBorder())
    .borderBottom(true)
    .borderForeground(subtle)
    .marginRight(2)
    .render(s);

const listItem = (s: string) => base.paddingLeft(2).render(s);

const checkMark = lipgloss.NewStyle()
    .foreground(special)
    .paddingRight(1)
    .render("✓");

const listDone = (s: string) => {
    return checkMark + lipgloss.NewStyle()
        .strikethrough(true)
        .foreground(new lipgloss.AdaptiveColor("#969B86", "#696969"))
        .render(s);
}

const historyStyle = lipgloss.NewStyle()
    .align(lipgloss.Align.Left)
    .foreground(lipgloss.Color("#FAFAFA"))
    .background(highlight)
    .margin(1, 3, 0, 0)
    .padding(1, 2)
    .height(19)
    .width(columnWidth);

const statusNugget = lipgloss.NewStyle()
    .foreground(lipgloss.Color("#FFFDF5"))
    .padding(0, 1);

const statusBarStyle = lipgloss.NewStyle()
    .foreground(new lipgloss.AdaptiveColor("#343433", "#C1C6B2"))
    .background(new lipgloss.AdaptiveColor("#D9DCCF", "#353533"));

const statusStyle = lipgloss.NewStyle()
    .inherit(statusBarStyle)
    .foreground(lipgloss.Color("#FFFDF5"))
    .background(lipgloss.Color("#FF5F87"))
    .padding(0, 1)
    .marginRight(1);

const encodingStyle = statusNugget
    .background(lipgloss.Color("#A550DF"))
    .align(lipgloss.Align.Right);



const statusText = lipgloss.NewStyle().inherit(statusBarStyle);




const fishCakeStyle = statusNugget.background(lipgloss.Color("#6124DF"));

let docStyle = lipgloss.NewStyle().padding(1, 2, 1, 2);

function main() {
    const physicalWidth = process.stdout.columns || 0;
    let doc = "";

    // Tabs
    {
        let row = lipgloss.JoinHorizontal(
            lipgloss.Top,
            activeTab.render("Lip Gloss"),
            tab.render("Blush"),
            tab.render("Eye Shadow"),
            tab.render("Mascara"),
            tab.render("Foundation")
        );
        const gap = tabGap.render(" ".repeat(Math.max(0, width - lipgloss.Width(row) - 2)));
        row = lipgloss.JoinHorizontal(lipgloss.Bottom, row, gap);
        doc += row + "\n\n";
    }

    // Title
    {
        const colors = colorGrid(1, 5);
        let title = "";
        
        for (let i = 0; i < colors.length; i++) {
            const v = colors[i];
            if (!v || !v[0]) continue;
            const offset = 2;
            const c = lipgloss.Color(v[0]);
            // Mimic Go: titleStyle.MarginLeft(i*offset).Background(c).String()
            // String() renders the set string "Lip Gloss"
            title += titleStyle.marginLeft(i * offset).background(c).render("Lip Gloss");
            if (i < colors.length - 1) {
                title += "\n";
            }
        }

        const desc = lipgloss.JoinVertical(lipgloss.Left,
            descStyle.render("Style Definitions for Nice Terminal Layouts"),
            infoStyle.render("From Charm" + divider + url("https://github.com/charmbracelet/lipgloss"))
        );

        const row = lipgloss.JoinHorizontal(lipgloss.Top, title, desc);
        doc += row + "\n\n";
    }

    // Dialog
    {
        const ok = activeButtonStyle.render("Yes");
        const cancel = buttonStyle.render("Maybe");

        const question = lipgloss.NewStyle().width(50).align(lipgloss.Align.Center).render(rainbow(lipgloss.NewStyle(), "Are you sure you want to eat marmalade?", blends));
        const buttons = lipgloss.JoinHorizontal(lipgloss.Top, ok, cancel);
        const ui = lipgloss.JoinVertical(lipgloss.Center, question, buttons);

        const dialog = lipgloss.Place(width, 9,
            lipgloss.Center, lipgloss.Center,
            dialogBoxStyle.render(ui),
            {
                chars: "猫咪",
                foreground: subtle
            }
        );

        doc += dialog + "\n\n";
    }

    // Color grid
    const colorGridStr = (() => {
        const colors = colorGrid(14, 8);
        let b = "";
        for (const x of colors) {
            for (const y of x) {
                const s = lipgloss.NewStyle().background(lipgloss.Color(y)).render("  ");
                b += s;
            }
            b += "\n";
        }
        return b;
    })();

    const lists = lipgloss.JoinHorizontal(lipgloss.Top,
        listIndex.render(
            lipgloss.JoinVertical(lipgloss.Left,
                listHeader("Citrus Fruits to Try"),
                listDone("Grapefruit"),
                listDone("Yuzu"),
                listItem("Citron"),
                listItem("Kumquat"),
                listItem("Pomelo"),
            )
        ),
        listIndex.width(columnWidth).render(
            lipgloss.JoinVertical(lipgloss.Left,
                listHeader("Actual Lip Gloss Vendors"),
                listItem("Glossier"),
                listItem("Claire‘s Boutique"),
                listDone("Nyx"),
                listItem("Mac"),
                listDone("Milk"),
            )
        )
    );

    doc += lipgloss.JoinHorizontal(lipgloss.Top, lists, colorGridStr);

    // Marmalade history
    {
        const historyA = "The Romans learned from the Greeks that quinces slowly cooked with honey would “set” when cool. The Apicius gives a recipe for preserving whole quinces, stems and leaves attached, in a bath of honey diluted with defrutum: Roman marmalade. Preserves of quince and lemon appear (along with rose, apple, plum and pear) in the Book of ceremonies of the Byzantine Emperor Constantine VII Porphyrogennetos.";
			  const historyB = "Medieval quince preserves, which went by the French name cotignac, produced in a clear version and a fruit pulp version, began to lose their medieval seasoning of spices in the 16th century. In the 17th century, La Varenne provided recipes for both thick and clear cotignac.";
			  const historyC = "In 1524, Henry VIII, King of England, received a “box of marmalade” from Mr. Hull of Exeter. This was probably marmelada, a solid quince paste from Portugal, still made and sold in southern Europe today. It became a favourite treat of Anne Boleyn and her ladies in waiting.";
        
        doc += lipgloss.JoinHorizontal(
            lipgloss.Top,
            historyStyle.align(lipgloss.Align.Right).render(historyA),
            historyStyle.align(lipgloss.Align.Center).render(historyB),
            historyStyle.marginRight(0).render(historyC)
        );

        doc += "\n\n";
    }

    // Status bar
    {
        const w = lipgloss.Width;

        const statusKey = statusStyle.render("STATUS");
        const encoding = encodingStyle.render("UTF-8");
        const fishCake = fishCakeStyle.render("🍥 Fish Cake");
        

        const statusValWidth = width - w(statusKey) - w(encoding) - w(fishCake);
        
        const statusVal = statusText
            .width(statusValWidth)
            .render("Ravishing");
            
        const bar = lipgloss.JoinHorizontal(lipgloss.Top,
            statusKey,
            statusVal,
            encoding,
            fishCake
        );

        doc += statusBarStyle.width(width).render(bar);
    }
    
    if (physicalWidth > 0) {
        docStyle = docStyle.maxWidth(physicalWidth);
    }

    console.log(docStyle.render(doc));
}

function colorGrid(xSteps: number, ySteps: number): string[][] {
    const x0y0 = gamut.Hex("#F25D94");
    const x1y0 = gamut.Hex("#EDFF82");
    const x0y1 = gamut.Hex("#643AFF");
    const x1y1 = gamut.Hex("#14F9D5");

    const x0: typeof x0y0[] = [];
    for (let i = 0; i < ySteps; i++) {
        x0[i] = x0y0.BlendLuv(x0y1, i / ySteps);
    }

    const x1: typeof x1y0[] = [];
    for (let i = 0; i < ySteps; i++) {
        x1[i] = x1y0.BlendLuv(x1y1, i / ySteps);
    }

    const grid: string[][] = [];
    for (let x = 0; x < ySteps; x++) {
        const y0 = x0[x]!;
        grid[x] = [];
        for (let y = 0; y < xSteps; y++) {
            grid[x]![y] = y0.BlendLuv(x1[x]!, y / xSteps).Hex();
        }
    }
    return grid;
}

function rainbow(base: lipgloss.Style, s: string, colors: Color[]): string {
    let str = "";
    for (let i = 0; i < s.length; i++) {
        const [color, _] = colorful.MakeColor(colors[i % colors.length]!);
        str = str + base.foreground(lipgloss.Color(color.hex())).render(s[i]!);
    }
    return str;
}

main();
