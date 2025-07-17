import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBcw7qNx7MMmhZr5js4xPFj8f73q85xlc8';
const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const chatModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: `You are an expert agricultural assistant. You help farmers with crop management, disease identification, soil analysis, and animal health. Provide practical, actionable advice. Support multiple languages including English, Kiswahili, Kikuyu, Kipsigis, and Kalenjin.`
});