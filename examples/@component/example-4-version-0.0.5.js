// @component 0.0.5
// core.js 0.0.4
// @Global 0.0.1
itemsC = function() {
  this.state = {
    ...this.state,
    items: Global.get("items") // get items from global state
  };
  // external Component
  return View({
    children: [
      Child({
        type: "ul",
        children: [
          ...this.state.items.map((v, i) =>
            Child({
              type: "li",
              text: v
            })
          )
        ]
      })
    ]
  });
};
inputC = function() {
  // external Component
  return View({
    children: [
      Child({
        type: "input",
        attrs: {
          value: Global.get("text"),
          autofocus: ""
        },
        events: {
          blur: function() {
            console.log("blur");
            var el = this.nativeEvent.target;
            var value = el.value;
            // [*] forced set value
            // [*] this style of set value is use a native or a core of state and set | get in a core of app state
            // [!] be careful with set|remove|rewrite value to not make a error in core.js
            Global.set("text", value);
          }
        }
      })
    ]
  });
};

buttonC = function() {
  // external Component
  return View({
    children: [
      Child({
        type: "button",
        text: "Add",
        events: {
          click: function() {
            console.log("clicked");
            var items = Global.get("items"); // items;
            console.log(items);
            items.push(Global.get("text"));
            Global.set("items", items); // set the new item
            Global.set("text", ""); // set as null | reset to null

            Global.get("setStateRoot")(); // rebuild all component
          }
        }
      })
    ]
  });
};
new Rex( // Root
  Component(function() {
    // Root Component

    this.state = {
      ...this.state, // recv { AppID: ...}
      Root: true,
      setStateRoot: () => this.setState({})
    };
    this.componentWillMount = () => {
      console.log("componentWillMount", this);
    };

    this.componentDidMount = () => {
      console.log("componentDidMount", this);
    };
    this.shouldComponentUpdate = () => {
      console.log("shouldComponentUpdate", this);
      return true;
    };

    this.componentWillUpdate = () => {
      console.log("componentWillUpdate", this);
    };

    this.componentDidUpdate = () => {
      console.log("componentDidUpdate", this);
    };

    // constructor | Before Call View Function;
    if (!Object.isFrozen(this)) {
      Global.set("items", ["item 1"]); // set as global
      Global.set("text", "item 2"); // set as global
      Global.set("setStateRoot", this.state.setStateRoot); // set as global
    }

    return View({
      children: [
        Child({
          attrs: {
            style: "padding: 20px"
          },
          children: [
            Child({
              type: "H1",
              text: "TODO"
            }),
            Component(itemsC), // Include External Component
            Child({
              type: "H4",
              text: "What needs to be done?"
            }),
            Component(inputC), // Include External Component
            Component(buttonC) // Include External Component
          ]
        })
      ]
    });
  })
);
