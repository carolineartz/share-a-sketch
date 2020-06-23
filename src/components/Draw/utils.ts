import Firebase from '../Firebase';
import throttle from "lodash.throttle";
import { DesignColor } from '@components/App/theme';
import { DrawSettingsContext } from '@components/Draw';
import paper from "paper"

type PointData = {
  x: number
  y: number
}

type SharedExternalData = {
  dataType: "path" | "text"
  id: string
  color: string
  localId: string
}

type PathData = SharedExternalData & {
  dataType: "path"
  strokeWidth: number
  definition: string
}

type TextData = SharedExternalData & {
  dataType: "text"
  content: string
  fontFamily: string
  fontSize: number,
  point: PointData,
  position: PointData
}

type ExternalData = TextData | PathData

interface Context {
  color: DesignColor
  tool: DrawSettingsContext.DrawTool
  shape: DrawSettingsContext.DrawShape
  toolState: "active" | "inactive"
  size: number
}

type ExternalLoadType = "initial" | "added" | "updated"

export class FirebaseHelper {
  constructor(
    public firebase: Firebase) {
  }

  broadcastCreate(item: paper.Item) {
    if (item instanceof paper.PointText) {
      return this.firebase.texts().push({
        content: item.content,
        color: item.data.color,
        localId: item.data.localId,
        fontFamily: item.fontFamily,
        fontSize: item.fontSize,
        point: {
          x: item.point.x,
          y: item.point.y
        },
        position: {
          x: item.position.x,
          y: item.position.y
        }
      })
    } else {
      const path = item as paper.Path
      return this.firebase.paths().push({
        definition: path.pathData,
        strokeWidth: path.closed ? 0 : path.strokeWidth,
        color: path.data.color,
        localId: path.data.localId
      });
    }
  }

  broadcastUpdate(item: paper.Item) {
    return throttle(() => {
      if (!item.data.id) {
        console.log("no id!")
        return
      }

      switch (item.constructor) {
        case paper.Path:
          const path = item as paper.Path

          return this.firebase.path(path.data.id).set({
            definition: path.pathData,
            strokeWidth: path.closed ? 0 : path.strokeWidth,
            color: path.data.color,
            localId: path.data.localId
          });
        case paper.PointText:
          const text = item as paper.PointText

          return this.firebase.text(text.data.id).set({
            content: text.content,
            color: text.data.color,
            localId: text.data.localId,
            fontFamily: text.fontFamily,
            fontSize: text.fontSize,
            point: {
              x: text.point.x,
              y: text.point.y
            },
            position: {
              x: text.position.x,
              y: text.position.y
            }
          })
      }
    })
  }

  broadcastDestroy(item: paper.Item) {
    switch (item.constructor) {
      case paper.Path:
        this.firebase.path(item.data.id).remove()
        break
      case paper.PointText:
        this.firebase.text(item.data.id).remove()
    }
  }

  watchItem(item: paper.Item, onUpdate: (data: ExternalData) => void) {
    switch (item.constructor) {
      case paper.Path:
        this.firebase.path(item.data.id).on("value", (snapshot: firebase.database.DataSnapshot) => {
          onUpdate({
            dataType: "path",
            id: snapshot.key,
            ...snapshot.val()
          })
        })
        break
      case paper.PointText:
        this.firebase.text(item.data.id).on("value", (snapshot: firebase.database.DataSnapshot) => {
          onUpdate({
            dataType: "text",
            id: snapshot.key,
            ...snapshot.val()
          })
        })
    }
  }
}

export class PaperItemLoader {
  constructor(
    public paperHelper: PaperHelper,
    public firebaseHelper: FirebaseHelper) {
  }

  update = (data: ExternalData): void => {
    this.load(data, "updated")
  }

  load = (data: ExternalData, loadType: ExternalLoadType): paper.Item | undefined => {
    // TODO: return a result type with the item or an error
    let item: paper.Item | undefined = undefined

    switch (loadType) {
      // 'initial': when first loading the content of the canvas from its stored state.
      case "initial":
        if (data.dataType === "path") {
          item = this.paperHelper.createPathFromRemote(data)
        }

        else if (data.dataType === "text") {
          item = this.paperHelper.createTextFromRemote(data)
        }

        // if (item) {
        //   this.paperHelper.setLocalHandlers(item)
        // }

        return item

      // 'added': when receiving a child_added event
      case "added":
        // the child_added event is from a locally drawn item's parent
        if (this.paperHelper.isLocalItem(data.localId)) {

          // item = this.paperHelper.existingItem(data.id)
          // this should always exist
          item = this.paperHelper.existingItem(data.id)

          if (item) {
            item.data.source = "local"
          }

          // if (item) {
          //   this.paperHelper.setLocalHandlers(item)
          // }
        }

        // the child_added event from an externally drawn item's parent
        else {
          // the initial display of this item is the same logic as an initial load.
          item = this.load(data, "initial")

          // after non-loocal added items are created, we have to update them as the remote data changes
          if (item) {
            this.firebaseHelper.watchItem(item, this.update)
          }
        }

        return item

      // 'updated': value events on the item (cuz of firebaseHelper.watchItem(item) when added)
      case "updated":
        if (data.dataType === "path") {
          item = this.paperHelper.updatePathFromRemote(data)
        }

        else if (data.dataType === "text") {
          item = this.paperHelper.updateTextFromRemote(data)
        }

        if (item) {
          item.data.source = "remote"
        }

        return item
    }
  }
}

export class PaperHelper {
  constructor(
    public paper: paper.PaperScope,
    public context: Context,
    public localItemIds: string[] = [],
  ) {}

  storeLocalItemId(id: string) {
    this.localItemIds.push(id)
  }

