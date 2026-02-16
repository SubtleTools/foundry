package main

import (
	"fmt"
	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	fmt.Printf("=== Deterministic Color Operations Test ===\n")
	
	// Test 1: Direct HSV creation with known values
	c1 := colorful.Hsv(0, 0.75, 0.55)  // Same as FastWarmPalette logic but deterministic
	fmt.Printf("HSV(0, 0.75, 0.55): R=%.6f G=%.6f B=%.6f Hex=%s\n", c1.R, c1.G, c1.B, c1.Hex())
	
	c2 := colorful.Hsv(120, 0.65, 0.45)
	fmt.Printf("HSV(120, 0.65, 0.45): R=%.6f G=%.6f B=%.6f Hex=%s\n", c2.R, c2.G, c2.B, c2.Hex())
	
	c3 := colorful.Hsv(240, 0.70, 0.50)
	fmt.Printf("HSV(240, 0.70, 0.50): R=%.6f G=%.6f B=%.6f Hex=%s\n", c3.R, c3.G, c3.B, c3.Hex())
	
	// Test 2: Color space conversions
	rgb := colorful.Color{R: 0.8, G: 0.4, B: 0.2}
	h, s, v := rgb.Hsv()
	fmt.Printf("RGB(0.8,0.4,0.2) -> HSV: %.6f %.6f %.6f\n", h, s, v)
	
	l, a, b := rgb.Lab()
	fmt.Printf("RGB(0.8,0.4,0.2) -> Lab: %.6f %.6f %.6f\n", l, a, b)
	
	// Test 3: Manual FastWarmPalette-style generation with known values
	fmt.Printf("\n=== Manual Warm Palette Generation (Deterministic) ===\n")
	count := 3
	for i := 0; i < count; i++ {
		hue := float64(i) * (360.0 / float64(count))
		sat := 0.65  // Fixed saturation instead of random
		val := 0.45  // Fixed value instead of random
		c := colorful.Hsv(hue, sat, val)
		fmt.Printf("Color %d: R=%.6f G=%.6f B=%.6f Hex=%s (H=%.1f S=%.2f V=%.2f)\n", 
			i, c.R, c.G, c.B, c.Hex(), hue, sat, val)
	}
}