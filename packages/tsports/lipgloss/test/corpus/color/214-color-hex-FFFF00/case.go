package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.TrueColor)
	

	style := lipgloss.NewStyle().Foreground(lipgloss.Color("#FFFF00"))
	result := style.Render("Hex Color")
	fmt.Print(result)

}