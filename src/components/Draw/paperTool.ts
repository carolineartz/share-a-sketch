import paper from "paper";

import { PaperHelper } from "./paperHelper";
import { FirebaseHelper } from "./firebaseHelper";
import { DrawSettingsContext } from ".";
import { DesignColor } from "@components/App/theme";
import { LocalPaperItem } from "./localPaperItem";
import { EmojiItem } from "./context";

export type LocalState = {
  tool: DrawSettingsContext.DrawTool
  size: number
  color: DesignColor
  shape: DrawSettingsContext.DrawShape
  emoji: EmojiItem
}

export class PaperTool extends paper.Tool {
  currentItem: LocalPaperItem = new LocalPaperItem()
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
    return this.currentItem.isActive
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

  clearCurrentItem(): void {
    this.currentItem.clear()
  }

  clearCursorShape() {
    if (this.cursorShape) {
      this.cursorShape.remove()
      this.cursorShape = null
    }
  }

  onMouseDown = (evt: paper.ToolEvent) => {
    switch (this.tool) {
      case "paint":
        this.currentItem.set(this.paperHelper.createLocalPath(evt.point), { isActive: true })
        const key = this.firebaseHelper.broadcastCreate(this.currentItem).key

        if (key) {
          this.currentItem.id = key
          this.paperHelper.setLocalHandlers(this.currentItem.get())
        }
        break
      case "emoji":
        this.paperHelper.createLocalEmoji(evt.point, (item: paper.Item) => {
          this.currentItem.set(item, { isActive: true })

          const key = this.firebaseHelper.broadcastCreate(this.currentItem).key

          if (key) {
            this.currentItem.id = key
            this.paperHelper.setLocalHandlers(this.currentItem.get())
          }
        })
        break
      case "shape":
        // don't broadcast create until the mouse is up for shapes
        this.currentItem.set(this.paperHelper.createLocalPath(evt.point), {isActive: true})
        break
      case "text":
        this.currentItem.set(this.paperHelper.createLocalText(evt.point))
        break
      case "erase":
        this.currentItem.clear()
        const target = evt.item

        if (target) {
          this.firebaseHelper.broadcastDestroy(new LocalPaperItem(target)) // but do the actual destroy the paper item from the firebase event response
        }
    }
  }

  onMouseUp = (_evt: paper.ToolEvent) => {
    switch (this.tool) {
      case "shape":
        const key = this.firebaseHelper.broadcastCreate(this.currentItem).key

        if (key) {
          this.currentItem.id = key
          this.paperHelper.setLocalHandlers(this.currentItem.get())
        }
        break
      case "paint":
        this.currentItem.simplifyPath()

        if (this.currentItem.isDirty && !this.currentItem.isEmpty) {
          this.firebaseHelper.broadcastUpdate(this.currentItem)()
        }
    }

    if (this.tool !== "text") {
      this.currentItem.clear()
    }
  }

  onMouseDrag = (evt: paper.ToolEvent) => {
    switch (this.tool) {
      case "erase":
        this.currentItem.setActive(true)
        const target = evt.item
        if (target) {
          this.firebaseHelper.broadcastDestroy(new LocalPaperItem(target))
        }
        break
      case "paint":
        this.currentItem.setActive(true)
        this.currentItem.addPoint(evt.point)

        if (this.currentItem.isDirty && !this.currentItem.isEmpty) {
           this.firebaseHelper.broadcastUpdate(this.currentItem)()
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
        if (this.currentItem.isActive) { return }

        // i have no idea why the position of the star specifically is slightly off from the event point, but this adjustment seems to work...
        else if (this.cursorShape && this.shape === "star") {
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
    if (this.tool !== "text" || evt.modifiers.alt) {
      return
    }

    this.currentItem.setActive(true)

    if (evt.key === "backspace") {
      this.currentItem.deleteChar()
    } else {
      this.currentItem.addChar(evt.character)
    }

    if (this.currentItem.isText && this.currentItem.isDirty && this.currentItem.isNew) {
      const key = this.firebaseHelper.broadcastCreate(this.currentItem).key

      if (key) {
        this.currentItem.id = key
        this.paperHelper.setLocalHandlers(this.currentItem.get())
      }
    }

    else if (this.currentItem.isDirty) {
      this.firebaseHelper.broadcastUpdate(this.currentItem)()
    }
  }
}
