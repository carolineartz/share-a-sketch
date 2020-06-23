import Firebase from '../Firebase';
import throttle from "lodash.throttle";
import paper from "paper";
import { ExternalData } from './utils';


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
      });
    }
    else {
      const path = item as paper.Path;
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

  broadcastDestroy(item: paper.Item) {
    switch (item.constructor) {
      case paper.Path:
        this.firebase.path(item.data.id).remove();
        break;
      case paper.PointText:
        this.firebase.text(item.data.id).remove();
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
