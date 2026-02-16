/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * lipgloss: Terminal styling and layout library for TypeScript/JavaScript.
 *
 * This library provides a comprehensive set of tools for creating beautiful,
 * styled terminal user interfaces. It's a TypeScript port of the popular
 * Go library Charm Lipgloss, offering the same powerful styling capabilities
 * with full Unicode and ANSI support.
 *
 * **Key Features**:
 * - Fluent styling API with method chaining
 * - Advanced text layout and positioning
 * - Unicode-aware text measurement and manipulation
 * - ANSI escape sequence handling
 * - Range-based text styling
 * - Terminal color profile management
 * - Cross-platform compatibility
 *
 * **Go Compatibility**: This library maintains API compatibility with
 * Go Lipgloss where possible, making it easy to port existing Go code.
 *
 * @example
 * ```typescript
 * import { Style, JoinHorizontal } from '@tsports/lipgloss';
 *
 * // Create a styled component (TypeScript-native)
 * const titleStyle = new Style()
 *   .color('white')
 *   .backgroundColor('blue')
 *   .padding(1)
 *   .margin(1)
 *   .bold(true);
 *
 * const title = titleStyle.render('Welcome to lipgloss!');
 *
 * // Create a layout
 * const leftPanel = 'Menu\nItem 1\nItem 2';
 * const rightPanel = 'Content\nArea';
 * const layout = JoinHorizontal(0.5, leftPanel, rightPanel);
 *
 * console.log(title);
 * console.log(layout);
 * ```
 *
 * @version 0.1.0
 * @author lipgloss Contributors
 * @license MIT
 */

// =============================================================================
// CORE STYLING ENGINE
// =============================================================================

/**
 * The main Style class - the heart of lipgloss.
 *
 * The Style class provides a fluent API for creating and applying text styles.
 * It supports method chaining and maintains immutability by returning new
 * instances for each modification.
 *
 * @example
 * ```typescript
 * import { Style } from '@tsports/lipgloss';
 * // or
 * import Style from '@tsports/lipgloss'; // default export
 *
 * const errorStyle = new Style()
 *   .color('red')
 *   .bold(true)
 *   .padding(1);
 *
 * console.log(errorStyle.render('Error: Something went wrong!'));
 * ```
 *
 * @see {@link Style} - The main styling class
 */
export { Style, Style as default } from './style';

// =============================================================================
// TYPE DEFINITIONS AND ENUMS
// =============================================================================

/**
 * Core type definitions for styling and configuration.
 * These interfaces define the structure of styling properties and configurations.
 *
 * @see {@link BorderConfig} - Interface for border configuration
 * @see {@link StyleProperties} - Interface for style properties
 * @see {@link StyleOptions} - Interface for style creation with renderer options
 * @see {@link StyleUpdate} - Type for partial style updates
 * @see {@link ColorValue} - Union type for all color formats
 * @see {@link RendererOptions} - Interface for renderer configuration
 * @see {@link OutputOptions} - Interface for output behavior configuration
 */
export type {
  BorderConfig,
  BorderStyle,
  ColorValue,
  HeightConfig,
  HSLColor,
  MarginConfig,
  NamedColor,
  OutputOptions,
  PaddingConfig,
  Position,
  RendererOptions,
  RGBAColor,
  RGBColor,
  StyleOptions,
  StyleProperties,
  StyleResult,
  StyleUpdate,
  TextDecoration,
  TransformFunction,
  WidthConfig,
} from './types';

/**
 * Enumeration types for styling options.
 * These enums provide type-safe options for various styling properties.
 *
 * @see {@link BorderType} - Available border styles
 * @see {@link HorizontalAlignment} - Horizontal text alignment options
 * @see {@link VerticalAlignment} - Vertical text alignment options
 * @see {@link ColorProfile} - Terminal color capability levels
 * @see {@link FontWeight} - Font weight options
 * @see {@link FontStyle} - Font style options
 */
export {
  BorderType,
  ColorProfile,
  FontStyle,
  FontWeight,
  HorizontalAlignment,
  isValidBorderStyle,
  isValidColor,
  VerticalAlignment,
} from './types';

// =============================================================================
// BORDER STYLING
// =============================================================================

