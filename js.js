// Simple for more smile :D
// support core.js-0.0.4.js
// support @component.js-0.0.6.js
// ex-date: 30-10-2019

var Main = function() {
  /**
   * ? You can use a new *React Hooks*
   * ! be careful with using it with some functions call auto with component call
   * ! because component function a @component library Call it two time
   * ! and this will make some problem with dirct use.
   * ! use can using it after Component function return
   * * like [ element:events, [componentDidMount] ]
   * ? maybe in future you can using it dirctly!
   */
  [x, setX] = this.useState(0);

  var redText = createNativeElement({
    attrs: {
      style: "color:red;"
    }
  });
  return View({
    children: [
      // children :D
      redText({
        text: "Hello world x: " + x,
        events: {
          click: function() {
            console.log(x + 1);
            setX(x + 1);
          }
        }
      })
    ]
  });
};

Brex(Component(Main)); // init main point to start from it.
