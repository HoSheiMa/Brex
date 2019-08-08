xComp = function() {
    this.state = {
      ...this.state,
      x: "Hello wrold from state Xcomponent"
    };
    return View({
      children: [
        Child({
          text: "hello {{$AppID}} {{&&}} {{$y}}"
        }),
      ]
    });
  }
  new Rex(
    Component(function() {
      this.state = {
        x: "Hello wrold from state component"
      };
      return View({
        children: [
          function () {
            // debugger
            console.log('this', this)
            // cr = Rex.prototype.registration(c.appID, c.objState, c.app);
            return ['Hello world', (Component(xComp,  {y : 'yyyy'})).app , Child({text: 'ds',}, true)];
          },
          Child({
            text: "Hello world {{$AppID}}"
          }),
        ]
      });
    })
  );
  
  
  