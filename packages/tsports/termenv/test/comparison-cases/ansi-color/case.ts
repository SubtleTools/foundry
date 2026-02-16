#!/usr/bin/env bun
import { 
  string, rgbColor, ansiColor, ansi256Color, noColor,
  colorProfile, profileName, clearScreen, moveCursor,
  createHyperlink, sendNotification, altScreen, exitAltScreen,
  hideCursor, showCursor, cursorUp, cursorDown, clearLine,
  enableMouse, disableMouse, setWindowTitle
} from '../../../dist/index.js';
import { Profile } from '../../../dist/types.js';


// Mock process.stdout.write to capture output and force TTY detection
const originalWrite = process.stdout.write;
const originalIsTTY = process.stdout.isTTY;
let capturedOutput = '';
(process.stdout.write as any) = function(chunk: any) {
  capturedOutput += chunk.toString();
  return true;
};
// Force TTY detection for color output
process.stdout.isTTY = true;

try {
  const styled = string('Bright Red').foreground(ansiColor(9));
        process.stdout.write(styled.toString());
  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
  process.stdout.isTTY = originalIsTTY;
}
