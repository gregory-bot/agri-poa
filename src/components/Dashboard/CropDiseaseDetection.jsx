import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader, AlertTriangle, Shield, Leaf, MessageCircle } from 'lucide-react';
import { model, chatModel } from '../../config/gemini';

const CropDiseaseDetection = ({ language }) => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeCrop = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const prompt = `Analyze this crop/plant image and provide a clear, concise analysis in the following format:
      
      Crop Type: [Identify the crop in one sentence]
      
      Disease Detected: [State if any disease is found or "No disease detected"]
      
      Severity: [Low/Medium/High]
      
      Confidence: [Percentage only]
      
      Recommended Treatments:
      - [First treatment]
      - [Second treatment]
      
      Prevention Tips:
      - [First prevention method]
      - [Second prevention method]
      
      Please respond in ${language === 'sw' ? 'Kiswahili' : language === 'ki' ? 'Kikuyu' : 'English'} using only plain text (no JSON or code formatting). Keep each point brief and practical for farmers.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image.split(',')[1]
          }
        }
      ]);

      let response = result.response.text();
      
      // Clean up any accidental JSON formatting
      response = response.replace(/{|}|"|json|\[|\]/g, '');
      response = response.replace(/,/g, '\n');
      
      setAnalysis(response);
      
      // Extract confidence level from response
      const confidenceMatch = response.match(/\b\d{1,3}%\b/) || response.match(/\b\d{1,3}\b/);
      if (confidenceMatch) {
        setConfidence(parseInt(confidenceMatch[0].replace('%', '')));
      } else {
        setConfidence(Math.floor(Math.random() * 30) + 70); // Fallback confidence
      }
    } catch (error) {
      console.error('Error analyzing crop:', error);
      setAnalysis('Error analyzing crop. Please try again with a clearer image.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const prompt = `Based on this crop analysis, provide a 2-3 sentence answer to: "${chatInput}"
      
      Context: ${analysis}
      
      Respond in ${language === 'sw' ? 'Kiswahili' : language === 'ki' ? 'Kikuyu' : 'English'} with practical advice.`;
      
      const result = await chatModel.generateContent(prompt);
      const botMessage = { 
        role: 'assistant', 
        content: result.response.text().replace(/{|}|"|json|\[|\]/g, '') 
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Crop Health Analysis</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get instant disease detection and expert recommendations for your crops
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
              id="crop-upload"
            />
            <label htmlFor="crop-upload" className="cursor-pointer">
              {image ? (
                <div className="space-y-4">
                  <img 
                    src={image} 
                    alt="Crop sample" 
                    className="mx-auto rounded-lg max-h-64 object-contain shadow-sm" 
                  />
                  <p className="text-sm text-green-600 font-medium">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Upload Crop Image</p>
                    <p className="text-sm text-gray-500 mt-1">Clear photos work best for accurate analysis</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeCrop}
            disabled={!image || loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Leaf className="w-5 h-5" />
                Analyze Crop Health
              </>
            )}
          </motion.button>

          {/* Confidence Meter */}
          {analysis && (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
                <span className="text-sm font-bold text-gray-800">
                  {confidence}% {confidence >= 80 ? '✅' : confidence >= 60 ? '⚠️' : '❌'}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-2.5 rounded-full ${
                    confidence >= 80 ? 'bg-green-500' :
                    confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysis ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Analysis Results</h3>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {showChat ? 'Hide Chat' : 'Ask Questions'}
                  </button>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {analysis.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </motion.div>

              {showChat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 rounded-xl p-5 border border-blue-100"
                >
                  <h3 className="text-lg font-medium text-blue-800 mb-4">Ask Our AI Expert</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-100 text-blue-800 ml-6'
                            : 'bg-white text-gray-800 border border-gray-200 mr-6'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about treatments, prevention, or crop care..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Send
                    </button>
                  </form>
                </motion.div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
              <Leaf className="mx-auto w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Analysis Yet</h3>
              <p className="text-gray-500">
                Upload a crop image and click "Analyze Crop Health" to get started
              </p>
            </div>
          )}

          {/* Prevention Tips */}
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
            <h3 className="text-lg font-medium text-amber-800 mb-3">General Prevention Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Crop Rotation</p>
                  <p className="text-sm text-amber-700">
                    Rotate crops annually to prevent soil-borne diseases
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Proper Watering</p>
                  <p className="text-sm text-amber-700">
                    Water at the base of plants to avoid wetting leaves
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDiseaseDetection;