package main
import (
"fmt"
"github.com/lucasb-eyer/go-colorful"
"github.com/muesli/gamut"
)
func main() {
	c1, _ := colorful.Hex("#F25D94")
	c2, _ := colorful.Hex("#EDFF82")
	blends := gamut.Blends(c1, c2, 5)
	for _, c := range blends {
        r, g, b, _ := c.RGBA()
		fmt.Printf("#%02x%02x%02x\n", uint8(r>>8), uint8(g>>8), uint8(b>>8))
	}
}
