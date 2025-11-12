import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClimateDataPoint {
  year: number;
  avg_temp_c: number;
  total_precip_mm: number;
}

interface DeforestationDataPoint {
  year: number;
  hectares_lost: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { locationName, startYear, endYear } = await req.json();
    
    console.log(`Analyzing ${locationName} from ${startYear} to ${endYear}`);

    const openCageApiKey = Deno.env.get('OPENCAGE_API_KEY');
    if (!openCageApiKey) {
      throw new Error('OpenCage API key not configured');
    }

    // Step 1: Geocode the location
    console.log('Geocoding location...');
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationName)}&key=${openCageApiKey}&limit=1`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lng } = geocodeData.results[0].geometry;
    const formattedLocation = geocodeData.results[0].formatted;
    console.log(`Geocoded to: ${lat}, ${lng} (${formattedLocation})`);

    // Step 2: Generate mock deforestation data
    // Simulates realistic patterns based on location
    console.log('Generating deforestation data...');
    const deforestationSeries: DeforestationDataPoint[] = [];
    const baselineDeforestation = Math.abs(lat) > 30 ? 500 : 1500; // Higher near equator
    
    for (let year = parseInt(startYear); year <= parseInt(endYear); year++) {
      const yearOffset = year - parseInt(startYear);
      const trend = yearOffset * 50; // Increasing trend
      const variance = Math.random() * 300 - 150; // Random variation
      const hectaresLost = Math.max(0, Math.round(baselineDeforestation + trend + variance));
      
      deforestationSeries.push({
        year,
        hectares_lost: hectaresLost,
      });
    }

    // Step 3: Fetch climate data from Open-Meteo
    console.log('Fetching climate data from Open-Meteo...');
    const startDate = `${startYear}-01-01`;
    const endDate = `${endYear}-12-31`;
    
    const climateUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;
    const climateResponse = await fetch(climateUrl);
    const climateData = await climateResponse.json();

    if (!climateData.daily) {
      throw new Error('Climate data not available for this location and time range');
    }

    // Step 4: Aggregate climate data by year
    console.log('Aggregating climate data by year...');
    const yearlyData: Record<number, { temps: number[], precips: number[] }> = {};

    for (let i = 0; i < climateData.daily.time.length; i++) {
      const date = new Date(climateData.daily.time[i]);
      const year = date.getFullYear();
      
      if (!yearlyData[year]) {
        yearlyData[year] = { temps: [], precips: [] };
      }
      
      if (climateData.daily.temperature_2m_mean[i] !== null) {
        yearlyData[year].temps.push(climateData.daily.temperature_2m_mean[i]);
      }
      if (climateData.daily.precipitation_sum[i] !== null) {
        yearlyData[year].precips.push(climateData.daily.precipitation_sum[i]);
      }
    }

    const climateSeries: ClimateDataPoint[] = [];
    for (let year = parseInt(startYear); year <= parseInt(endYear); year++) {
      const data = yearlyData[year];
      if (data && data.temps.length > 0) {
        const avgTemp = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
        const totalPrecip = data.precips.reduce((a, b) => a + b, 0);
        
        climateSeries.push({
          year,
          avg_temp_c: Math.round(avgTemp * 10) / 10,
          total_precip_mm: Math.round(totalPrecip),
        });
      }
    }

    console.log('Analysis complete');

    return new Response(
      JSON.stringify({
        analysis: {
          location: formattedLocation,
          time_range: `${startYear}-${endYear}`,
          coordinates: [lat, lng], // Leaflet expects [latitude, longitude]
          deforestation_series: deforestationSeries,
          climate_series: climateSeries,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
