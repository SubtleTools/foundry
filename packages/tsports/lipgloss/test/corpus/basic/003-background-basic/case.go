package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.TrueColor)
	

	style := lipgloss.NewStyle().Background(lipgloss.Color("blue"))
	result := style.Render("Blue Background")
	fmt.Print(result)

}