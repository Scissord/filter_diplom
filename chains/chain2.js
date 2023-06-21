export function drawChain2(n, R1, R2) {
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

	var hiddenCircleUp = createCircle(30, 20);

	var hiddenCircleDown = createCircle(30, 150);

	var Rin = createRectangle(50, 10, 40, 20, 'Rin');

	var hiddenCircleMiddle = createCircle(115, 20);

	//var L1 = createRectangle(130, 10, 40, 20, 'L1');
	var L1 = createCoil(130, 5, 145, 5, 160, 5);

	var hiddenCircleL1Start = createCircle(130, 20);
	var hiddenCircleL1End = createCircle(175, 20);
	var hiddenCircleUpRight = createCircle(190, 20);

	//var capacitor = createRectangle(105, 65, 20, 40, 'C1');
	var capacitor = createCapacitor(105, 65, 20, 10);

	var Rout = createRectangle(175, 65, 30, 40, 'Rout');

	var hiddenCircleDownRight = createCircle(190, 150);

	var hiddenCircleDownMiddle = createCircle(115, 150);

	var link = createLink(hiddenCircleL1Start, hiddenCircleMiddle);

	var link = createLink(hiddenCircleL1End, hiddenCircleUpRight);

	var link = createLink(hiddenCircleDown, hiddenCircleDownMiddle);

	var link = createLink(hiddenCircleDownMiddle, capacitor);

	var link = createLink(hiddenCircleDownMiddle, hiddenCircleDownRight);

	var link = createLink(Rout, hiddenCircleDownRight);

	var link = createLink(battery, hiddenCircleUp);

	var link = createLink(battery, hiddenCircleDown);

	var link = createLink(hiddenCircleUpRight, Rout);

	var link = createLink(hiddenCircleMiddle, capacitor);

	var link = createLink(hiddenCircleUp, Rin);
	
	var link = createLink(Rin, hiddenCircleMiddle);
}