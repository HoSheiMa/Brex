// list = function () {
//   this.state = {
//     ...this.state,
//   }
//   return View({
//     children : [
//       function () {
//         console.log(this.state.items())
//         var ItemsList = (this.state.items()) // ! should fix
//         console.log(ItemsList)
//         var ItemsRender = [];
//         for (var i in ItemsList) {
//           ItemsRender.push(
//             Child({
//               type : 'li',
//               text : ItemsList[i],
//             })
//           )
//         }
//         return [
//           Child( {
//             type : 'ul',
//             children : ItemsRender
//           },true)
//         ]
//       }
//     ]
//   })
// }
// new Rex(Component(function () {
//   this.state = {
//     ...this.state,
//     items: [],
//     text: '',
//     disabled: true,
//   }
//   return View({
//     children: [
//       Child({
//         type : 'h1',
//         text: 'Put a List!',
//       }),
//       function () {
//         return [
//           (Import(list, {
//           items: this.state.items(),
//         }))
//         ]
//       },
//       Child({ type : 'br'}),
//       Child({
//         type : 'input',
//         events: {
//           keydown : function () {
//             var lastKey = this.nativeEvent.key;
//             var val = this.nativeEvent.target.value + lastKey;
//             console.log('keydown', val)
//             this.setState({
//               text: val,
//               disabled: false,
//             });
//         }
//       }
//       }),
//       function () {
//         var attrs = this.state.disabled() == true ? {
//           disabled: ''
//         } : {}
//         return Container({
//             children: [
//               Child({
//                 text: 'Add ',
//                 type : 'button',
//                 attrs: attrs,
//                 children: [
//                   function () { 
//                     // console.log(this.state.items())
//                     var len = (this.state.items()).length;
//                     return [
//                       '#' + len
//                     ]
//                   }
//                 ],
//                 events: {
//                   click : function () {
//                     var Items = this.state.items;
//                     var text = this.state.text;
//                     console.log('clicked', Items, text, this.state);
//                     Items.push(text);
//                     this.setState({
//                       items: Items,
//                     })
//                   }
//                 }
//               })
//             ]
//           }).context
     
//     }


//     ]    
//   })
// }));
var ExComp = function () {
  this.state = {
    ...this.state,
  }
  return View({
    children: [
      Child({
        text: 'Hello world, from excomp!'
      })
    ]
  })
}

new Rex(Component(
  function () {
    this.state = {
      ...this.state,
      reload:  false,
      Words: [
        'Hello',
        'World!',
      ]
    }
    return View({
      children: [
        Component(ExComp),
      ]
    })
  }
))