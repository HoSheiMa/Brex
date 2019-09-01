// itemsC = function() {
//   // external Component
//   return View({
//     children: [
//       Child({
//         type: "ul",
//         children: [
//           ...this.state.items.map((v, i) =>
//             Child({
//               type: "li",
//               text: v
//             })
//           )
//         ]
//       })
//     ]
//   });
// };
// inputC = function() {
//   // external Component
//   return View({
//     children: [
//       Child({
//         type: "input",
//         attrs: {
//           value: this.state.text,
//           autofocus: ""
//         },
//         events: {
//           blur: function() {
//             console.log("changed");
//             var el = this.nativeEvent.target;
//             var value = el.value;
//             // [*] forced set value
//             // [*] this style of set value is use a native or a core of state and set | get in a core of app state
//             // [!] be careful with set|remove|rewrite value to not make a error in core.js
//             console.log(value);
//             // this.state.SetText(value);
//           }
//         }
//       })
//     ]
//   });
// };

// buttonC = function() {
//   // external Component
//   return View({
//     children: [
//       Child({
//         type: "button",
//         text: "Add",
//         events: {
//           click: function() {
//             console.log("clicked");
//             var items = this.state.items;
//             items.push(this.state.text);
//             // this.setState({
//             //   items: items,
//             //   text: ""
//             // });
//             this.state.SetItems(items);
//             this.state.SetText("");
//           }
//         }
//       })
//     ]
//   });
// };
// new Rex( // Root
//   Component(function() {
//     // Root Component
//     this.state = {
//       ...this.state, // recv { AppID: ...}
//       items: ["item 1"],
//       text: "item 2",
//       Root: true,
//       SetItems: v => this.setState({ items: v }),
//       SetText: v => this.setState({ text: v })
//     };
//     return View({
//       children: [
//         Child({
//           attrs: {
//             style: "padding: 20px"
//           },
//           children: [
//             Child({
//               type: "H1",
//               text: "TODO"
//             }),
//             Component(itemsC, { items: this.state.items }), // Include External Component
//             Child({
//               type: "H4",
//               text: "What needs to be done?"
//             }),
//             Component(inputC, {
//               text: this.state.text,
//               SetText: this.state.SetText
//             }), // Include External Component
//             Component(buttonC, {
//               items: this.state.items,
//               SetItems: this.state.SetItems,
//               SetText: this.state.SetText,
//               text: this.state.text
//             }) // Include External Component
//           ]
//         })
//       ]
//     });
//   })
// );

x = function() {
  return View({
    children: [
      Child({
        text: "x"
      })
    ]
  });
};

Rex(
  Component(function() {
    this.state = {
      ...this.state,
      name: "Eslam"
    };
    return View({
      children: [
        Component(x),
        Child({
          text: "Hello " + this.state.name,
          events: {
            click: function() {
              this.setState({
                name: "Qandil"
              });
            }
          }
        })
      ]
    });
  })
);
