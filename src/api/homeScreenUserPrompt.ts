export const homeScreenUserPrompt = `Please give me a summary of the top 3 boycott movements and the top 3 most ethical companies, based on EthicalConsumer.org and other trusted ethical sources.  

For each boycott movement, include:  
- Movement/Campaign Name  
- Campaigning organisation(s)  
- Category  
- Targets (companies or products under boycott)  
- A short contextual note (reason for boycott)  
- A URL for more information  

For each ethical company, include:  
- Company/Brand Name  
- Ethical Rating or Ranking (e.g., Best Buy, Highly Recommended)  
- Key Ethical Strengths  
- Any Ethical Weaknesses (if relevant)  
- Example Products (if available)  
- A URL to the company profile or ethical guide  

Return the results in a single JSON object with two arrays: 'boycotts' and 'ethical_companies'.
`;
