package main

import (
	"fmt"
	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	// Test fast palette generation (deterministic)
	colors := colorful.FastWarmPalette(3)
	fmt.Printf("FastWarmPalette count: %d\n", len(colors))
	for i, c := range colors {
		fmt.Printf("Color %d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}
	
	// Test fast happy palette
	happyColors := colorful.FastHappyPalette(2)
	fmt.Printf("FastHappyPalette count: %d\n", len(happyColors))
	for i, c := range happyColors {
		fmt.Printf("Happy %d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}
	
	// Test color creation from different spaces
	hslColor := colorful.Hsl(120.0, 1.0, 0.5) // Green from HSL
	fmt.Printf("HSL Color: R=%.6f G=%.6f B=%.6f Hex=%s\n", hslColor.R, hslColor.G, hslColor.B, hslColor.Hex())
	
	hsvColor := colorful.Hsv(240.0, 1.0, 1.0) // Blue from HSV  
	fmt.Printf("HSV Color: R=%.6f G=%.6f B=%.6f Hex=%s\n", hsvColor.R, hsvColor.G, hsvColor.B, hsvColor.Hex())
}