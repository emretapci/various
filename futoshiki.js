//fixed: array of [row, col, e] (e at (row, col))
//constraints: array of [row, col, dir] (dir=0: (row, col) > (row - 1, col), dir=1: (row, col) > (row, col + 1), dir=2: (row, col) > (row + 1, col), dir=3: (row, col) > (row, col - 1))
//rows and columns are 1-based
const solve = (size, fixed = [], constraints = []) => {
	const isSubset = (big, small) => {
		if (big.length < small.length)
			return false;
		for (let e of small)
			if (big.indexOf(e) < 0)
				return false;
		return true;
	}

	const setDiff = (minuend, subtrahend) => {
		return minuend.filter(el => subtrahend.indexOf(el) < 0);
	}

	const fullCell = size => {
		let ret = [];
		for (let i = 0; i < size; i++)
			ret.push(i);
		return ret;
	}

	const discoverSets = puzzle => {
		let changed = false;
		for (let r = 0; r < puzzle.size; r++) {
			for (let c = 0; c < puzzle.size; c++) {
				let cells = fullCell(puzzle.size);
				while (cells.length > 0) {
					let subsets = [];
					for (let i of cells)
						if (isSubset(puzzle.array[r][c], puzzle.array[i][c]))
							subsets.push(i);
					if (subsets.length == puzzle.array[r][c].length) {
						let diff = setDiff(fullCell(size), subsets);
						if (diff.length > 0) {
							for (let j of diff) {
								let temp = setDiff(puzzle.array[j][c], puzzle.array[r][c]);
								if (temp.length != puzzle.array[j][c].length)
									changed = true;
								puzzle.array[j][c] = temp;
							}
						}
					}
					else if (subsets.length > puzzle.array[r][c].length) {
						throw "Error in puzzle";
					}
					else
						break;
					cells = setDiff(cells, subsets);
				}
				cells = fullCell(puzzle.size);
				while (cells.length > 0) {
					let subsets = [];
					for (let i of cells)
						if (isSubset(puzzle.array[r][c], puzzle.array[r][i]))
							subsets.push(i);
					if (subsets.length == puzzle.array[r][c].length) {
						let diff = setDiff(fullCell(size), subsets);
						if (diff.length > 0) {
							for (let j of diff) {
								let temp = setDiff(puzzle.array[r][j], puzzle.array[r][c]);
								if (temp.length != puzzle.array[r][j].length)
									changed = true;
								puzzle.array[r][j] = temp;
							}
						}
					}
					else if (subsets.length > puzzle.array[r][c].length) {
						throw "Error in puzzle";
					}
					else
						break;
					cells = setDiff(cells, subsets);
				}
			}
		}
		return changed;
	}

	const setSingles = puzzle => {
		let changed = false;
		for (let r = 0; r < puzzle.size; r++) {
			for (let i = 0; i < puzzle.size; i++) {
				let cells = puzzle.array[r].filter(cell => cell.indexOf(i) >= 0);
				if (cells.length == 1 && cells[0].length > 1) {
					cells[0] = [i];
					changed = true;
				}
			}
		}
		for (let c = 0; c < puzzle.size; c++) {
			for (let i = 0; i < puzzle.size; i++) {
				let cells = [];
				for (let r = 0; r < puzzle.size; r++) {
					if (puzzle.array[r][c].indexOf(i) >= 0)
						cells.push(r);
				}
				if (cells.length == 1 && puzzle.array[cells[0]][c].length > 1) {
					puzzle.array[cells[0]][c] = [i];
					changed = true;
				}
			}
		}
		return changed;
	}

	const useConstraints = puzzle => {
		let changed = false;
		for (let cons of puzzle.constraints) {
			switch (cons[2]) {
				case 0:
					smallCell = [cons[0] - 1, cons[1]];
					break;
				case 1:
					smallCell = [cons[0], cons[1] + 1];
					break;
				case 2:
					smallCell = [cons[0] + 1, cons[1]];
					break;
				case 3:
					smallCell = [cons[0], cons[1] - 1];
					break;
			}
			let min = Math.min(...puzzle.array[smallCell[0] - 1][smallCell[1] - 1]);
			let big = puzzle.array[cons[0] - 1][cons[1] - 1].filter(x => x > min);
			let max = Math.max(...puzzle.array[cons[0] - 1][cons[1] - 1]);
			let small = puzzle.array[smallCell[0] - 1][smallCell[1] - 1].filter(x => x < max);
			if (puzzle.array[cons[0] - 1][cons[1] - 1].length != big.length || puzzle.array[smallCell[0] - 1][smallCell[1] - 1].length != small.length)
				changed = true;
			puzzle.array[cons[0] - 1][cons[1] - 1] = big;
			puzzle.array[smallCell[0] - 1][smallCell[1] - 1] = small;
		}
		return changed;
	}

	let puzzle = {
		size,
		array: [], //array elements are rows
		constraints
	};

	for (let r = 0; r < size; r++) {
		let row = [];
		for (let c = 0; c < size; c++) {
			row.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		}
		puzzle.array.push(row);
	}

	for (let i = 0; i < fixed.length; i++) {
		puzzle.array[fixed[i][0] - 1][fixed[i][1] - 1] = [fixed[i][2]];
	}

	let changed = false;
	print(puzzle);
	do {
		changed = false;
		changed |= discoverSets(puzzle);
		changed |= setSingles(puzzle);
		changed |= useConstraints(puzzle);
		print(puzzle);
	}
	while (changed);
}


