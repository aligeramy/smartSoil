/**
 * ESP8266 Utility Functions
 * 
 * This file centralizes all ESP8266 related functionality including:
 * - Connection settings
 * - Data fetching
 * - Value mapping and conversion
 */

// Default ESP base URL (in AP mode)
let ESP_BASE = "http://192.168.4.1";

// Type for the parsed analog sensor data
type AnalogSensorData = {
  rawValue: number;
  resistanceTop?: number;
  resistanceBottom?: number;
};

/**
 * Update the ESP base URL
 * @param ip New IP address to use
 */
export function setEspBaseUrl(ip: string) {
  ESP_BASE = `http://${ip}`;
  return ESP_BASE;
}

/**
 * Get the current ESP base URL
 */
export function getEspBaseUrl(): string {
  return ESP_BASE;
}

/**
 * Maps a value from one range to another
 */
export function mapValue(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
  return toLow + (toHigh - toLow) * ((value - fromLow) / (fromHigh - fromLow));
}

/**
 * Parse the analog sensor data from the new format
 * @param rawText The raw text response from the sensor
 * @returns Parsed analog sensor data object
 */
export function parseAnalogData(rawText: string): AnalogSensorData {
  // Default response for old format
  if (!rawText.includes('=')) {
    return { rawValue: parseInt(rawText.trim()) };
  }

  // New format: "A=123 R_top=456.78 R_bottom=789.01"
  const data: AnalogSensorData = { rawValue: 0 };
  
  // Parse A value
  const aMatch = rawText.match(/A=(\d+)/);
  if (aMatch && aMatch[1]) {
    data.rawValue = parseInt(aMatch[1]);
  }
  
  // Parse resistance top value
  const rTopMatch = rawText.match(/R_top=(\d+\.\d+)/);
  if (rTopMatch && rTopMatch[1]) {
    data.resistanceTop = parseFloat(rTopMatch[1]);
  }
  
  // Parse resistance bottom value
  const rBottomMatch = rawText.match(/R_bottom=(\d+\.\d+)/);
  if (rBottomMatch && rBottomMatch[1]) {
    data.resistanceBottom = parseFloat(rBottomMatch[1]);
  }
  
  return data;
}

/**
 * Convert raw analog value to moisture percentage
 * LINEAR CALCULATION: 
 * - Simple linear scale from 0-1024 to 0-100%
 * @param rawAnalog Raw analog value or sensor data object
 * @returns Moisture percentage (0-100)
 */
export function analogToMoisture(rawAnalog: number | AnalogSensorData): number {
  // If an object is passed, extract the raw value
  if (typeof rawAnalog === 'object') {
    rawAnalog = rawAnalog.rawValue;
  }
  
  // Ensure the value is within 0-1024 range
  const clampedValue = Math.max(0, Math.min(1024, rawAnalog));
  
  // Calculate percentage as a simple linear scale
  return Math.round((clampedValue * 100) / 1024);
}

/**
 * Convert moisture percentage to raw analog value
 * NEW CONVERSION: 0% = 0, 100% = 850
 * @param moisture Moisture percentage (0-100)
 * @returns Raw analog value (0-850)
 */
export function moistureToAnalog(moisture: number): number {
  // Map from 0-100% to get 0-850 range
  return Math.round(mapValue(moisture, 0, 100, 0, 850));
}

/**
 * Fetch all sensor data from ESP8266
 * @param onLog Optional logging callback
 * @returns Object containing all sensor data or null if fetch failed
 */
