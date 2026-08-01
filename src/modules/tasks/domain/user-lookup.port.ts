import { Assignee } from "./assignee.vo";

export interface UserLookupPort {
  getAssignee(userId: string): Promise<Assignee | null>;
}
