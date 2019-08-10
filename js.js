
new Rex(
  Component(function() {
    this.state = {
      ...this.state, // !important
      seconds: 0,
    };
    return View({
      children: [
        function () {
          console.log(this)
          // in this version we don't add yet a function bind with elements like {
            // componentWillMount
            // componentDidMount
          // }
          // but you can use function child style
          // to use a same style like componentWillMount functuin without exist it in version
          // and this works perfect ! :D 
          window.newSecondsValue = this.state.seconds; // set for global 
          setInterval(() =>  {  // set timer
            newSecondsValue++; // add one
            console.log('Hello wrold', this, newSecondsValue)
            this.setState({ // set state new value
            seconds: newSecondsValue,
          }) }, 1000); // call this function each one secound
          return [Child({ // return normal child with a compile
            text : 'seconds: {{$seconds}}',
          }, true),];
        }
      ]
    });
  }));