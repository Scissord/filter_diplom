export function calculatelowfilt(S_Filter, n, Ri, Rn, fh, db){
	const R1 = Number.parseFloat(Ri);
	const R2 = Number.parseFloat(Rn);
	const N = Number.parseInt(n);
	const Fh = Number.parseFloat(fh);
	const dB = Number.parseFloat(db);

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
				result.L[l1] = (elements[k] * Math.pow(10, -3)).toFixed(4);
				S_Filter.Element[k] = 'C';
				S_Filter.Type[k] = 'p';
				S_Filter.Value[k] = result.L[l1];
				l1++;
			} else if(k % 2 == 0){
				result.C[c1] = (elements[k] * Math.pow(10, -2)).toFixed(4);
				S_Filter.Element[k] = 'L';
				S_Filter.Type[k] = 's';
				S_Filter.Value[k] = result.C[c1];
				c1++;
			}
		} else {
			if (k % 2 == 0) {
				result.L[l1] = (elements[k] * Math.pow(10, -3)).toFixed(4);
				S_Filter.Element[k] = 'C';
				S_Filter.Type[k] = 'p';
				S_Filter.Value[k] = result.L[l1];
				l1++;
			} else if (k % 2 == 1) {
				result.C[c1] = (elements[k] * Math.pow(10, -2)).toFixed(4);
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
					// считается +- как в матлаб, но со второй половины проблемы с целой частью 1е-3 выглядит ненадёжно
					// выглядит надёжно
					z = math.evaluate(`${w} * ${Number.parseFloat(value)} * ${math.i} * 1e+3`).ceil(8);
				
					//z.im = z.im * Math.pow(10, -4);
					//z = math.evaluate(`${w} * ${Number.parseFloat(value)} * ${math.i}`);
					
					//здесь мы оставили первые два числа как в matlab, остальные нихуя не сходятся по разрядам sad
					//y = math.evaluate(`(1 / ${z}) * 1e-6`);
					y = math.evaluate(`(1 / ${z})`).ceil(8);
					//console.log(y);
					//y = y.ceil(4);
					
					break;
				case "C":
					y = math.evaluate(`${math.i} * ${w} * ${Number.parseFloat(value)}`).ceil(13);
					
					// y = math.evaluate(`${y.im} + 1e-8`);
					//y = y.ceil(4);
					//y = y.im * Math.pow(10, 5)
					//y = math.evaluate(`${math.i} * ${w} * ${Number.parseFloat(value)}`);

					//z = math.evaluate(`1 / ${y} * 1e-6`);
					//z = math.evaluate(`1 / ${y}`).ceil(8);
					z = math.evaluate(`1 / ${y}`)
					//console.log(z)
					//console.log(z)
					//z = z.ceil(4)

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
					//ВТОРОЙ, ЧЕТВЕРТЫЙ
					//[[1, z], [0, 1]];
					//A1 = math.matrix([[1 , z], [0, 1]]);
					A1 = math.matrix([
						[math.complex({re: 1, im: 0}), z.ceil(4)],
						[math.complex({re: 0, im: 0}), math.complex({re: 1, im: 0})]
					]);
					break;
				case "p":
					//ПЕРВЫЙ, ТРЕТИЙ, ПЯТЫЙ, ETC.
					//A1 = math.matrix([[1, 0], [y, 1]]);
					A1 = math.matrix([
						[math.complex({re: 1, im: 0}), math.complex({re: 0, im: 0})],
						[y.ceil(4), math.complex({re: 1, im: 0})]
					]);
					break;
				default:
					//A1 = math.matrix([[0, 0], [0, 0]]);
					A1 = math.matrix([
						[math.complex({re: 0, im: 0}), math.complex({re: 0, im: 0})],
						[math.complex({re: 0, im: 0}), math.complex({re: 0, im: 0})]
					]);
					break;
			}
			

			if (ke == 0) {
				//СХУЯЛИ ЭТО РАБОТАЕТ НЕ 1 РАЗ
				A = A1;
				// A.set([0, 0], A1.get([0, 0]));
				// A.set([0, 1], A1.get([0, 1]));
				// A.set([1, 0], A1.get([1, 0]));
				// A.set([1, 1], A1.get([1, 1]));
				// A = math.subset(A, math.index([0, 0], [1, 1]), A1);
				// A._data[0][0].unshift(A1._data[0][0], A1._data[0][1]);
				// A._data[0][1].unshift(A1._data[1][0], A1._data[1][1]);
				// A._data[0][0].length = 50;
				// A._data[0][1].length = 50;
				// console.log(A)
				// console.log(A1._data[0]);
				// console.log(A._data[0]);
			} else {
				A = multiplyComplexMatrices(A, A1);
				//A._data[[{re: , im:},{re: , im:}],[{re: , im:},{re: , im:}]]
			}
		}
			// const ah = math.evaluate(`${A._data[0][0]} + (${A._data[0][1]} / ${Z0})`).floor(4);
			// const bh = math.evaluate(`${A._data[1][0]} * ${Z0}`).floor(1);
			// console.log(math.evaluate(`${ah} - ${bh}`));

			// вопросы к 1-ому и 2-ому элементу остальное +- сходится 
			//console.log(math.evaluate(`${A._data[0][0]} + (${A._data[0][1]} / ${Z0}) - (${A._data[1][0]} * ${Z0})`))	;

			// сходится идеально console.log(math.evaluate(`${A._data[0][0]} + (${A._data[0][1]} / ${Z0})`));

			// +- сходится но есть вопросы ко 2-ому элементу console.log(math.evaluate(`${A._data[0][0]} + (${A._data[0][1]} / ${Z0}) - (${A._data[1][0]} * ${Z0}) - ${A._data[1][1]}`).ceil(3));
		
			// сходится - console.log(math.evaluate(`${A._data[1][0]} * ${Z0}`))


			// сходится - console.log(math.evaluate(`${A._data[0][1]} / ${Z0}`));

		  let s110, s120, s210, s220;

			const m1 = math.multiply(A._data[1][0], Z0);
			const m2 = math.divide(A._data[0][1], Z0)
			
			const dT = math.evaluate(`${A._data[0][0]} + ${m2} + ${m1} + ${A._data[1][1]}`);

			// 						const ah = math.add(
			// 				math.divide(
			// 					math.add(A.subset(math.index(0, 0)), math.divide(A.subset(math.index(0, 1)), Z0)),
			// 					1
			// 				),
			// 				math.divide(
			// 					math.subtract(
			// 						math.multiply(A.subset(math.index(1, 0)), Z0.re) - math.multiply(A.subset(math.index(1, 1)), Z0.im),
			// 						math.multiply(A.subset(math.index(1, 0)), Z0.im) + math.multiply(A.subset(math.index(1, 1)), Z0.re)
			// 					),
			// 					dT
			// 				)
			// 			);
			// 
			// 			console.log(ah);

			const ab = math.divide(A._data[0][1], Z0);
			const ba = math.multiply(A._data[1][0], Z0);

			const ca = math.evaluate(`(${A._data[0][0]} + ${ab} - ${ba} - ${A._data[1][1]})`);
			//confirmed
			const s11 = math.divide(ca, dT).ceil(4)
			//confirmed
			const s21 = math.divide(2, dT).ceil(4);

			const mul1 = math.evaluate(`(${A._data[0][0]} * ${A._data[1][1]}) - (${A._data[0][1]} * ${A._data[1][0]})`);

			const mul2 = math.multiply(2, mul1)
			//confirmed
			const s12 = math.divide(mul2, dT).ceil(4);

			//(-A(1,1) + A(1,2)/Z0 - A(2,1)*Z0 + A(2,2))/dT;
			const x = math.divide(A._data[0][1], Z0)
			const xx = math.multiply(A._data[1][0], Z0)

			const xxx = math.evaluate(`(-${A._data[0][0]} + ${x} - ${xx} + ${A._data[1][1]})`);
			//confirmed
			const s22 = math.divide(xxx, dT).ceil(4)
			
			const r1 = math.complex(R1, 0)
			const r2 = math.complex(R2, 0)

			if (r1 != Z0 || r2 != Z0) {

			const Gamma11 = math.evaluate(`(${r1} - ${Z0})`);
			const Gamma12 = math.evaluate(`(${r1} + ${Z0})`);
			const Gamma1 = math.divide(Gamma11, Gamma12);
			
			const Gamma21 = math.evaluate(`(${r2} - ${Z0})`);
			const Gamma22 = math.evaluate(`(${r2} + ${Z0})`);
			const Gamma2 = math.divide(Gamma21, Gamma22);

			const a1 = (1 - Gamma1) * Math.sqrt(1 - Math.pow(Math.abs(Gamma1), 2)) / Math.abs(1 - Gamma1);

			const a2 = (1 - Gamma2) * Math.sqrt(1 - Math.pow(Math.abs(Gamma2), 2)) / Math.abs(1 - Gamma2);
			
			//тут есть вопросы при порядке фильтра не 5, может быть совсем другие данные нужно затестить D = (1-Gamma1*s11)*(1-Gamma2*s22) - Gamma1*Gamma2*s12*s21;
			const kek = math.multiply(Gamma1, s11);
			const keka = math.multiply(Gamma2, s22);
			const kekak = math.multiply(Gamma1, Gamma2);
			const kekake = math.multiply(s12, s21)
			const kekakek = math.multiply(kekak, kekake)
			//тут знаки мнимой части противоположны
			var wewe = math.evaluate(`1 - ${kek}`);
			//var new_wewe = math.complex(wewe.re, -wewe.im)
			//console.log(new_wewe.ceil(4))
			var wewe2 = math.evaluate(`1 - ${keka}`);
			//var new_wewe2 = math.complex(wewe2.re, -wewe2.im)
			//console.log(wewe2.ceil(4))
			const D2 = math.multiply(wewe, wewe2)
			const new_D = math.evaluate(`${D2} - ${kekakek}`).ceil(4);
			//confirmed
			const D = math.complex(new_D.re, -new_D.im); 
			//console.log(D)

			//s110 = (conj(a1)*((1-Gamma2*s22)*(s11-conj(Gamma1))+Gamma2*s12*s21))/(a1*D);

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

			//s220 = (conj(a2)*((1-Gamma1*s11)*(s22-conj(Gamma2))+Gamma1*s12*s21))/(a2*D);

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
			
			//s120 = (conj(a2)*s12*(1-abs(Gamma1)^2))/(a1*D);

			const firstJopa = math.multiply(a2, s12);

			const absedGamma1 = math.pow(math.abs(Gamma1), 2);

			const thirdJopa = math.evaluate(`1 - ${absedGamma1}`);
			
			const fourthJopa = math.multiply(firstJopa, thirdJopa);

			const fifthJopa = math.multiply(a1, D);

			s120 = math.divide(fourthJopa, fifthJopa);
			
			//s210 = (conj(a1)*s21*(1-abs(Gamma2)^2))/(a2*D);

			const firstNegr = math.multiply(a1, s21);

			const absedGamma2 = math.pow(math.abs(Gamma2), 2);

			const secondNegr = math.evaluate(`1 - ${absedGamma2}`);

			const fourthNegr = math.multiply(firstNegr, secondNegr);

			const fifthNegr = math.multiply(a2, D);

			s210 = math.divide(fourthNegr, fifthNegr);
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
		//console.log(s110)
		a.push(A._data[0][0])
		b.push(A._data[1][0])

		// Создаем матрицу S размером 2x2 для текущей частоты kf
		// const S_kf = [[s110, s120], [s210, s220]];
		// S[kf - 1] = S_kf;
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
//confirmed
function Wm(m, n){
	return (m * Math.PI) / (2 * n);
}
//confirmed
function Fm(a, a1, m, n){
	return 4 * (Math.pow(a, 2) + Math.pow(a1, 2) + Math.pow(Math.sin(Wm(2 * m, n)), 2) - 2 * a * a1 * Math.cos(Wm(2 * m, n)));
}

//A._data[[{re: , im:},{re: , im:}],[{re: , im:},{re: , im:}]]
// let matrix1 = [[{re: 1, im: 2}, {re: 3, im: 4}], [{re: 5, im: 6}, {re: 7, im: 8}]];
// let matrix2 = [[{re: 1, im: 2}, {re: 3, im: 4}], [{re: 5, im: 6}, {re: 7, im: 8}]];
// let result = multiplyMatrices(matrix1, matrix2);
// console.log(result); // [[19, 22], [43, 50]]
// 
// function multiplyMatrices(matrix1, matrix2) {
//   let result = [[{re: 0, im: 0}, {re: 0, im: 0}], [{re: 0, im: 0}, {re: 0, im: 0}]];
// 
//   for (let i = 0; i < 2; i++) {
//     for (let j = 0; j < 2; j++) {
//       for (let k = 0; k < 2; k++) {
//         result[i][j] += math.evaluate(`${matrix1[i][k]} * ${matrix2[k][j]}`);
//       }
//     }
//   }
//   return result;
// }

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