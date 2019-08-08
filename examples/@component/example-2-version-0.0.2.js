
new Rex(
    Component(function() {
      this.state = {
        ...this.state,
        click: 0,
      };
      return View({
        children: [
          Child({
            // type: '', 
            // you can select a type but will break a default style
            // and if you wanna to use a state virable in innerText or innerHTML on element
            // you should insert this virable in <code></code> element or using child function and select a type: code
            // and put a virable or text inner it 
            attrs: {
              clickValue: "click {{$click}}" // for attr
            },
            text : 'click {{$click}}',
            events: {
              click:  function () {
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