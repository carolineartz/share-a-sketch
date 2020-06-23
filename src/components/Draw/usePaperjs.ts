import * as React from "react";

import paper from "paper";

import { WithFirebaseProps } from "../Firebase";
import { PaperItemLoader } from "./paperItemLoader";
import { PaperHelper } from "./paperHelper";
import { FirebaseHelper } from "./firebaseHelper";
import { DrawSettingsContext } from '@components/Draw';
import { LocalState, PaperTool } from "./paperTool";

type CreatePaperHookType = {
  setCanvas: (canvas: HTMLCanvasElement) => void;
};

export const usePaperJs = ({firebase}: WithFirebaseProps): CreatePaperHookType => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const { tool, shape, color, size } = DrawSettingsContext.useDrawSettings();
  const localState = React.useRef<LocalState>({tool, size, color, shape})
  const localIds = React.useRef<string[]>([])

  const paperTool = React.useRef<PaperTool | undefined>()

  // TODO: DRY up the firebase event subscribers code.
  React.useEffect(() => {
    if (canvas) {
      paper.setup(canvas);

      const paperHelper = new PaperHelper(paper, localState.current, localIds.current)
      const firebaseHelper = new FirebaseHelper(firebase)
      const itemLoader = new PaperItemLoader(paperHelper, firebaseHelper)
      paperTool.current = new PaperTool(paperHelper, firebaseHelper)

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
            const existingPaths = (paper.project.activeLayer.children as paper.Path[]).filter(p => {
              return (
                p.data.id === removedSnapshot.key || p.data.localId === removedSnapshot.val().localId
              )
            });

            if (existingPaths.length) {
              existingPaths.forEach(p => p.remove());
            }
          })

          firebase.texts().on("child_removed", (removedSnapshot: firebase.database.DataSnapshot) => {
            const existingPaths = (paper.project.activeLayer.children as paper.Path[]).filter(p => {
              return (
                p.data.id === removedSnapshot.key || p.data.localId === removedSnapshot.val().localId
              )
            });

            if (existingPaths.length) {
              existingPaths.forEach(p => p.remove());
            }
          })
        })
    }

    return () => {
      firebase.drawings().off();
      if (paperTool.current) {
        paperTool.current.remove()
      }
    };
  }, [canvas, firebase]);

  React.useEffect(() => {
    if (paperTool.current) {
      paperTool.current.activate()
    }
  }, [])

  React.useEffect(() => {
    if (paperTool.current) {
      paperTool.current.updateContext({ tool, shape, color, size })
      paperTool.current.clearCursorShape()
    }
  }, [tool, shape, color, size, paperTool])

  return { setCanvas }
}

