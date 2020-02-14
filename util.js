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

const findSets = sets => {
	let sets2 = [];

}

const generateCombinations = (n, r) => {
	let a = [], ret = [];
	for (let k = 0; k < r; k++) {
		a[k] = k;
	}
	let i = r - 1;
	while (a[0] < n - r + 1) {
		while (i > 0 && a[i] == n - r + i) {
			i--;
		}
		ret.push([...a]);
		a[i]++;
		while (i < r - 1) {
			a[i + 1] = a[i] + 1;
			i++;
		}
	}
	return ret;
}

console.log(generateCombinations(6, 3));