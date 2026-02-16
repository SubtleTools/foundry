/**
 * HexColor type for database and JSON serialization
 * TypeScript port of Go colorful.HexColor type with identical API
 */

import { Color, hex } from './colors';

// Error class for unsupported types during scanning
export class ErrUnsupportedType extends Error {
  constructor(got: unknown, want: string) {
    super(`unsupported type: got ${typeof got}, want a ${want}`);
    this.name = 'ErrUnsupportedType';
  }
}

// A HexColor is a Color stored as a hex string "#rrggbb". It implements
// serialization interfaces for databases and JSON, matching Go's HexColor exactly.
export class HexColor {
  // Store the color components directly like Go's type alias
  public r: number;
  public g: number;
  public b: number;

  constructor(r: number = 0, g: number = 0, b: number = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  // Create HexColor from Color
  static fromColor(color: Color): HexColor {
    return new HexColor(color.r, color.g, color.b);
  }

  // Convert to Color
  toColor(): Color {
    return new Color(this.r, this.g, this.b);
  }

  // Get the underlying Color (compatibility method)
  getColor(): Color {
    return this.toColor();
  }

  // Set the underlying Color (compatibility method)
  setColor(color: Color): void {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }

  // Create from hex string (static constructor)
  static fromHex(hexCode: string): HexColor {
    const color = hex(hexCode);
    return HexColor.fromColor(color);
  }

  // Convert to hex string
  hex(): string {
    return this.toColor().hex();
  }

  // Convert to hex string (compatibility method)
  toString(): string {
    return this.hex();
  }

  // Database/SQL interfaces

  // Scan implements the database/sql Scanner interface
  scan(value: unknown): void {
    if (typeof value !== 'string') {
      throw new ErrUnsupportedType(value, 'string');
    }

    const color = hex(value);
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }

  // Static scan method for convenience
  static scan(value: unknown): HexColor {
    const hc = new HexColor();
    hc.scan(value);
    return hc;
  }

  // Value implements the database/sql/driver Valuer interface
  value(): string {
    return this.hex();
  }

  // JSON interfaces

  // For JSON.stringify compatibility (implements json.Marshaler interface)
  toJSON(): string {
    return this.hex();
  }

  // UnmarshalJSON implements the json.Unmarshaler interface
  fromJSON(data: string): void {
    let hexCode: string;
    try {
      hexCode = JSON.parse(data);
    } catch (err) {
      throw new Error(`invalid JSON: ${err}`);
    }

    const color = hex(hexCode);
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }

  // Static fromJSON method for convenience
  static fromJSON(data: string): HexColor {
    const hc = new HexColor();
    hc.fromJSON(data);
    return hc;
  }

  // Configuration library interface

  // Decode - deserialize function for configuration libraries like envconfig
  decode(hexCode: string): void {
    const color = hex(hexCode);
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }

  // Static decode method for convenience
  static decode(hexCode: string): HexColor {
    const hc = new HexColor();
    hc.decode(hexCode);
    return hc;
  }

  // YAML interfaces (for completeness, matching Go implementation)

  // MarshalYAML for YAML serialization
  toYAML(): string {
    return this.hex();
  }

  // UnmarshalYAML for YAML deserialization
  fromYAML(hexCode: string): void {
    const color = hex(hexCode);
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }

  // Static YAML methods
  static fromYAML(hexCode: string): HexColor {
    const hc = new HexColor();
    hc.fromYAML(hexCode);
    return hc;
  }

  // Utility methods for compatibility

  // RGB values (0-1 range)
  get R(): number {
    return this.r;
  }
  set R(value: number) {
    this.r = value;
  }

  get G(): number {
    return this.g;
  }
  set G(value: number) {
    this.g = value;
  }

  get B(): number {
    return this.b;
  }
  set B(value: number) {
    this.b = value;
  }

  // Equality check
  equals(other: HexColor): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b;
  }
}
