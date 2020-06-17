/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-multi-assign */
import * as React from "react";
import * as DrawSettingsContext from "@components/Draw/context";
import paper, { Point, Path, Color, Size, Tool } from "paper";
import throttle from "lodash.throttle";
import { DesignColor } from "~/theme";

import { WithFirebaseProps } from "../Firebase";

type LoadType = "initial" | "added" | "updated";

type RemotePath = {
  id?: string;
  definition: string;
  strokeWidth: number;
  color: string; // covers strokeColor and fill
  localId: string;
};

type CreatPaperHookType = {
  setCanvas: (canvas: HTMLCanvasElement) => void;
};

type LocalState = {
  color: DesignColor;
  strokeWidth: DrawSettingsContext.DrawStrokeWidth;
  shape: DrawSettingsContext.DrawShape;
  size: number,
  tool: DrawSettingsContext.DrawTool;
  toolState: "active" | "inactive";
  currentLocalId?: string;
  localPathIds: string[];
  activePath?: paper.Path;
  localPathCache: Record<string, paper.Item>;
  paperScope: paper.PaperScope;
  paperTool?: PaperTool;
};

const generateLocalId = (): string => {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
};

const broadcastCreate = (
  firebase: any,
  path: paper.Path,
  tool: DrawSettingsContext.DrawTool
) => {
  return firebase.paths()
    .push({
      definition: path.pathData,
      strokeWidth: tool === "paint" ? path.strokeWidth : 0,
      color: path.data.color,
      localId: path.data.localId
    });
};

const broadcastUpdates = (firebase: any, path: paper.Path) =>
  throttle(() => {
    firebase.path(path.data.id)
      .set({
        definition: path.pathData,
        strokeWidth: path.closed ? 0 : path.strokeWidth,
        color: path.data.color,
        localId: path.data.localId
      });
  });

