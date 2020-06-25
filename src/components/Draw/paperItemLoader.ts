import { FirebaseHelper } from './firebaseHelper';
import { PaperHelper } from "./paperHelper";
import { ExternalData, ExternalLoadType } from './utils';

export class PaperItemLoader {
  constructor(
    public paperHelper: PaperHelper,
    public firebaseHelper: FirebaseHelper) {
  }

  update = (data: ExternalData): void => {
    this.load(data, "updated");
  };

  load = (data: ExternalData, loadType: ExternalLoadType): paper.Item | undefined => {
    // TODO: return a result type with the item or an error
    let item: paper.Item | undefined = undefined;

    switch (loadType) {
      case "initial": // 'initial': when first loading the content of the canvas from its stored state.
        if (data.dataType === "path") {
          item = this.paperHelper.createPathFromRemote(data);
        }
        else if (data.dataType === "text") {
          item = this.paperHelper.createTextFromRemote(data);
        }
        else if (data.dataType === "emoji") {
          item = this.paperHelper.createEmojiFromRemote(data)
        }

        if (item) {
          this.paperHelper.setLocalHandlers(item);
        }

        return item;

      case "added": // 'added': when receiving a child_added event
        // the child_added event is from a locally drawn item's parent
        if (this.paperHelper.isLocalItem(data.localId)) {
          item = this.paperHelper.existingItem(data.id);
        }
        // the child_added event from an externally drawn item's parent
        else {
          // the initial display of these added items are the same logic as an initial load.
          item = this.load(data, "initial");

          // unlike the initially loaded paths, we have to update them as the remote data changes
          if (item) {
            this.firebaseHelper.watchItem(item, this.update);
          }
        }

        if (item) {
          this.paperHelper.setLocalHandlers(item);
        }

        return item;

      case "updated": // 'updated': value events on the item (cuz of firebaseHelper.watchItem(item) when added)
        if (data.dataType === "path") {
          item = this.paperHelper.updatePathFromRemote(data);
        }
        else if (data.dataType === "text") {
          item = this.paperHelper.updateTextFromRemote(data);
        }

        return item;
    }
  };
}
