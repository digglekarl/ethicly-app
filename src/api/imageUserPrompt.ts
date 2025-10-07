export const imageUserPrompt = (imageUrl: string) => `You will receive one image of a product. Identify it and propose ethical alternatives.

Task: Identify the product and brand from the images and recommend ethically preferable alternatives that meet my constraints.

Inputs:

Images: ${imageUrl}

What I care about most (weights sum ≈ 1.0):
labor_rights: 0.30, environment: 0.35, animal_welfare: 0.10, privacy_security: 0.10, governance_transparency: 0.10, dei: 0.05

Budget: [e.g., “≤ £120” or “mid-range”]

Region: [e.g., “UK/EU only”]

Must-have features: [e.g., “wireless charging; vegan materials; FSC-certified paper; no cobalt from DRC unless audited”]

Nice-to-have: [e.g., “repairable; open-source firmware”]

Deal-breakers: [e.g., “no palm oil; no child-labor exposure in last 3 years”]

Category (if known): [e.g., “running shoes”, “smartphone case”, “dark chocolate”]

Output: Return only the JSON object per the system schema. Use tools (if available) to find and cite recent, reputable sources for each ethical claim. If you can’t access tools, state that in uncertainty, mark any unverifiable claims as “model-knowledge/uncertain,” and keep recommendations conservative.`;