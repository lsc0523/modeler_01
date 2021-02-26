import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';

export default {
//  __init__: [ 'customContextPad', 'customPalette', 'customRenderer' ],
//  customContextPad: [ 'type', CustomContextPad ],
//  customPalette: [ 'type', CustomPalette ],
//  customRenderer: [ 'type', CustomRenderer ]

  __init__: [ 'customContextPad','customPalette' , 'customRenderer' ],
customPalette: [ 'type', CustomPalette ],
customRenderer: [ 'type', CustomRenderer ],
customContextPad: [ 'type', CustomContextPad ]
};

