import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log(`Autocomplete query: ${query}`);

    const openCageApiKey = Deno.env.get('OPENCAGE_API_KEY');
    if (!openCageApiKey) {
      throw new Error('OpenCage API key not configured');
    }

    // Fetch autocomplete suggestions from OpenCage
    const autocompleteUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${openCageApiKey}&limit=5&no_annotations=1`;
    const response = await fetch(autocompleteUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Format suggestions
    const suggestions = data.results.map((result: any) => ({
      name: result.formatted,
      coordinates: [result.geometry.lat, result.geometry.lng],
    }));

    console.log(`Found ${suggestions.length} suggestions`);

    return new Response(
      JSON.stringify({ suggestions }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in autocomplete function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Autocomplete failed',
        suggestions: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
