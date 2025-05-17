import { Request, Response } from "express";
import { IPlace } from "../models/place_model";

class MockPlaceController {
  /**
   * Returns one mock place per requested category around the given lat/lng.
   */
  public async getNearbyPlacesByCategories(req: Request, res: Response): Promise<void> {
    const { lat, lng, categories } = req.query as any;

    if (!lat || !lng || !categories) {
      res.status(400).send({ error: "Missing lat, lng or categories[]" });
      return;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      res.status(400).send({ error: "Invalid lat or lng" });
      return;
    }

    const cats: string[] = Array.isArray(categories) ? categories : [categories];
    if (cats.length === 0) {
      res.status(400).send({ error: "categories[] must be a non-empty array" });
      return;
    }

    const places: IPlace[] = cats.map((cat, idx) => ({
      place_id: `mock-place-${idx + 1}`,
      name: `${cat} Mock Place`,
      location: {
        lat: latNum + (idx + 1) * 0.0001,
        lng: lngNum + (idx + 1) * 0.0001,
      },
      rating: 4.5,
      type: cat,
      address: `123 Mock ${cat} St.`,
      phone_number: "000-000-0000",
      business_status: "OPERATIONAL",
      opening_hours: {
        open_now: true,
        weekday_text: [
          "Monday: 9:00 AM – 5:00 PM",
          "Tuesday: 9:00 AM – 5:00 PM",
          "Wednesday: 9:00 AM – 5:00 PM",
          "Thursday: 9:00 AM – 5:00 PM",
          "Friday: 9:00 AM – 5:00 PM",
          "Saturday: 10:00 AM – 4:00 PM",
          "Sunday: Closed",
        ],
      },
      elevation:       20 + idx * 5
    }));

    res.status(200).send(places);
  }
}

export default new MockPlaceController();
