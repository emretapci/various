const getPartitions = n2 => {
	dict = [];
	const f = (n, r) => {
		if (n < r) {
			return [];
		}
		else if (r == 1) {
			return [[n]];
		}
		else if (n == r) {
			return [new Array(n).fill(1)];
		}
		else {
			let filt = dict.filter(e => e[0] == n && e[1] == r);
			if (filt.length > 0)
				return filt[0][2];

			let ret = [];
			for (let i = 1; i <= r; i++) {
				let ret2 = f(n - r, i);
				for (let j = 0; j < ret2.length; j++) {
					for (let k = 0; k < ret2[j].length; k++) {
						ret2[j][k]++;
					}
					ret2[j] = ret2[j].concat(new Array(r - i).fill(1))
				}
				ret = ret.concat(ret2);
			}

			dict.push([n, r, ret]);

			return ret;
		}
	}
	return f(n2 * 2, n2).map(e => e.filter(e2 => e2 > 1).map(e2 => e2 - 1));
}

const getDistinctPartitions = n2 => {
	const f = (n, r) => {
		if (n < r * (r + 1) / 2) {
			return [];
		}
		else if (r == 1) {
			return [[n]];
		}
		else if (n == r * (r + 1) / 2) {
			let ret = [];
			for (let i = 1; i <= r; i++) {
				ret.push(i);
			}
			return [ret];
		}
		else {
			let ret = [];
			let ret2 = f(n - r, r - 1);
			for (let j = 0; j < ret2.length; j++) {
				for (let k = 0; k < ret2[j].length; k++) {
					ret2[j][k]++;
				}
				ret2[j].push(1);
			}
			ret = ret.concat(ret2);
			ret2 = f(n - r, r);
			for (let j = 0; j < ret2.length; j++) {
				for (let k = 0; k < ret2[j].length; k++) {
					ret2[j][k]++;
				}
			}
			ret = ret.concat(ret2);

			return ret;
		}
	}

	let ret = [];
	let r = (Math.sqrt(1 + 8 * n2) - 1) / 2;
	for (let i = 1; i <= r; i++)
		ret = ret.concat(f(n2, i));
	return ret;
}

for (let i = 1; i <= 30; i++) {
	let h = getPartitions(i);
	//let h = getDistinctPartitions(i);
	console.log(i, h.length, h);
}