/**
 * Border styling utilities and pre-defined border styles.
 * These components provide comprehensive border rendering capabilities.
 *
 * @see {@link BorderStyles} - Collection of pre-defined border styles
 * @see {@link Borders} - Border configuration utilities
 * @see {@link BorderUtils} - Border calculation and rendering utilities
 */
export {
  ASCIIBorder,
  BlockBorder,
  BorderStyles,
  Borders,
  BorderUtils,
  DoubleBorder,
  HiddenBorder,
  InnerHalfBlockBorder,
  MarkdownBorder,
  NormalBorder,
  OuterHalfBlockBorder,
  RoundedBorder,
  ThickBorder,
} from './borders';

// =============================================================================
// TEXT LAYOUT AND JOINING
// =============================================================================

/**
 * Text layout functions for combining multiple text blocks.
 * These functions enable sophisticated text layouts with precise alignment control.
 *
 * @see {@link JoinHorizontal} - Join text blocks side-by-side with vertical alignment
 * @see {@link JoinVertical} - Stack text blocks with horizontal alignment
 * @see {@link Position} - Type for position values (0.0 to 1.0)
 */
export {
  JoinHorizontal,
  JoinVertical,
  type Position as JoinPosition,
} from './join';

// =============================================================================
// RANGE-BASED STYLING
// =============================================================================

/**
 * Range-based text styling for fine-grained control over text appearance.
 * These functions allow styling specific character ranges within text.
 *
 * @see {@link Range} - Interface for defining character ranges
 * @see {@link NewRange} - Create character ranges for styling
 * @see {@link StyleRanges} - Apply styles to character ranges
 * @see {@link CreateRanges} - Create multiple ranges with same style
 * @see {@link StyleWord} - Create ranges for specific words
 */
export {
  CreateRanges,
  NewRange,
  type Range,
  StyleRanges,
  StyleWord,
} from './ranges';

// =============================================================================
// COLOR MANAGEMENT
// =============================================================================

/**
 * Color management and terminal color utilities.
 * These provide comprehensive color handling for different terminal capabilities.
 *
 * **Go Compatibility**: Includes Go-compatible color factory functions
 * for direct port compatibility with Go Lipgloss code.
 *
 * @example
 * ```typescript
 * // Go-compatible color creation (deferred resolution)
 * const goRed = Color("1");        // ANSI red with renderer resolution
 * const goBlue = Color("#0000ff"); // Hex blue with renderer resolution
 * const ansiOrange = ANSIColor(208); // Direct ANSI color
 *
 * // Adaptive colors for light/dark themes
 * const adaptiveColor = AdaptiveColor("#0000ff", "#000099");
 * ```
 *
 * @see {@link ColorManager} - Main color management class
 * @see {@link Colors} - Named color constants
 * @see {@link HexColors} - Hex color utilities
 * @see {@link NoColor} - No-color constants
 * @see {@link ColorUtils} - Color utility functions
 * @see {@link TerminalColorCapability} - Terminal color capability detection
 * @see {@link Color} - Go-compatible Color factory function
 * @see {@link ANSIColor} - Go-compatible ANSIColor factory function
 */
export {
  AdaptiveColor,
  ANSIColor, // Go-compatible factory function
  ANSIColorClass, // The actual class
  Color, // Go-compatible factory function
  ColorClass, // The actual class
  CompleteAdaptiveColor,
  CompleteColor,
  NewAdaptiveColor,
  NewANSIColor,
  // Factory functions
  NewColor,
  NewCompleteAdaptiveColor,
  NewCompleteColor,
  // Color classes
  NoColor,
  // Constants
  noColor,
  // Types
  type TerminalColor,
} from './color';

