export function drawChain9(n, R1, R2) {
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

	var hiddenCircleUp1 = createCircle(30, 20);
	var hiddenCircleDown1 = createCircle(30, 150);

	var Rin = createRectangle(50, 10, 40, 20, 'Rin');

	if(N == 9 && r1 > r2){
		var L1 = createRectangle(130, 10, 40, 20, 'L1');
		var L2 = createRectangle(210, 10, 40, 20, 'L2');
		var L3 = createRectangle(285, 10, 40, 20, 'L3');
		var L4 = createRectangle(355, 10, 40, 20, 'L4');
		

		var C1 = createRectangle(105, 65, 20, 40, 'C1');
		var C2 = createRectangle(180, 65, 20, 40, 'C2');
		var C3 = createRectangle(260, 65, 20, 40, 'C3');
		var C4 = createRectangle(330, 65, 20, 40, 'C4');
		var C5 = createRectangle(400, 65, 20, 40, 'C5');

		var Rout = createRectangle(465, 65, 30, 40, 'Rout');
		
		var hiddenCircleUp2 = createCircle(115, 20);
		var hiddenCircleUp3 = createCircle(190, 20);
		var hiddenCircleUp4 = createCircle(270, 20);
		var hiddenCircleUp5 = createCircle(340, 20);
		var hiddenCircleUp6 = createCircle(410, 20);
		var hiddenCircleUp7 = createCircle(480, 20);
		var hiddenCircleDown2 = createCircle(115, 150);
		var hiddenCircleDown3 = createCircle(190, 150);
		var hiddenCircleDown4 = createCircle(270, 150);
		var hiddenCircleDown5 = createCircle(340, 150);
		var hiddenCircleDown6 = createCircle(410, 150);
		var hiddenCircleDown7 = createCircle(480, 150);

		var link = createLink(Rout, hiddenCircleUp7);

		var link = createLink(Rout, hiddenCircleDown7);

		var link = createLink(hiddenCircleDown6, hiddenCircleDown7);

		var link = createLink(hiddenCircleUp6, hiddenCircleUp7);

		var link = createLink(hiddenCircleUp6, L4);

		var link = createLink(hiddenCircleUp5, L4);

		var link = createLink(hiddenCircleDown5, hiddenCircleDown6);

		var link = createLink(C5, hiddenCircleDown6);

		var link = createLink(C5, hiddenCircleUp6);

		var link = createLink(L3, hiddenCircleUp5);

		var link = createLink(hiddenCircleUp4, L3);

		var link = createLink(hiddenCircleDown4, hiddenCircleDown5);

		var link = createLink(hiddenCircleDown5, C4);

		var link = createLink(hiddenCircleUp5, C4);

		var link = createLink(L2, hiddenCircleUp4);

		var link = createLink(hiddenCircleUp3, L2);
		
		var link = createLink(C3, hiddenCircleDown4);

		var link = createLink(hiddenCircleDown3, hiddenCircleDown4);
		
		var link = createLink(hiddenCircleUp4, C3);

		var link = createLink(Rin, hiddenCircleUp2);
		
		var link = createLink(hiddenCircleUp2, C1);

		var link = createLink(hiddenCircleUp2, L1);

		var link = createLink(hiddenCircleUp3, C2);

		var link = createLink(L1, hiddenCircleUp3);

		var link = createLink(hiddenCircleDown1, hiddenCircleDown2);

		var link = createLink(hiddenCircleDown2, hiddenCircleDown3);

		var link = createLink(C1, hiddenCircleDown2);

		var link = createLink(C2, hiddenCircleDown3);
	} else if(N == 9 && r2 >= r1){

		var L1 = createRectangle(110, 10, 40, 20, 'L1');
		var L2 = createRectangle(190, 10, 40, 20, 'L2');
		var L3 = createRectangle(270, 10, 40, 20, 'L3');
		var L4 = createRectangle(350, 10, 40, 20, 'L4');
		var L5 = createRectangle(440, 10, 40, 20, 'L5');

		var C1 = createRectangle(160, 65, 20, 40, 'C1');
		var C2 = createRectangle(240, 65, 20, 40, 'C2');
		var C3 = createRectangle(320, 65, 20, 40, 'C3');
		var C4 = createRectangle(405, 65, 20, 40, 'C4');

		var Rout = createRectangle(490, 65, 30, 40, 'Rout');

		var hiddenCircleUp2 = createCircle(170, 20);
		var hiddenCircleUp3 = createCircle(250, 20);
		var hiddenCircleUp4 = createCircle(330, 20);
		var hiddenCircleUp5 = createCircle(415, 20);
		var hiddenCircleUp6 = createCircle(505, 20);
		var hiddenCircleDown2 = createCircle(170, 150);
		var hiddenCircleDown3 = createCircle(250, 150);
		var hiddenCircleDown4 = createCircle(330, 150);
		var hiddenCircleDown5 = createCircle(415, 150);
		var hiddenCircleDown6 = createCircle(505, 150);

		var link = createLink(hiddenCircleUp6, Rout);

		var link = createLink(hiddenCircleDown6, Rout);

		var link = createLink(hiddenCircleDown5, hiddenCircleDown6);

		var link = createLink(hiddenCircleUp6, L5);

		var link = createLink(hiddenCircleUp5, L5);

		var link = createLink(hiddenCircleDown5, C4);

		var link = createLink(hiddenCircleDown4, hiddenCircleDown5);

		var link = createLink(hiddenCircleUp5, C4);

		var link = createLink(L4, hiddenCircleUp5);

		var link = createLink(hiddenCircleUp4, L4);

		var link = createLink(C3, hiddenCircleDown4);

		var link = createLink(hiddenCircleDown3, hiddenCircleDown4);

		var link = createLink(hiddenCircleUp4, C3);

		var link = createLink(L3, hiddenCircleUp4);

		var link = createLink(hiddenCircleUp3, L3);
		
		var link = createLink(Rin, L1);

		var link = createLink(L1, hiddenCircleUp2);

		var link = createLink(hiddenCircleUp2, C1);

		var link = createLink(C1, hiddenCircleDown2);

		var link = createLink(hiddenCircleDown1, hiddenCircleDown2);

		var link = createLink(hiddenCircleUp2, L2);

		var link = createLink(hiddenCircleUp3, L2);

		var link = createLink(hiddenCircleUp3, C2);

		var link = createLink(hiddenCircleDown2, hiddenCircleDown3);

		var link = createLink(hiddenCircleDown3, C2);
	}

	var link = createLink(battery, hiddenCircleUp1)

	var link = createLink(battery, hiddenCircleDown1);

	var link = createLink(hiddenCircleUp1, Rin);
}