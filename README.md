# Hello in Brex world

A JavaScript library for building user interfaces with easy ***syntax*** system and esay controll each widget in each component and Design simple views for each state in your application.

- **Fast and Lite.** lite library to help you to create a **Complex UI** with simple ways.
- **Tools.** give you more library & methods helping you create all you want.
- **Easy Style.** using **React** *style component* with *methods* & **Flutter** *Widget style* with *fast readable system*
- **Easy Control** all things in component is a widget

## Simple Example

- Without Hooks

```javascript
 Brex(Component(function() {

  this.state = {
    ...this.state,
    name: 'HoSheiMa',
  }

   return View({
     children: [
       Child({
         text: 'Hello ' + this.state.name
       })
    ]
})
```

- With Hooks (Beta)

```javascript
 Brex(Component(function() {

   [name, setName] = this.useState('HoSheiMa'); 

   return View({
     children: [
       Child({
         text: 'Hello ' + name
       })
    ]
})
```

- Advance Example

```javascript
var Main = function() {
  
  /**
   * // without Hooks
   * this.state = {
   *  ..this.state,
   *  x: 0,
   * }
  */

  // with Hooks
  [x, setX] = this.useState(0);

  var redText = createNativeElement({
    attrs: {
      style: "color:red;"
    }
  }); // ? Create a custom child using createNativeElement function
  
  return View({
    children: [
      // children :D
      redText({
        text: "Hello world x: " + x,
        events: {
          click: function() {
            /**
              * // without Hooks
              * this.setState({
              *  x: x + 1,
              * })
            */

            // with Hooks
            setX(x + 1); 
          }
        }
      })
    ]
  });
};

Brex(Component(Main)); // init main point to start from it.
```

for more example visit [Full example section.](/examples/@component) with lastest version.