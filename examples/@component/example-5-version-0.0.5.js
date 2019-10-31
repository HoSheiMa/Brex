// Simple for more smile :D
// support core.js-0.0.4.js
// support @component.js-0.0.5.js
// ex-date: 24-10-2019 : update 26-10-2019
Rex(
  Component(function() {
    this.componentWillMount = () => {
      this.state = {
        // ? you can set a init state here or out side
        ...this.state,
        color: "red"
      };
    };

    setTimeout(() => {
      this.setState({});
    }, 1000); // ? create loop for every one secound will change a colors

    var WORD = "HELLOWORLD!".split("");

    var random = () => {
      return Math.floor(Math.random() * 255 - WORD.length * 12); // ? we minus word.length * 12 because don't make random over than max number(255)
    };

    var bgred = random();

    var bggreen = random();

    var bgblue = random();

    var Cover = createNativeElement({
      attrs: {
        style: `
            display: flex;
            flex: 1;
            transition: 0.8s;
            width: 100vw;
            height: 100vh;
            justify-content: center;
            align-items: center;
          `
      }
    });

    return View({
      children: [
        Cover({
          children: [
            ...WORD.map((v, i) => {
              bgred = bgred + 12;
              bggreen = bggreen + 12;
              bgblue = bgblue + 12;

              return Child({
                text: v,
                type: "span",
                attrs: {
                  style:
                    `
                    transition: 0.6s;                    
                    background-color: 
                     rgb(${bgred}, ${bggreen}, ${bgblue});` +
                    "color: #fff;" +
                    "text-shadow: 2px 2px 8px #000;" +
                    "font-size: 46px;" +
                    "padding: 8px;"
                }
              });
            })
          ]
        })
      ]
    });
  })
);
