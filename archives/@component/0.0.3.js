/**
 * this file is javascript component style.
 * version 0.0.3
 */
/**
 * @example
 * //short Example
 * Rax(Component(function() {
 *  
 *  this.state ={
 *    ...this.state
 *  }
 *  
 *  return View({
 *    children: [
 *      Child({
 *        text: 'Hello world!'
 *      }) 
 *    ]
 *  })
 * 
 * }))
 * @param {object} Root this will a root component 
 * @param {String} AppSeclector by default will be #root but you can select a other element to insert a root component in it!
 *  
 */
function Rex(Root, AppSeclector = '#root') {
  if (Root) {
    //  AppSeclector is #root element by default else for inject other component
    if (AppSeclector == '#root') {
      document.querySelector(AppSeclector).append(Root.app);
    }
    this.registration(Root.appID, Root.objState);
    /**
     * listUnregistraionComponents is list of apps or component created his html struction but not have a (ids list)
     * for his state and others process
     */
    // if (Root.listUnregistraionComponents.length != 0) {
    //   console.log(Root.listUnregistraionComponents);
    //   for (var i in listUnregistraionComponents) {
    //     this.registration((listUnregistraionComponents[i]).appID, (listUnregistraionComponents[i]).objState);
    //   }
    // }
  }
};

Rex.ConvertMapToHash = (map) => {
  var hash = {};
  map.forEach((v, i)=> {
    hash[i] = v;
  });
  return hash;
}
Rex.prototype.registration = (appID, objState, e) => {
  // we registration here to make code faster than old version.
  // this help to see html better pure than old.
  var e = e == undefined ? document.querySelector(`#${appID}`) : e;
  console.log(e);
  var app = App.create(e);
  var MapData = new Map();
  console.log(objState);
  for (var i in objState["state"]) {
    MapData.set(i, objState["state"][i]);
  }
  _state = app.state(MapData);

  App.building(); // for test!!!!!!!!!
};
/**
 * @example
 * //full example
 * View({
 *  children:[
 *    Child({
 *      text: 'Hello world!',
 *      attrs: {
 *       id: 'myId'
 *       },
 *      events: {
 *        click: function () {
 *           console.log(this.state);
 *           this.setState({
 *             x: 'Hello World!'
 *            })
 *         }
 *       }
 *     })
 *   ]
 * }) 
 * @param {Function} fn it's Function contein a State & View
 * @returns {object} object of props
 * @param {object} props can set a inject state to a component and recaive it by use => this.state = {...this.state, }
 */
function Component(fn, props = {}) {
  if (fn) {
    var obj = {
      state: props,// exports props from parent components add to local component state :D 2 in 1
    };
    this.console.log('obj here', props , obj)
    // creating a new component to as core working with;
    var app = document.createElement("div");

    app.setAttribute("permission", "app");

    app.setAttribute('autoAppState', 'true'); // give it a free and auto 
    
    var appID = "app_id_" + Math.floor(Math.random() * 1000);

    app.id = appID;

    Rex.InstallingFnID = appID; // this for global his compoenent id for using in other function ! i think it's bad idea
    // but it's i just way in mind now for fix this problem i think should improve this part

    var context = (fn.call(obj)).context; // return elemants array

    // listUnregistraionComponents = (fn.call(obj)).listUnregistraionComponents; // return array

    Rex.prototype.registration(appID, obj, app); // registraion for this component in app core!


    console.log(obj, context);

    for (var i in context) {
      app.appendChild(context[i]);
    }


    return {
      app: app,
      appID: appID,
      objState: obj,
      // listUnregistraionComponents: listUnregistraionComponents,
    };
  }
};
window.FnLibrary = {};
/**
 * @example
 * View({
 *  children: [
 *   function () {
 *    console.log(this.state);
 *    // you can use here a code use a native javascript code or a code style.
 *    return [
 *      Child({
 *        text: 'Hello world' + this.state.AppID// 'Hello world! {{$AppID}}'  ,
 *      },true)
 *    ] 
 *   },
 *   Child({
 *    type: 'H1',
 *    text: 'Hello world!'
 *   })
 * ]})
 * @param {object} view return a View props with Children to return to DOM 
 */
