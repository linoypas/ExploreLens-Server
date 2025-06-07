import { Request, Response } from "express";
import siteInfoHistoryModel from "../models/siteinfo_history_model";
import siteInfoModel, { ISiteInfo } from "../models/siteInfo_model";
import userStatisticsModel, { IUserStatistics } from "../models/userStatistics_model";
import { askUserStatisticsGPT } from "../providers/gpt/userStatistics_gpt_provider"; 

class UserStatisticsController {
  public async calculate(req: Request, res: Response) {
    const { userId } = req.params;
    try {
            const visitedSiteNames = await this.getVisitedSiteNames(userId);
            const sitesListString = visitedSiteNames.map((n) => `- ${n}`).join("\n");

            const percentageVisited = await this.calculatePercentageVisited(sitesListString);
            const countries          = await this.calculateCountriesList(sitesListString);
            const countryCount       = countries.length;
            const siteCount          = visitedSiteNames.length;

            const userStatistics: IUserStatistics = {
                userId,
                percentageVisited,
                countryCount,
                countries,
                siteCount
            };

            res.status(200).send(userStatistics);

    } catch (err: any) {
      console.error("calculate error:", err);
      res.status(500).send({ error: "Failed to calculate user statistics" });
    }
  }

  private async getVisitedSiteNames(userId: string): Promise<string[]> {
    const histories = await siteInfoHistoryModel.find({ userId });
    const rawIds = histories.map((h) => h.siteInfoId);
    const uniqueIds = Array.from(new Set(rawIds));
    //load only the `name` field from each SiteInfo
    const sites = await siteInfoModel
      .find({ _id: { $in: uniqueIds } })
      .select("name")
      .lean<{ _id: string; name: string }[]>();
    return sites.map((s) => s.name);
  }

   private async calculatePercentageVisited(sitesListString: string): Promise<string> {
    const prompt = `
I want you to compute what percentage of all known famous historical sites a user has visited.
Assume there are 10,000 such sites worldwide.
Here are the sites this user has visited:
${sitesListString}

Please reply with exactly one percentage (for example "12.3%"), and nothing else.
    `.trim();

    return await askUserStatisticsGPT(prompt);
  }

private async calculateCountriesList(sitesListString: string): Promise<string[]> {
  const prompt = `
I have visited these historical sites:
${sitesListString}

Please tell me the distinct country names where these sites are located.
Reply with a comma-separated list of country names only
(e.g. "France, Japan, United States").
  `.trim();

  const reply = await askUserStatisticsGPT(prompt);
  const countries = reply
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (countries.length === 0) {
    throw {
      status: 500,
      message: `Invalid countries list from GPT: "${reply}"`
    };
  }

  return countries;
}  

}

export default new UserStatisticsController();