// Create a function to convert ANSI color code to hex
function ansiToHex(ansiCode: number): string {
  // Standard 16 colors (0-15)
  if (ansiCode >= 0 && ansiCode <= 15) {
    const standardColors: string[] = [
      '#000000', // 0: black
      '#800000', // 1: dark red
      '#008000', // 2: dark green
      '#808000', // 3: dark yellow/brown
      '#000080', // 4: dark blue
      '#800080', // 5: dark magenta
      '#008080', // 6: dark cyan
      '#c0c0c0', // 7: light gray
      '#808080', // 8: dark gray
      '#ff0000', // 9: bright red
      '#00ff00', // 10: bright green
      '#ffff00', // 11: bright yellow
      '#0000ff', // 12: bright blue
      '#ff00ff', // 13: bright magenta
      '#00ffff', // 14: bright cyan
      '#ffffff', // 15: white
    ];
    return standardColors[ansiCode] || '#ffffff';
  }

  // 216-color cube (16-231)
  if (ansiCode >= 16 && ansiCode <= 231) {
    const index = ansiCode - 16;
    const levels = [0, 95, 135, 175, 215, 255];

    const r = levels[Math.floor(index / 36)] ?? 0;
    const g = levels[Math.floor((index % 36) / 6)] ?? 0;
    const b = levels[index % 6] ?? 0;

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Grayscale colors (232-255)
  if (ansiCode >= 232 && ansiCode <= 255) {
    const level = 8 + (ansiCode - 232) * 10;
    const hex = Math.min(255, level).toString(16).padStart(2, '0');
    return `#${hex}${hex}${hex}`;
  }

  // Default to white for invalid codes
  return '#ffffff';
}

// Enhanced Colors object that supports both named colors and numeric indexing
export const Colors = new Proxy(
  {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    yellow: '#FFFF00',
    magenta: '#FF00FF',
    cyan: '#00FFFF',
    white: '#FFFFFF',
    black: '#000000',
  } as Record<string | number, string | TerminalColor>,
  {
    get(target, prop: string | symbol): string | TerminalColor {
      // Handle string keys (named colors)
      if (typeof prop === 'string') {
        // Check if it's a numeric string
        const numericKey = parseInt(prop, 10);
        if (!isNaN(numericKey) && numericKey >= 0 && numericKey <= 255) {
          // Lazy load NewANSIColor to preserve ANSI codes in rendering
          const { NewANSIColor: NAIC } = require('./color');
          return NAIC(numericKey);
        }
        // Return named color or fallback to white
        return target[prop] || '#ffffff';
      }

      // Handle numeric keys directly
      if (typeof prop === 'number' && prop >= 0 && prop <= 255) {
        // Lazy load NewANSIColor to preserve ANSI codes in rendering
        const { NewANSIColor: NAIC } = require('./color');
        return NAIC(prop);
      }

      // Fallback for other cases
      return target[String(prop)] || '#ffffff';
    },

    has(target, prop: string | symbol): boolean {
      // Support all ANSI color codes 0-255
      if (typeof prop === 'string') {
        const numericKey = parseInt(prop, 10);
        if (!isNaN(numericKey) && numericKey >= 0 && numericKey <= 255) {
          return true;
        }
      }
      if (typeof prop === 'number' && prop >= 0 && prop <= 255) {
        return true;
      }
      return prop in target;
    },
  }
);

// Style factory function for Go compatibility
import { Style } from './style';
export function NewStyle(): Style {
  return new Style();
}

// =============================================================================
// RENDERING SYSTEM
// =============================================================================

/**
 * Advanced rendering system for customizing text output.
 * These components allow custom rendering strategies and output formats.
 *
 * @see {@link Renderer} - Base renderer interface
 * @see {@link DefaultRenderer} - Default terminal renderer
 * @see {@link SetDefaultRenderer} - Set global renderer
 * @see {@link RenderUtils} - Rendering utility functions
 */
export {
  colorProfile,
  defaultRenderer,
  hasDarkBackground,
  newRenderer,
  Renderer,
  renderer,
  setColorProfile,
  setDefaultRenderer,
  setHasDarkBackground,
} from './renderer';

// =============================================================================
// ALIGNMENT UTILITIES
// =============================================================================

/**
 * Text alignment utilities and constants.
 * These provide precise control over text positioning and alignment.
 *
 * @see {@link AlignUtils} - Alignment calculation utilities
 * @see {@link Align} - Horizontal alignment constants
 */
export { AlignUtils } from './align';
export { HorizontalAlignment as Align } from './types';

// =============================================================================
// VERSION AND METADATA
// =============================================================================

/**
 * Library version information.
 * Use this for version checking and compatibility verification.
 */
export const VERSION = '0.1.0';

// =============================================================================
// TABLE COMPONENTS
// =============================================================================

/**
 * Table-related type definitions.
 *
 * @see {@link TableData} - Interface for table data
 * @see {@link TableStyleFunc} - Function type for table styling
 */
export type { StyleFunc as TableStyleFunc, TableData } from './table';
/**
 * Advanced table rendering components for structured data display.
 * These components provide comprehensive table functionality with styling support.
 *
 * @see {@link Table} - Main table component
 * @see {@link newTable} - Table factory function
 * @see {@link defaultStyles} - Default table styling
 * @see {@link HeaderRow} - Table header utilities
 * @see {@link StringData} - String-based table data
 * @see {@link TableFilter} - Table filtering utilities
 * @see {@link newStringData} - String data factory
 * @see {@link newTableFilter} - Filter factory
 * @see {@link dataToMatrix} - Data conversion utilities
 */
export {
  dataToMatrix,
  defaultStyles,
  HeaderRow,
  newStringData,
  newTable,
  newTableFilter,
  StringData,
  Table,
  TableFilter,
} from './table';

// =============================================================================
// TEXT MEASUREMENT AND MANIPULATION UTILITIES
// =============================================================================

/**
 * Text layout and manipulation utilities.
 *
 * @see {@link truncateText} - Truncate text to specified width
 * @see {@link wrapText} - Wrap text to specified width
 * @see {@link getTextWidth} - Calculate text width in terminal columns
 * @see {@link getLineWidths} - Get width of each line in text
 * @see {@link getMaxTextWidth} - Get maximum line width in text
 * @see {@link truncateToWidth} - Truncate text to exact width
 * @see {@link applyPadding} - Apply padding to text content
 * @see {@link applyMargin} - Apply margin to text content
 * @see {@link calculateWidth} - Calculate total width with padding/margin
 * @see {@link calculateHeight} - Calculate total height with padding/margin
 */
export {
  applyMargin,
  applyPadding,
  calculateHeight,
  calculateWidth,
  getLineWidths,
  getMaxTextWidth,
  getTextWidth,
  truncateText,
  truncateToWidth,
  wrapText,
} from './layout';
/**
 * Whitespace styling configuration.
 * Types and functions for configuring whitespace appearance and behavior.
 *
 * @see {@link WhitespaceOptions} - Interface for whitespace styling options
 * @see {@link WhitespaceOption} - Function type for whitespace configuration
 * @see {@link WithWhitespaceForeground} - Set foreground color for whitespace
 * @see {@link WithWhitespaceBackground} - Set background color for whitespace
 * @see {@link WithWhitespaceChars} - Set custom characters for whitespace
 */
export type { WhitespaceOption, WhitespaceOptions } from './utils';
/**
 * Text measurement functions for calculating display dimensions.
 * These functions handle Unicode characters and ANSI escape sequences correctly.
 *
 * @see {@link Width} - Calculate string width in terminal columns
 * @see {@link Height} - Calculate string height in lines
 * @see {@link Size} - Get both width and height
 */
/**
 * Text positioning and alignment utilities.
 * These functions help position text within specified dimensions.
 *
 * @see {@link Place} - Position text in a rectangular area
 * @see {@link PlaceHorizontal} - Horizontal text positioning
 * @see {@link PlaceVertical} - Vertical text positioning
 */
/**
 * Style creation and color profile management.
 * Core functions for creating styles and managing terminal capabilities.
 *
 * @see {@link GetColorProfile} - Get current color profile
 * @see {@link SetColorProfile} - Set color profile
 * @see {@link HasDarkBackground} - Detect dark terminal backgrounds
 * @see {@link SetHasDarkBackground} - Override background detection
 */
/**
 * Advanced text styling utilities.
 * Functions for fine-grained text styling and manipulation.
 *
 * @see {@link StyleRunes} - Style specific character indices
 * @see {@link renderWhitespace} - Create styled whitespace
 */
/**
 * String manipulation and Unicode utilities.
 * Low-level functions for text processing and character handling.
 *
 * @see {@link maxRuneWidth} - Find widest character in string
 * @see {@link getFirstRune} - Extract first Unicode character
 * @see {@link toRunes} - Convert string to Unicode character array
 * @see {@link runeCount} - Count Unicode characters
 */
/**
 * Text padding utilities.
 * Functions for adding spacing to text content.
 *
 * @see {@link padRight} - Add trailing spaces
 * @see {@link padLeft} - Add leading spaces
 * @see {@link padCenter} - Center text with padding
 */
/**
 * ANSI escape sequence utilities.
 * Functions for working with terminal escape sequences.
 *
 * @see {@link stripANSI} - Remove ANSI escape sequences
 * @see {@link hasANSI} - Check for ANSI escape sequences
 */
/**
 * General string utilities.
 * Basic string manipulation functions.
 *
 * @see {@link repeat} - Repeat strings
 * @see {@link spaces} - Create space strings
 * @see {@link trim} - Trim whitespace
 * @see {@link trimLeft} - Trim left whitespace
 * @see {@link trimRight} - Trim right whitespace
 */
/**
 * Position constants for alignment.
 * Pre-defined values for common text positioning.
 *
 * @see {@link Position} - Position type (number between 0.0 and 1.0)
 * @see {@link Top} - Top alignment (0.0)
 * @see {@link Bottom} - Bottom alignment (1.0)
 * @see {@link Center} - Center alignment (0.5)
 * @see {@link Left} - Left alignment (0.0)
 * @see {@link Right} - Right alignment (1.0)
 */
/**
 * Tab conversion constants.
 * Constants for controlling tab conversion behavior.
 *
 * @see {@link NoTabConversion} - Disable tab conversion (-1)
 */
export {
  Bottom,
  Center,
  GetColorProfile,
  getFirstRune,
  HasDarkBackground,
  Height,
  hasANSI,
  Left,
  maxRuneWidth,
  NoTabConversion,
  Place,
  PlaceHorizontal,
  PlaceVertical,
  padCenter,
  padLeft,
  padRight,
  Right,
  renderWhitespace,
  repeat,
  runeCount,
  SetColorProfile,
  SetHasDarkBackground,
  Size,
  StyleRunes,
  spaces,
  stripANSI,
  Top,
  toRunes,
  trim,
  trimLeft,
  trimRight,
  Width,
  WithWhitespaceBackground,
  WithWhitespaceChars,
  WithWhitespaceForeground,
} from './utils';

// =============================================================================
// LIST COMPONENT SYSTEM
// =============================================================================

/**
 * List-related type definitions.
 *
 * @see {@link Enumerator} - Function type for list item enumeration
 * @see {@link Indenter} - Function type for nested content indentation
 * @see {@link Items} - Interface for list item collections
 * @see {@link StyleFunc} - Function type for conditional list styling
 */
export type {
  Enumerator,
  Indenter,
  Items,
  StyleFunc as ListStyleFunc,
} from './list';
/**
 * Advanced list rendering components for structured data display.
 * These components provide comprehensive list functionality with styling support.
 *
 * @see {@link List} - Main list component
 * @see {@link newList} - List factory function
 * @see {@link Enumerator} - Interface for list item enumeration
 * @see {@link Alphabet} - Alphabetic enumeration (A., B., C., ...)
 * @see {@link Arabic} - Numeric enumeration (1., 2., 3., ...)
 * @see {@link Roman} - Roman numeral enumeration (I., II., III., ...)
 * @see {@link Bullet} - Bullet point enumeration (•)
 * @see {@link Asterisk} - Asterisk enumeration (*)
 * @see {@link Dash} - Dash enumeration (-)
 */
export {
  Alphabet,
  Arabic,
  Asterisk,
  Bullet,
  Dash,
  List,
  newList,
  Roman,
} from './list';

// =============================================================================
// TREE COMPONENT SYSTEM
// =============================================================================

/**
 * Tree-related type definitions.
 *
 * @see {@link Node} - Interface for all tree elements
 * @see {@link Children} - Collection interface for child nodes
 * @see {@link Enumerator} - Function for generating node prefixes
 * @see {@link Indenter} - Function for controlling nested indentation
 * @see {@link StyleFunc} - Function for conditional node styling
 * @see {@link TreeStyle} - Configuration for tree-wide styling
 * @see {@link FilterFunc} - Function for filtering tree nodes
 */
export type {
  Children,
  Enumerator as TreeEnumerator,
  FilterFunc,
  Indenter as TreeIndenter,
  Node,
  StyleFunc as TreeStyleFunc,
  TreeStyle,
} from './tree';
/**
 * Advanced tree rendering components for hierarchical data display.
 * These components provide comprehensive tree functionality with flexible styling.
 *
 * @see {@link Tree} - Main tree component
 * @see {@link newTree} - Tree factory function
 * @see {@link rootTree} - Root tree factory function
 * @see {@link Leaf} - Simple terminal node implementation
 * @see {@link NodeChildren} - Container for managing child collections
 * @see {@link Filter} - Non-destructive filtering of node collections
 * @see {@link TreeRenderer} - Advanced tree rendering engine
 * @see {@link DefaultEnumerator} - Standard tree branches (├── and └──)
 * @see {@link RoundedEnumerator} - Rounded tree branches (├── and ╰──)
 * @see {@link DefaultIndenter} - Default indentation strategy
 */
export {
  createRenderer,
  DefaultEnumerator,
  DefaultIndenter,
  Filter,
  Leaf,
  NodeChildren,
  newTree,
  RoundedEnumerator,
  rootTree,
  Tree,
  TreeRenderer,
} from './tree';

// =============================================================================
// FORCE COLOR UTILITIES
// =============================================================================

/**
 * Force color configuration types.
 *
 * @see {@link ForceColorOptions} - Configuration options for force color
 */
export type { ForceColorOptions } from './force-color';
/**
 * Force color utilities for ensuring color output even when not in TTY.
 * These functions allow forcing color output when piping to files or redirecting output.
 *
 * @see {@link enableForceColor} - Enable forced color output
 * @see {@link disableForceColor} - Disable forced color output
 * @see {@link isForceColorEnabled} - Check if force color is enabled
 * @see {@link setForceColorEnv} - Set FORCE_COLOR environment variable
 * @see {@link overrideNoColor} - Override NO_COLOR environment variable
 * @see {@link withForceColor} - Run code with temporary forced colors
 * @see {@link colorProfileToLevel} - Convert color profile to force level
 * @see {@link levelToColorProfile} - Convert force level to color profile
 */
export {
  colorProfileToLevel,
  disableForceColor,
  enableForceColor,
  getForceColorConfig,
  isForceColorEnabled,
  levelToColorProfile,
  overrideNoColor,
  setForceColorEnv,
  withForceColor,
} from './force-color';

// =============================================================================
// GO COMPATIBILITY LAYER
// =============================================================================

/**
 * Go-compatible type definitions.
 *
 * @see {@link GoStyle} - Style with Go-style PascalCase methods
 * @see {@link GoTable} - Table with Go-style PascalCase methods
 * @see {@link GoRenderer} - Renderer with Go-style PascalCase methods
 */
// Go compatibility types removed - use idiomatic TypeScript patterns
/**
 * Go compatibility layer for developers transitioning from Go Lipgloss.
 * This module provides factory functions and Go-style method names.
 *
 * @see {@link NewStyle} - Go-compatible Style factory function
 * @see {@link NewRenderer} - Go-compatible Renderer factory function
 * @see {@link NewTable} - Go-compatible Table factory function
 * @see {@link createNewStyle} - Go-compatible Style with PascalCase methods
 * @see {@link createNewTable} - Go-compatible Table with PascalCase methods
 * @see {@link createNewRenderer} - Go-compatible Renderer with PascalCase methods
 */

/**
 * Color utility functions for converting between different color formats.
 * Used by examples for color manipulation and gradients.
 */
// Export new core functions (Width, Height, Size are already exported from utils, avoid duplicate)
export { getLines } from './size';
// Place functions already exported from utils
// Most whitespace functions are already exported from utils
export { newWhitespace, Whitespace } from './whitespace';

export const ColorUtils = {
  /**
   * Convert hex color to RGB object
   */
  hexToRGB(hex: string): { r: number; g: number; b: number } | null {
    // Handle long format (#RRGGBB)
    const longMatch = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (longMatch) {
      return {
        r: parseInt(longMatch[1]!, 16),
        g: parseInt(longMatch[2]!, 16),
        b: parseInt(longMatch[3]!, 16),
      };
    }

    // Handle short format (#RGB)
    const shortMatch = hex.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
    if (shortMatch) {
      return {
        r: parseInt(shortMatch[1]! + shortMatch[1]!, 16),
        g: parseInt(shortMatch[2]! + shortMatch[2]!, 16),
        b: parseInt(shortMatch[3]! + shortMatch[3]!, 16),
      };
    }

    return null;
  },

  /**
   * Convert RGB object to hex string
   */
  rgbToHex(rgb: { r: number; g: number; b: number }): string {
    const toHex = (n: number) =>
      Math.round(Math.max(0, Math.min(255, n)))
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  },
};

// Go compatibility functions - added after all exports so imports are available
import { Renderer as _Renderer } from './renderer';
export function NewRenderer() {
  return new _Renderer();
}
