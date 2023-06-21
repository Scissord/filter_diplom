import { calc_S2P } from "./chebyshev.js";

export function drawPlot(Freq, {s11, s12}) {
	const trace1 = {
		x: Freq,	
		y: s11,
		name: 'S11',
		type: 'scatter',
		yaxis: 'y1',
		line: { color	: 'red' }
	};

	const trace2 = {
		x: Freq,
		y: s12,
		name: 'S12',
		type: 'scatter',
		yaxis: 'y2',
		mode: 'markers',
		line: { color: 'blue' }
	};

	const data = [trace1, trace2];

	const layout = {
		title: 'Filter S-parameters',
		xaxis: {
			title: 'Freq, GHz'
		},
		yaxis: {
			title: 'S12 dB', 
			side: 'left',
			color: 'red',
			range: [-20, 0]
		},
		yaxis2: {
			overlaying: 'y',
			title: 'S11 dB',
			side: 'right',
			color: 'blue',
			range: [-40, 0]
		}
	};

	Plotly.newPlot('myChart', data, layout);
}
