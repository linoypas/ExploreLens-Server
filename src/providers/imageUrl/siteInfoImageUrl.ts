const axios = require('axios');

export async function getImageUrl(siteName: string) {
  const accessKey = process.env.UNSPLASH_API_KEY 

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: siteName,
        per_page: 1, // return 1 image
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });

    const image = response.data.results[0];
    return image?.urls?.regular || null;

  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
}