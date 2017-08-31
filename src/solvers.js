/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = findAllRooksSolutionsMemoized(n)[0];

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  let solutionCount = findAllRooksSolutionsMemoized(n).length;


  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


var findAllRooksSolutions = function(n) {
  let result = [];
  let board = new Board({n: n});
  let occupiedColumns = [];

  var recursiveFunc = function(rowIndex) {
    for (var i = 0; i < n; i++) {
      if (!occupiedColumns[i]) {
        // try each position at row rowIndex, and set it in the board
        // should never result in a column conflict because we checked that the column has not been occupied
        var rowToBeSet = genRow(i, n);
        board.set(rowIndex, rowToBeSet);
        if (rowIndex === n - 1) {
          // valid and complete
          result.push(board.rows());
        } else {
          // valid but incomplete:
          // mark that the column has been occupied   
          occupiedColumns[i] = true;
          // then fill in the next row   
          recursiveFunc(rowIndex + 1);
        }
        // reset the row to all 0s
        clearRow(board, rowIndex);
        // mark that the column is no longer occupied for parent node to recurse down another path
        occupiedColumns[i] = false;
      }
    }
  };
  recursiveFunc(0);

  return result;
};


var findAllRooksSolutionsMemoized = _.memoize(findAllRooksSolutions);

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = findAllQueensSolutionsMemoized(n)[0];

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));

  // return empty matrix when there is no solution
  if (!solution) {
    return new Board({n: n}).rows();
  }
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  // an empty board is always valid
  if (n === 0) {
    return 1;
  }

  var solutionCount = findAllQueensSolutionsMemoized(n).length;

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

var findAllQueensSolutions = function(n) {
  let result = [];
  let board = new Board({n: n});
  let occupiedColumns = [];
  let occupiedMajorDiagonal = [];
  let occupiedMinorDiagonal = [];

  var recursiveFunc = function(rowIndex) {
    for (var i = 0; i < n; i++) {
      var majorDiagonalIndex = (i - rowIndex) + 3;
      var minorDiagonalIndex = i + rowIndex;
      if (!(occupiedColumns[i] || occupiedMajorDiagonal[majorDiagonalIndex] || occupiedMinorDiagonal[minorDiagonalIndex])) {
        // try each position at row rowIndex, and set it in the board
        // should never result in a column/diagonal conflict because we checked that the column/diagonal has not been occupied
        var rowToBeSet = genRow(i, n);
        board.set(rowIndex, rowToBeSet);
        // valid board
        if (rowIndex === n - 1) {
          // valid and complete
          result.push(board.rows());
        } else {
          // valid but incomplete:
          // mark column and diagonals as occupied
          occupiedColumns[i] = true;
          occupiedMajorDiagonal[majorDiagonalIndex] = true;
          occupiedMinorDiagonal[minorDiagonalIndex] = true;
          // then fill in the next row
          recursiveFunc(rowIndex + 1);
        }
        
        // reset the row to all 0s
        clearRow(board, rowIndex);
        // mark that the column and diagonals is no longer occupied for parent node to recurse down another path
        occupiedColumns[i] = false;
        occupiedMajorDiagonal[majorDiagonalIndex] = false;
        occupiedMinorDiagonal[minorDiagonalIndex] = false;
      }
    }
  };
  recursiveFunc(0);

  return result;
};


var findAllQueensSolutionsMemoized = _.memoize(findAllQueensSolutions);


var clearRow = function(board, rowIndex) {
  board.set(rowIndex, genRow(-1, board.get('n')));
};

var genRow = function(i, n) {
  var result = [];
  for (var j = 0; j < n; j++) {
    if (j === i) {
      result[j] = 1;
    } else {
      result[j] = 0;
    }
  }
  return result;
};
