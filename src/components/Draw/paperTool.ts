import paper from "paper";

import { PaperHelper } from "./paperHelper";
import { FirebaseHelper } from "./firebaseHelper";
import { DrawSettingsContext } from ".";
import { DesignColor } from "@components/App/theme";

export type LocalState = {
  tool: DrawSettingsContext.DrawTool
  size: number
  color: DesignColor
  shape: DrawSettingsContext.DrawShape
}

export class PaperTool extends paper.Tool {
  activeState: "active" | "inactive" = "inactive"
  activeItem: paper.Item | null = null
  cursorShape: paper.Item | null = null

  constructor(
    public paperHelper: PaperHelper,
    public firebaseHelper: FirebaseHelper) {
      super()
  }

  updateContext(context: Partial<LocalState>) {
    this.paperHelper.updateContext(context)
  }

  get isActive() {
    return this.activeState === "active"
  }

  get tool() {
    return this.paperHelper.context.tool
  }

  get color() {
    return new paper.Color(this.paperHelper.context.color)
  }

  get shape() {
    return this.paperHelper.context.shape
  }

  get size() {
    return this.paperHelper.context.size
  }

  clearActiveItem() {
    this.activeItem = null
  }

  clearCursorShape() {
    if (this.cursorShape) {
      this.cursorShape.remove()
      this.cursorShape = null
    }
  }

  setActive(isActive: boolean) {
    if (isActive) {
      this.activeState = "active"
    } else {
      this.activeState = "inactive"
    }
  }

  onMouseDown = (evt: paper.ToolEvent) => {
    this.setActive(true)

    switch (this.tool) {
      case "paint":
      case "shape":
        this.activeItem = this.paperHelper.createLocalPath(evt.point)
        const key = this.firebaseHelper.broadcastCreate(this.activeItem).key
        this.activeItem.data.id = key
        this.paperHelper.setLocalHandlers(this.activeItem)
        break
      case "text":
        // don't broadcast create until actual text content is added to the item.
        this.activeItem = this.paperHelper.createLocalText(evt.point)
        break
      case "erase":
        this.clearActiveItem()
        const target = evt.item

        if (target) {
          this.firebaseHelper.broadcastDestroy(target) // but do the actual destroy the paper item from the firebase event response
        }
    }
  }

  onMouseUp = (_evt: paper.ToolEvent) => {
    this.setActive(false)

    switch (this.tool) {
      case "shape":
      case "erase":
        this.clearActiveItem() // i guess shouldn't need this for erase?
        break
      case "paint":
        if (this.activeItem instanceof paper.Path && this.activeItem.area !== 0) { // DO I NEED the area check?
          this.activeItem.simplify()
          this.firebaseHelper.broadcastUpdate(this.activeItem)()
          this.clearActiveItem()
        }
    }
  }

  onMouseDrag = (evt: paper.ToolEvent) => {
    this.setActive(true)

    switch (this.tool) {
      case "erase":
        const target = evt.item
        if (target) {
          this.firebaseHelper.broadcastDestroy(target)
        }
        break
      case "paint":
        if (this.activeItem && this.activeItem instanceof paper.Path) {
          this.activeItem.add(evt.point)
          this.firebaseHelper.broadcastUpdate(this.activeItem)()
        }
    }
  }

  onMouseMove = (evt: paper.ToolEvent) => {
    switch (this.tool) {
      case "erase":
      case "paint":
      case "text":
        if (this.cursorShape) { this.clearCursorShape() }
        break
      case "shape":
        if (this.isActive) { return }

        else if (this.cursorShape && this.shape === "star") {
          // i have no idea why the position of the star specifically is slightly off from the event point, but this adjustment seems to work...
          this.cursorShape.position = new paper.Point(evt.point.x, evt.point.y + (this.size / 5))
        }

        else if (this.cursorShape) {
          this.cursorShape.position = evt.point
        }

        else {
          this.cursorShape = this.paperHelper.createLocalPath(evt.point)
          this.cursorShape.fillColor = new paper.Color(this.color);
          this.cursorShape.opacity = 0.5;
        }
    }
  }

  onKeyDown = (evt: paper.KeyEvent) => {
    this.setActive(true)

    if (this.tool !== "text") { return }

    else if (this.activeItem && this.activeItem instanceof paper.PointText) {
      const isNew = this.activeItem.isEmpty()

      this.activeItem.content = this.activeItem.content + evt.character

      if (isNew) {
        const key = this.firebaseHelper.broadcastCreate(this.activeItem).key
        this.activeItem.data.id = key
        this.paperHelper.setLocalHandlers(this.activeItem)
      } else {
        this.firebaseHelper.broadcastUpdate(this.activeItem)()
      }
    }
  }

  onKeyUp = (_evt: paper.KeyEvent) => {
    this.setActive(false)
  }
}
