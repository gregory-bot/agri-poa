import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader, MapPin, Droplets, Thermometer, Leaf } from 'lucide-react';
import { model } from '../../config/gemini';

const SoilAnalysis = ({ language }) => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeSoil = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const prompt = `Analyze this soil image and provide:
      1. Soil type identification
      2. Recommended crops for this soil type
      3. Soil health assessment
      4. Nutrient recommendations
      5. Best practices for this soil type
      ${location ? `Location: ${location}` : ''}
      
      Please provide the response in ${language === 'sw' ? 'Kiswahili' : language === 'ki' ? 'Kikuyu' : 'English'}.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image.split(',')[1]
          }
        }
      ]);

      setAnalysis(result.response.text());
    } catch (error) {
      console.error('Error analyzing soil:', error);
      setAnalysis('Error analyzing soil. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Soil Analysis</h2>
        <p className="text-gray-600">
          Upload a soil image to get AI-powered analysis and crop recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
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
                  <img src={image} alt="Soil sample" className="mx-auto rounded-lg max-h-48 object-cover" />
                  <p className="text-sm text-green-600">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">Upload Soil Image</p>
                    <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeSoil}
              disabled={!image || loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5" />
                  Analyze Soil
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">{analysis}</pre>
              </div>
            </motion.div>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Soil Analysis Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Moisture Content</p>
                  <p className="text-sm text-blue-600">Take samples when soil is at field capacity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Thermometer className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Temperature</p>
                  <p className="text-sm text-blue-600">Collect samples during moderate temperatures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Location</p>
                  <p className="text-sm text-blue-600">Include location for region-specific recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;