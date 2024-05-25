// src/lib/api.ts
export async function fetchStandings() {
    const response = await fetch('https://api.motogp.pulselive.com/motogp/v1/results/standings?seasonUuid=dd12382e-1d9f-46ee-a5f7-c5104db28e43&categoryUuid=e8c110ad-64aa-4e8e-8a86-f2f152f6a942');
    if (!response.ok) {
      throw new Error('Failed to fetch standings');
    }
    return response.json();
  }
  