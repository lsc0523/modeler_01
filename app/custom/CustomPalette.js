
export default class CustomPalette {
  constructor(create, elementFactory, palette, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      create,
      elementFactory,
      translate
    } = this;

    function createTextTask(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:TextAnnotation' });

      create.start(event, shape);
    }


    function createUserTask(evnet){

      const textShape = elementFactory.createShape({ type :  'bpmn:UserTask' } );

      create.start(event, textShape);
    }

    return {
      
      'create.service-task': {
        group: 'activity',
        className: 'bpmn-icon-text-annotation',
        title: translate('Create TextAnnotation'),
        action: {
          dragstart: createTextTask,
          click: createTextTask
        }
      }
      ,

      'create.dotted-task' : {
        group: 'activity',
        className: 'bpmn-icon-user-task',
        title: translate('Create UserTask'),
        action: {
          dragstart: createUserTask,
          click: createUserTask
        }
      }
    }
  }
}

CustomPalette.$inject = [
  'create',
  'elementFactory',
  'palette',
  'translate'
];