export async function fetchAllSensorData(onLog?: (message: string) => void): Promise<{
  temperature: number;
  humidity: number;
  moisture: number;
  rawAnalog: number;
  resistanceTop?: number;
  resistanceBottom?: number;
  heatIndex: number;
} | null> {
  try {
    // Log connection attempt
    const logMessage = `Attempting to connect to ESP at: ${ESP_BASE}`;
    if (onLog) onLog(logMessage);
    console.log(logMessage);

    // Create AbortController with timeout for compatibility with all Android versions
    const dhtController = new AbortController();
    const dhtTimeoutId = setTimeout(() => dhtController.abort(), 5000);

    // Fetch DHT11 data with better error handling
    let dhtText: string;
    try {
      const dhtRes = await fetch(`${ESP_BASE}/raw_dht11`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'Cache-Control': 'no-cache, no-store'
        },
        signal: dhtController.signal
      });
      
      clearTimeout(dhtTimeoutId);
      dhtText = await dhtRes.text();
      if (onLog) onLog(`DHT data received: ${dhtText}`);
      console.log(`DHT data received: ${dhtText}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('abort')) {
        if (onLog) onLog('DHT request timed out after 5 seconds');
      } else {
        if (onLog) onLog(`DHT fetch error: ${errorMsg}`);
      }
      throw error;
    }

    // Create a new controller for the analog request
    const analogController = new AbortController();
    const analogTimeoutId = setTimeout(() => analogController.abort(), 5000);

    // Fetch analog data with better error handling
    let rawAnalogText: string;
    try {
      const analogRes = await fetch(`${ESP_BASE}/raw_a`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'Cache-Control': 'no-cache, no-store'
        },
        signal: analogController.signal
      });
      
      clearTimeout(analogTimeoutId);
      rawAnalogText = await analogRes.text();
      if (onLog) onLog(`Analog data received: ${rawAnalogText}`);
      console.log(`Analog data received: ${rawAnalogText}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('abort')) {
        if (onLog) onLog('Analog request timed out after 5 seconds');
      } else {
        if (onLog) onLog(`Analog fetch error: ${errorMsg}`);
      }
      throw error;
    }
    
    // Process DHT data - now handling three-value format from the DHT11 sensor
    const dhtValues = dhtText.trim().split(/\s+/);
    let humidity: number;
    let temperature: number;
    let heatIndex: number | null = null;
    
    if (dhtValues.length >= 3) {
      // New format: "humidity temperature heatIndex"
      humidity = parseFloat(dhtValues[0]);
      temperature = parseFloat(dhtValues[1]);
      heatIndex = parseFloat(dhtValues[2]);
      if (onLog) onLog(`Parsed DHT values: humidity=${humidity}, temp=${temperature}, heatIndex=${heatIndex}`);
    } else {
      // Old format: "humidity temperature"
      if (dhtText.includes('|')) {
        // Format: "humidity|temperature"
        const [humidityStr, temperatureStr] = dhtText.split('|');
        humidity = parseFloat(humidityStr);
        temperature = parseFloat(temperatureStr);
      } else {
        // Format: "humidity temperature"
        const [humidityStr, temperatureStr] = dhtValues;
        humidity = parseFloat(humidityStr);
        temperature = parseFloat(temperatureStr);
      }
      if (onLog) onLog(`Parsed DHT values: humidity=${humidity}, temp=${temperature}`);
    }

    // Parse analog response (using the new parsing function)
    const analogData = parseAnalogData(rawAnalogText);

    // Check if all values are valid
    if (!isNaN(analogData.rawValue) && !isNaN(humidity) && !isNaN(temperature)) {
      // Calculate moisture using the bottom resistance when available,
      // otherwise use the raw analog value
      const moisture = analogToMoisture(analogData);
      
      return {
        temperature,
        humidity,
        heatIndex: heatIndex ?? temperature, // Use heat index from sensor when available
        moisture,
        rawAnalog: analogData.rawValue,
        resistanceTop: analogData.resistanceTop,
        resistanceBottom: analogData.resistanceBottom
      };
    }
    
    if (onLog) onLog(`Invalid sensor data detected. Raw DHT: ${dhtText}, Raw Analog: ${rawAnalogText}`);
    return null;
  } catch (error) {
    const errorMessage = `Error fetching ESP8266 data: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage);
    if (onLog) onLog(errorMessage);
    return null;
  }
} 