import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import axios from "axios";
import { IPlace } from "../models/place_model";

const GOOGLE_API_KEY    = process.env.GOOGLE_PLACES_API_KEY!;
const NEARBY_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const SEARCH_RADIUS     = 500;

const ALLOWED_CATEGORIES = [
  "restaurant",
  "cafe",
  "bar",
  "bakery",
  "hotel",
  "pharmacy",
  "gym"
];

class PlaceController {
    public getCategories(req: Request, res: Response) {
        res.status(200).json(ALLOWED_CATEGORIES);
    }

  public async getNearbyPlacesByCategories(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lng, categories } = this.parseAndValidate(req);
      const rawPlaces = await this.fetchAllCategories(+lat, +lng, categories);
      const enriched  = await this.enrichPlaces(rawPlaces);
      res.status(200).json(enriched);
    } catch (err: any) {
      res
        .status(err.status || 500)
        .json({ error: err.message || "Server error" });
    }
  }

  private parseAndValidate(req: Request) {
    const { lat, lng, categories } = req.query as any;
  
    if (!lat || !lng || categories == null) {
      throw { status: 400, message: "Missing lat, lng or categories[]" };
    }
  
    if (isNaN(+lat) || isNaN(+lng)) {
      throw { status: 400, message: "Invalid lat or lng" };
    }
  
    const cats: string[] = Array.isArray(categories)
      ? categories
      : [categories];
  
    if (
      cats.length === 0 ||
      cats.some((c) => typeof c !== "string" || !ALLOWED_CATEGORIES.includes(c))
    ) {
      throw {
        status: 400,
        message: `Invalid categories. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`
      };
    }
      return { lat, lng, categories: cats };
  }
  

  private async fetchAllCategories(
    lat: number,
    lng: number,
    categories: string[]
  ): Promise<IPlace[]> {
    const map = new Map<string, IPlace>();
    for (const cat of categories) {
      const list = await this.fetchCategoryPlaces(lat, lng, cat);
      for (const p of list) {
        if ((p as any).place_id && !map.has((p as any).place_id)) {
          map.set((p as any).place_id, p);
        }
      }
    }
    return Array.from(map.values());
  }

  private async fetchCategoryPlaces(
    lat: number,
    lng: number,
    category: string
  ): Promise<IPlace[]> {
    const url = `${NEARBY_SEARCH_URL}` +
                `?location=${lat},${lng}` +
                `&radius=${SEARCH_RADIUS}` +
                `&type=${category}` +
                `&key=${GOOGLE_API_KEY}`;
    try {
      const resp = await axios.get(url);
      const results = resp.data.results as any[] || [];
      return results.map(r => ({
        // temporarily include place_id only for de-duplication; will not be persisted
        place_id: r.place_id,
        name: r.name,
        location: {
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng
        },
        rating: typeof r.rating === "number" ? r.rating : 0,
        type: category
      }));
    } catch {
      return [];
    }
  }

  private async enrichPlaces(places: IPlace[]): Promise<IPlace[]> {
    return Promise.all(
      places.map(async place => {
        const placeId = (place as any).place_id;
        if (!placeId) return place;

        const url = `${PLACE_DETAILS_URL}` +
                    `?place_id=${placeId}` +
                    `&fields=formatted_address,international_phone_number,business_status,opening_hours` +
                    `&key=${GOOGLE_API_KEY}`;
        try {
          const resp = await axios.get(url);
          const r = resp.data.result;
          if (r) {
            place.address         = r.formatted_address;
            place.phone_number    = r.international_phone_number;
            place.business_status = r.business_status;
            if (r.opening_hours) {
              place.opening_hours = {
                open_now:      r.opening_hours.open_now,
                weekday_text: r.opening_hours.weekday_text
              };
            }
          }
        } catch {
          // ignore individual enrichment failures
        }
        return place;
      })
    );
  }
}

export default new PlaceController();
