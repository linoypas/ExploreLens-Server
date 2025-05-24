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
            const countryCount       = await this.calculateCountryCount(sitesListString);
            const continents         = await this.calculateContinents(sitesListString);
            const siteCount          = visitedSiteNames.length;

            const userStatistics: IUserStatistics = {
                userId,
                percentageVisited,
                countryCount,
                continents,
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

  private buildPromptList(items: string[]): string {
  if (items.length === 0) {
    return "- (none)";
  }
  return items.map((i) => `- ${i}`).join("\n");
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

  private async calculateCountryCount(sitesListString: string): Promise<number> {
    const prompt = `
I have visited these historical sites:
${sitesListString}

Please tell me how many distinct countries these sites are located in.
Reply with exactly one integer (for example: “5”) and nothing else.
`.trim();

    const reply = await askUserStatisticsGPT(prompt);
    const parsed = parseInt(reply.replace(/[^\d]/g, ""), 10);
    if (isNaN(parsed)) {
      throw { status: 500, message: `Invalid country count from GPT: "${reply}"` };
    }
    return parsed;
  }

  private async calculateContinents(sitesListString: string): Promise<string[]> {
  const prompt = `
I have visited these historical sites:
${sitesListString}

Please tell me the distinct continents where these sites are located.
Reply with a comma-separated list of continent names only
(e.g. "Europe, Asia").
`.trim();

  const reply = await askUserStatisticsGPT(prompt);
  const continents = reply
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (continents.length === 0) {
    throw {
      status: 500,
      message: `Invalid continents list from GPT: "${reply}"`
    };
  }

  return continents;
}

}

export default new UserStatisticsController();