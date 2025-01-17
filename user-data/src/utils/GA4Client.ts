import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { createObjectCsvWriter } from "csv-writer";
import { subYears, format } from "date-fns";

const GA4_PROPERTY_ID = "414002558";

interface MetricData {
  date: string;
  count: number;
}

const getGoogleCredentials = () => {
  const base64Credentials = process.env.GOOGLE_CREDENTIALS;
  if (!base64Credentials) {
    throw new Error("Missing Google credentials");
  }
  const jsonString = Buffer.from(base64Credentials, "base64").toString("utf8");
  return JSON.parse(jsonString);
};

const CREDENTIALS = getGoogleCredentials();

export class GA4Client {
  private client: BetaAnalyticsDataClient;

  constructor() {
    this.client = new BetaAnalyticsDataClient({
      credentials: CREDENTIALS,
    });
  }

  private async runReport(
    metrics: string[],
    startDate: Date,
    endDate: Date = new Date(),
    eventName?: string
  ) {
    const [response] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        },
      ],
      dimensions: [
        {
          name: "date",
        },
      ],
      metrics: metrics.map((metric) => ({ name: metric })),
      ...(eventName && {
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: eventName,
              matchType: "EXACT",
            },
          },
        },
      }),
    });

    return response;
  }

  private async exportToCSV(
    data: MetricData[],
    filename: string,
    headers: { id: string; title: string }[]
  ) {
    const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
    
    const csvWriter = createObjectCsvWriter({
      path: `public/${filename}`,
      header: headers,
    });

    await csvWriter.writeRecords(sortedData);
    console.log(`Data exported to public/${filename}`);
  }

  public async getSearchQueryEvents() {
    const startDate = subYears(new Date(), 1);
    const response = await this.runReport(
      ["eventCount"],
      startDate,
      undefined,
      "search_query"
    );

    const data =
      response.rows?.map((row) => ({
        date: row.dimensionValues?.[0].value || "",
        count: parseInt(row.metricValues?.[0].value || "0", 10),
      })) || [];

    await this.exportToCSV(data, "search_queries.csv", [
      { id: "date", title: "Date" },
      { id: "count", title: "Search Queries" },
    ]);

    return data;
  }

  public async getBuyButtonClicks() {
    const startDate = subYears(new Date(), 1);
    const response = await this.runReport(
      ["eventCount"],
      startDate,
      undefined,
      "buy_button_click"
    );

    const data =
      response.rows?.map((row) => ({
        date: row.dimensionValues?.[0].value || "",
        count: parseInt(row.metricValues?.[0].value || "0", 10),
      })) || [];

    await this.exportToCSV(data, "buy_button_clicks.csv", [
      { id: "date", title: "Date" },
      { id: "count", title: "Buy Button Clicks" },
    ]);

    return data;
  }

  public async getActiveUsers() {
    const startDate = subYears(new Date(), 1);
    const response = await this.runReport(["activeUsers"], startDate);

    const data =
      response.rows?.map((row) => ({
        date: row.dimensionValues?.[0].value || "",
        count: parseInt(row.metricValues?.[0].value || "0", 10),
      })) || [];

    await this.exportToCSV(data, "active_users.csv", [
      { id: "date", title: "Date" },
      { id: "count", title: "Active Users" },
    ]);

    return data;
  }

  public async fetchAllMetrics() {
    try {
      console.log("Fetching search query events...");
      await this.getSearchQueryEvents();

      console.log("Fetching buy button clicks...");
      await this.getBuyButtonClicks();

      console.log("Fetching active users...");
      await this.getActiveUsers();

      console.log("All data fetched and exported successfully!");
    } catch (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }
  }
}
