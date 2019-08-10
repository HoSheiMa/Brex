
new Rex(
    Component(function() { // create a  function iclude component style!
      this.state = { 
        ...this.state, // receive a init virable or static state and this is require to not see any error
        click: 0, // can use this click by type in text: '{{$click}}'
      };
      return View({ // view class 
        children: [ // children list
          Child({ // normal child | static child
            // type: '', 
            // you can select a type but will break a default style
            // and if you wanna to use a state virable in innerText or innerHTML on element
            // you should insert this virable in <code></code> element or using child function and select a type: code
            // and put a virable or text inner it 
            attrs: { // attrs of html element will be insert
              clickValue: "click {{$click}}" // for attr
            },
            text : 'click {{$click}}', // text | html
            events: { // events like {click, mousemove, ...etc}
              click:  function () {
                // onclick do fn
                // you can use this.setState function to replace a old value to new one
                var newClickValue = this.state.click + 1;
                this.setState({
                  click: newClickValue,
                })
              }
            }
          }),
        ]
      });
    }));