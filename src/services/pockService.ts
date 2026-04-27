import { randomUUID } from "node:crypto";

import type { PockRecord } from "../domain/pockRecord.js";
import { PockHistoryRepository } from "../repositories/pockHistoryRepository.js";

interface CreatePockInput {
  actorUserId: string;
  actorDisplayName: string;
  targetUserId: string;
  targetDisplayName: string;
  guildId: string;
  channelId: string;
}

export class PockService {
  public constructor(private readonly repository: PockHistoryRepository) {}

  public async createPock(input: CreatePockInput): Promise<PockRecord> {
    const record: PockRecord = {
      id: randomUUID(),
      actorUserId: input.actorUserId,
      actorDisplayName: input.actorDisplayName,
      targetUserId: input.targetUserId,
      targetDisplayName: input.targetDisplayName,
      guildId: input.guildId,
      channelId: input.channelId,
      createdAt: new Date().toISOString()
    };

    await this.repository.add(record);

    return record;
  }

  public async getRecentGuildPocks(guildId: string, limit = 10): Promise<PockRecord[]> {
    return this.repository.findRecentByGuild(guildId, limit);
  }
}
