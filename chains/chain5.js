export function drawChain5(n, R1, R2) {
	const N = Number.parseFloat(n);
	const r1 = Number.parseFloat(R1);
	const r2 = Number.parseFloat(R2);

	var namespace = joint.shapes;
                
	var graph = new joint.dia.Graph({}, { cellNamespace: namespace });

	var paper = new joint.dia.Paper({
		el: document.getElementById('myChain'),
		model: graph,
		width: 800,
		height: 200,
		gridSize: 1,
		cellViewNamespace: namespace
	});

	var battery = new joint.shapes.standard.Circle();
	battery.position(5, 60);
	battery.resize(50, 50);
	battery.attr({
		body: {
			fill: 'white',
			stroke: 'black',
		},
		label: {
			text: 'Battery',
			'font-size': 14
		},
	});
	battery.addTo(graph);

	const createCircle = (x, y) => {
    const circle = new joint.shapes.standard.Circle();
    circle.position(x, y);
    circle.resize(1, 1);
    circle.attr({
      body: {
        fill: 'white',
        stroke: 'black',
        display: 'none'
      },
    });
    circle.addTo(graph);
    return circle;
  };

	const createRectangle = (x, y, w, h, label) => {
    const rectangle = new joint.shapes.standard.Rectangle();
    rectangle.position(x, y);
    rectangle.resize(w, h);
    rectangle.attr({
      body: {
        fill: 'white'
      },
      label: {
        text: label,
        fill: 'black'
      }
    });
    rectangle.addTo(graph);
    return rectangle;
  };

	const createLink = (el1, el2) => {
		const link = new joint.shapes.standard.Link();
		link.source(el1);
		link.target(el2);
		link.attr({
			line: {
				stroke: 'black',
				'stroke-width': 2,
				targetMarker: {
					'type': 'path',
					'd': '',
				}
			}
		});
		link.addTo(graph);
		return link;
	}

	const createCapacitor = (x, y, w, h) => {
		const capacitor = new joint.shapes.basic.Path({
			markup:
				'<g class="rotatable"><g class="scalable"><path class="body"/></g><text class="label"/></g>',
			size: { width: w, height: h },
			position: { x, y },
			attrs: {
				'.body': {
					d: `M0,${h / 2} L${w}, ${h / 2} M0,${h / 4} L${w},${h / 4}	`,
					fill: 'transparent',
					stroke: 'black',
					'stroke-width': 0.5,
				},
			},
		});
	
		capacitor.addTo(graph);
		return capacitor;
	};

	function moveElement(element, x, y) {
		element.position(x, y);
	}
	
	// Создаем элемент Path для половины круга
	const halfCircle = (pathData) => {
		const coil = new joint.shapes.basic.Path({
			size: { width: 15, height: 15 },
			attrs: {
				path: { d: pathData },
				stroke: 'black',
			},
		});
		coil.addTo(graph);
		return coil;
	}; 

	const createCoil = (x1, y1, x2, y2, x3, y3) => {
		var firstCoil = halfCircle('M0 25 A15 15 0 0 1 50 25')
		moveElement(firstCoil, x1, y1)
		var secondCoil = halfCircle('M0 25 A15 15 0 0 1 50 25')
		moveElement(secondCoil, x2, y2)
		var thirdCoil = halfCircle('M0 25 A15 15 0 0 1 50 25')
		moveElement(thirdCoil, x3, y3)
	}

	var hiddenCircleUp1 = createCircle(30, 20);
	var hiddenCircleDown1 = createCircle(30, 150);

	var Rin = createRectangle(50, 10, 40, 20, 'Rin');

	if(N == 5 && r1 > r2){

		var hiddenCircleL1Start = createCircle(130, 20);
		var hiddenCircleL1End = createCircle(175, 20);

		var hiddenCircleL2Start = createCircle(210, 20);
		var hiddenCircleL2End = createCircle(255, 20);

		var L1 = createCoil(130, 5, 145, 5, 160, 5);
		var L2 = createCoil(210, 5, 225, 5, 240, 5);

		var C1 = createCapacitor(105, 65, 20, 10);
		var C2 = createCapacitor(180, 65, 20, 10);
		var C3 = createCapacitor(255, 65, 20, 10);

		var Rout = createRectangle(315, 65, 30, 40, 'Rout');

		var hiddenCircleUp2 = createCircle(115, 20);
		var hiddenCircleUp3 = createCircle(190, 20);
		var hiddenCircleUp4 = createCircle(265, 20);
		var hiddenCircleUp5 = createCircle(330, 20);
		var hiddenCircleDown2 = createCircle(115, 150);
		var hiddenCircleDown3 = createCircle(190, 150);
		var hiddenCircleDown4 = createCircle(265, 150);
		var hiddenCircleDown5 = createCircle(330, 150);

		var link = createLink(hiddenCircleUp3, hiddenCircleL2Start);

		var link = createLink(hiddenCircleUp4, hiddenCircleL2End);

		var link = createLink(hiddenCircleUp2, hiddenCircleL1Start);

		var link = createLink(hiddenCircleUp3, hiddenCircleL1End);

		var link = createLink(hiddenCircleDown4, hiddenCircleDown5);

		var link = createLink(hiddenCircleDown5, Rout);

		var link = createLink(hiddenCircleUp5, Rout);

		var link = createLink(hiddenCircleUp4, hiddenCircleUp5);
		
		var link = createLink(C3, hiddenCircleDown4);

		var link = createLink(hiddenCircleDown3, hiddenCircleDown4);
		
		var link = createLink(hiddenCircleUp4, C3);

		var link = createLink(Rin, hiddenCircleUp2);
		
		var link = createLink(hiddenCircleUp2, C1);

		var link = createLink(hiddenCircleUp3, C2);

		var link = createLink(hiddenCircleDown1, hiddenCircleDown2);

		var link = createLink(hiddenCircleDown2, hiddenCircleDown3);

		var link = createLink(C1, hiddenCircleDown2);

		var link = createLink(C2, hiddenCircleDown3);
	} else if(N == 5 && r2 >= r1){

		var hiddenCircleL1Start = createCircle(110, 20);
		var hiddenCircleL1End = createCircle(155, 20);

		var hiddenCircleL2Start = createCircle(190, 20);
		var hiddenCircleL2End = createCircle(235, 20);

		var hiddenCircleL3Start = createCircle(270, 20);
		var hiddenCircleL3End = createCircle(315, 20);

		var L1 = createCoil(110, 5, 125, 5, 140, 5);
		var L2 = createCoil(190, 5, 205, 5, 220, 5);
		var L3 = createCoil(270, 5, 285, 5, 300, 5);

		// var L2 = createRectangle(190, 10, 40, 20, 'L2');
		// var L3 = createRectangle(270, 10, 40, 20, 'L3');

		var C1 = createCapacitor(160, 65, 20, 10);
		var C2 = createCapacitor(240, 65, 20, 10);

		var Rout = createRectangle(315, 65, 30, 40, 'Rout');

		var hiddenCircleUp2 = createCircle(170, 20);
		var hiddenCircleUp3 = createCircle(250, 20);
		var hiddenCircleUp4 = createCircle(330, 20);
		var hiddenCircleDown2 = createCircle(170, 150);
		var hiddenCircleDown3 = createCircle(250, 150);
		var hiddenCircleDown4 = createCircle(330, 150);

		var link = createLink(hiddenCircleUp4, hiddenCircleL3End);

		var link = createLink(hiddenCircleUp3, hiddenCircleL3Start);

		var link = createLink(hiddenCircleL2End, hiddenCircleUp3);

		var link = createLink(hiddenCircleL2Start, hiddenCircleUp2);

		var link = createLink(hiddenCircleL1End, hiddenCircleUp2);

		var link = createLink(Rin, hiddenCircleL1Start);

		var link = createLink(Rout, hiddenCircleDown4);

		var link = createLink(hiddenCircleDown3, hiddenCircleDown4);

		var link = createLink(hiddenCircleUp4, Rout);

		var link = createLink(hiddenCircleUp2, C1);

		var link = createLink(C1, hiddenCircleDown2);

		var link = createLink(hiddenCircleDown1, hiddenCircleDown2);

		var link = createLink(hiddenCircleUp3, C2);

		var link = createLink(hiddenCircleDown2, hiddenCircleDown3);

		var link = createLink(hiddenCircleDown3, C2);
	}

	var link = createLink(battery, hiddenCircleUp1)

	var link = createLink(battery, hiddenCircleDown1);

	var link = createLink(hiddenCircleUp1, Rin);
}