export const usePaperJs = ({firebase}: WithFirebaseProps): CreatPaperHookType => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const {
    tool,
    shape,
    strokeWidth,
    color,
    size
  } = DrawSettingsContext.useDrawSettings();

  const localState = React.useRef<LocalState>({
    tool,
    toolState: "inactive",
    localPathIds: [],
    shape,
    size,
    strokeWidth,
    color,
    paperScope: paper,
    localPathCache: {} as Record<string, paper.Item>
  });
  // ;(window as any).localState = localState // debugging

  React.useEffect(() => {
    localState.current.tool = tool;
    localState.current.shape = shape;
    localState.current.strokeWidth = strokeWidth;
    localState.current.color = color;
    localState.current.size = size
  }, [tool, shape, strokeWidth, color, size]);

  React.useEffect(() => {
    if (!localState.current.paperTool) {
      localState.current.paperTool = new PaperTool({
        currentState: localState.current
      });
      localState.current.paperTool.activate();
    }

    localState.current.paperTool.clearCursorShape()
  }, [tool, shape, color, size])

  React.useEffect(() => {
    if (canvas) {
      const scope = localState.current.paperScope;
      scope.setup(canvas);

      scope.project.view.onMouseUp = handleMouseUp;
      scope.project.view.onMouseDown = handleMouseDown;
      scope.project.view.onMouseDrag = handleMouseDrag;

      firebase.paths()
        .orderByKey()
        .once("value", (snapshot: any) => {
          try {
            const paths = snapshot.val();
            if (paths) {
              Object.entries(paths).forEach(
                ([pathId, pathVal]: [string, unknown]) => {
                  loadPath({
                    id: pathId,
                    ...(pathVal as RemotePath),
                    loadType: "initial"
                  });
                }
              );
            }
          } catch (e) {
            console.error(e);
          }
        })
        .then(() => {
          firebase.paths().on("child_added", (addedSnapshot: any) => {
            loadPath({
              id: addedSnapshot.key,
              ...addedSnapshot.val(),
              loadType: "added"
            });
          });

          firebase.paths().on("child_removed", (removedSnapshot: any) => {
            const existingPath = (paper.project.activeLayer
              .children as paper.Path[]).find(
              p => p.data.id === removedSnapshot.key
            );
            if (existingPath) {
              existingPath.remove();
            }
          });
        });
    }

    return () => {
      firebase.paths().off();
    };
  }, [canvas]);

  const createPathFromRemote = ({
    id,
    definition,
    color: createColor,
    strokeWidth: createStrokeWidth,
    localId
  }: {
    id: string;
    definition: string;
    color: string;
    strokeWidth: number;
    localId: string;
  }) => {
    const newPath = new Path();
    newPath.data.localId = localId;
    newPath.pathData = definition;
    newPath.data.id = id;

    if (newPath.closed) {
      newPath.fillColor = new Color(createColor);
      newPath.strokeWidth = 0;
    } else {
      newPath.strokeCap = "round";
      newPath.strokeColor = new Color(createColor);
      newPath.strokeWidth = createStrokeWidth;
    }
    return newPath;
  };

  function loadPath({
    id,
    definition,
    color: loadColor,
    strokeWidth: loadStrokeWidth,
    localId,
    loadType
  }: {
    id: string;
    definition: string;
    color: string;
    strokeWidth: number;
    loadType: LoadType;
    localId: string;
  }) {
    // none of these can be drawn during this session on the local device
    if (loadType === "initial") {
      const initialPath = createPathFromRemote({
        localId,
        id,
        definition,
        strokeWidth: loadStrokeWidth,
        color: loadColor
      });
      setLocalPathEventHandlers(initialPath); // hover color
    }

    // remote from child_added -- could be either from another user creating a path or from a path that was crated locally
    else if (loadType === "added") {
      // this is a path received actively drawn from aonther device, create it locally and listen for changes and update the data
      const remotelyAddedPath = createPathFromRemote({
        localId,
        id,
        definition,
        strokeWidth: loadStrokeWidth,
        color: loadColor
      });
      setLocalPathEventHandlers(remotelyAddedPath);

      firebase.path(id).on("value", (updatedSnapshot: any) => {
        loadPath({
          id: updatedSnapshot.key,
          ...updatedSnapshot.val(),
          loadType: "updated"
        });
      });

    } else if (loadType === "updated") {
      const existingPath = (paper.project.activeLayer
        .children as paper.Path[]).find(p => p.data.id === id);

      if (existingPath) {
        existingPath.pathData = definition;
        existingPath.data.color = loadColor;

        if (loadStrokeWidth && loadStrokeWidth > 1) {
          existingPath.strokeColor = new Color(loadColor);
          existingPath.strokeWidth = loadStrokeWidth;
        } else {
          existingPath.fillColor = new Color(loadColor);
        }
      }
    }
  }

  function handleMouseDown(_event: paper.MouseEvent) {
    const { tool, color, strokeWidth, size } = localState.current;
    localState.current.toolState = "active";

    if (tool === "erase") {
      return;
    }

    let path;
    const localId = generateLocalId();
    localState.current.localPathIds.push(localId);
    localState.current.currentLocalId = localId;
    localState.current.activePath = path;

    if (tool === "paint") {
      localState.current.activePath = path = new Path({
        strokeWidth: size,
        strokeCap: "round",
        strokeColor: new Color(color)
      });
    } else {
      localState.current.activePath = path = new Path({
        fillColor: color
      });
    }

    path.data.color = color;
    path.data.localId = localId;

    if (!localState.current.paperTool) {
      localState.current.paperTool = new PaperTool({
        currentState: localState.current
      });
      localState.current.paperTool.activate();
    } else {
      localState.current.paperTool.currentState = localState.current;
    }

    localState.current.paperTool.onCreate = (path, tool) => {
      const { key } = broadcastCreate(firebase, path, tool);
      path.data.id = key;
    };

    setLocalPathEventHandlers(path);
  }

  function handleMouseUp(_evt: paper.MouseEvent) {
    localState.current.toolState = "inactive";
    const path = localState.current.activePath;
    if (!path || localState.current.tool === "erase") return;

    if (localState.current.tool === "paint") {
      path.simplify();
    }

    localState.current.activePath = undefined;

    if (path && path.area !== 0) {
      broadcastUpdates(firebase, path)();
    }
  }

  function handleMouseDrag(evt: paper.MouseEvent) {
    localState.current.toolState = "active";
    if (localState.current.tool === "erase") {
      const { target } = evt;
      if (target && target instanceof Path) {
        if (target.data.id) {
          // this is not the currently drawn path, this is any path that is being removed.
          firebase.path(target.data.id).remove()
        }
        target.remove(); // locally remove -- not listening to external event for this.
      }
    } else if (localState.current.tool === "paint") {
      const path = localState.current.activePath;
      if (path) {
        broadcastUpdates(firebase, path)();
      }
    }
  }

  const setLocalPathEventHandlers = (path: paper.Path): void => {
    const handleEnter = (path: paper.Path): void => {
      if (path.closed) {
        path.data.color = path.fillColor;
        path.fillColor = new Color("#A9FF4D");
      } else {
        path.data.color = path.strokeColor;
        path.strokeColor = new Color("#A9FF4D");
      }
    };
    const handleLeave = (path: paper.Path) => {
      if (path.closed) {
        path.fillColor = path.data.color;
      } else {
        path.strokeColor = path.data.color;
      }
    };
    path.onMouseEnter = function(_evt: paper.MouseEvent): void {
      if (localState.current.tool === "erase") {
        handleEnter(this);
      }
    };

    path.onMouseLeave = (_evt: paper.MouseEvent): void => {
      const { tool, toolState } = localState.current;
      // on non-mobile we have to reset from the highlighted color
      if (tool === "erase" && toolState === "inactive") {
        handleLeave(path);
      }
    };
  };

  return { setCanvas };
};

