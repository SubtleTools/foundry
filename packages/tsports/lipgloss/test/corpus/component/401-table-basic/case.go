package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.TrueColor)
	

	t := table.New().
		Border(lipgloss.NormalBorder()).
		Headers("Name", "Age").
		Row("Alice", "30").
		Row("Bob", "25")
	result := t.Render()
	fmt.Print(result)

}