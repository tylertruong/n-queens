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
  return findAllSolutions(n, false);
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
  return findAllSolutions(n, true);
}; 

var findAllSolutions = function(n, hasDiagonalConflicts) {
  let mirrorResult = [];
  let centerResult = [];
  let matrix = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      row.push(0);
    }
    matrix.push(row);
  }
  let occupiedColumns = [];
  let occupiedMajorDiagonal = [];
  let occupiedMinorDiagonal = [];

  var recursiveFunc = function(rowIndex) {
    for (var colIndex = 0; colIndex < n; colIndex++) {
      // when traversing first row, only need to check left half of the board,
      // because the mirror images of the solutions derived will be results from the other half of the board
      if (rowIndex === 0 && colIndex >= n / 2) {
        continue;
      }
      var majorDiagonalIndex = (colIndex - rowIndex) + 3;
      var minorDiagonalIndex = colIndex + rowIndex;

      // check for column collisions
      var validSlot = !occupiedColumns[colIndex];
      // check whether it is a queen, if it is also checks diagonal collisions
      if (hasDiagonalConflicts) {
        validSlot = validSlot && !occupiedMajorDiagonal[majorDiagonalIndex] && !occupiedMinorDiagonal[minorDiagonalIndex];
      }
      if (validSlot) {
        // try each position at row rowIndex, and set it in the board
        // should never result in a column/diagonal conflict because we checked that the column/diagonal has not been occupied
        matrix[rowIndex][colIndex] = 1;        

        // valid board
        if (rowIndex === n - 1) {
          // valid and complete: make a copy of the matrix
          var matrixCopy = matrix.slice();
          matrixCopy = _.map(matrixCopy, row => row.slice());
          if (n % 2 === 1 && matrix[0][Math.floor(n / 2)]) {
            // solution starts at center column
            centerResult.push(matrixCopy);
          } else {
            // solution starts at left half of board
            mirrorResult.push(matrixCopy);
          }
        } else {
          // valid but incomplete:
          // mark column and diagonals as occupied
          occupiedColumns[colIndex] = true;
          occupiedMajorDiagonal[majorDiagonalIndex] = true;
          occupiedMinorDiagonal[minorDiagonalIndex] = true;
          // then fill in the next row
          recursiveFunc(rowIndex + 1);
        }
        
        // reset the slot to 0
        matrix[rowIndex][colIndex] = 0;

        // mark that the column and diagonals is no longer occupied for parent node to recurse down another path
        occupiedColumns[colIndex] = false;
        occupiedMajorDiagonal[majorDiagonalIndex] = false;
        occupiedMinorDiagonal[minorDiagonalIndex] = false;
      }
    }
  };
  recursiveFunc(0);

  // combine solutions that start on the left half, center column (if n is odd) and right half
  return mirrorResult.concat(centerResult).concat(mirrorSolutions(mirrorResult));
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

var mirrorSolutions = function(solutions) {
  return _.map(solutions, (matrix) => {
    return _.map(matrix, (row) => row.slice().reverse());
  });
};
