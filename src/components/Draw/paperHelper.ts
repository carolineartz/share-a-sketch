import paper from "paper";
import { PathData, TextData, generateLocalId, mapToRange, emojiSrc, EmojiItemData } from "./utils";
import { DrawSettingsContextType } from "./context";

export type PaperItemContext = Pick<DrawSettingsContextType, 'tool' | 'shape' | 'size' | 'color' | 'emoji'>

export class PaperHelper {
  constructor(
    public paper: paper.PaperScope,
    public context: PaperItemContext,
    public localItemIds: string[] = []) {
    this.setupTextInputHack()
  }

  storeLocalItemId(id: string) {
    this.localItemIds.push(id);
  }

  updateContext(context: Partial<PaperItemContext>) {
    this.context.color = context.color || this.context.color;
    this.context.tool = context.tool || this.context.tool;
    this.context.shape = context.shape || this.context.shape;
    this.context.size = context.size || this.context.size;
    this.context.emoji = context.emoji || this.context.emoji
  }

  existingItem(id: string): paper.Item | undefined {
    return (this.paper.project.activeLayer.children as paper.Item[]).find(item => item.data.id === id);
  }

  isLocalItem(id: string): boolean {
    return this.localItemIds.includes(id);
  }

  createPathFromRemote(data: PathData): paper.Path {
    const newPath = new paper.Path();
    newPath.data.localId = data.localId;
    newPath.pathData = data.definition;
    newPath.data.id = data.id;

    if (newPath.closed) {
      newPath.fillColor = new paper.Color(data.color);
      newPath.strokeWidth = 0;
    }
    else {
      newPath.strokeCap = "round";
      newPath.strokeColor = new paper.Color(data.color);
      newPath.strokeWidth = data.strokeWidth;
    }
    return newPath;
  }

  createEmojiFromRemote(data: EmojiItemData): paper.Item {
    const url = emojiSrc(data.code)
    const item = this.paper.project.activeLayer.importSVG(url, (item: any, _str: any) => {
      item.setPosition(new paper.Point(data.position.x, data.position.y))
      item.scale(data.scale)
      item.data.scale = data.scale
      item.data.sourceType = "emoji"
      item.data.code = data.code
      item.data.localId = data.localId
      item.data.id = data.id
    })

    return item
  }

  createTextFromRemote(data: TextData): paper.PointText {
    const newText = new paper.PointText({
      point: Object.values(data.point),
      content: data.content,
      fillColor: new paper.Color(data.color),
      fontSize: data.fontSize,
      fontFamily: data.fontFamily
    });

    newText.data.localId = data.localId;
    newText.data.id = data.id

    return newText;
  }

  updatePathFromRemote(data: PathData): paper.Path {
    const path = this.existingItem(data.id) as paper.Path || this.createPathFromRemote(data);

    path.pathData = data.definition;

    return path;
  }

  updateTextFromRemote(data: TextData): paper.PointText {
    const text = this.existingItem(data.id) as paper.PointText || this.createTextFromRemote(data);

    text.content = data.content;

    return text;
  }

  setLocalHandlers(item: paper.Item) {
    const highlight = new paper.Color("#A9FF4D");

    item.onMouseEnter = () => {
      if (this.context.tool !== "erase") { return; }

      switch (item.constructor) {
        case paper.Path:
          const path = item as paper.Path;

          if (path.closed) {
            path.data.color = path.fillColor; // save the original color
            path.fillColor = highlight;
          }
          else {
            path.data.color = path.strokeColor; // save the original color
            path.strokeColor = highlight;
          }

          break;
        case paper.PointText:
          const text = item as paper.PointText;

          text.data.color = text.fillColor; // save the original color
          text.fillColor = highlight;
      }
    };

    item.onMouseLeave = () => {
      if (this.context.tool !== "erase") { return; }

      switch (item.constructor) {
        case paper.Path:
          const path = item as paper.Path;

          if (path.closed) {
            path.fillColor = path.data.color; // revert to original color
          }
          else {
            path.strokeColor = path.data.color; // revert to original color
          }

          break;
        case paper.PointText:
          const text = item as paper.PointText;

          text.fillColor = text.data.color; // revert to original color
      }
    };
  }

  createLocalEmoji(point: paper.Point, onCreate: (item: paper.Item, foo: any) => void): void {
    const localId = generateLocalId();
    this.storeLocalItemId(localId);

    const emojiData = this.context.emoji as any

    const url = emojiSrc(emojiData.unified)

    this.paper.project.activeLayer.importSVG(url, (item: any, str: any) => {
      item.setPosition(point)
      item.scale(this.context.size / 8)
      item.data.localId = localId
      item.data.scale = this.context.size / 8
      item.data.sourceType = "emoji"
      item.data.code = emojiData.unified

      onCreate(item, {})
    })

    // return item
  }

  createLocalPath(point: paper.Point): paper.Item {
    const localId = generateLocalId();
    this.storeLocalItemId(localId);

    let path: paper.Path;

    if (this.context.tool === "shape") {
      let sizeFactor;
      switch (this.context.shape) {
        case "square":
          sizeFactor = this.context.size / 2 * 3;
          path = new paper.Path.Rectangle(
            new paper.Point(point.x - sizeFactor, point.y - sizeFactor),
            new paper.Size(sizeFactor * 2, sizeFactor * 2)
          );
          break;
        case "circle":
          sizeFactor = this.context.size / 2 * 3;
          path = new paper.Path.Circle(point, sizeFactor);
          break;
        case "star":
          sizeFactor = (this.context.size - (this.context.size / 4)) * 3;
          path = new paper.Path.Star(point, 5, sizeFactor / 2, sizeFactor);
      }
      path.fillColor = new paper.Color(this.context.color);
    }
    else {
      path = new paper.Path({
        strokeWidth: this.context.size,
        strokeCap: "round",
        strokeColor: new paper.Color(this.context.color)
      });
    }

    path.data.localId = localId;
    path.data.color = this.context.color;

    return path;
  }

  createLocalText(point: paper.Point): paper.Item {
    const localId = generateLocalId();
    this.storeLocalItemId(localId);

    const text = new paper.PointText({
      point: [point.x, point.y],
      content: "",
      fillColor: new paper.Color(this.context.color),
      fontSize: mapToRange(this.context.size, 8, 60, 25, 60),
      fontFamily: "Quicksand"
    });

    text.data.localId = localId
    text.data.color = this.context.color

    return text
  }

  private setupTextInputHack() {
    const view = this.paper.project.activeLayer.view

    view.onClick = () => {
      const hiddenInputEl = document.getElementById("draw-tools-hidden-input")
      if (this.context.tool === "text" && hiddenInputEl) {
        hiddenInputEl.focus()
      }
    }
  }
}
