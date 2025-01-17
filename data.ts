export interface DataPoint {
  date: string;
  value: number;
}

export async function loadData(): Promise<DataPoint[]> {
  const text = await Deno.readTextFile("users_db.csv");
  const lines = text.split("\n").slice(1); // Skip header row
  
  return lines
    .filter(line => line.trim()) // Skip empty lines
    .map(line => {
      const [date, value] = line.split(",");
      return {
        date,
        value: parseInt(value, 10)
      };
    });
} 