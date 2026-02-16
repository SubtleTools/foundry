#!/usr/bin/env bun

/**
 * Step through toRGB logic manually to find the bug
 */

console.log('MANUAL toRGB TRACE');
console.log('='.repeat(40));

async function manualTrace() {
  const { ColorManager } = await import('./src/color');
  
  // Create a fresh instance to avoid cache issues
  const cm = ColorManager.getInstance();
  (cm as any).rgbCache?.clear?.();
  
  const color = '99';
  console.log('Input color:', color);
  
  // Manually follow the toRGB logic
  console.log('\n--- Following toRGB logic ---');
  
  // 1. Check if it's null
  if (color === null) {
    console.log('1. Color is null - returning null');
    return null;
  }
  console.log('1. Color is not null ✅');
  
  // 2. Create cache key
  const cacheKey = String(color);
  console.log('2. Cache key:', cacheKey);
  
  // 3. Check cache (should be empty after clear)
  const cached = (cm as any).rgbCache?.get(cacheKey);
  console.log('3. Cached value:', cached);
  
  let result = null;
  
  // 4. Handle RGB objects (skip - it's a string)
  console.log('4. Not an RGB object ✅');
  
  // 5. Handle HSL objects (skip - it's a string) 
  console.log('5. Not an HSL object ✅');
  
  // 6. Handle number (skip - it's a string)
  console.log('6. Not a number ✅');
  
  // 7. Handle string
  console.log('7. Is a string - processing...');
  
  // 7a. Try hex conversion
  console.log('7a. Try hex conversion');
  // Assuming hex conversion fails for "99"
  
  // 7b. Try RGB string format  
  console.log('7b. Try RGB string format');
  // Assuming this fails for "99"
  
  // 7c. Try string ANSI color code
  console.log('7c. Try string ANSI color code');
  const numValue = parseInt(color, 10);
  console.log('   parseInt result:', numValue);
  console.log('   isNaN:', isNaN(numValue));
  console.log('   color === numValue.toString():', color === numValue.toString());
  
  if (!isNaN(numValue) && color === numValue.toString()) {
    console.log('   ✅ ANSI parsing succeeded');
    result = (cm as any).ansiToRGB(numValue);
    console.log('   ansiToRGB result:', result);
  } else {
    console.log('   ❌ ANSI parsing failed');
    // 7d. Try named color conversion
    console.log('7d. Try named color conversion');
    const namedRgb = (cm as any).namedColorToRGB(color);
    console.log('   namedColorToRGB result:', namedRgb);
    result = namedRgb;
  }
  
  console.log('\n8. Final result before caching:', result);
  
  // 8. Cache the result
  (cm as any).rgbCache?.set(cacheKey, result);
  console.log('9. Result cached');
  
  console.log('\n10. Test actual toRGB call:');
  const actualResult = cm.toRGB(color);
  console.log('    Actual toRGB result:', actualResult);
}

manualTrace();