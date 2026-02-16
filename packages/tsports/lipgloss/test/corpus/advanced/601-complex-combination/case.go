package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	// Set color profile for consistent output
	// Note: FORCE_COLOR=3 handles color profile via lipgloss getColorProfileWithForceColor

	style := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FFFFFF")).
		Background(lipgloss.Color("#0000FF")).
		Border(lipgloss.RoundedBorder()).
		Padding(2).
		Width(30).
		Align(lipgloss.Center)
	result := style.Render("Complex Styled Content")
	fmt.Print(result)

}