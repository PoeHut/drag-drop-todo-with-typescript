import * as Types from "./types";
import Project from "./Project";

class State<T> {
  protected listeners: Types.Listener<T>[] = [];

  addListener(listenerFn: Types.Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export default class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      Types.ProjectStatus.Active,
    );

    this.projects.push(newProject);
    this.updateListners();
  }

  moveProject(projectId: string, newStatus: Types.ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListners();
    }
  }

  private updateListners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
