package main

import (
	"encoding/json"
	"fmt"

	colorful "github.com/lucasb-eyer/go-colorful"
	"github.com/muesli/gamut"
)

type PaletteResult struct {
	Name   string   `json:"name"`
	Colors []string `json:"colors"`
}

func colorToHex(c colorful.Color) string {
	return c.Hex()
}

func main() {
	c, _ := colorful.Hex("#2F1B82")

	results := []PaletteResult{
		{
			Name:   "Monochromatic",
			Colors: make([]string, 0),
		},
		{
			Name:   "Shades",
			Colors: make([]string, 0),
		},
		{
			Name:   "Tints",
			Colors: make([]string, 0),
		},
		{
			Name:   "Tones",
			Colors: make([]string, 0),
		},
		{
			Name:   "Analogous",
			Colors: make([]string, 0),
		},
		{
			Name:   "Split Complementary",
			Colors: make([]string, 0),
		},
		{
			Name:   "Triadic",
			Colors: make([]string, 0),
		},
		{
			Name:   "Quadratic",
			Colors: make([]string, 0),
		},
		{
			Name:   "Tetradic",
			Colors: make([]string, 0),
		},
	}

	// Monochromatic
	for _, color := range gamut.Monochromatic(c, 8) {
		col, _ := colorful.MakeColor(color)
		results[0].Colors = append(results[0].Colors, colorToHex(col))
	}

	// Shades
	for _, color := range gamut.Shades(c, 8) {
		col, _ := colorful.MakeColor(color)
		results[1].Colors = append(results[1].Colors, colorToHex(col))
	}

	// Tints
	for _, color := range gamut.Tints(c, 8) {
		col, _ := colorful.MakeColor(color)
		results[2].Colors = append(results[2].Colors, colorToHex(col))
	}

	// Tones
	for _, color := range gamut.Tones(c, 8) {
		col, _ := colorful.MakeColor(color)
		results[3].Colors = append(results[3].Colors, colorToHex(col))
	}

	// Analogous
	for _, color := range gamut.Analogous(c) {
		col, _ := colorful.MakeColor(color)
		results[4].Colors = append(results[4].Colors, colorToHex(col))
	}

	// Split Complementary
	for _, color := range gamut.SplitComplementary(c) {
		col, _ := colorful.MakeColor(color)
		results[5].Colors = append(results[5].Colors, colorToHex(col))
	}

	// Triadic
	for _, color := range gamut.Triadic(c) {
		col, _ := colorful.MakeColor(color)
		results[6].Colors = append(results[6].Colors, colorToHex(col))
	}

	// Quadratic
	for _, color := range gamut.Quadratic(c) {
		col, _ := colorful.MakeColor(color)
		results[7].Colors = append(results[7].Colors, colorToHex(col))
	}

	// Tetradic
	for _, color := range gamut.Tetradic(c, gamut.HueOffset(c, 60)) {
		col, _ := colorful.MakeColor(color)
		results[8].Colors = append(results[8].Colors, colorToHex(col))
	}

	output, _ := json.MarshalIndent(results, "", "  ")
	fmt.Println(string(output))
}
