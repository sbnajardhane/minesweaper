var Grid = function(width, height, level) {
    this.width = width;
    this.height = height;
    this.totalMines = level;
    this.gameSolved = false;

    this.init = function(a) {
        console.log(a);
        placeMines(this);
        calculateNoOfMines(this);
        renderGrid(this);
        bindEvents();
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
        // console.log(number);
        if (number % 5 == 0) {
            // console.log("found here");
            return true
        }
        return false;
    }

    var placeMines = function(grid) {
        var mines = 0;
        for (i = 0; i < height; i++) {
            for (j = 0; j < width; j++) {
                var tile = new Tile();
                if (mines <= grid.totalMines) {
                    if (__doesTilehasMine()) {
                        tile.hasMine = true;
                        tile.noOfMines = -8;
                        mines++;
                    }

                }
                grid.gridData[i][j] = tile;
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
            // console.log(i + "i , j" + j);
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

    var renderGrid = function(grid) {
        var source = $("#some-template").html();
        var template = Handlebars.compile(source);

        var data = new Object();
        data.width = grid.width;
        data.height = grid.height;
        data.gridData = grid.gridData;

        $('body').append(template(data));
        // Handlebar runtime
        // var gridHTML = Handlebars.templates.description(grid);
        // $("#grid").innerHTML = descHtml;
        return;
    }

    this.__revilGrid = function(i, j){
        if ((i < 0 || i >= this.width) || (j < 0 || j >= this.height)) {
            return;
        }
        if (this.gridData[i][j].noOfMines > 0 || (this.gridData[i][j].hasMine) || this.gridData[i][j].isOpened) {
            this.gridData[i][j].isOpened = true;
            return this;
        }
        this.gridData[i][j].isOpened = true;
        // Go Top Left
        this.__revilGrid(i-1, j-1);
        // Go Top
        this.__revilGrid(i-1, j);
        // Go Top Right
        this.__revilGrid(i-1, j+1);
        // go Right
        this.__revilGrid(i, j+1);
        // go Bottom Right
        this.__revilGrid(i+1, j+1);
        // go Bottom
        this.__revilGrid(i+1, j);
        // go Bottom Left
        this.__revilGrid(i+1, j-1);
        // go Left
        this.__revilGrid(i, j-1);
    }

    this.__revilAllGrid = function(){
        for (i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                var tile = this.gridData[i][j];
                if (tile.hasFlag) {
                    if (tile.hasMine) {
                        continue;
                    }
                }
                tile.isOpened = true;
            }
        }
        this.gameSolved = true;
        return;
    }

    var bindEvents = function() {
        // $("#grid td").on("click", this.rightClick(1));
    }
}


var Tile = function() {
    this.hasMine = false;
    this.isOpened = false;
    this.hasFlag = false;
    this.noOfMines = 0;
}


var grid = new Grid(16, 16, 200);

grid.init(1);

$("td").on("click", rightClick);


var rightClick = function() {
    console.log("rightClick");
    alert("row number: " + ($(this).index() + 1));

    // if (tile.hasMine && !tile.hasFlag) {
    //     __revilGrid();
    //     return false;
    // }
    // if (tile.noOfMines) {
    //     tile.isOpened = true;
    //     return true;
    // }
}

var leftClick = function(tile) {
        if (tile.hasFlag) {
            tile.hasFlag = false;
        } else {
            tile.hasFlag = true;
        }
        return;
    }
    // grid.rightClick();