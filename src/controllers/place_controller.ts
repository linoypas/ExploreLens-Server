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
}

export default new PlaceController();
