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
  var solution = findNSolution(n, false);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = findNSolution(n, true);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// helper function
window.findNSolution = function(n, hasDiagonalConflicts) {
  let result;
  // initialize empty matrix (all 0s)
  let matrix = [];
  for (var i = 0; i < n; i++) {
    matrix.push(0);
  }
  let found = false;
  // store information about which columns/diagonal lines are occupied
  let occupiedColumns = [];
  let occupiedMajorDiagonal = [];
  let occupiedMinorDiagonal = [];

  var recursiveFunc = function(rowIndex) {
    for (var colIndex = 0; colIndex < n; colIndex++) {
      // if solution is already found in previous calls, break out of loop
      if (found) {
        break;
      }
      // when traversing first row, only need to check left half of the board,
      // because the mirror images of the solutions derived will be results from the other half of the board
      if (rowIndex === 0 && colIndex >= n / 2) {
        continue;
      }
      var majorDiagonalIndex = (colIndex - rowIndex) + 3;
      var minorDiagonalIndex = colIndex + rowIndex;

      // check for column collisions
      var validSlot = !occupiedColumns[colIndex];
      // check whether it is a queen, if it is also check for diagonal collisions
      if (hasDiagonalConflicts) {
        validSlot = validSlot && !occupiedMajorDiagonal[majorDiagonalIndex] && !occupiedMinorDiagonal[minorDiagonalIndex];
      }
      if (validSlot) {
        // the current position should never result in a column/diagonal conflict
        // because we checked that the column/diagonal has not been occupied

        // use 2-based number to indicate where the piece is in the row
        matrix[rowIndex] = 2 ** (n - colIndex - 1);       

        // valid board
        if (rowIndex === n - 1) {
          // valid and complete: mark as found and store the matrix
          found = true;
          result = matrix;
        } else {
          // valid but incomplete: mark column and diagonals as occupied
          occupiedColumns[colIndex] = true;
          occupiedMajorDiagonal[majorDiagonalIndex] = true;
          occupiedMinorDiagonal[minorDiagonalIndex] = true;
          // then fill in the next row
          recursiveFunc(rowIndex + 1);
        }
        
        // only execute after previous recursive calls have returned with unsuccessful results (i.e. backtracking)
        if (!found) {
          // reset the row to 0
          matrix[rowIndex] = 0;

          // mark that the column and diagonals is no longer occupied for parent node to recurse down another path
          occupiedColumns[colIndex] = false;
          occupiedMajorDiagonal[majorDiagonalIndex] = false;
          occupiedMinorDiagonal[minorDiagonalIndex] = false;
        }
      }
    }
  };
  recursiveFunc(0);
  
  // return empty matrix when there is no solution
  if (!result) {
    return new Board({n: n}).rows();
  }
  return binArrToMatrix(result, n);
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = countNSolutions(n, false);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  // an empty board is always valid
  if (n === 0) {
    return 1;
  }

  var solutionCount = countNSolutions(n, true);
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

// helper function
var countNSolutions = function(n, hasDiagonalConflicts) {
  // initialize count to 0
  let count = 0;
  let occupiedColumns = [];
  let occupiedMajorDiagonal = [];
  let occupiedMinorDiagonal = [];
  let startCenter = false;

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
      // check whether it is a queen, if it is also check for diagonal collisions
      if (hasDiagonalConflicts) {
        validSlot = validSlot && !occupiedMajorDiagonal[majorDiagonalIndex] && !occupiedMinorDiagonal[minorDiagonalIndex];
      }
      if (validSlot) {
        // the current position should never result in a column/diagonal conflict
        // because we checked that the column/diagonal has not been occupied

        // check whether the current piece is placed in the center position of the first row
        // with an even 'n', this block will never get executed because it would have broken out of the loop in lines above
        if (rowIndex === 0) {
          if (colIndex === Math.floor(n / 2)) {
            startCenter = true;
          } else {
            startCenter = false;
          }
        }

        // valid board
        if (rowIndex === n - 1) {
          if (startCenter) {
            // increment solutions count by 1 if it is a 'center' board
            count++;
          } else {
            // increment by 2 if it is a 'left' board, to account for mirror solutions on the 'right' board
            count += 2;
          }
        } else {
          // valid but incomplete: mark column and diagonals as occupied
          occupiedColumns[colIndex] = true;
          occupiedMajorDiagonal[majorDiagonalIndex] = true;
          occupiedMinorDiagonal[minorDiagonalIndex] = true;

          // then fill in the next row
          recursiveFunc(rowIndex + 1);
        }

        // mark that the column and diagonals is no longer occupied for parent node to recurse down another path
        occupiedColumns[colIndex] = false;
        occupiedMajorDiagonal[majorDiagonalIndex] = false;
        occupiedMinorDiagonal[minorDiagonalIndex] = false;
      }
    }
  };
  recursiveFunc(0);
  
  return count;
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

var binArrToMatrix = function(arr, n) {
  var result = [];
  for (var bin of arr) {
    result.push(genRow(Math.log2(bin), n));
  }
  return result;
};

/*
Time Complexity
findNRooksSolution = O(n^n)
findAllRooksSolution = O(n^n)
countNQueensSolutions = O(n^n)
findAllQueensSolutions = O(n^n)
*/
