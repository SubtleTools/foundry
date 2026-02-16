package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/list"
)

func main() {
	// Set color profile for consistent output
	// lipgloss.SetColorProfile(termenv.TrueColor)
	

	l := list.New().
		Item("First item").
		Item("Second item").
		Item("Third item")
	result := l.String()
	fmt.Print(result)

}