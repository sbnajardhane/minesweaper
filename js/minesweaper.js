var Grid = function(width, height, level) {
    this.width = width;
    this.height = height;
    this.totalMines = level;
    this.gameSolved = false;

    this.init = function(a) {
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

        $("#grid").html(template(data));
        // $("body").append(template(data));
        // Handlebar runtime
        // var gridHTML = Handlebars.templates.description(grid);
        // $("#grid").innerHTML = descHtml;
        return;
    }

    this.__revilGrid = function(i, j) {
        if ((i < 0 || i >= this.width) || (j < 0 || j >= this.height)) {
            return;
        }
        $("table tbody tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")").addClass("opened");

        if (this.gridData[i][j].noOfMines > 0 || (this.gridData[i][j].hasMine) || this.gridData[i][j].isOpened) {
            this.gridData[i][j].isOpened = true;
            return this;
        }
        this.gridData[i][j].isOpened = true;

        // Go Top Left
        this.__revilGrid(i - 1, j - 1);
        // Go Top
        this.__revilGrid(i - 1, j);
        // Go Top Right
        this.__revilGrid(i - 1, j + 1);
        // go Right
        this.__revilGrid(i, j + 1);
        // go Bottom Right
        this.__revilGrid(i + 1, j + 1);
        // go Bottom
        this.__revilGrid(i + 1, j);
        // go Bottom Left
        this.__revilGrid(i + 1, j - 1);
        // go Left
        this.__revilGrid(i, j - 1);
    }

    this.__revilAllGrid = function() {
        for (i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                var tile = this.gridData[i][j];
                if (tile.isOpened) {
                    continue;
                }
                tile.isOpened = true;
                if (tile.hasFlag) {
                    if (tile.hasMine) {
                        $("table tbody tr:nth-child("+(i + 1)+") td:nth-child(" + (j + 1) + ")").addClass("flag-true");
                        continue;
                    }
                    else {
                        $("table tbody tr:nth-child("+(i + 1)+") td:nth-child(" + (j + 1) + ")").addClass("flag-false");
                        continue;
                    }
                }
                if (tile.hasMine && !tile.hasFlag) {
                    $("table tbody tr:nth-child("+(i + 1)+") td:nth-child(" + (j + 1) + ")").addClass("mine-true");
                    continue;
                }
                $("table tbody tr:nth-child("+(i + 1)+") td:nth-child(" + (j + 1) + ")").addClass("opened");
            }
        }
        this.gameSolved = true;
        gameOverMessage(false);
        return;
    }

    this.__checkGrid = function() {
        var gameSolved = false;
        for (i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                var tile = this.gridData[i][j];
                if (tile.isOpened) {
                    continue;
                }
                else if (tile.hasMine) {
                    continue;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    var gameOverMessage = function(flag) {
        if (flag) {
            $("body").append("<p style='color:green'>Success</p>");
        }
        else {
            $("body").append("<p style='color:red'>Failed</p>");
        }
        return true;
    }

    this.rightClick = function(row, col) {
        // console.log("rightClick");
        var tile = this.gridData[row][col];
        // console.log(tile);

        if (tile.hasFlag) {
            tile.hasFlag = false;
        } else {
            tile.hasFlag = true;
        }
        this.gridData[row][col] = tile;
        if (this.__checkGrid()) {
            this.gameSolved = true;
            gameOverMessage(true);
        }
        return;
    }

    this.leftClick = function(row, col) {
        var tile = this.gridData[row][col];
        // console.log(tile);
        if (tile.hasMine && !tile.hasFlag) {
            this.__revilAllGrid();
            return false;
        }
        if (tile.noOfMines) {
            tile.isOpened = true;
            $("table tbody tr:nth-child("+(row + 1)+") td:nth-child(" + (col + 1) + ")").addClass("opened");
            return true;
        }
        if (tile.noOfMines == 0) {
            this.__revilGrid(row, col);
            return true;
        }
        if (this.__checkGrid()) {
            this.gameSolved = true;
            showSuccess();
        }
        return;
    }

    this.updateTile = function(element, tile) {
        // $(element).removeClass("flag-true");
        if (tile.hasFlag) {
            $(element).addClass("flag-true");
            return;
        } else {
            $(element).removeClass("flag-true");
            // return;
        }
        if (tile.hasMine) {
            $(element).addClass("mine-true");
            return;
        } else {
            $(element).removeClass("mine-true");
            // return;
        }
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

$( document ).ready(function() {
    
    var grid;
    $("#restart").on("click", function(){
        grid = new Grid(8, 8, 100);
        grid.init();
    });
    $("#restart").trigger("click");

    $("tr > td").mouseup(function(event) {

        // console.log($(this));
        var row = parseInt($(this).parent()[0].id);
        var col = $(this)[0].cellIndex;
        if (!grid.gridData[row][col].isOpened && !this.gameSolved) {
            switch (event.which) {
                case 1:
                    grid.leftClick(row, col);
                    console.log("left");
                    break;
                case 2:
                case 3:
                    grid.rightClick(row, col);
                    event.preventDefault();
                    console.log("right");
                    break;
                default:
                    return;
            }
            grid.updateTile(this, grid.gridData[row][col]);
            // $(this).addClass("mine");
            console.log(grid.gridData[row][col]);
        }
    });
});
// $("td").on("click", function(this) {

// console.log($(this).index());
// });


// grid.rightClick();