var Grid = function(width, height, level) {
    this.width = width;
    this.height = height;
    this.totalMines = level;

    this.init = function() {
        placeMines(this);
        calculateNoOfMines(this);
        renderGrid(this);
    }

    var __getTwoDimentionArray = function(n, m) {
        var array = new Array(n);
        for (var i = 0; i < n; i++) {
            array[i] = new Array(m);
        }
        return array;
    }

    this.gridData = __getTwoDimentionArray(width, height);

    var __doesTilehasMine = function() {
        var number = Math.floor((Math.random() * 100) + 1);
        console.log(number);
        if (number % 2 == 0) {
            console.log("found here");
            return true
        }
        return false;
    }

    var placeMines = function(grid) {
        var mines = 0;
        for (i = 0; i < height; i++) {
            for (j = 0; j < width; j++) {
                if (mines <= grid.totalMines) {
                    var tile = new Tile();
                    if (__doesTilehasMine()) {
                        tile.hasMine = true;
                        tile.noOfMines = -8;
                        mines++;
                    }
                    grid.gridData[i][j] = tile;
                } else {
                    return true
                }
            }
        }
        return true;
    }

    var updateNeighbour = function(grid, i, j) {
        var neighbour_i_index;
        var neighbour_j_index;

        // Top left
        neighbour_i_index = i - 1;
        neighbour_j_index = j - 1;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);

        // Top 
        neighbour_i_index = i - 1;
        neighbour_j_index = j;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);

        // Top Right
        neighbour_i_index = i - 1;
        neighbour_j_index = j + 1;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);

        // Right
        neighbour_i_index = i;
        neighbour_j_index = j + 1;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);

        // Bottom Right
        neighbour_i_index = i + 1;
        neighbour_j_index = j + 1;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);

        // Bottom
        neighbour_i_index = i + 1;
        neighbour_j_index = j;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);

        // Bottom left
        neighbour_i_index = i + 1;
        neighbour_j_index = j - 1;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);

        // Top left
        neighbour_i_index = i;
        neighbour_j_index = j - 1;
        __updateMinesCount(grid, neighbour_i_index, neighbour_j_index);
    }

    var __updateMinesCount = function(grid, i, j) {
        if ((i >= 0 && i < grid.height) && (j >= 0 && j < grid.width)) {
            console.log(i + "i , j" + j);
            grid.gridData[i][j].noOfMines += 1;
        }
        return;
    }

    var calculateNoOfMines = function(grid) {
        for (i = 0; i < grid.height; i++) {
            for (j = 0; j < grid.width; j++) {
                var tile = grid.gridData[i][j];
                if (tile.hasMine) {
                    updateNeighbour(grid, i, j);
                }
            }
        }
        return;
    }

    var renderGrid = function() {

        return;
    }

    this.rightClick = function(tile) {
        if (tile.hasMine && !tile.hasFlag) {
            __revilGrid();
            return false;
        }
        if (tile.noOfMines) {
            tile.isOpened = true;
            return true;
        }
    }

    this.leftClick = function(tile) {
        if (tile.hasFlag) {
            tile.hasFlag = false;
        } else {
            tile.hasFlag = true;
        }
        return;
    }
}


var Tile = function() {
    this.hasMine = false;
    this.isOpened = false;
    this.hasFlag = false;
    this.noOfMines = 0;
}


var grid = new Grid(8, 8, 44);

grid.init();