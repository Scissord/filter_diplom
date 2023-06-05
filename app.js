import { drawChain } from './chains/chain1.js';
import { drawChain2 } from './chains/chain2.js';
import { drawChain3 } from './chains/chain3.js';
import { drawChain4 } from './chains/chain4.js';
import { drawChain5 } from './chains/chain5.js';
import { drawChain6 } from './chains/chain6.js';
import { drawChain7 } from './chains/chain7.js';
import { drawChain8 } from './chains/chain8.js';
import { drawChain9 } from './chains/chain9.js';
import { calculatelowfilt } from './chebyshev.js';
import { drawPlot } from './plotly.js';
import { calc_S2P } from './chebyshev.js';

document.getElementById("R1").addEventListener("input", updateFilter);
document.getElementById("R2").addEventListener("input", updateFilter);
document.getElementById("A").addEventListener("input", updateFilter);
document.getElementById("f").addEventListener("input", updateFilter);
document.getElementById("n").addEventListener("input", updateFilter);

function updateFilter() {
	const S_Filter = {
		Element: [],
		Type: [],
		Value: [],
		R: []
	};

	const R1 = document.getElementById("R1").value;
  const R2 = document.getElementById("R2").value;
  const A = document.getElementById("A").value;
  const f = document.getElementById("f").value;
  const n = document.getElementById("n").value;

	const result = calculatelowfilt(S_Filter, n, R1, R2, f, A);
	const resultL = result.C.map((element, idx) => `Элемент ${idx + 1} : L = ${element} нГн <br>`);
	const resultC = result.L.map((element, idx) => `Элемент ${idx + 1} : C = ${element} пФ <br>`);

	document.getElementById("C").innerHTML = resultC.join("\n");
	document.getElementById("L").innerHTML = resultL.join("\n");

	const F = f;
	const Freq = Array.from({length: 50}, (_, i) => (0.001 + (2*F - 0.001)/49 * i)* Math.pow(10, -3));
	const {a, b} = calc_S2P(S_Filter,Freq)
	const s11 = a.map(k => 20 * math.log10(math.abs(k)));
  const s12 = b.map(k => 20 * math.log10(math.abs(k)));
	drawPlot(Freq, {s11, s12});

	const N = Number.parseInt(n);
	switch(N) {
		case 1:
			drawChain(n, R1, R2);
			break;
		case 2:
			drawChain2(n, R1, R2);
			break;
		case 3:
			drawChain3(n, R1, R2);
			break;
		case 4:
			drawChain4(n, R1, R2);
			break;
		case 5:
			drawChain5(n, R1, R2);
			break;
		case 6:
			drawChain6(n, R1, R2);
			break;
		case 7:
			drawChain7(n, R1, R2);
			break;
		case 8:
			drawChain8(n, R1, R2);
			break;
		case 9:
			drawChain9(n, R1, R2);
			break;
		default:
			// handle invalid input
	}
}

updateFilter();