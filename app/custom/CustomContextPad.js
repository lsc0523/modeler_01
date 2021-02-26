export default class CustomContextPad {
  constructor(config, contextPad, create, elementFactory, injector, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      create,
      elementFactory,
      translate
    } = this;

    function appendServiceTask(event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
  
        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendTest(event, element) {
      if (autoPlace) {

        //컬러피커 이벤트 추가

        const Testshape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
  
        autoPlace.append(element, Testshape);
      } else {
        appendTestTaskStart(event, element);
      }
    }




    function appendServiceTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });  
      create.start(event, shape, element);
       }


    function appendTestTaskStart(event) {
      const Testshape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });  
      create.start(event, Testshape, element);
    }


    return {
      'append.service-task': {
        group: 'model',
        className: 'bpmn-icon-service-task',
        title: translate('Append TextAnnotation'),
        action: {
          click: appendServiceTask,
          dragstart: appendServiceTaskStart
        }
      },

      'append.test-task': {
        group: 'model',
        className: 'bpmn-icon-test-task',
        title: translate('Color Piker'),
        action: {
          click: appendTest,
          dragstart: appendTestTaskStart
        }
      }
    };
  }
}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
];