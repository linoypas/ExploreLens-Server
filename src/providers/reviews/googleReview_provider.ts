import axios from 'axios';
import { IGoogleReview } from '../../models/review_model';

const API_KEY = process.env.GOOGLE_API_KEY;

const getPlaceId = async (siteName: string): Promise<string | null> => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
      {
        params: {
          input: siteName,
          inputtype: 'textquery',
          fields: 'place_id',
          key: API_KEY,
        },
      }
    );

    const candidates = response.data.candidates;
    return candidates.length > 0 ? candidates[0].place_id : null;
  } catch (error) {
    console.error('Error getting place ID:', error);
    return null;
  }
};

export const getReviews = async (siteName: string): Promise<IGoogleReview[] | null> => {
    const placeId = await getPlaceId(siteName);
    if (!placeId) {
      console.log('No place found for:', siteName);
      return null;
    }
  
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'reviews',
          reviews_sort: 'newest',
          key: API_KEY,
        },
      });
  
      const reviews: IGoogleReview[] = response.data.result?.reviews || [];
  
      if (reviews.length === 0) {
        console.log('No reviews found for:', siteName);
        return [];
      }
  
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', (error as Error).message);
      return null;
    }
  };
  