function locationKey(x, y) {
  return "[" + x + "," + y + "]";
}

class EditorStateHandler {
  constructor(tileset) {
    console.log("EditorState initialized");

    this.editorHistory = [];

    this.tileset = tileset;

    this.initialState = {
      tiles: {},
      levelName: "mylevel",
      tileTypeCount: {},
    };

    this.pushState(this.initialState);
    this.createInitialState();
  }

  createInitialState() {
    const wallTile = this.tileset.allTiles["Walls"][0];
    const floorTile = this.tileset.allTiles["Floor"][0];
    const humanTile = this.tileset.allTiles["Player"][0];
    const stairsTile = this.tileset.allTiles["Staircase"][0];
    const monsterTile = this.tileset.allTiles["Monster"][0];

    const height = 8;
    const width = 13;

    const widthOffset = 1;
    const heightOffset = 1;

    // Draw vertical walls
    [0, width - 1].forEach((x) => {
      for (let y = 0; y < height; y++) {
        this.addTile(widthOffset + x, heightOffset + y, wallTile);
      }
    });

    // Draw horizontal walls
    [0, height - 1].forEach((y) => {
      for (let x = 0; x < width; x++) {
        this.addTile(widthOffset + x, heightOffset + y, wallTile);
      }
    });

    // Fill in floor
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        this.addTile(widthOffset + x, heightOffset + y, floorTile);
      }
    }

    // Place human in middle left
    this.addTile(widthOffset + 1, heightOffset + height / 2, humanTile);

    // Place stairs in top right
    this.addTile(
      widthOffset + width - 2,
      heightOffset + height - 2,
      stairsTile
    );

    // Monster bottom right
    this.addTile(widthOffset + width - 2, heightOffset + 1, monsterTile);
  }

  getState = () => {
    return { ...this.editorHistory[this.editorHistory.length - 1] };
  };

  pushState = (state) => {
    // Copy the state and add it to the history
    const stateCopy = { ...state };
    this.editorHistory.push(stateCopy);

    const historyLength = this.editorHistory.length;

    if (historyLength >= 20) {
      this.editorHistory.shift();
    }
  };

  addTile = (x, y, tileData) => {
    const state = this.getState();
    const category = tileData.category;
    if (!(category in state.tileTypeCount)) {
      state.tileTypeCount[category] = 0;
    }

    const location = locationKey(x, y);

    if (
      tileData.maxInstances != -1 &&
      state.tileTypeCount[category] + 1 > tileData.maxInstances
    ) {
      return false;
    }

    if (state.tiles[location]) {
      this.removeTile(x, y);
    }

    state.tiles[location] = { ...tileData, x, y };

    state.tileTypeCount[category]++;

    this.pushState(state);
  };

  removeTile = (x, y) => {
    const state = this.getState();

    const tileData = state.tiles[locationKey(x, y)];
    state.tileTypeCount[tileData.category]--;
    delete state.tiles[locationKey(x, y)];

    this.pushState(state);
  };

  clearState = () => {
    const clearedState = {
      tiles: {},
      levelName: "mylevel",
      tileTypeCount: {},
    };

    this.pushState(clearedState);
  };
}

export default EditorStateHandler;
export { locationKey };
