package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.TrueColor)
	

	style := lipgloss.NewStyle().Border(lipgloss.ThickBorder()).Width(20)
	result := style.Render("Bordered Content")
	fmt.Print(result)

}