class PaperTool extends Tool {
  currentState: LocalState;
  cursorShape: undefined | paper.Path

  onCreate?: (path: paper.Path, tool: DrawSettingsContext.DrawTool) => void;
  clearCursorShape: () => void

  constructor({ currentState }: { currentState: LocalState }) {
    super();
    this.currentState = currentState;
    this.onMouseDown = (event: paper.ToolEvent) => {
      if (this.currentState.tool === "shape" && this.currentState.activePath) {
        const path = createShape({point: event.point, shape: this.currentState.shape, size: this.currentState.size})

        path.fillColor = new Color(this.currentState.color);
        path.data.localId = this.currentState.activePath.data.localId;
        path.data.color = this.currentState.color;

        this.currentState.activePath.pathData = path.pathData;
        this.currentState.activePath.fillColor = new Color(
          this.currentState.color
        );
        this.currentState.activePath.data.color = this.currentState.color;

        if (this.onCreate) {
          this.onCreate(this.currentState.activePath, this.currentState.tool);
          this.onCreate = undefined;
        }
      }
    };

    this.clearCursorShape = () => {
      if (this.cursorShape) {
        this.cursorShape.remove()
        this.cursorShape = undefined
      }
    }

    this.onMouseMove = (event: paper.ToolEvent) => {
      if (this.currentState.tool !== "shape" && this.cursorShape) {
        this.clearCursorShape()
      }

      if (this.currentState.tool === "shape" && this.currentState.toolState === "inactive") {
        if (!this.cursorShape) {
          this.cursorShape = createShape({point: event.point, shape: this.currentState.shape, size: this.currentState.size})
          this.cursorShape.fillColor = new Color(this.currentState.color);
          this.cursorShape.opacity = 0.5;
        } else if (this.currentState.shape === "star") {
          // i have no idea why the position of the star specifically is slightly off from the event point, but this adjustment seems to work...
          this.cursorShape.position = new Point(event.point.x, event.point.y + (this.currentState.size/5))
        } else {
          this.cursorShape.position = event.point
        }
      }
    }

    this.onMouseDrag = (event: paper.ToolEvent) => {
      if (!this.currentState.activePath) {
        return;
      }

      if (this.currentState.tool === "paint") {
        this.currentState.activePath.add(event.point);

        if (this.onCreate) {
          this.onCreate(this.currentState.activePath, this.currentState.tool);
          this.onCreate = undefined;
        }
      }
    };
  }
}

function createShape({
  size,
  point,
  shape,
  }:{
  size: number
  point: paper.Point
  shape: DrawSettingsContext.DrawShape
}): paper.Path {
  let p, sizeFactor
  switch (shape) {
    case "square":
      sizeFactor = size / 2 * 3
      p = new Path.Rectangle(
        new Point(point.x - sizeFactor, point.y - sizeFactor),
        new Size(sizeFactor * 2, sizeFactor * 2)
      );
      break;
    case "circle":
      sizeFactor = size / 2 * 3
      p = new Path.Circle(point, sizeFactor);
      break;
    case "star":
      sizeFactor = (size - (size / 4)) * 3
      p = new Path.Star(point, 5, sizeFactor/2, sizeFactor);
  }
  return p
}
