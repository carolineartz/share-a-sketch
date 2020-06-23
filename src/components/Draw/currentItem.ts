import paper from "paper";

type CurrentItemState = {
  isActive: boolean
  isNew: boolean // opposite isPersisted
  isSynced: boolean
}

const defaultInitialState: CurrentItemState = {
  isActive: false,
  isNew: true,
  isSynced: false
}

export class CurrentItem {
  static stubSource = () => new paper.Item();
  private _source: paper.Item = CurrentItem.stubSource();
  private _state: CurrentItemState = defaultInitialState;

  set(item: paper.Item, state: Partial<CurrentItemState> = {}) {
    this.clear();
    this._source = item;
    this._state = { ...defaultInitialState, ...state };

    if (this.id) {
      this._state.isNew = false;
    }
  }

  get(): paper.Item {
    return this._source || CurrentItem.stubSource();
  }

  setDirty(): void {
    this._state.isSynced = false;
  }

  setSynced(synced: boolean): void {
    this._state.isSynced = synced;
  }

  setActive(active: boolean): void {
    this._state.isActive = active;
  }

  clear(): void {
    this._source = CurrentItem.stubSource();
    this._state = {
      isNew: true,
      isActive: false,
      isSynced: false
    };
  }

  get presence(): paper.Item | undefined {
    return this._source || undefined;
  }

  get isEmpty(): boolean {
    return this._source instanceof paper.Item && this._source.isEmpty();
  }

  get isText(): boolean {
    return this._source instanceof paper.PointText;
  }

  get isPath(): boolean {
    return this._source instanceof paper.Path;
  }

  get isLine(): boolean {
    return this._source instanceof paper.Path && !this._source.closed;
  }

  get isShape(): boolean {
    return this._source instanceof paper.Path && this._source.closed;
  }

  get isPersisted(): boolean {
    return !this.isNew;
  }

  get isActive(): boolean {
    return this._state.isActive;
  }

  get isNew(): boolean {
    return !this.id;
  }

  get isSynced(): boolean {
    return this._state.isSynced;
  }

  get isDirty(): boolean {
    return !this.isSynced;
  }

  set id(externalId: string | undefined) {
    this._source && (this._source.data.id = externalId);
  }

  get id(): string | undefined {
    return this._source && this._source.data.id;
  }

  get localId(): string | undefined {
    return this._source && this._source.data.localId;
  }

  get textContent(): string | undefined {
    if (this.isText && this._source instanceof paper.PointText) {
      return this._source.content;
    }
  }

  simplifyPath(): void {
    if (this.isLine && this._source instanceof paper.Path) {
      const pathDataBefore = this._source.pathData;
      this._source.simplify();

      if (this._source.pathData !== pathDataBefore) {
        this.setDirty();
      }
    }
  }

  addPoint(point: paper.Point): void {
    if (this.isLine) {
      this._source instanceof paper.Path && this._source.add(point);
      this.setDirty();
    }
  }

  addChar(character: string) {
    if (this.isText) {
      this._source instanceof paper.PointText && (this._source.content = this._source.content + character);
      this.setDirty();
    }
  }

  deleteChar() {
    if (this.isText && this._source instanceof paper.PointText) {
      const contentBefore = this.textContent;
      this._source.content = this._source.content.substring(0, this._source.content.length - 1);

      // only do this if deleting results in a different string
      if (this._source.content !== contentBefore) {
        this.setDirty();
      }
    }
  }
}
