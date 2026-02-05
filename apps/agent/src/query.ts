/**
 * Data query tool for CSV database
 * Converted from Python: src/query.py
 */

import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DataRecord {
  date: string;
  category: string;
  subcategory: string;
  amount: string;
  type: string;
}

/**
 * Query the database. Always call before showing a chart or graph.
 */
export const queryData = tool(
  async (_input: { query: string }): Promise<DataRecord[]> => {
    const csvPath = join(__dirname, "db.csv");
    const csvContent = readFileSync(csvPath, "utf-8");

    // Parse CSV manually
    const lines = csvContent.trim().split("\n");
    const headers = lines[0].split(",");

    const records: DataRecord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      records.push(record as unknown as DataRecord);
    }

    return records;
  },
  {
    name: "query_data",
    description:
      "Query the database. Always call before showing a chart or graph.",
    schema: z.object({
      query: z.string().describe("The query to execute"),
    }),
  }
);