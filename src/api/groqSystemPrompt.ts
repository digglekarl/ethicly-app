import axios from 'axios';
import { ethicalScoreSystemPrompt } from './ethicalScoreSystemPrompt';
import { homeScreenSystemPrompt } from './homeScreenSystemPrompt';
import { boycottSystemPrompt } from './boycottSystemPrompt';

const apiKey = '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';
const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';

export async function getEthicalScore(prompt: string) {
  try {
    const response = await axios.post(
      groqApiUrl,
      {
        messages: [
          { role: 'system', content: ethicalScoreSystemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'openai/gpt-oss-20b',
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Groq API raw response:', response.data);
    const result = response.data.choices[0]?.message?.content;
    console.log('Groq API parsed result:', result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Groq API error (axios):', error.response?.data || error.message);
    } else {
      console.log('Groq API error:', error);
    }
    return 'Error fetching ethical score.';
  }
}

export async function getTop3EthicalCompanies(prompt: string) {
  try {
    const response = await axios.post(
      groqApiUrl,
      {
        messages: [
          { role: 'system', content: homeScreenSystemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'gemma2-9b-it',
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Groq API raw response:', response.data);
    const result = response.data.choices[0]?.message?.content;
    console.log('Groq API parsed result:', result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Groq API error (axios):', error.response?.data || error.message);
    } else {
      console.log('Groq API error:', error);
    }
    return 'Error fetching ethical score.';
  }
}

export async function getBoycotts(prompt: string) {
  try {
    const response = await axios.post(
      groqApiUrl,
      {
        messages: [
          { role: 'system', content: boycottSystemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'gemma2-9b-it',
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Groq API raw response:', response.data);
    const result = response.data.choices[0]?.message?.content;
    console.log('Groq API parsed result:', result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Groq API error (axios):', error.response?.data || error.message);
    } else {
      console.log('Groq API error:', error);
    }
    return 'Error fetching boycott data.';
  }
}