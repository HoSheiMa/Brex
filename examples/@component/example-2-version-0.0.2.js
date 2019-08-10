xComp = function() { // create a  function iclude component style!
    this.state = {
      ...this.state, // receive a init virable or static state and this is require to not see any error
      x: "Hello wrold from state Xcomponent" // normal virable
    };
    return View({ // view class
      children: [ // list children
        Child({
          // between virable and other put "{{&&}}" to tell compile this split world and neet to checking and 
          // comiple too :D 
          text: "hello {{$AppID}} {{&&}} {{$y}}" // compile will replace a $Appid && $y to a real state value
        }),
      ]
    });
  }
  new Rex( // main class
    Component(function() { // create a  function iclude component style!
      this.state = {
        x: "Hello wrold from state component"
      };
      return View({ // view class
        children: [
          function () {
            // debugger
            console.log('this', this) // this = { state : {x : "..."}, AppID : '...'}
            // cr = Rex.prototype.registration(c.appID, c.objState, c.app);
            return [
              'Hello world', // normal text
              (Component(xComp,  {y : 'yyyy'})).app, // import component "xComp" with y : 'yyyy'
              // y will insert to state not to props :D
              // maybe change this from state list to props list in future versions
              Child({text: 'ds',}, true) // normal child | static style child
              // !important => when use normal Child in ( function style return child ) set args[1] = true like prav line
            ];
          },
          Child({ // normal child
            text: "Hello world {{$AppID}}" // text or html
          }),
        ]
      });
    })
  );
  
  
  