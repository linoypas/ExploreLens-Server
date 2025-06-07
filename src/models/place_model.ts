export interface IPlace {
    place_id: string;            
    name:     string;            
    location: {
      lat: number;               
      lng: number;               
    };
    rating:   number;            
    type:     string;
    editorial_summary?: string;
    website?: string;
    price_level?: number;
    elevation?: number;            
    address?: string;
    phone_number?: string;
    business_status?: string;
    opening_hours?: {
      open_now?: boolean;
      weekday_text?: string[];
    };
    reviews?: Array<{
    author_name:             string;
    rating:                  number;
    relative_time_description: string;
    text:                    string;
    time:                    number;  
  }>;
  }
  