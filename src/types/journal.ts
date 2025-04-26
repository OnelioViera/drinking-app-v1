export interface JournalEntry {
  _id?: string;
  date: Date;
  mood: string;
  triggers: string[];
  notes: string;
  createdAt?: Date;
}
