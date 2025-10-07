export const boycottUserPrompt = `Please provide the top 3 most recent and trending UK boycott movements.  

For each boycott campaign, include:  
- Movement/Campaign Name  
- Campaigning Organisation(s)  
- Category  
- Start Date (if available)  
- Targets (brands, companies, or products under boycott)  
- A short note summarising the reason/context  
- A URL to the Ethical Consumer boycott campaign page for more information  

Return the results strictly in valid JSON format as an array of objects. If fewer than 3 are available, return only those available. If none are found, return an empty array: [].
`;