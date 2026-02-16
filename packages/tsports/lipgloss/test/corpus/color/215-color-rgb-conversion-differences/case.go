package main

import (
	"fmt"
	"os"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	re := lipgloss.NewRenderer(os.Stdout)

	// These are the specific RGB values that show conversion differences
	// between Go and TypeScript implementations
	problematicColors := []string{
		"rgb(245,197,140)",
		"rgb(245,200,140)", 
		"rgb(245,203,139)",
		"rgb(243,206,139)",
		"rgb(239,192,137)",
		"rgb(239,195,137)",
		"rgb(239,199,136)",
		"rgb(239,202,136)",
	}

	for i, colorStr := range problematicColors {
		style := re.NewStyle().Foreground(lipgloss.Color(colorStr))
		fmt.Printf("Color %d: %s rendered as: %s\n", i+1, colorStr, style.Render("TEST"))
	}
}