package lipgloss

import (
	"io"
	"os"
	"strconv"
	"sync"

	"github.com/muesli/termenv"
)

// We're manually creating the struct here to avoid initializing the output and
// query the terminal multiple times.
var renderer = &Renderer{
	output: termenv.DefaultOutput(),
}

// Renderer is a lipgloss terminal renderer.
type Renderer struct {
	output            *termenv.Output
	colorProfile      termenv.Profile
	hasDarkBackground bool

	getColorProfile      sync.Once
	explicitColorProfile bool

	getBackgroundColor      sync.Once
	explicitBackgroundColor bool

	mtx sync.RWMutex
}

// DefaultRenderer returns the default renderer.
func DefaultRenderer() *Renderer {
	return renderer
}

// SetDefaultRenderer sets the default global renderer.
func SetDefaultRenderer(r *Renderer) {
	renderer = r
}

// NewRenderer creates a new Renderer.
//
// w will be used to determine the terminal's color capabilities.
func NewRenderer(w io.Writer, opts ...termenv.OutputOption) *Renderer {
	r := &Renderer{
		output: termenv.NewOutput(w, opts...),
	}
	return r
}

// Output returns the termenv output.
func (r *Renderer) Output() *termenv.Output {
	r.mtx.RLock()
	defer r.mtx.RUnlock()
	return r.output
}

// SetOutput sets the termenv output.
func (r *Renderer) SetOutput(o *termenv.Output) {
	r.mtx.Lock()
	defer r.mtx.Unlock()
	r.output = o
}

// ColorProfile returns the detected termenv color profile.
func (r *Renderer) ColorProfile() termenv.Profile {
	r.mtx.RLock()
	defer r.mtx.RUnlock()

	if !r.explicitColorProfile {
		r.getColorProfile.Do(func() {
			// NOTE: we don't need to lock here because sync.Once provides its
			// own locking mechanism.
			r.colorProfile = r.getColorProfileWithForceColor()
		})
	}

	return r.colorProfile
}

// ColorProfile returns the detected termenv color profile.
func ColorProfile() termenv.Profile {
	return renderer.ColorProfile()
}

// getColorProfileWithForceColor handles FORCE_COLOR environment variable and falls back to termenv detection.
// FORCE_COLOR=0 disables color, FORCE_COLOR=1 enables basic colors, FORCE_COLOR=2 enables 256 colors, 
// FORCE_COLOR=3 enables true color. Any other non-empty value enables basic colors.
func (r *Renderer) getColorProfileWithForceColor() termenv.Profile {
	if forceColor := os.Getenv("FORCE_COLOR"); forceColor != "" {
		if level, err := strconv.Atoi(forceColor); err == nil {
			switch level {
			case 0:
				return termenv.Ascii
			case 1:
				return termenv.ANSI
			case 2:
				return termenv.ANSI256
			case 3:
				return termenv.TrueColor
			default:
				return termenv.ANSI
			}
		}
		// Non-numeric FORCE_COLOR value - enable basic colors
		return termenv.ANSI
	}

	// Fall back to termenv's environment-aware detection
	return r.output.EnvColorProfile()
}

// SetColorProfile sets the color profile on the renderer. This function exists
// mostly for testing purposes so that you can assure you're testing against
// a specific profile.
//
// Outside of testing you likely won't want to use this function as the color
// profile will detect and cache the terminal's color capabilities and choose
// the best available profile.
//
// Available color profiles are:
//
//	termenv.Ascii     // no color, 1-bit
//	termenv.ANSI      //16 colors, 4-bit
//	termenv.ANSI256   // 256 colors, 8-bit
//	termenv.TrueColor // 16,777,216 colors, 24-bit
//
// This function is thread-safe.
func (r *Renderer) SetColorProfile(p termenv.Profile) {
	r.mtx.Lock()
	defer r.mtx.Unlock()

	r.colorProfile = p
	r.explicitColorProfile = true
}

// SetColorProfile sets the color profile on the default renderer. This
// function exists mostly for testing purposes so that you can assure you're
// testing against a specific profile.
//
// Outside of testing you likely won't want to use this function as the color
// profile will detect and cache the terminal's color capabilities and choose
// the best available profile.
//
// Available color profiles are:
//
//	termenv.Ascii     // no color, 1-bit
//	termenv.ANSI      //16 colors, 4-bit
//	termenv.ANSI256   // 256 colors, 8-bit
//	termenv.TrueColor // 16,777,216 colors, 24-bit
//
// This function is thread-safe.
func SetColorProfile(p termenv.Profile) {
	renderer.SetColorProfile(p)
}

// HasDarkBackground returns whether or not the terminal has a dark background.
func HasDarkBackground() bool {
	return renderer.HasDarkBackground()
}

// HasDarkBackground returns whether or not the renderer will render to a dark
// background. A dark background can either be auto-detected, or set explicitly
// on the renderer.
func (r *Renderer) HasDarkBackground() bool {
	r.mtx.RLock()
	defer r.mtx.RUnlock()

	if !r.explicitBackgroundColor {
		r.getBackgroundColor.Do(func() {
			// NOTE: we don't need to lock here because sync.Once provides its
			// own locking mechanism.
			r.hasDarkBackground = r.output.HasDarkBackground()
		})
	}

	return r.hasDarkBackground
}

// SetHasDarkBackground sets the background color detection value for the
// default renderer. This function exists mostly for testing purposes so that
// you can assure you're testing against a specific background color setting.
//
// Outside of testing you likely won't want to use this function as the
// backgrounds value will be automatically detected and cached against the
// terminal's current background color setting.
//
// This function is thread-safe.
func SetHasDarkBackground(b bool) {
	renderer.SetHasDarkBackground(b)
}

// SetHasDarkBackground sets the background color detection value on the
// renderer. This function exists mostly for testing purposes so that you can
// assure you're testing against a specific background color setting.
//
// Outside of testing you likely won't want to use this function as the
// backgrounds value will be automatically detected and cached against the
// terminal's current background color setting.
//
// This function is thread-safe.
func (r *Renderer) SetHasDarkBackground(b bool) {
	r.mtx.Lock()
	defer r.mtx.Unlock()

	r.hasDarkBackground = b
	r.explicitBackgroundColor = true
}
