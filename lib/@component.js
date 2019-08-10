/**
 * this file is javascript component style.
 * version 0.0.1
 */
window.Rex = function(Root, AppSeclector = '#root') {
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

window.Component = function(fn, props = {}) {
  if (fn) {
    var obj = {
      state: props,// exports props from parent components add to local component state :D 2 in 1
    };
    this.console.log('obj here', props , obj)
    // creating a new component to as core working with;
    var app = document.createElement("div");

    app.setAttribute("permission", "app");

    var appID = "app_id_" + Math.floor(Math.random() * 1000);

    app.id = appID;

    Rex.InstallingFnID = appID; // this for global his compoenent id for using in other function ! i think it's bad idea
    // but it's i just way in mind now for fix this problem i think should improve this part

    var context = (fn.call(obj)).context; // return elemants array

    // listUnregistraionComponents = (fn.call(obj)).listUnregistraionComponents; // return array

    Rex.prototype.registration(appID, obj, app); // registraion for this component in app core!


    console.log(obj, context);

    var head = document.createElement("script");
    head.setAttribute("permission", "head");

    var body = document.createElement("div");
    body.setAttribute("permission", "body");

    for (var i in context) {
      body.appendChild(context[i]);
    }

    app.appendChild(head);
    app.appendChild(body);

    return {
      app: app,
      appID: appID,
      objState: obj,
      // listUnregistraionComponents: listUnregistraionComponents,
    };
  }
};
window.FnLibrary = {};
window.View = function(view) {
  if (view) {
    if (view.children && view.children.length != 0) {
      var children = []; // return txt and will return as html
      // var listUnregistraionComponents = [];

      for (var i in view.children) {
        // debugger;
        if (!view.children[i].app && typeof view.children[i] == "object") {
          // app if exist mean is a extarnal component else it's a normal child in flow
          children.push(Child(view.children[i], true, false, null, window.Rex.InstallingFnID));
        } else if (view.children[i].app) {
          children.push(view.children[i].app)
          // listUnregistraionComponents.push(view.children[i]);
        } else if (typeof view.children[i] == "function") {
          // create id for function
          FnID = 'FnLibrary_' + Math.floor(Math.random() * 100000);
          // check if id exist or not 
          while (FnLibrary[FnID] != undefined) {
            // create new one
            FnID = 'FnLibrary_' + Math.floor(Math.random() * 100000);
          }
          // add to function library
          window.FnLibrary[FnID] = view.children[i]; 
          // set as normal  child with javascript core support text
          children.push(Child({
            // call function from html to FnLibrary
            // should function return a [array] if not return a array will return error
            text: `{{js window.FnLibrary['${FnID}'].call({
              setState : function (newState)  { (App.IDs['${window.Rex.InstallingFnID}']).state.setState(newState) },
              state: Rex.ConvertMapToHash(App.IDs['${window.Rex.InstallingFnID}'].state ),
              AppID:'${window.Rex.InstallingFnID}'
            })}}`
          }, true, false, null));          
        }
      }
      
      return {
        context: children,
        // listUnregistraionComponents: listUnregistraionComponents,
      };
    }
  }
};

window.Child = function(child, Indexed = false, appendStyle = false, parent, AppID) {
  // Indexed mean the child have a ready index or real number in flow
  if (child) {
    var div = document.createElement(child.type == undefined ? 'div' : child.type );
    
    if (child.type == undefined) {
      // mean user use a deffrant style and not need a default style #non-default-style
      var code = document.createElement("code");
      div.appendChild(code);
    }

    // set text in code element for compile it if have a Rex style scripts
    if (child.text) {
      code.innerHTML = child.text;
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
        div.addEventListener(event, () => (child.events[event]).call({
          AppID: AppID, // App ID in system
          state: Rex.ConvertMapToHash(App.IDs[AppID].state), // Hash type
          setState: (newState) => (App.IDs[AppID]).state.setState(newState), // function for update state
          STATE: (App.IDs[AppID]).state, // Map type
        }));
      }
    }

    if (child.children && child.children.length != 0) {
      for (var i in child.children) {
        Child(child.children[i], true, true, div, AppID);
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