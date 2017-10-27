var Grid = function(width, height, level) {
    this.width = width;
    this.height = height;
    this.totalMines = level;
    this.gameSolved = false;
    this.totalFlags = level;

    this.init = function() {
        this.placeMines();
        this.calculateNoOfMines();
        this.renderGrid();
        this.gameSolved = false;
    }

    var __getTwoDimentionArray = function(n, m) {
        var array = new Array(n);
        for (var i = 0; i < n; i++) {
            array[i] = new Array(m);
        }
        return array;
    }

    this.gridData = __getTwoDimentionArray(height, width);

    var __doesTilehasMine = function() {
        var number = Math.floor((Math.random() * 100) + 1);
        // console.log(number);
        if (number % 5 == 0) {
            // console.log("found here");
            return true
        }
        return false;
    }

    this.placeMines = function() {
        var mines = 0;
        for (i = 0; i < height; i++) {
            for (j = 0; j < width; j++) {
                var tile = new Tile();
                if (mines <= this.totalMines) {
                    if (__doesTilehasMine()) {
                        tile.hasMine = true;
                        tile.noOfMines = -8;
                        mines++;
                    }

                }
                this.gridData[i][j] = tile;
            }
        }
        this.totalMines = mines;
        this.totalFlags = mines;
        return true;
    }

    this.updateNeighbour = function(i, j) {
        var neighbour_i_index;
        var neighbour_j_index;

        // Top left
        neighbour_i_index = i - 1;
        neighbour_j_index = j - 1;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);

        // Top
        neighbour_i_index = i - 1;
        neighbour_j_index = j;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);

        // Top Right
        neighbour_i_index = i - 1;
        neighbour_j_index = j + 1;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);

        // Right
        neighbour_i_index = i;
        neighbour_j_index = j + 1;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);

        // Bottom Right
        neighbour_i_index = i + 1;
        neighbour_j_index = j + 1;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);

        // Bottom
        neighbour_i_index = i + 1;
        neighbour_j_index = j;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);

        // Bottom left
        neighbour_i_index = i + 1;
        neighbour_j_index = j - 1;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);

        // Top left
        neighbour_i_index = i;
        neighbour_j_index = j - 1;
        this.__updateMinesCount(neighbour_i_index, neighbour_j_index);
    }

    this.__updateMinesCount = function(i, j) {
        if ((i >= 0 && i < this.height) && (j >= 0 && j < this.width)) {
            // console.log(i + "i , j" + j);
            this.gridData[i][j].noOfMines += 1;
        }
        return;
    }

    this.calculateNoOfMines = function() {
        for (i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                var tile = this.gridData[i][j];
                if (tile.hasMine) {
                    this.updateNeighbour(i, j);
                }
            }
        }
        return;
    }

    this.renderGrid = function() {
        var source = $("#some-template").html();
        var template = Handlebars.compile(source);

        var data = new Object();
        data.width = this.width;
        data.height = this.height;
        data.gridData = this.gridData;

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
        if (this.gridData[i][j].noOfMines > 0) {
            $("table tbody tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")").html(this.gridData[i][j].noOfMines);
        }

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
                if (tile.noOfMines > 0) {
                    $("table tbody tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")").html(tile.noOfMines);
                }
                if (tile.isOpened) {
                    continue;
                }
                tile.isOpened = true;
                if (tile.hasFlag) {
                    if (tile.hasMine) {
                        $("table tbody tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")").addClass("flag-true");
                        continue;
                    } else {
                        $("table tbody tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")").addClass("flag-false");
                        continue;
                    }
                }
                if (tile.hasMine && !tile.hasFlag) {
                    $("table tbody tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")").addClass("mine-true");
                    continue;
                }
                $("table tbody tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")").addClass("opened");
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
                } else if (tile.hasMine) {
                    continue;
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    var gameOverMessage = function(flag) {
        if (flag) {
            $("body").append("<p style='color:green'>Success</p>");
        } else {
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
            this.totalFlags += 1;
        } else {
            tile.hasFlag = true;
            this.totalFlags -= 1;
        }
        this.gridData[row][col] = tile;
        if (this.__checkGrid()) {
            this.gameSolved = true;
            gameOverMessage(true);
        }
        tile.updateRightClickTile(row, col);
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
            // $("table tbody tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")").addClass("opened");
            // return true;
        }
        if (tile.noOfMines == 0) {
            this.__revilGrid(row, col);
            return true;
        }
        if (this.__checkGrid()) {
            this.gameSolved = true;
            gameOverMessage(true);
        }
        tile.updateLeftClickTile(row, col);
        return;
    }

    var exitGame = function() {
        $('body').append("<p>Success :)</p>");
        return;
    }
}


var Tile = function() {
    this.hasMine = false;
    this.isOpened = false;
    this.hasFlag = false;
    this.noOfMines = 0;

    this.updateRightClickTile = function(row, col) {
        // $(element).removeClass("flag-true");
        if (this.hasFlag) {
            $("table tbody tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")").addClass("flag-true");
        } else {
            $("table tbody tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")").removeClass("flag-true");
        }
        return;
    }

    this.updateLeftClickTile = function(row, col) {
        if (this.noOfMines > 0) {
            $("table tbody tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")").html(this.noOfMines);
        }
        $("table tbody tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")").addClass("opened");
        return;
    }
}

$(document).ready(function() {

    var grid;
    $("#restart").on("click", function() {
        grid = new Grid(8, 8, 100);
        grid.init();
    });
    $("#restart").trigger("click");

    // $("tr > td").mouseup(function(event) {
    $("body").on("mouseup", "table tr > td", function(event) {
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
            // grid.updateTile(this, grid.gridData[row][col]);
            // $(this).addClass("mine");
            console.log(grid.gridData[row][col]);
        }
    });
});
// $("td").on("click", function(this) {

// console.log($(this).index());
// });


// grid.rightClick();