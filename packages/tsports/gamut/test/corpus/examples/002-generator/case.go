package main

import (
	"encoding/json"
	"fmt"

	colorful "github.com/lucasb-eyer/go-colorful"
	"github.com/muesli/gamut"
)

func main() {
	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		panic(err)
	}

	hexColors := make([]string, 0, len(colors))
	for _, c := range colors {
		col, ok := colorful.MakeColor(c)
		if !ok {
			panic(fmt.Sprintf("invalid RGB color: %v", c))
		}
		hexColors = append(hexColors, col.Hex())
	}

	output, _ := json.MarshalIndent(hexColors, "", "  ")
	fmt.Println(string(output))
}
