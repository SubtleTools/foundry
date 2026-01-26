package main

import (
	"encoding/json"
	"fmt"
	"image/color"

	colorful "github.com/lucasb-eyer/go-colorful"
	"github.com/muesli/gamut"
)

type PaletteResult struct {
	Name   string   `json:"name"`
	Colors []string `json:"colors"`
}

func colorSliceToHex(colors []color.Color) []string {
	hexColors := make([]string, 0, len(colors))
	for _, c := range colors {
		col, _ := colorful.MakeColor(c)
		hexColors = append(hexColors, col.Hex())
	}
	return hexColors
}

func main() {
	c, _ := colorful.Hex("#2F1B82")
	cells := 8

	results := []PaletteResult{}

	// generators
	cc, _ := gamut.Generate(cells, gamut.SimilarHueGenerator{Color: c})
	results = append(results, PaletteResult{Name: "similarhue", Colors: colorSliceToHex(cc)})

	cc, _ = gamut.Generate(cells, gamut.PastelGenerator{})
	results = append(results, PaletteResult{Name: "pastel", Colors: colorSliceToHex(cc)})

	cc, _ = gamut.Generate(cells, gamut.HappyGenerator{})
	results = append(results, PaletteResult{Name: "happy", Colors: colorSliceToHex(cc)})

	cc, _ = gamut.Generate(cells, gamut.WarmGenerator{})
	results = append(results, PaletteResult{Name: "warm", Colors: colorSliceToHex(cc)})

	// angular
	results = append(results, PaletteResult{Name: "triadic", Colors: colorSliceToHex(gamut.Triadic(c))})
	results = append(results, PaletteResult{Name: "quadratic", Colors: colorSliceToHex(gamut.Quadratic(c))})
	results = append(results, PaletteResult{Name: "tetradic", Colors: colorSliceToHex(gamut.Tetradic(c, gamut.HueOffset(c, 60)))})
	results = append(results, PaletteResult{Name: "analogous", Colors: colorSliceToHex(gamut.Analogous(c))})
	results = append(results, PaletteResult{Name: "splitcomplementary", Colors: colorSliceToHex(gamut.SplitComplementary(c))})

	// color wheel
	results = append(results, PaletteResult{Name: "monochromatic", Colors: colorSliceToHex(gamut.Monochromatic(c, cells))})
	results = append(results, PaletteResult{Name: "shades", Colors: colorSliceToHex(gamut.Shades(c, cells))})
	results = append(results, PaletteResult{Name: "tints", Colors: colorSliceToHex(gamut.Tints(c, cells))})
	results = append(results, PaletteResult{Name: "tones", Colors: colorSliceToHex(gamut.Tones(c, cells))})

	// blends
	results = append(results, PaletteResult{Name: "blends", Colors: colorSliceToHex(gamut.Blends(c, gamut.HueOffset(c, 90), cells))})

	output, _ := json.MarshalIndent(results, "", "  ")
	fmt.Println(string(output))
}
