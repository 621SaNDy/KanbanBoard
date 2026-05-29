export class DateUtility {
  static getAbsoluteDate(dateString: string) {
    try {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const parts = formatter.formatToParts(date);
      const day = parts.find((p) => p.type === "day")?.value ?? "??";
      const month = parts.find((p) => p.type === "month")?.value ?? "??";
      const year = parts.find((p) => p.type === "year")?.value ?? "????";

      return `${day}.${month}.${year}`;
    } catch {
      return "????";
    }
  }
}
