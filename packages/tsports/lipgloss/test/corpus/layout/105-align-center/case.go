package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.TrueColor)
	

	style := lipgloss.NewStyle().Width(20).Align(lipgloss.Center)
	result := style.Render("Centered")
	fmt.Print(result)

}