function View(view) {
  if (view) {
    if (view.children && view.children.length != 0) {
      var children = []; // return txt and will return as html
      // var listUnregistraionComponents = [];

      for (var i in view.children) {
        // debugger;
        if (!view.children[i].app && typeof view.children[i] == "object") {
          // app if exist mean is a extarnal component else it's a normal child in flow
          children.push(Child(view.children[i], true, false, null, window.Rex.InstallingFnID));
        }
        
        
        else if (view.children[i].app) {
          children.push(view.children[i].app)
          // listUnregistraionComponents.push(view.children[i]);
        }
        
        
        else if (typeof view.children[i] == "function") {
          // create id for function
          FnID = 'FnLibrary_' + Math.floor(Math.random() * 100000);
          // check if id exist or not 
          while (FnLibrary[FnID] != undefined) {
            // create new one
            FnID = 'FnLibrary_' + Math.floor(Math.random() * 100000);
          }
          // add to function library
          // this.console.log(view.children[i])
          window.FnLibrary[FnID] = view.children[i]; 
          // set as normal  child with javascript core support text
          children.push(
            Child(
              // send a child function style 
              ChildFunctionStyle(
                FnID, window.Rex.InstallingFnID, null, null, true
                ), true, false, null, window.Rex.InstallingFnID)
          );          
        }
      }
      return {
        context: children,
        // listUnregistraionComponents: listUnregistraionComponents,
      };
    }
  }
};

Rex.SetStateToFunction = /**
 * 
 * @param {object} state this is list of state virable 
 * @param {string} eIndex this is a element tree number
 * @return {Object<Function>} this will return a new copy of state but this copy to get a virable value should use as function
 * @example
 * // this will just work in child function style
 * this.state.x() // return a x value and add x to listen virable to child function style !
 */ function (state, eIndex) {
  // here we recreate a state Hash to a to hash of function 
  // if you need use state virable in function you should use like 
  // @example
  // this.state.x() // => this will return a x value;
  // and before return a value of virable will add this virable as virable in list of listenvirable for 
  // this element 
  // this is a just for #Child-Function-Style
  var NewState = {};
  for (var i in state) {
    NewState[i] = eval(`() => {
     
      var listFunctionStyle = App.IDs['${state.AppID}']['virableListenIn']['${eIndex}'];

      if (listFunctionStyle == undefined) {
        // if this element not have virableListenIn made one!
        App.IDs['${state.AppID}']['virableListenIn']['${eIndex}'] = [];
      
        listFunctionStyle = App.IDs['${state.AppID}']['virableListenIn']['${eIndex}'];
      }
      // add a state virable used by name
      // example : this.state.x() => will add x to his virableListenIn
      listFunctionStyle.push('${i}');
      
      App.IDs['${state.AppID}']['virableListenIn']['${eIndex}'] = listFunctionStyle;
      // return a value to use in function
      return '${state[i]}'
    }
    `)

  }
  return NewState;
}
Rex.RenderFunctionStyle = (functionChild) => {
  return functionChild;
};
/**
 * 
 * @param {string} FnID the function library id of thie child function style
 * @param {string} InstallingFnID 
 * @param {object} div elements child function style
 * @param {string} AppID appid
 * @param {boolean} returnObject true | false if true return props | if false return function child called[return element DOM]! 
 */
