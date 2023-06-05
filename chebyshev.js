export function calculatelowfilt(S_Filter, n, Ri, Rn, fh, db){
	const R1 = Number.parseInt(Ri);
	const R2 = Number.parseInt(Rn);
	const N = Number.parseInt(n);
	const Fh = Number.parseInt(fh);
	const dB = Number.parseInt(db);

	S_Filter.R[0] = R1;
	S_Filter.R[1] = R2;

	const Wv = 2 * Math.PI * Fh * Math.pow(10, -3);

	// обьясни этот код и переведи в javascript - m=.5*N-rem(N/2,1);
	//const m = 0.5 * N - N % 2;
	const m = N % 2 === 0 ? 0.5 * N - N % 2 : 0.5 * (N - 1);

	// обьясни этот код и переведи в javascript - E=sqrt(10^(dB/10)-1);
	const E = Math.sqrt(Math.pow(10, dB / 10) - 1);
	
	const K = ku(Ri, Rn, dB, N)
	// перепеши на javascript - a=(1/N)*asinh(1/E);
	const a = (1/N) * Math.asinh(1/E);

	// перепеши на javascript - a1=(1/N)*asinh(sqrt(1-K)/E);
	const a1 = (1/N) * Math.asinh(Math.sqrt(1-K)/E);
	
	// создаём массив с элементами
	let elements = [];
	// находим 1-ый элемент!
	if(R2 >= R1){
		//confirmed
		elements[0] = (2 * R1 * Math.sin(Math.PI / (2 * N))) / (Wv * (Math.sinh(a) - Math.sinh(a1))) * Math.pow(10, -3);
	} else {
		//confirmed
		elements[0] = (2 * Math.sin(Math.PI / (2 * N))) / (R1 * Wv * (Math.sinh(a) - Math.sinh(a1))) * Math.pow(10, 3);
	}

	// ищем остальные четные и нечетные элементы
	for (let k = 1; k <= m; k++) {
		//6.996
		let c = (16 * Math.sin(Wm(4 * k - 3, N)) * Math.sin(Wm(4 * k - 1, N))) / (Math.pow(Wv, 2) * Fm(Math.sinh(a), Math.sinh(a1), 2 * k - 1, N)) * Math.pow(10, 2);
		// Каждый нечет элемент
		elements[2 * k - 1] = c * (1 / elements[2 * k - 2]);
		//8.5
		c = (16 * Math.sin(Wm(4 * k - 1, N)) * Math.sin(Wm(4 * k + 1, N))) / (Math.pow(Wv, 2) * Fm(Math.sinh(a), Math.sinh(a1), 2 * k, N)) * Math.pow(10, 2);
		// Каждый чётный элемент
		elements[2 * k] = c * (1 / elements[2 * k - 1]);
	}
	
	const result = {
		L: [],
		C: []
	}

	let l1 = 0;
	let c1 = 0;

	for (let k = 0; k < N; k++) {
		if (R2 >= R1) {
			if (k % 2 == 1) {
				//result.L[l1] = (elements[k] * Math.pow(10, -3)).toFixed(4);
				result.L[l1] = (elements[k] * 1e-5).toFixed(4);
				S_Filter.Element[k] = 'C';
				S_Filter.Type[k] = 'p';
				S_Filter.Value[k] = result.L[l1];
				l1++;
			} else if(k % 2 == 0){
				//result.C[c1] = (elements[k] * Math.pow(10, -2)).toFixed(4);
				result.C[c1] = elements[k].toFixed(4);
				S_Filter.Element[k] = 'L';
				S_Filter.Type[k] = 's';
				S_Filter.Value[k] = result.C[c1];
				c1++;
			}
		} else {
			if (k % 2 == 0) {
				result.L[l1] = (elements[k] * 1e-3).toFixed(4);
				//result.L[l1] = elements[k] * 1e-5;
				S_Filter.Element[k] = 'C';
				S_Filter.Type[k] = 'p';
				S_Filter.Value[k] = result.L[l1];
				l1++;
			} else if (k % 2 == 1) {
				result.C[c1] = (elements[k] * 1e-2).toFixed(4);
				//result.C[c1] = elements[k];
				S_Filter.Element[k] = 'L';
				S_Filter.Type[k] = 's';
				S_Filter.Value[k] = result.C[c1];
				c1++;
			} 
		}
	}

	return result;
}

