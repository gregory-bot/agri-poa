import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader, Heart, AlertCircle, Stethoscope, Pill } from 'lucide-react';
import { model } from '../../config/gemini';

const AnimalHealthDiagnosis = ({ language }) => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animalType, setAnimalType] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeAnimal = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const prompt = `Analyze this animal image for health assessment and provide:
      1. Animal type identification
      2. Visible health issues or diseases
      3. Disease severity assessment
      4. Treatment recommendations
      5. Prevention measures
      6. When to consult a veterinarian
      7. Cost-effective treatment options
      
      ${animalType ? `Animal type: ${animalType}` : ''}
      ${symptoms ? `Observed symptoms: ${symptoms}` : ''}
      
      Please provide the response in ${language === 'sw' ? 'Kiswahili' : language === 'ki' ? 'Kikuyu' : 'English'}.
      Important: This is for educational purposes only. Always consult a veterinarian for serious health issues.`;

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
      console.error('Error analyzing animal:', error);
      setAnalysis('Error analyzing animal health. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const animalTypes = [
    'Cattle/Cow', 'Goat', 'Sheep', 'Pig', 'Chicken', 'Duck', 'Dog', 'Cat', 'Other'
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Animal Health Diagnosis</h2>
        <p className="text-gray-600">
          Upload animal images to get AI-powered health assessment and treatment recommendations
        </p>
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ This tool provides educational information only. Always consult a veterinarian for serious health concerns.
          </p>
        </div>
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
              id="animal-upload"
            />
            <label htmlFor="animal-upload" className="cursor-pointer">
              {image ? (
                <div className="space-y-4">
                  <img src={image} alt="Animal" className="mx-auto rounded-lg max-h-48 object-cover" />
                  <p className="text-sm text-green-600">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">Upload Animal Image</p>
                    <p className="text-sm text-gray-500">Clear photos work best for accurate analysis</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal Type (Optional)
              </label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select animal type</option>
                {animalTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observed Symptoms (Optional)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe any symptoms you've observed..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeAnimal}
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
                  <Heart className="w-5 h-5" />
                  Analyze Health
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Health Assessment</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">{analysis}</pre>
              </div>
            </motion.div>
          )}

          {/* Emergency Guidelines */}
          <div className="bg-red-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Emergency Signs</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Immediate Veterinary Care</p>
                  <p className="text-sm text-red-600">Difficulty breathing, seizures, severe bleeding</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Urgent Attention</p>
                  <p className="text-sm text-red-600">Loss of appetite, lethargy, unusual behavior</p>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Tips */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">General Care Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Pill className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Medication Safety</p>
                  <p className="text-sm text-blue-600">Never give human medications without vet approval</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Monitoring</p>
                  <p className="text-sm text-blue-600">Keep detailed records of symptoms and treatments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalHealthDiagnosis;