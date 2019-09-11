/**
 * this file is javascript component style.
 * version 0.0.2
 */

// kill permissions of App to not made a error with @component
window.App.permission.reloadingAttr = false;
window.App.permission.reloadingText = false;
window.App.permission.stateFilterFunctions = true;

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
function Rex(Root, AppSeclector = "#root") {
  if (Root) {
    Root.child.Root = true; // make mark in this element is a mian component
    Root.child.__Index = "0";
    var app = Rex.build(Root); // create app elements

    //  AppSeclector is #root element by default else for inject other component
    if (AppSeclector == "#root") {
      document.querySelector(AppSeclector).append(app);
    }
    Rex.prototype.registration(Root.child.appID, Root.child.objState, app);
    // // App building after trgistration
    App.building();
  }
}
Rex.findChild = (dom, __Index = "*") => {
  // this function using __Index to find child in componenet children
  var foundChild = null;
  if (dom.type == "component-style") {
    var _children = dom.child.context.child.children; // [!] this is start point
  }

  for (var i = 0; i < _children.length; i++) {
    var _type = _children[i].type;
    var __Index__ = _children[i].__Index;

    if (__Index != "*") {
      // * mean return all children in this json dom
      if (__Index == __Index__) {
        foundChild = _children[i];
        break;
      }
    }
    if (_type == "child-style") {
      if (
        _children[i].child.children &&
        _children[i].child.children.length != 0
      ) {
        _children = [..._children, ..._children[i].child.children];
      }
    } else if (_type == "component-style") {
      if (
        _children[i].child.context.child.children &&
        _children[i].child.context.child.children.length != 0
      ) {
        _children = [
          ..._children,
          ..._children[i].child.context.child.children
        ];
      }
    }
  }
  if (__Index == "*") {
    // * mean return all children in this json dom
    return _children;
  }
  return foundChild;
};
Rex.findChanges = (newChild, oldChild) => {
  // find changes between two type of child [old state type (vs) new state type]
  var changes = [];
  // _ for oldchild
  var _type = oldChild.type;
  var type = newChild.type;
  var _index = oldChild.__Index;
  var index = newChild.__Index;
  var _el = oldChild.__el;
  var el = newChild.__el;
  var _props = oldChild.child;
  var props = newChild.child;
  var _events = _props.events;
  var events = props.events;
  var _attrs = _props.attrs;
  var attrs = props.attrs;
  var _text = _props.text;
  var text = props.text;
  var _children = _props.children;
  var children = props.children;

  if (_index == index) {
    // we have three importent thing in props we wanna check it [events, attrs, text, children ...]
    // text|innerText
    if (_text != text) {
      console.log(_text, text);
      changes.push({
        type: "text",
        key: null,
        newValue: text
      });
    }
    // attrs
    for (var i in attrs) {
      // i = key = nameAttr
      var _attrValue = _attrs[i];
      var attrValue = attrs[i];
      if (_attrValue != attrValue) {
        changes.push({
          type: "attrs",
          key: i,
          newValue: attrValue
        });
      }
    }
    // events
    for (var i in events) {
      // i = key = nameAttr
      var _eventValue = _events[i];
      var eventValue = events[i];
      // we here check the type of value -> by normal will by type Function
      // but if function removed | add will return undefined type
      if (typeof _eventValue != typeof eventValue) {
        changes.push({
          type: "events",
          key: i,
          newValue: eventValue
        });
      }
    }
  }

  return changes;
};
Rex.matchChanges = (childContext, changes) => {
  var el = childContext.__el.el;
  if (el && changes) {
    for (var i in changes) {
      var key = changes[i].key;
      var type = changes[i].type;
      var newValue = changes[i].newValue;

      if (key == null && type == "text") {
        childContext.child.text = newValue; // [!] here we replace the old cached context|value with new values
        el.innerText = newValue;
      }

      if (key != null && type == "attrs") {
        childContext.child.attrs[key] = newValue; // [!] here we replace the old cached context|value with new values
        el.setAttribute(key, newValue);
      }

      if (key != null && type == "events") {
        childContext.child.events[key] = newValue; // [!] here we replace the old cached context|value with new values
        el.addEventListener(key, evt =>
          newValue.call({
            nativeEvent: evt,
            AppID: AppID, // App ID in system
            state: Rex.ConvertMapToHash(App.IDs[AppID].state), // Hash type
            setState: newState => App.IDs[AppID].state.setState(newState), // function for update state
            STATE: App.IDs[AppID].state // Map type
          })
        );
      }
    }
  }
};
Rex.matchingDOM = (newchild, oldDOM, newDOM, appID, ViraulRealDOMStructure) => {
  var __Index = newchild.__Index;
  var oldChild = Rex.findChild(oldDOM, __Index); // [!] find the same old child in old structure

  // [*] type 1 => diffarant Tag Name
  if (oldChild && newchild) {
    if (oldChild.type != newchild.type) {
      // [!] check if Have Same Tag Name
      oldChild.__el.parent.replaceChild(newchild.__el.el, oldChild.__el.el); // [*] replace the old child by new child
    }
  }
  // [*] type 2 => deffarant (Attr-Value) || (Text-Value) || (Events-value) || (Children-value)
  if (oldChild && newchild) {
    var Changes = Rex.findChanges(newchild, oldChild);
    if (Changes.length != 0) {
      Rex.matchChanges(oldChild, Changes); // update the changes in real dom;
    }
  }
  // [*] type 3 => new child not have any history in the old json dom
  if (oldChild == null && newchild) {
    // [!] we add "0_" for a id of parent because all element under View Child and View child always have 0 __index.
    var _parent__Index = newchild.__Index.split(App.regax.getIndexOfChild)[0];
    var parent = Rex.findChild(oldDOM, _parent__Index);
    console.log(newchild, _parent__Index);
  }
};

Rex.analysisDOM = (oldDOM, newDOM, AppID, ViraulRealDOMStructure) => {
  // element using new state -> updates innertext, children, attrs
  // element replace element -> using replaceChild
  // element replace component or opposide -> using replaceChild
  // element add
  // element remove

  if (newDOM.type == "component-style") {
    var _children = newDOM.child.context.child.children; // [!] this is start point
  }

  for (var i = 0; i < _children.length; i++) {
    var _type = _children[i].type;

    // matchingDom mean -> see changes in this old & new child and update it :D

    Rex.matchingDOM(
      _children[i],
      oldDOM,
      newDOM,
      AppID,
      ViraulRealDOMStructure
    );

    if (_type == "child-style") {
      if (
        _children[i].child.children &&
        _children[i].child.children.length != 0
      ) {
        _children = [..._children, ..._children[i].child.children];
      }
    } else if (_type == "component-style") {
      if (
        _children[i].child.context.child.children &&
        _children[i].child.context.child.children.length != 0
      ) {
        _children = [
          ..._children,
          ..._children[i].child.context.child.children
        ];
      }
    }
  }
};
Rex.cloneHashArray = clone => {
  if (typeof clone == "object") {
    var copy = {};
    for (var i in clone) {
      copy[i] = clone[i];
    }
    return copy;
  }
};

(Rex.ComponentsCaching = {}), // component Caching
  App.extensionsCachingFunctions.push(function() {
    // this function called from SetState in core.js when core.js finsh rebuild a apps need to rebuilding
    // and we here after this, we recall a function component to rebuild a components need to reload but
    // we reload at @component-lib-style
    // هنا بتم استدعاء الفكشن علشان تعمل اعادة بناء للكمبونت و يتم اعادة بناءها من جديد
    var AppID = this.AppID;
    var app = window.Rex.ComponentsCaching[AppID];
    var fn = app.child.fn;
    var state = Rex.ConvertMapToHash(App.IDs[AppID].state);
    var obj = {
      AppID: AppID,
      state: state,
      STATE: App.IDs[AppID].state,
      setState: newState => App.IDs[AppID].state.setState(newState) // function for update state
    };
    obj = Object.freeze(obj);
    var AppStructure = fn.call(obj); // recall a cached function componenet to get a new sturcture with a lastest state
    // reset all children to recreate it with new state;
    var Sturecture = {
      fn: app.child.fn,
      app: document.createElement("div"),
      appID: app.child.appID,
      objState: obj,
      context: AppStructure,
      __Index: app.child.__Index
    };
    var CompoReady = {
      type: "component-style",
      child: Sturecture
    };

    // [!] we not need to caching this because this a viraul dom we copy and replace from it to real dom
    var RealDOMStructure = Rex.build(CompoReady, false);

    Rex.analysisDOM(app, CompoReady, AppID, RealDOMStructure);
    // app.child.app.innerHTML = "";
  });

