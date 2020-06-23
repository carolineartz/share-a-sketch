import * as React from "react";
import * as DrawSettingsContext from "@components/Draw/context";
import paper from "paper";

import { WithFirebaseProps } from "../Firebase";
import { PaperHelper, FirebaseHelper, PaperItemLoader } from "./utils";

type CreatePaperHookType = {
  setCanvas: (canvas: HTMLCanvasElement) => void;
};

export const usePaperJs = ({firebase}: WithFirebaseProps): CreatePaperHookType => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const { tool, shape, color, size } = DrawSettingsContext.useDrawSettings();
  const localIds = React.useRef<string[]>([])

  const paperHelper = new PaperHelper(paper, { tool, shape, color, size, toolState: "inactive" }, localIds.current)
  const firebaseHelper = new FirebaseHelper(firebase)
  const itemLoader = new PaperItemLoader(paperHelper, firebaseHelper)

  const paperTool = new PaperTool(paperHelper, firebaseHelper)
  paperTool.activate()

  React.useEffect(() => {
    paperHelper.updateContext({ tool, shape, color, size })
    paperTool.clearCursorShape()
  }, [tool, shape, color, size, paperTool, paperHelper])

  React.useEffect(() => {
    if (canvas) {
      paper.setup(canvas);

      firebase.drawings().orderByKey().once("value", (snapshot: firebase.database.DataSnapshot) => {
          try {
            const drawings = snapshot.val();
            if (drawings && drawings.paths) {
              Object.entries(drawings.paths).forEach(
                ([pathId, pathVal]: [string, any]) => {
                  itemLoader.load({
                    dataType: "path",
                    id: pathId,
                    ...pathVal
                  }, "initial");
                }
              );
            }
            if (drawings && drawings.texts) {
             Object.entries(drawings.texts).forEach(
                ([pathId, pathVal]: [string, any]) => {
                  itemLoader.load({
                    dataType: "text",
                    id: pathId,
                    ...pathVal
                  }, "initial");
                }
              );
            }
          } catch (e) {
            console.error(e);
          }
        })
        .then(() => {
          firebase.paths().on("child_added", (addedSnapshot: firebase.database.DataSnapshot) => {
            itemLoader.load({
              dataType: "path",
              id: addedSnapshot.key,
              ...addedSnapshot.val()
            }, "added");
          })

          firebase.texts().on("child_added", (addedSnapshot: firebase.database.DataSnapshot) => {
            itemLoader.load({
              dataType: "text",
              id: addedSnapshot.key,
              ...addedSnapshot.val()
            }, "added");
          })

          firebase.paths().on("child_removed", (removedSnapshot: firebase.database.DataSnapshot) => {
            const existingPath = (paper.project.activeLayer
              .children as paper.Path[]).find(
              p => p.data.id === removedSnapshot.key
            );
            if (existingPath) {
              existingPath.remove();
            }
          })

          firebase.texts().on("child_removed", (removedSnapshot: firebase.database.DataSnapshot) => {
            const existingPath = (paper.project.activeLayer
              .children as paper.Path[]).find(
              p => p.data.id === removedSnapshot.key
            );
            if (existingPath) {
              existingPath.remove();
            }
          })
        })
    }

    return () => {
      firebase.drawings().off();
    };
  }, [canvas, firebase, itemLoader]);

  return { setCanvas }
}


class PaperTool extends paper.Tool {
  activeState: "active" | "inactive" = "inactive"
  activeItem: paper.Item | null = null
  cursorShape: paper.Item | null = null

  constructor(
    public paperHelper: PaperHelper,
    public firebaseHelper: FirebaseHelper) {
      super()
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
      this.paperHelper.context.toolState = this.activeState = "active"
    } else {
      this.paperHelper.context.toolState = this.activeState = "inactive"
    }
  }

  onMouseDown = (evt: paper.ToolEvent) => {
    this.setActive(true)

    switch (this.tool) {
      case "paint":
      case "shape":
        this.activeItem = this.paperHelper.createLocalPath(evt.point)
        break
      case "text":
        this.activeItem = this.paperHelper.createLocalText(evt.point)
        break
      case "erase":
        this.clearActiveItem()
        const target = evt.item

        if (target) {
          this.firebaseHelper.broadcastDestroy(target) // but do the actual destroy the paper item from the firebase event response
        }
    }

    if (this.activeItem) {
      const activeItem = this.activeItem
      const key = this.firebaseHelper.broadcastCreate(this.activeItem).key
      activeItem.data.id = key
      // this.firebaseHelper.broadcastCreate(this.activeItem).then(({ key }) => {
      //   activeItem.data.id = key
      // })
    }
  }

  onMouseUp = (_evt: paper.ToolEvent) => {
    this.setActive(false)

    switch (this.tool) {
      case "shape":
        this.clearActiveItem()
        console.log("mouse up when shape")
        break
      case "erase":
        this.clearActiveItem() // shouldn't need this, right?
        console.log("mouse up when erase")
        break
      case "text":
        console.log("mouse up when text")
        break
      case "paint":
        if (this.activeItem instanceof paper.Path && this.activeItem.area !== 0) { // DO I NEED the area check?
          this.activeItem.simplify()
          this.firebaseHelper.broadcastUpdate(this.activeItem)()
          this.clearActiveItem()
        }
        console.log("mouse up when paint")
        break
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
        if (this.cursorShape) {
          this.clearCursorShape()
        }
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
      this.activeItem.content = this.activeItem.content + evt.character
      this.firebaseHelper.broadcastUpdate(this.activeItem)()
    }
  }

  onKeyUp = (_evt: paper.KeyEvent) => {
    this.setActive(false)
  }
}
