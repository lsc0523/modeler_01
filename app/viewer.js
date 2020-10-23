import $ from 'jquery';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import diagramXML from '../resources/newDiagram.bpmn';

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var viewer = new BpmnViewer({
  container: canvas,
  keyboard: { bindTo: document }
 // additionalModules: [ minimapModule ]
});

$( async function() {
	var data = $("#xmlData");
	console.log(data);

	var xmlData = "";

	if(data == null || data == undefined || data == 'undefined'){
		xmlData = diagramXML;
	}
	else
	{
		xmlData = data[0].innerText;
	}

	try 
	{
		const result = await viewer.importXML(xmlData);
		const { warnings } = result;
		console.log(warnings);

	} catch (err) {
		console.log(err.message, err.warnings);
	}
  

  //zoom
  $('#zoom-reset').on('click' , function(){
    viewer.get('zoomScroll').reset();
  })

  $('#zoom-in').on('click', function(){
    viewer.get('zoomScroll').stepZoom(1);
  })

  $('#zoom-out').on('click', function(){
    viewer.get('zoomScroll').stepZoom(-1);
  })
})