export function calc_S2P(S_Filter, Freq){
	const Z0 = math.complex(50, 0);
	const ne = S_Filter.Value.length;
	const nf = Freq.length;
	const R1 = S_Filter.R[0];
	const R2 = S_Filter.R[1];
	let a = [];
	let b = [];
	let A = math.zeros(2, 2, nf);
	
	for(let kf = 0; kf < nf; kf++){

		const w = 2 * Math.PI * Freq[kf];

		for (let ke = 0; ke < ne; ke++) {

			const value = S_Filter.Value[ke];

			const t_element = S_Filter.Element[ke];

			let z, y = [];

			switch (t_element) {
				case "L":
					z = math.evaluate(`${w} * ${Number.parseFloat(value)} * ${math.i} * 1e+3`).ceil(8);

					y = math.evaluate(`(1 / ${z})`)
					
					break;
				case "C":
					y = math.evaluate(`${math.i} * ${w} * ${Number.parseFloat(value)}`).ceil(13);
					
					z = math.evaluate(`1 / ${y}`)

					break;
				case "R":
					y = math.evaluate(`1 / ${Number.parseFloat(value)}`);

					z = math.evaluate(`${Number.parseFloat(value)}`);

					break;
				default:
					z = 0;
					y = 0;

					break;
			}
			let A1 = math.zeros(2, 2);
			
			const t_type = S_Filter.Type[ke];
			switch (t_type) {
				case "s":
					A1 = math.matrix([
						[math.complex({re: 1, im: 0}), z.ceil(4)],
						[math.complex({re: 0, im: 0}), math.complex({re: 1, im: 0})]
					]);
					break;
				case "p":
					A1 = math.matrix([
						[math.complex({re: 1, im: 0}), math.complex({re: 0, im: 0})],
						[y.ceil(4), math.complex({re: 1, im: 0})]
					]);
					break;
				default:
					A1 = math.matrix([
						[math.complex({re: 0, im: 0}), math.complex({re: 0, im: 0})],
						[math.complex({re: 0, im: 0}), math.complex({re: 0, im: 0})]
					]);
					break;
			}
			

			if (ke == 0) {
				A = A1;
			} else {
				A = multiplyComplexMatrices(A, A1);
			}
		}

		  let s110, s120, s210, s220;

			const m1 = math.multiply(A._data[1][0], Z0);
			const m2 = math.divide(A._data[0][1], Z0)
			
			const dT = math.evaluate(`${A._data[0][0]} + ${m2} + ${m1} + ${A._data[1][1]}`);

			const ab = math.divide(A._data[0][1], Z0);
			const ba = math.multiply(A._data[1][0], Z0);

			const ca = math.evaluate(`(${A._data[0][0]} + ${ab} - ${ba} - ${A._data[1][1]})`);

			const s11 = math.divide(ca, dT).ceil(4);

			const s21 = math.divide(2, dT).ceil(4);

			const mul1 = math.evaluate(`(${A._data[0][0]} * ${A._data[1][1]}) - (${A._data[0][1]} * ${A._data[1][0]})`);

			const mul2 = math.multiply(2, mul1)

			const s12 = math.divide(mul2, dT).ceil(4);

			const x = math.divide(A._data[0][1], Z0)
			const xx = math.multiply(A._data[1][0], Z0)

			const xxx = math.evaluate(`(-${A._data[0][0]} + ${x} - ${xx} + ${A._data[1][1]})`);

			const s22 = math.divide(xxx, dT).ceil(4)
			
			const r1 = R1;
			const r2 = R2;

			if (r1 != 50 || r2 != 50) {

			const Gamma11 = math.evaluate(`(${r1} - ${Z0})`);
			const Gamma12 = math.evaluate(`(${r1} + ${Z0})`);
			const Gamma1 = math.divide(Gamma11, Gamma12);

			const Gamma21 = math.evaluate(`(${r2} - ${Z0})`);
			const Gamma22 = math.evaluate(`(${r2} + ${Z0})`);
			const Gamma2 = math.divide(Gamma21, Gamma22);

			const a1 = (1 - Gamma1) * Math.sqrt(1 - Math.pow(Math.abs(Gamma1), 2)) / Math.abs(1 - Gamma1);

			const a2 = (1 - Gamma2) * Math.sqrt(1 - Math.pow(Math.abs(Gamma2), 2)) / Math.abs(1 - Gamma2);
			
			const tmp = math.multiply(Gamma1, s11);
			const tmp1 = math.multiply(Gamma2, s22);
			const tmp2 = math.multiply(Gamma1, Gamma2);
			const tmp3 = math.multiply(s12, s21)
			const tmp4 = math.multiply(tmp2, tmp3)

			var wewe = math.evaluate(`1 - ${tmp}`);

			var wewe2 = math.evaluate(`1 - ${tmp1}`);

			const D2 = math.multiply(wewe, wewe2)
			const new_D = math.evaluate(`${D2} - ${tmp4}`);

			const D = math.complex(new_D.re, -new_D.im); 

			const firstBracket = math.multiply(Gamma2, s22);
			const firstBracket2 = math.evaluate(`1 - ${firstBracket}`)
			var new_firstBracket2 = math.complex(firstBracket2.re, -firstBracket2.im)

			const secondBracket = math.evaluate(`${s11} - ${Gamma1}`);

			const thirdBracket = math.multiply(Gamma2, s12)	
			const thirdBracket2 = math.multiply(thirdBracket, s21)

			const fourthBracket = math.multiply(new_firstBracket2, secondBracket)

			const fifthBracket = math.evaluate(`${fourthBracket} + ${thirdBracket2}`)

			const sixthBracket = math.multiply(a1, fifthBracket)

			const seventhBracket = math.multiply(a1, D)

			s110 = math.divide(sixthBracket, seventhBracket);

			const firstAction = math.multiply(Gamma1, s11);
			const firstAction2 = math.evaluate(`1 - ${firstAction}`);
			const firstAction3 = math.complex(firstAction2.re, -firstAction2.im)

			const secondAction = math.evaluate(`${s22} - ${Gamma2}`)

			const thirdAction = math.multiply(Gamma1, s12)
			const thirdAction2 = math.multiply(thirdAction, s21)

			const fourthAction = math.multiply(firstAction3, secondAction)
			const fourthAction2 = math.evaluate(`${fourthAction} + ${thirdAction2}`)

			const fifthAction = math.multiply(a2, fourthAction2);

			const sixthAction = math.multiply(a2, D);

			s220 = math.divide(fifthAction, sixthAction);

			const firstJ = math.multiply(a2, s12);

			const absedGamma1 = math.pow(math.abs(Gamma1), 2);

			const thirdJ = math.evaluate(`1 - ${absedGamma1}`);
			
			const fourthJ = math.multiply(firstJ, thirdJ);

			const fifthJ = math.multiply(a1, D);

			s120 = math.divide(fourthJ, fifthJ);

			const firstN = math.multiply(a1, s21);

			const absedGamma2 = math.pow(math.abs(Gamma2), 2);

			const secondN = math.evaluate(`1 - ${absedGamma2}`);

			const fourthN = math.multiply(firstN, secondN);

			const fifthN = math.multiply(a2, D);

			s210 = math.divide(fourthN, fifthN);
		} else {
			s110 = s11;
			s120 = s12;
			s210 = s21;
			s220 = s22;
		}
		
		A._data[0][0] = s110;
		A._data[0][1] = s120;
		A._data[1][0] = s210;
		A._data[1][1] = s220;

		a.push(A._data[0][0])
		b.push(A._data[1][0])

	}
	return { a: a, b: b };
}

