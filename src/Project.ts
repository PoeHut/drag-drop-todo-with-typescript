import * as Types from "./types";

// Project State Management
export default class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: Types.ProjectStatus,
  ) {}
}
