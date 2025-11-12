# **🌍 EcoLens – Visualize Deforestation and Climate Correlation**

EcoLens is an interactive web application designed to analyze and visualize the relationship between deforestation and climate change over time.  
By combining historical forest cover loss and climate data, EcoLens empowers users to understand environmental trends, identify correlations, and take data-driven actions for a sustainable future.


## **Key Features**

### **1. Location-Based Analysis**
- **Smart Search:** Enter any location name to analyze its environmental trends.
- **Year Range Selection:** Define a custom time period (e.g., 2015–2025) for analysis.
- **Accurate Geocoding:** Automatically fetches precise coordinates using the OpenCage API.
- **Autocomplete Suggestions:** Instantly displays relevant locations as you type.


### **2. Deforestation & Climate Insights**
- **Deforestation Trends:** Fetches annual tree cover loss data from Global Forest Watch.
- **Climate Data Correlation:** Uses Open-Meteo API to show temperature and rainfall patterns.
- **Interactive Charts:** Compare deforestation and climate changes side-by-side using Chart.js.
- **Visual Correlation:** Observe how deforestation relates to rising temperatures and rainfall variation.


### **3. Interactive Map Integration**
- **Leaflet.js Map:** Displays the analyzed region using OpenStreetMap tiles (no API key required).
- **Accurate Positioning:** Centers on the exact analyzed location.
- **Markers & Popups:** Shows key metrics like average temperature, total rainfall, and forest loss.
- **Region Selection:** Select specific areas using rectangles or freehand drawing tools.
- **Responsive Design:** Works seamlessly on all screen sizes and adjusts to light/dark mode.


### **4. Additional Functionalities**
- 🌗 **Smooth Theme Toggle:** Switch between light and dark modes with soft transitions.  
- 🧾 **PDF Export:** Download the entire analysis report with maps and charts.  
- 🔗 **Share Feature:** Share analysis results or location insights via link or social platforms.  
- 🗺️ **Location Comparison:** Compare two regions side-by-side for deeper insights.  
- ℹ️ **About Page:** Learn about EcoLens’s vision and mission for environmental awareness.  


## **Benefits**

- Helps visualize environmental changes over time.  
- Encourages data-driven understanding of deforestation and climate impact.  
- Offers easy-to-use geospatial analysis for researchers, students, and environmentalists.  
- Promotes sustainability through awareness and education.  


## **How It Works**

1. **Enter a Location:** Type a location name in the search bar and choose a time range.  
2. **Run Analysis:** Click “Start Analysis” — the backend fetches and processes relevant data.  
3. **View Insights:** Explore visual correlations between deforestation and climate trends.  
4. **(Optional)** **Select or Compare Areas:** Use drawing tools or compare multiple locations.  
5. **Export or Share:** Download results as a PDF or share them online.  


## **Target Users**

This platform is ideal for:  
- Environmental researchers and students.  
- Policy makers studying deforestation trends.  
- NGOs and sustainability advocates.  
- Anyone interested in climate and forest data visualization.  


## **Get Started**

Gain insights into our planet’s changing ecosystems!  
Start analyzing, visualizing, and understanding the world with EcoLens.  

🌐 **Live Demo:** https://ecolens.vercel.app/


## **Tech Stack**

| Technology | Purpose |
|-------------|----------|
| **Python (Flask)** | Backend API for geocoding, data aggregation & analysis |
| **OpenCage API** | Location geocoding |
| **Global Forest Watch API** | Deforestation data |
| **Open-Meteo API** | Climate data (temperature, precipitation) |
| **JavaScript / Chart.js** | Interactive data visualization |
| **Leaflet.js + OpenStreetMap** | Interactive map integration |
| **Tailwind CSS** | Responsive, modern design |
| **jsPDF** | PDF report export |


## **Future Enhancements**
- AI-powered prediction of climate and deforestation trends.  
- Region-based alerts and email summaries.  
- User accounts for saving analysis history.  
- Integration of satellite imagery overlays for visual depth.  