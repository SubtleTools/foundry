package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.TrueColor)
	

	style := lipgloss.NewStyle().Foreground(lipgloss.Color("cyan"))
	result := style.Render("Cyan Text")
	fmt.Print(result)

}