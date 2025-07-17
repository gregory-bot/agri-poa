import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader, MapPin, Droplets, Thermometer, Leaf, Camera, Zap } from 'lucide-react';
import { model } from '../../config/gemini';

const EnhancedSoilAnalysis = ({ language }) => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [soilData, setSoilData] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeSoil = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const prompt = `Analyze this soil image comprehensively and provide detailed information in JSON format:

      {
        "soilType": "primary soil classification",
        "texture": "soil texture description",
        "color": "soil color and what it indicates",
        "moisture": "moisture level assessment",
        "organicMatter": "organic matter content estimation",
        "ph": "estimated pH range",
        "nutrients": {
          "nitrogen": "level",
          "phosphorus": "level", 
          "potassium": "level"
        },
        "recommendedCrops": ["crop1", "crop2", "crop3"],
        "regionalSuitability": "best regions for this soil type",
        "improvements": ["improvement1", "improvement2"],
        "seasonalConsiderations": "when to plant and harvest",
        "irrigation": "irrigation recommendations",
        "fertilization": "fertilizer recommendations"
      }

      ${location ? `Location context: ${location}` : ''}
      
      Provide response in ${language === 'sw' ? 'Kiswahili' : language === 'ki' ? 'Kikuyu' : 'English'}.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image.split(',')[1]
          }
        }
      ]);

      const response = result.response.text();
      setAnalysis(response);
      
      // Parse structured data for visualization
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setSoilData(JSON.parse(jsonMatch[0]));
        }
      } catch (e) {
        console.log('Could not parse structured data');
      }
    } catch (error) {
      console.error('Error analyzing soil:', error);
      setAnalysis('Error analyzing soil. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            AI Soil Analysis
          </h2>
        </motion.div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload soil images to get comprehensive analysis with crop recommendations, 
          nutrient levels, and regional suitability insights
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="border-2 border-dashed border-amber-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors bg-gradient-to-br from-amber-50 to-orange-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="soil-upload"
              />
              <label htmlFor="soil-upload" className="cursor-pointer">
                {image ? (
                  <div className="space-y-4">
                    <img src={image} alt="Soil sample" className="mx-auto rounded-lg max-h-48 object-cover shadow-lg" />
                    <div className="flex items-center justify-center gap-2 text-amber-600">
                      <Camera className="w-5 h-5" />
                      <p className="font-medium">Click to change image</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-700">Upload Soil Image</p>
                      <p className="text-gray-500">JPG, PNG formats • Max 10MB</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeSoil}
                disabled={!image || loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing Soil...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze with AI
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Soil Tips */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-500" />
              Soil Sampling Tips
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Droplets className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Optimal Moisture</p>
                  <p className="text-sm text-gray-600">Sample when soil is at field capacity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Clear Images</p>
                  <p className="text-sm text-gray-600">Take photos in good lighting conditions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {soilData && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Soil Analysis Results</h3>
              
              {/* Soil Type Card */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-amber-800 mb-2">Soil Classification</h4>
                <p className="text-amber-700">{soilData.soilType}</p>
                <p className="text-sm text-amber-600 mt-1">{soilData.texture}</p>
              </div>

              {/* Nutrient Levels */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-600 font-medium">NITROGEN</p>
                  <p className="text-lg font-bold text-green-800">{soilData.nutrients?.nitrogen}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium">PHOSPHORUS</p>
                  <p className="text-lg font-bold text-blue-800">{soilData.nutrients?.phosphorus}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-purple-600 font-medium">POTASSIUM</p>
                  <p className="text-lg font-bold text-purple-800">{soilData.nutrients?.potassium}</p>
                </div>
              </div>

              {/* Recommended Crops */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Recommended Crops</h4>
                <div className="flex flex-wrap gap-2">
                  {soilData.recommendedCrops?.map((crop, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Analysis</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">{analysis}</pre>
              </div>
            </motion.div>
          )}

          {/* Sample Images */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample Soil Types</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <img
                  src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Clay soil"
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-medium text-gray-700">Clay Soil</p>
              </div>
              <div className="text-center">
                <img
                  src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Loam soil"
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-medium text-gray-700">Loam Soil</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedSoilAnalysis;