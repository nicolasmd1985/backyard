import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with production URL when deployed

export const generateScenario = async (location, scenarioType) => {
  try {
    const response = await axios.post(`${API_URL}/scenarios/generate`, {
      location: location,
      scenario_type: scenarioType,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw error;
  }
};
