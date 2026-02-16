package main

import (
	"fmt"
	"math/rand"
	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	fmt.Printf("=== Go Seeded FastWarmPalette Test ===\n")
	
	// Test with seed = 1
	rand.Seed(1)
	colors1 := colorful.FastWarmPalette(3)
	for i, c := range colors1 {
		fmt.Printf("Seed1-Color%d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}
	
	fmt.Printf("\n=== Go Seeded FastHappyPalette Test ===\n")
	
	// Reset seed to 1 for happy palette
	rand.Seed(1)
	happyColors := colorful.FastHappyPalette(2)
	for i, c := range happyColors {
		fmt.Printf("Seed1-Happy%d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}
	
	fmt.Printf("\n=== Go Seeded Test with Different Seed ===\n")
	
	// Test with seed = 42 for comparison
	rand.Seed(42)
	colors42 := colorful.FastWarmPalette(2)
	for i, c := range colors42 {
		fmt.Printf("Seed42-Color%d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}
}