function ChildFunctionStyle(FnID, InstallingFnID, div, AppID, returnObject = false) {
  var props = {
    // call function from html to FnLibrary
    // should function return a [array] if not return a array will return error
    // !important
    // {{$Rex.this.Element.eIndex}} this string the core.js will replace it by a tree number of this element
    // this used for some process in controlling state and others.
    text: `{{js Rex.RenderFunctionStyle(window.FnLibrary['${FnID}'].call({
      setState : function (newState)  { (App.IDs['${window.Rex.InstallingFnID}']).state.setState(newState) },
      state: Rex.SetStateToFunction(Rex.ConvertMapToHash(App.IDs['${window.Rex.InstallingFnID}'].state ), '{{$Rex.this.Element.eIndex}}'), 
      AppID:'${window.Rex.InstallingFnID}',
      eIndex: '{{$Rex.this.Element.eIndex}}',
    }));}}`
  };
  if (!returnObject) {
    Child(props, true, true, div, AppID ? AppID : InstallingFnID);   
  } else {
    return props;
  }
}
/**
 * @example
 * // example under normal child or under view
 * Child({
 *  text: 'Hello world!',
 *  attrs: {
 *    id: 'myId'
 *  },
 *  events: {
 *   click: function () {
 *     console.log(this.state, this.setState);
 *     this.setState({
 *      x: 'Hello World!'
 *     })
 *   }
 * })
 * // example under a Child function Style
 * function () {
 *  console.log(this.state, this.setState);
 *  return [
 *    Child({
 *      text: 'Hello world! {{$AppID}}' // or 'Hello world!' + this.state.AppID();
 *    }, true)
 *  ];
 * }
 * 
 * @param {object} child it's a child props.
 * @param {Boolean} Indexed in Child function style should Child({text: 'Hello world'}, true)  2 args be true
 * @param {Boolean} appendStyle  for compile only
 * @param {String} parent  for compile only
 * @param {String} AppID  for compile only
 */
 function Child(child, Indexed = false, appendStyle = false, parent, AppID) {
  // Indexed mean the child have a ready index or real number in flow
  if (child) {
    var div = document.createElement(child.type == undefined ? 'div' : child.type );

    if (child.text) {
      // why we put {{&&}} at last of child.text because this will put a mark between a text of element and text . 
      div.innerHTML = child.text;    
    }

    // set attrs
    if (child.attrs && child.attrs.length != 0) {
      for (var attr in child.attrs) {
        div.setAttribute(attr, child.attrs[attr]);
      }
    }
    // set events
    if (child.events && child.events.length != 0) {
      for (var event in child.events) {
        // give it some functions like Setstate to reloading a new state with new ui building
        div.addEventListener(event, (evt) => (child.events[event]).call({
          nativeEvent: evt,
          AppID: AppID, // App ID in system
          state: Rex.ConvertMapToHash(App.IDs[AppID].state), // Hash type
          setState: (newState) => (App.IDs[AppID]).state.setState(newState), // function for update state
          STATE: (App.IDs[AppID]).state, // Map type
        }));
      }
    }

    if (child.children && child.children.length != 0) {
      for (var i in child.children) {
        if (typeof child.children[i] == "function") {
          // if child is function style
          // create id for function
          FnID = 'FnLibrary_' + Math.floor(Math.random() * 100000);
          // check if id exist or not 
          while (FnLibrary[FnID] != undefined) {
            // create new one
            FnID = 'FnLibrary_' + Math.floor(Math.random() * 100000);
          }
          // add to function library
          window.FnLibrary[FnID] = child.children[i]; 
          // set as normal  child with javascript core support text
          // return to childfunctionstyle to make some process before push it to dom and code.js
          ChildFunctionStyle(FnID, window.Rex.InstallingFnID, div, AppID);
        } else {
          Child(child.children[i], true, true, div, AppID);
        }
      }
    }
    if (appendStyle == true && Indexed == true) {
      // for childrens in flow child
      parent.appendChild(div);
    }
    if (Indexed == true) {
      // return element
      return div;
    }
    if (Indexed == false) {
      // return to child function again but with deffrant props
      return child;
    }
  }
};

window.Import = function(Component) {

  console.log(Component);
    return Component;
}