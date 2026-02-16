package main

import (
	"fmt"
	"os"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	fmt.Fprintln(os.Stderr, "FORCE_COLOR=", os.Getenv("FORCE_COLOR"))
	fmt.Fprintln(os.Stderr, "ColorProfile:", lipgloss.ColorProfile())
	style := lipgloss.NewStyle().Foreground(lipgloss.Color("#FF0000"))
	fmt.Print(style.Render("Red Text"))
}
