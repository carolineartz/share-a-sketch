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

export const usePaperJs = ({ firebase }: WithFirebaseProps): CreatePaperHookType => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const { tool, shape, color, size, emoji } = DrawSettingsContext.useDrawSettings();
  const localState = React.useRef<LocalState>({tool, size, color, shape, emoji})
  const localIds = React.useRef<string[]>([])

  const paperTool = React.useRef<PaperTool | undefined>()

  React.useEffect(() => {
    if (canvas) {
      paper.setup(canvas);

      const paperHelper = new PaperHelper(paper, localState.current, localIds.current)
      const firebaseHelper = new FirebaseHelper(firebase)
      const itemLoader = new PaperItemLoader(paperHelper, firebaseHelper)
      paperTool.current = new PaperTool(paperHelper, firebaseHelper)

      firebase.drawings().orderByKey().once("value", (snapshot: firebase.database.DataSnapshot) => {
        try {
          const drawings = snapshot.val() || {}
          const { paths = {}, texts = {}, emojis = {} } = drawings
          const response = [
            { val: paths, dataType: "path" },
            { val: texts, dataType: "text" },
            { val: emojis, dataType: "emoji"}
          ]

          response.forEach(({ val, dataType }) => {
            Object.entries(val).forEach(
              ([id, itemVal]: [string, any]) => {
                itemLoader.load({
                  dataType,
                  id,
                  ...itemVal
                }, "initial");
              }
            );
          })
        } catch (e) {
          console.error(e);
        }
      })
      .then(() => {
        [
          { ref: firebase.paths(), dataType: "path" },
          { ref: firebase.texts(), dataType: "text" },
          { ref: firebase.emojis(), dataType: "emoji"}
        ].forEach(({ ref, dataType}) => {
          ref.on("child_added", (addedSnapshot: firebase.database.DataSnapshot) => {
            itemLoader.load({
              dataType,
              id: addedSnapshot.key,
              ...addedSnapshot.val()
            }, "added");
          })

          ref.on("child_removed", (removedSnapshot: firebase.database.DataSnapshot) => {
            const existingItems = (paper.project.activeLayer.children as paper.Item[]).filter(p => {
              return (
                p.data.id === removedSnapshot.key || p.data.localId === removedSnapshot.val().localId
              )
            });

            if (existingItems.length) {
              existingItems.forEach(p => p.remove());
            }
          })
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
      paperTool.current.updateContext({ tool, shape, color, size, emoji })
      paperTool.current.clearCursorShape()
    }
  }, [tool, shape, color, size, paperTool, emoji])

  return { setCanvas }
}

