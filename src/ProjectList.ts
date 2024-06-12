import Project from "./Project";
import ProjectStateInstance from "./ProjectState";
import Component from "./Component";
import * as Types from "./types";
import ProjectItem from "./ProjectItem";
import { UtilFn } from "./utils";

export default class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Types.DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @UtilFn.autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();

      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");

    ProjectStateInstance.moveProject(
      projectId,
      this.type === "active"
        ? Types.ProjectStatus.Active
        : Types.ProjectStatus.Finished,
    );
  }

  @UtilFn.autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    ProjectStateInstance.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === Types.ProjectStatus.Active;
        }

        return prj.status === Types.ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`,
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}
