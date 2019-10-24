// Simple for more smile :D
// support core.js-0.0.4.js
// support @component.js-0.0.5.js
// ex-date: 24-10-2019
Rex(
  Component(function() {
    this.componentWillMount = () => {
      this.state = {
        // ? you can set a init state here or out side
        ...this.state,
        color: "red"
      };
    };

    var WORD = "HELLO WORLD!".split("");

    var Cover = function(props) {
      // ? create own type of child name by default we using child() function but you can make you one
      return {
        type: "child-style",
        child: props
      };
    };

    var random = () => {
      return Math.floor(Math.random() * 255);
    };

    var red = random();

    var green = random();

    var blue = random();

    return View({
      children: [
        Cover({
          children: [
            ...WORD.map((v, i) => {
              return Child({
                text: v,
                type: "span",
                attrs: {
                  style:
                    // ? rgba(red, green, blue, [1] => DefaultValueOfopacity / i => index + 1) -> index start with [0] and (1 / 0) => infinte, should add one to fix problem
                    `background-color: 
                       rgba(${red}, ${green}, ${blue}, ${1 / (i + 1)});` +
                    "font-size: 46px;"
                }
              });
            })
          ]
        })
      ]
    });
  })
);
