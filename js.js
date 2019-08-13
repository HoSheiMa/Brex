list = function () {
  this.state = {
    ...this.state,
  }
  return View({
    children : [
      function () {
        console.log(this.state.items())
        var ItemsList = (this.state.items()) // ! should fix
        console.log(ItemsList)
        var ItemsRender = [];
        for (var i in ItemsList) {
          ItemsRender.push(
            Child({
              type : 'li',
              text : ItemsList[i],
            })
          )
        }
        return [
          Child( {
            type : 'ul',
            children : ItemsRender
          },true)
        ]
      }
    ]
  })
}
new Rex(Component(function () {
  this.state = {
    ...this.state,
    items: [],
    text: '',
    disabled: true,
  }
  return View({
    children: [
      Child({
        type : 'h1',
        text: 'Put a List!',
        input: null,
      }),
      function () {
        return [
          (Component(list, {
          items: this.state.items(),
        })).app
        ]
      },
      Child({ type : 'br'}),
      Child({
        type : 'input',
        attrs: {
          value : '{{$text}}',
        },
        events: {
          keydown : function () {
            var lastKey = this.nativeEvent.key;
            var val = this.nativeEvent.target.value + lastKey;
            this.setState({
              text: val,
              input: this.nativeEvent,
              disabled: false,
            });
        }
      }
      }),
      function () {
        var attrs = this.state.disabled() == true ? {
          disabled: ''
        } : {}
        return [
          Child({
            text: '',
            type : 'button',
            attrs: attrs,
            children: [
              function () {
                // console.log(this.state.items())
                var len = (this.state.items()).length;
                return [
                  'Add #' + len
                ]
              }
            ],
            events: {
              click : function () {
                var Items = this.state.items;
                var text = this.state.text;
                Items.push(text);
                this.setState({
                  items: Items,
                })
              }
            }
          }, true)
     ]
    }


    ]    
  })
}));

// new Rex(Component(
//   function () {
//     this.state = {
//       ...this.state,
//       x : '',
//       y: 1,
//     }
//     return View({
//       children: [

//         Child({
//           text: '1111 {{$AppID}}'
//         }),
//         Child({
//           text: 'asdasdhjkas {{$y}}',
//         }),
//         function () {
//           return [
//             Child({
//               text: '{{$y}}',
//             }, true),
            
//           ]
//         } 
//           ]
//     })
//   }
// ))