Rex.build = (list, withCaching = true) => {
  // info about this function and his work!
  // before component compile, Component Function send a real element of component to append children of this component in it
  // and Component Function make registration for this component in App.js|Core.js
  // build make big process for children and component
  // he take info of component and send creating children of this component
  // if normal child will add it dirct to a main component element
  // or if a component child will send a info of this child.component to same rex.build
  // but before this will append child.component.element to children of parent component.element to arraying in a tree element

  // caching a Real function component to recycle it in setState and changing values
  // [!] we set full list info in caching
  if (withCaching) {
    Rex.ComponentsCaching[list.child["appID"]] = list;
  }

  // [!] we set list of info for child dirctly
  list = list.child;

  var mainApp = list.app;

  var mianAppID = list.appID;

  var objState = list.objState;

  var _context = list.context.child.children.concat(); // here we get children of main element

  var _children = []; // compiled children | ready children for append to a [root element | main element]

  var AppInstallNow = mianAppID;

  var ComponentNeedRenderingChildren = [];

  for (var _c = 0; _c < _context.length; _c++) {
    if (_context.length == 0) break;

    var ctxt = _context[_c];
    var childType = ctxt.type;

    var childProps = ctxt.child;

    var childParent = ctxt.parent == undefined ? mainApp : ctxt.parent;

    var parent__Index = list.__Index;

    var __OwnIndex = parent__Index + `_${_c}`;

    if (childType == "child-style") {
      var child = Rex._Child(childProps, mianAppID, childParent, __OwnIndex);

      /**
       * [!] here we should write note to help you understand from where the index come
       * [!] frist in any component we make loop and give index by help from loop index
       * [*] like
       * [*] Componenent => 0
       * [*]  Child => (loop give me -> 0 ) i add component index + loop give me 0 to give child this index
       * [?] but we have problem how can i give child of child his index
       * [*] before children add to loop array Rex._Child function give his index by add his parent index + _ + loop give me index
       * [*] and now child have own index without use a main loop
       */
      if (!ctxt.__Index) {
        ctxt.__Index = __OwnIndex; // give element a unqie index
      }

      ctxt.__el = child; // inject element to his own json struction return => {el, parent, children, ...}

      var childChildren = child.children;

      for (var v in childChildren) {
        _context.push(childChildren[v]);
      }

      _children.push(child);
    } else if (childType == "component-style") {
      ctxt.child.__el = childProps.app; // inject element to his own json struction
      ctxt.child.__Index = __OwnIndex; // give element a unqie index
      ComponentNeedRenderingChildren.push(ctxt); // add to waiting list of component render

      _children.push({
        el: childProps.app,
        parent: childParent
      });
    }
  }

  for (var y in _children) {
    _children[y].parent.append(_children[y].el);
  }

  for (var cm in ComponentNeedRenderingChildren) {
    Rex.build(ComponentNeedRenderingChildren[cm]);
  }

  return mainApp;
};
Rex._Child = (child, AppID, parent, __OwnIndex) => {
  //   Indexed mean the child have a ready index or real number in flow
  if (child) {
    var div = document.createElement(
      child.type == undefined ? "div" : child.type
    );

    if (child.text) {
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
        // console.log(div, event);
        // give it some functions like Setstate to reloading a new state with new ui building
        div.addEventListener(event, evt =>
          child.events[event].call({
            nativeEvent: evt,
            AppID: AppID, // App ID in system
            state: Rex.ConvertMapToHash(App.IDs[AppID].state), // Hash type
            setState: newState => App.IDs[AppID].state.setState(newState), // function for update state
            STATE: App.IDs[AppID].state // Map type
          })
        );
      }
    }
    for (var c in child.children) {
      child.children[c].parent__Index = __OwnIndex;
      child.children[c].__Index = __OwnIndex + "_" + c;
      child.children[c].parent = div;
    }
    // return element
    return {
      parent: parent,
      el: div,
      children: child.children
    };
  }
};
Rex.ConvertMapToHash = map => {
  var hash = {};
  map.forEach((v, i) => {
    hash[i] = v;
  });
  return hash;
};
Rex.prototype.registration = (appID, objState, e) => {
  // we registration here to make code faster than old version.
  // this help to see html better pure than old.
  var e = e == undefined ? document.querySelector(`#${appID}`) : e;
  // console.log(e);
  var app = App.create(e);

  var MapData = new Map();
  // console.log(objState);
  for (var i in objState["state"]) {
    MapData.set(i, objState["state"][i]);
  }
  _state = app.state(MapData);
  // App.building(); // for test!!!!!!!!!
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
    var appID = "app_id_" + Math.floor(Math.random() * 1000);

    var obj = {
      setState: newState => App.IDs[appID].state.setState(newState), // function for update state
      state: props // exports props from parent components add to local component state :D 2 in 1
    };
    // this.console.log('obj here', props , obj)
    // creating a new component to as core working with;
    var app = document.createElement("div");

    app.setAttribute("permission", "app");

    app.setAttribute("autoAppState", "true"); // give it a free and auto

    app.id = appID;

    Rex.InstallingFnID = appID; // this for global his compoenent id for using in other function ! i think it's bad idea
    // but it's i just way in mind now for fix this problem i think should improve this part

    var context = fn.call(obj); // return elemants array

    Rex.prototype.registration(appID, obj, app); // registraion for this component in app core!
    return {
      type: "component-style",
      child: {
        fn: fn,
        app: app,
        appID: appID,
        objState: obj,
        context: context
      }
    };
  }
}
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
  var _viewChildren = [];

  for (var i in view.children) {
    _viewChildren.push(view.children[i]); // normal child
  }
  view.children = _viewChildren;

  return {
    type: "view-style",
    child: view
  };
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
 *
 * @param {object} child it's a child props.
 */
function Child(child) {
  if (!child.type) child.type = "DIV";
  return {
    type: "child-style",
    child: child
  };
}
