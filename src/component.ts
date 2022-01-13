import { Project } from "./project";
import { logger } from "./tracing";

/**
 * Represents a project component.
 */
@logger
export class Component {
  constructor(public readonly project: Project) {
    project._addComponent(this);
  }

  /**
   * Called before synthesis.
   */
  public preSynthesize() {}

  /**
   * Synthesizes files to the project output directory.
   */
  public synthesize() {}

  /**
   * Called after synthesis. Order is *not* guaranteed.
   */
  public postSynthesize() {}
}
