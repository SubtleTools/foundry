package main

import (
	"fmt"
	"math/rand"

	colorful "github.com/lucasb-eyer/go-colorful"
)

func main() {
	fmt.Printf("=== Test 1: Default random (should be different each run) ===\n")
	colors1 := colorful.FastWarmPalette(3)
	for i, c := range colors1 {
		fmt.Printf("Color %d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}

	fmt.Printf("\n=== Test 2: Seeded random with seed 1 (should be deterministic) ===\n")
	rand.Seed(1)
	colors2 := colorful.FastWarmPalette(3)
	for i, c := range colors2 {
		fmt.Printf("Color %d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}

	fmt.Printf("\n=== Test 3: Seeded random with seed 1 again (should be same as Test 2) ===\n")
	rand.Seed(1)
	colors3 := colorful.FastWarmPalette(3)
	for i, c := range colors3 {
		fmt.Printf("Color %d: R=%.6f G=%.6f B=%.6f Hex=%s\n", i, c.R, c.G, c.B, c.Hex())
	}

	fmt.Printf("\n=== Test 4: Current time (nanoseconds) ===\n")
	fmt.Printf("Current time nano: %d\n", 123456789)
}
