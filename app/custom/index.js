import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
// import ColorMenuProvider from './ColorMenuProvider';

export default {
  //customContextPad
  __init__: [ 'customPalette', 'customRenderer' ],
  __init__: [ 'customContextPad', 'customRenderer' ],
  // __init__: [ 'customColorMenu', 'customRenderer' ],

  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  // customColorMenu: ['type',ColorMenuProvider]

//  __init__: [ 'customPalette' , 'customRenderer'],
//customPalette: [ 'type', CustomPalette ],
//customRenderer: [ 'type', CustomRenderer ]
};

