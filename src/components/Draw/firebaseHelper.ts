import Firebase from '../Firebase';
import throttle from "lodash.throttle";
import paper from "paper";
import { ExternalData } from './utils';

import { LocalPaperItem } from "./localPaperItem"

export class FirebaseHelper {
  constructor(
    public firebase: Firebase) {
  }

  broadcastCreate(item: LocalPaperItem) {
    let source
    switch (item.itemType) {
      case "emoji":
        source = item.get()

        return this.firebase.emojis().push({
          scale: source.data.scale,
          code: source.data.code,
          localId: source.data.localId,
          position: {
            x: source.position.x,
            y: source.position.y
          }
        })
      case "text":
        source = item.get() as paper.PointText

        return this.firebase.texts().push({
          content: source.content,
          color: source.data.color,
          localId: source.data.localId,
          fontFamily: source.fontFamily,
          fontSize: source.fontSize,
          point: {
            x: source.point.x,
            y: source.point.y
          },
          position: {
            x: source.position.x,
            y: source.position.y
          }
        });
      case "shape":
      case "path":
        source = item.get() as paper.Path

        return this.firebase.paths().push({
          definition: source.pathData,
          strokeWidth: source.closed ? 0 : source.strokeWidth,
          color: source.data.color,
          localId: source.data.localId
        });
    }
  }

  broadcastUpdate(localItem: LocalPaperItem) {
    return throttle(() => {
      const item = localItem.get()
      if (!item.data.id) {
        console.log("no id!");
        return;
      }

      switch (item.constructor) {
        case paper.Path:
          const path = item as paper.Path;

          return this.firebase.path(path.data.id).set({
            definition: path.pathData,
            strokeWidth: path.closed ? 0 : path.strokeWidth,
            color: path.data.color,
            localId: path.data.localId
          });
        case paper.PointText:
          const text = item as paper.PointText;

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
          });
      }
    });
  }

  broadcastDestroy(localItem: LocalPaperItem) {
    const item = localItem.get()
    switch (item.constructor) {
      case paper.Path:
        this.firebase.path(item.data.id).remove();
        break;
      case paper.PointText:
        this.firebase.text(item.data.id).remove();
        break;
      default:
        this.firebase.emoji(item.data.id).remove()
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
          });
        });
        break;
      case paper.PointText:
        this.firebase.text(item.data.id).on("value", (snapshot: firebase.database.DataSnapshot) => {
          onUpdate({
            dataType: "text",
            id: snapshot.key,
            ...snapshot.val()
          });
        });
    }
  }
}
