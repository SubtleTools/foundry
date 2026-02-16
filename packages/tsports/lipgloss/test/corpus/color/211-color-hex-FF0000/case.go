package main

import (
	"fmt"

	"github.com/charmbracelet/lipgloss"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.ANSI)

	style := lipgloss.NewStyle().Foreground(lipgloss.Color("#FF0000"))
	result := style.Render("Hex Color")
	fmt.Print(result)

}
