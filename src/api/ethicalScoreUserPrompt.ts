export const ethicalScoreUserPrompt = `Please evaluate the following company/product: {searchTerm}.

Provide the results strictly in the JSON format defined in the system prompt, including:  
- The company_or_product name  
- An overall ethical score (1–100), calculated using the weighted formula provided  
- Sub-scores (1–100) for each category:  
  - Environment (25% weight)  
  - Labor and Human Rights (30% weight)  
  - Animal Welfare (20% weight)  
  - Social Responsibility (15% weight)  
  - Corporate Governance (10% weight)  
- A list of positives, where each item includes:  
  - category (the relevant ethical practice area)  
  - point (the positive practice description)  
- A list of negatives, where each item includes:  
  - category (the relevant ethical practice area)  
  - point (the weakness or ethical concern)  

The output must only be a single valid JSON object with the overall score and the category breakdown. 
`;