export function drawChain6(n, R1, R2) {
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
	var L1 = createRectangle(130, 10, 40, 20, 'L1');
	var L2 = createRectangle(210, 10, 40, 20, 'L2');
	var L3 = createRectangle(300, 10, 40, 20, 'L3');

	var C1 = createRectangle(105, 65, 20, 40, 'C1');
	var C2 = createRectangle(180, 65, 20, 40, 'C2');
	var C3 = createRectangle(265, 65, 20, 40, 'C3');
	
	var Rin = createRectangle(50, 10, 40, 20, 'Rin');
	var Rout = createRectangle(355, 65, 30, 40, 'Rout');
	
	var hiddenCircleUp1 = createCircle(30, 20);
	var hiddenCircleUp2 = createCircle(115, 20);
	var hiddenCircleUp3 = createCircle(190, 20);
	var hiddenCircleUp4 = createCircle(275, 20);
	var hiddenCircleUp5 = createCircle(370, 20);
	var hiddenCircleDown1 = createCircle(30, 150);
	var hiddenCircleDown2 = createCircle(115, 150);
	var hiddenCircleDown3 = createCircle(190, 150);
	var hiddenCircleDown4 = createCircle(275, 150);
	var hiddenCircleDown5 = createCircle(370, 150);

	var link = createLink(hiddenCircleDown5, Rout);

	var link = createLink(hiddenCircleDown5, hiddenCircleDown4);

	var link = createLink(hiddenCircleUp5, Rout);

	var link = createLink(L3, hiddenCircleUp5);

	var link = createLink(hiddenCircleUp4, L3);

	var link = createLink(hiddenCircleDown3, hiddenCircleDown4);

	var link = createLink(C3, hiddenCircleDown4);

	var link = createLink(C3, hiddenCircleUp4);

	var link = createLink(L2, hiddenCircleUp4);

	var link = createLink(hiddenCircleUp3, L2);

	var link = createLink(hiddenCircleDown1, hiddenCircleDown2);

	var link = createLink(hiddenCircleDown2, C1);

	var link = createLink(hiddenCircleDown2, hiddenCircleDown3);

	var link = createLink(C2, hiddenCircleDown3);

	var link = createLink(battery, hiddenCircleUp1);

	var link = createLink(battery, hiddenCircleDown1);

	var link = createLink(hiddenCircleUp3, C2);

	var link = createLink(hiddenCircleUp2, C1);

	var link = createLink(hiddenCircleUp1, Rin);
	
	var link = createLink(Rin, hiddenCircleUp2);
	
	var link = createLink(hiddenCircleUp2, L1);

	var link = createLink(L1, hiddenCircleUp3);
}