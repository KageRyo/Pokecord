import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { PockRecord } from "../domain/pockRecord.js";
import { ensureDirectory } from "../utils/ensureDirectory.js";

interface PockHistoryData {
  records: PockRecord[];
}

const DEFAULT_DATA: PockHistoryData = { records: [] };

export class PockHistoryRepository {
  private readonly filePath: string;

  public constructor(filePath?: string) {
    this.filePath = filePath ?? path.resolve(process.cwd(), "data", "pock-history.json");
  }

  public async add(record: PockRecord): Promise<void> {
    const data = await this.readData();

    data.records.push(record);

    await this.writeData(data);
  }

  public async findRecentByGuild(guildId: string, limit: number): Promise<PockRecord[]> {
    const data = await this.readData();

    return data.records
      .filter((record) => record.guildId === guildId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, limit);
  }

  private async readData(): Promise<PockHistoryData> {
    try {
      const content = await readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(content) as Partial<PockHistoryData>;

      return {
        records: Array.isArray(parsed.records) ? parsed.records : []
      };
    } catch (error) {
      const isMissingFile =
        error instanceof Error &&
        "code" in error &&
        typeof error.code === "string" &&
        error.code === "ENOENT";

      if (isMissingFile) {
        return DEFAULT_DATA;
      }

      throw error;
    }
  }

  private async writeData(data: PockHistoryData): Promise<void> {
    await ensureDirectory(path.dirname(this.filePath));
    await writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}