  updateContext(context: Partial<Context>) {
    this.context.color = context.color || this.context.color
    this.context.tool = context.tool || this.context.tool
    this.context.shape = context.shape || this.context.shape
    this.context.toolState = context.toolState || this.context.toolState
    this.context.size = context.size || this.context.size
  }

  existingItem(id: string): paper.Item | undefined {
    return (this.paper.project.activeLayer.children as paper.Item[]).find(item => item.data.id === id);
  }

  isLocalItem(id: string): boolean {
    return this.localItemIds.includes(id)
  }

  createPathFromRemote(data: PathData): paper.Path {
    const newPath = new paper.Path();
    newPath.data.localId = data.localId;
    newPath.pathData = data.definition;
    newPath.data.id = data.id;

    if (newPath.closed) {
      newPath.fillColor = new paper.Color(data.color);
      newPath.strokeWidth = 0;
    } else {
      newPath.strokeCap = "round";
      newPath.strokeColor = new paper.Color(data.color);
      newPath.strokeWidth = data.strokeWidth;
    }
    return newPath;
  }

  createTextFromRemote(data: TextData): paper.PointText {
    const newText = new paper.PointText({
      point: Object.values(data.point),
      content: data.content,
      fillColor: new paper.Color(data.color),
      fontSize: data.fontSize,
      fontFamily: data.fontFamily
    })

    newText.data.localId = data.localId;
    newText.data.id = data.id;

    return newText
  }

  updatePathFromRemote(data: PathData): paper.Path {
    const path = this.existingItem(data.id) as paper.Path || this.createPathFromRemote(data)

    path.pathData = data.definition

    return path
  }

  updateTextFromRemote(data: TextData): paper.PointText {
    const text = this.existingItem(data.id) as paper.PointText || this.createTextFromRemote(data)

    text.content = data.content

    return text
  }

  setLocalHandlers(item: paper.Item) {
    const highlight = new paper.Color("#A9FF4D")

    item.onMouseEnter = () => {
      if (this.context.tool !== "erase") { return }

      switch (item.constructor) {
        case paper.Path:
          const path = item as paper.Path

          if (path.closed) {
            path.data.color = path.fillColor; // save the original color
            path.fillColor = highlight
          } else {
            path.data.color = path.strokeColor; // save the original color
            path.strokeColor = highlight
          }

          break
        case paper.PointText:
          const text = item as paper.PointText

          text.data.color = text.fillColor // save the original color
          text.fillColor = highlight
      }
    }

    item.onMouseLeave = () => {
      if (this.context.tool !== "erase" || this.context.toolState === "active") {
         return
      }

      switch (item.constructor) {
        case paper.Path:
          const path = item as paper.Path

          if (path.closed) {
            path.fillColor = path.data.color // revert to original color
          } else {
            path.strokeColor = path.data.color // revert to original color
          }

          break
        case paper.PointText:
          const text = item as paper.PointText

          text.fillColor = text.data.color // revert to original color
      }
    }
  }

  createLocalPath(point: paper.Point): paper.Item {
    const localId = generateLocalId();
    this.storeLocalItemId(localId)

    let path: paper.Path

    if (this.context.tool === "shape") {
      let sizeFactor
      switch (this.context.shape) {
        case "square":
          sizeFactor = this.context.size / 2 * 3
          path = new paper.Path.Rectangle(
            new paper.Point(point.x - sizeFactor, point.y - sizeFactor),
            new paper.Size(sizeFactor * 2, sizeFactor * 2)
          );
          break;
        case "circle":
          sizeFactor = this.context.size / 2 * 3
          path = new paper.Path.Circle(point, sizeFactor);
          break;
        case "star":
          sizeFactor = (this.context.size - (this.context.size / 4)) * 3
          path = new paper.Path.Star(point, 5, sizeFactor/2, sizeFactor);
      }
    } else {
      path = new paper.Path({
        strokeWidth: this.context.size,
        strokeCap: "round",
        strokeColor: new paper.Color(this.context.color)
      });
    }

    path.data.localId = localId
    path.data.color = this.context.color

    return path
  }

  createLocalText(point: paper.Point): paper.Item {
    const localId = generateLocalId();
    this.storeLocalItemId(localId)

    const text = new paper.PointText({
      point: [point.x, point.y],
      content: "",
      fillColor: new paper.Color(this.context.color),
      fontSize: mapToRange(this.context.size, 8, 60, 25, 60)
    });

    text.data.localId = localId
    text.data.color = this.context.color

    return text
  }
}

type State = {
  localIds: string[],
  tool: "active" | "inactive"
}

export const withLocalItemEvents = (context: Context, state: State) => (item: paper.Item): paper.Item => {
  const highlight = new paper.Color("#A9FF4D")

  item.onMouseEnter = () => {
    if (context.tool !== "erase") { return }

    switch (item.constructor) {
      case paper.Path:
        const path = item as paper.Path

        if (path.closed) {
          path.data.color = path.fillColor; // save the original color
          path.fillColor = highlight
        } else {
          path.data.color = path.strokeColor; // save the original color
          path.strokeColor = highlight
        }

        break
      case paper.PointText:
        const text = item as paper.PointText

        text.data.color = text.fillColor // save the original color
        text.fillColor = highlight
    }
  }

  item.onMouseLeave = () => {
    if (context.tool !== "erase" || state.tool === "active") {
        return
    }

    switch (item.constructor) {
      case paper.Path:
        const path = item as paper.Path

        if (path.closed) {
          path.fillColor = path.data.color // revert to original color
        } else {
          path.strokeColor = path.data.color // revert to original color
        }

        break
      case paper.PointText:
        const text = item as paper.PointText

        text.fillColor = text.data.color // revert to original color
    }
  }

  return item
}

function generateLocalId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
};

function mapToRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}