const print = puzzle => {
	console.log('┌───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┐');
	for (let r = 0; r < puzzle.size; r++) {
		for (let subrow = 0; subrow < 3; subrow++) {
			let str = '│ ';
			for (let c = 0; c < puzzle.size; c++) {
				if (puzzle.array[r][c].length == 1) {
					switch (subrow) {
						case 0:
							str += '      ';
							break;
						case 1:
							str += '  ' + puzzle.array[r][c][0].toString() + '   ';
							break;
						case 2:
							str += '      ';
							break;
					}
				}
				else {
					for (let i = subrow * 3; i < subrow * 3 + 3; i++)
						str += (puzzle.array[r][c].indexOf(i + 1) >= 0 ? (i + 1).toString() : ' ') + ' ';
				}
				if (subrow == 1 && puzzle.constraints.filter(cons => cons[0] == r + 1 && cons[1] == c + 1 && cons[2] == 1).length > 0)
					str += '> ';
				else if (subrow == 1 && puzzle.constraints.filter(cons => cons[0] == r + 1 && cons[1] == c + 2 && cons[2] == 3).length > 0)
					str += '< ';
				else
					str += '│ ';
			}
			str = str.slice(0, -2) + '│';
			console.log(str);
		}
		str = (r == puzzle.size - 1 ? '└' : '├') + '─';
		for (let c = 0; c < puzzle.size; c++) {
			if (puzzle.constraints.filter(cons => cons[0] == r + 1 && cons[1] == c + 1 && cons[2] == 2).length > 0)
				str += '─ v ──' + (r == puzzle.size - 1 ? '┴' : '┼') + '─';
			else if (puzzle.constraints.filter(cons => cons[0] == r + 2 && cons[1] == c + 1 && cons[2] == 0).length > 0)
				str += '─ ^ ──' + (r == puzzle.size - 1 ? '┴' : '┼') + '─';
			else
				str += '──────' + (r == puzzle.size - 1 ? '┴' : '┼') + '─';
		}
		str = str.slice(0, -2);
		str += r == puzzle.size - 1 ? '┘' : '┤';
		console.log(str);
	}
}

solve(9, [
	[1, 5, 7],
	[2, 5, 3],
	[3, 4, 7],
	[3, 6, 9],
	[4, 3, 7],
	[4, 7, 6],
	[5, 1, 3],
	[5, 2, 7],
	[5, 8, 8],
	[5, 9, 9],
	[6, 3, 3],
	[6, 7, 7],
	[7, 4, 3],
	[7, 6, 2],
	[8, 5, 8],
	[9, 5, 6]
], [
	[1, 1, 2],
	[1, 8, 3],
	[1, 9, 3],
	[2, 6, 1],
	[2, 8, 0],
	[3, 2, 0],
	[3, 2, 1],
	[4, 1, 2],
	[4, 4, 2],
	[4, 6, 2],
	[4, 7, 3],
	[4, 8, 2],
	[4, 9, 0],
	[6, 1, 0],
	[6, 2, 0],
	[6, 3, 0],
	[6, 5, 0],
	[6, 6, 3],
	[6, 7, 2],
	[6, 9, 2],
	[7, 9, 3],
	[8, 2, 0],
	[8, 3, 2],
	[8, 4, 3],
	[8, 8, 1],
	[9, 1, 0],
	[9, 6, 1],
	[9, 8, 0]
]);