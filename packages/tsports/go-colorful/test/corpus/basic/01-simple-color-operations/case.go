package main

import (
	"fmt"
	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	// Test basic color operations
	c1 := colorful.Color{R: 1.0, G: 0.0, B: 0.0}
	fmt.Printf("Color: R=%.6f G=%.6f B=%.6f\n", c1.R, c1.G, c1.B)
	
	// RGBA conversion
	r, g, b, a := c1.RGBA()
	fmt.Printf("RGBA: %d %d %d %d\n", r, g, b, a)
	
	// RGB255 conversion  
	r255, g255, b255 := c1.RGB255()
	fmt.Printf("RGB255: %d %d %d\n", r255, g255, b255)
	
	// Hex conversion
	fmt.Printf("Hex: %s\n", c1.Hex())
	
	// HSV conversion
	h, s, v := c1.Hsv()
	fmt.Printf("HSV: %.6f %.6f %.6f\n", h, s, v)
	
	// HSL conversion
	h2, s2, l2 := c1.Hsl()  
	fmt.Printf("HSL: %.6f %.6f %.6f\n", h2, s2, l2)
	
	// Lab conversion
	l, a_val, b_val := c1.Lab()
	fmt.Printf("Lab: %.6f %.6f %.6f\n", l, a_val, b_val)
	
	// Test hex parsing
	c2, err := colorful.Hex("#FF0080")
	if err != nil {
		panic(err)
	}
	fmt.Printf("Parsed hex: R=%.6f G=%.6f B=%.6f\n", c2.R, c2.G, c2.B)
	
	// Test color distance
	c3 := colorful.Color{R: 0.0, G: 1.0, B: 0.0}
	dist := c1.DistanceLab(c3)
	fmt.Printf("Distance: %.6f\n", dist)
	
	// Test color blending
	blended := c1.BlendLab(c3, 0.5)
	fmt.Printf("Blended: R=%.6f G=%.6f B=%.6f\n", blended.R, blended.G, blended.B)
}