function ku(Ri, Rn, dB, N) {
	const E = Math.sqrt(Math.pow(10, dB/10) - 1);
	const n = N % 2;
	const R1 = Number.parseFloat(Ri);
	const R2 = Number.parseFloat(Rn);
	let K;
	
	if(R2 >= R1){
		if (n === 0){
			K = (1 + Math.pow(E, 2)) * (1 - Math.pow((R2 - R1)/(R2 + R1), 2));
		} else{
				K = 1 - Math.pow((R2 - R1)/(R2 + R1), 2);
		}
	} else{
			if (n === 0){
				K = (1 + Math.pow(E, 2)) * (1 - Math.pow((R1 - R2)/(R2 + R1), 2));
			} else{
					K = 1 - Math.pow((R1 - R2)/(R2 + R1), 2);
			}
	}
	
	if (K > 1) {
		K = 1;
	}
	
	return K;
}

function Wm(m, n){
	return (m * Math.PI) / (2 * n);
}

function Fm(a, a1, m, n){
	return 4 * (Math.pow(a, 2) + Math.pow(a1, 2) + Math.pow(Math.sin(Wm(2 * m, n)), 2) - 2 * a * a1 * Math.cos(Wm(2 * m, n)));
}

function multiplyComplexMatrices(A, B) {
	const m = A.size()[0]; // число строк матрицы A
	const n = A.size()[1]; // число столбцов матрицы A
	const p = B.size()[1]; // число столбцов матрицы B
	
	const C = math.zeros(m, p); // создаем матрицу C нулей
	
	// выполняем умножение матриц
	for (let i = 0; i < m; i++) {
		for (let j = 0; j < p; j++) {
			let sum = math.complex(0, 0); // начальное значение суммы
			
			for (let k = 0; k < n; k++) {
				const aik = A.get([i, k]); // элемент матрицы A
				const bkj = B.get([k, j]); // элемент матрицы B
				const product = math.multiply(aik, bkj); // произведение элементов
				
				sum = math.add(sum, product); // добавляем произведение к сумме
			}
			
			C.set([i, j], sum); // записываем значение в матрицу C
		}
	}
	
	return C;
}