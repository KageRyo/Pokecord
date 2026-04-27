import type { AppLocale } from "./locales.js";

export interface I18nMessages {
  commandOnlyInServer: string;
  unknownCommand: string;
  genericCommandError: string;
  cannotPockYourself: string;
  noPockHistory: string;
  recentPockHistoryTitle: string;
  pockMessage(actorId: string, targetId: string): string;
  languageUpdated: string;
  clearCommandsDone(scope: "global" | "guild", guildId?: string): string;
}

const messages: Record<AppLocale, I18nMessages> = {
  en: {
    commandOnlyInServer: "This command can only be used inside a server.",
    unknownCommand: "Unknown command.",
    genericCommandError: "Something went wrong while handling the command.",
    cannotPockYourself: "You cannot pock yourself.",
    noPockHistory: "No pock history yet.",
    recentPockHistoryTitle: "Recent pock history:",
    pockMessage: (actorId, targetId) => `<@${actorId}> pocked <@${targetId}>.`,
    languageUpdated: "Language has been updated to English.",
    clearCommandsDone: (scope, guildId) =>
      scope === "guild"
        ? `Cleared guild slash commands for ${guildId}.`
        : "Cleared global slash commands."
  },
  ja: {
    commandOnlyInServer: "このコマンドはサーバー内でのみ使用できます。",
    unknownCommand: "不明なコマンドです。",
    genericCommandError: "コマンドの処理中に問題が発生しました。",
    cannotPockYourself: "自分自身をポックすることはできません。",
    noPockHistory: "まだポック履歴はありません。",
    recentPockHistoryTitle: "最近のポック履歴:",
    pockMessage: (actorId, targetId) => `<@${actorId}> が <@${targetId}> をポックしました。`,
    languageUpdated: "言語を日本語に変更しました。",
    clearCommandsDone: (scope, guildId) =>
      scope === "guild"
        ? `ギルド ${guildId} のスラッシュコマンドを削除しました。`
        : "グローバルスラッシュコマンドを削除しました。"
  },
  "zh-TW": {
    commandOnlyInServer: "這個指令只能在伺服器內使用。",
    unknownCommand: "找不到這個指令。",
    genericCommandError: "處理指令時發生錯誤。",
    cannotPockYourself: "你不能戳自己。",
    noPockHistory: "目前還沒有戳人紀錄。",
    recentPockHistoryTitle: "最近的戳人紀錄:",
    pockMessage: (actorId, targetId) => `<@${actorId}> 戳了 <@${targetId}> 一下。`,
    languageUpdated: "語言已切換為繁體中文。",
    clearCommandsDone: (scope, guildId) =>
      scope === "guild"
        ? `已清除 guild ${guildId} 的 slash commands。`
        : "已清除全域 slash commands。"
  }
};

export function getMessages(locale: AppLocale): I18nMessages {
  return messages[locale];
}
