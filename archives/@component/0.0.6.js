/**
 * this file is javascript component style.
 * version 0.0.6
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
function Brex(Root, AppSeclector = "#root") {
  if (Root) {
    Root.child.Root = true; // make mark in this element is a mian component
    Root.child.__Index = "0";
    var app = Brex.build(Root); // create app elements

    //  AppSeclector is #root element by default else for inject other component
    if (AppSeclector == "#root") {
      document.querySelector(AppSeclector).append(app);
    }
    App.building();
  }
}
Brex.findChildHyber = (dom, __index, _action) => {
  foundChild = null;
  if (dom.type == "component-style") {
    var _children = dom.child.context.child.children; // [!] this is start point
  } else if (dom.type == "child-style") {
    var _children = dom.child.children; // [!] this is start point
  }

  for (var i in _children) {
    if (_children[i].__Index == __index) {
      if (_action) {
        function _setChildren(v) {
          _children = v;
        }
        _action(i, _children, _setChildren);
      }
      foundChild = _children[i];
      break;
    }
    if (_children[i].type == "component-style") {
      if (_children[i].child.context.child.children) {
        var b = Brex.findChildHyber(_children[i], __index, _action);
        if (b) {
          return b;
        }
      }
    } else {
      if (_children[i].child.children) {
        var b = Brex.findChildHyber(_children[i], __index, _action);
        if (b) {
          return b;
        }
      }
    }
  }
  return foundChild;
};
Brex.findChild = function(
  dom,
  __Index = "*",
  _action /* action or function call after find child and send a array and index of child to edit or replace the child json */
) {
  // this function using __Index to find child in componenet children
  foundChild = null;
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
        if (_action) {
          // we send array and index of json child
          // to allow to you edit and remove this json from root in caching file
          // and we send get, set to change, edit, delete childrens of array
          function _setChildren(v) {
            _children = v;
          }
          _action(i, _children.concat(), _setChildren);
        }
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
Brex.findChanges = (newChild, oldChild, DontCheckChildren = true) => {
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
Brex.matchChanges = (childContext, changes) => {
  var el = _a(childContext).__el.el;
  if (el && changes) {
    for (var i in changes) {
      var key = changes[i].key;
      var type = changes[i].type;
      var newValue = changes[i].newValue;

      if (key == null && type == "text") {
        _b(childContext).text = newValue; // [!] here we replace the old cached context|value with new values
        if (el.childNodes.length == 0) {
          el.innerText = newValue; // if this child not have any node [0]  | text
        } else {
          el.childNodes[0].textContent = newValue; // [!] child node 0 is a default index of text of this element :D
        }
      }

      if (key != null && type == "attrs") {
        _b(childContext).attrs[key] = newValue; // [!] here we replace the old cached context|value with new values
        el.setAttribute(key, newValue);
      }

      if (key != null && type == "events") {
        _b(childContext).events[key] = newValue; // [!] here we replace the old cached context|value with new values
        el.addEventListener(key, evt =>
          newValue.call({
            nativeEvent: evt,
            AppID: AppID, // App ID in system
            state: Brex.ConvertMapToHash(App.IDs[AppID].state), // Hash type
            setState: newState => App.IDs[AppID].state.setState(newState), // function for update state
            STATE: App.IDs[AppID].state // Map type
          })
        );
      }
    }
  }
};
_a = function(child) {
  var type = child.type;
  if (type == "component-style") {
    return child.child;
  } else {
    return child;
  }
};
_b = function(child) {
  var type = child.type;
  if (type == "component-style") {
    return child.child.context.child;
  } else {
    return child.child;
  }
};
Brex.matchingDOM = (
  newchild,
  oldChild,
  oldDOM,
  newDOM,
  appID,
  ViraulRealDOMStructure,
  Ctype // new | old
) => {
  //debugger;

  if (newchild) {
    var __Index = newchild.__Index;
  }

  if (oldChild) {
    var ___Index = oldChild.__Index;
  }

  if (!oldChild) {
    oldChild = Brex.findChild(oldDOM, __Index); // [!] find the same old child in old structure
    if (oldChild) var ___Index = oldChild.__Index;
  }

  if (!newchild) {
    newchild = Brex.findChild(newDOM, ___Index); // [!] find the same new child in new structure
    if (newchild) var __Index = newchild.__Index;
  }

  if (oldChild) {
    var _type = oldChild.type;
  }

  if (newchild) {
    var type = newchild.type;
  }

  // [*] type 1 => diffarant Tag Name
  if (oldChild && newchild && Ctype == "new") {
    var _tag = _b(oldChild).type;
    var tag = _b(newchild).type;

    if (_tag != tag) {
      // [!] check if Have Same Tag Name
      try {
        _a(oldChild).__el.parent.replaceChild(
          _a(newchild).__el.el,
          _a(oldChild).__el.el
        ); // [*] replace the old child by new child
      } catch (e) {
        console.log(e);
      }

      console.log(oldDOM, __Index);
      // [*] updates old json DOM
      Brex.findChildHyber(oldDOM, __Index, function(_index, _get, _set) {
        // [!] we replace parent of new child because the new child have deffrant parent than old child.
        _a(newchild).__el.parent = _a(_get[_index]).__el.parent;
        _get[_index] = newchild;
        _set(_get);
      });
    }
  }
  // [*] type 2 => deffarant (Attr-Value) || (Text-Value) || (Events-value) || (Children-value)
  if (oldChild && newchild && Ctype == "new") {
    var Changes = Brex.findChanges(newchild, oldChild);
    if (Changes.length != 0) {
      Brex.matchChanges(oldChild, Changes); // update the changes in real dom;
    }
  }
  // [*] type 3 => new child not have any history in the old json dom
  if (
    oldChild == null &&
    newchild &&
    Ctype == "new" &&
    _a(newchild).__el.el.getRootNode() != document // this mean the child not exist in old
  ) {
    var _parent__Index = newchild.parent__Index;

    var _newChild__Index = parseInt(newchild.__Index_In_Parent_Children);

    var parent = Brex.findChild(oldDOM, _parent__Index);

    var parent_children = null;

    if (parent) {
      var parent_children = parent.child.children;
    }

    if (parent_children) {
      if (parent_children.length > _newChild__Index) {
        // mean child exist and need replace with new one :D
        // [!] we should replace element first from cached json DOM then delete from real dom in html
        Brex.findChildHyber(oldDOM, _parent__Index, function(
          _index,
          _get,
          _set
        ) {
          _get[_index] = newchild;
          _set(_get);
        });
        parent.__el.el.children[_newChild__Index].replaceChild(
          newchild.__el.el,
          parent.__el.el.children[_newChild__Index]
        );
      } else {
        // this mean this parent not have children exist with his index
        // [!] we should add element first from cached json DOM then delete from real dom in html
        Brex.findChildHyber(oldDOM, _parent__Index, function(
          _index,
          _get,
          _set
        ) {
          _get.push(newchild);
          _set(_get);
        });
        parent.__el.el.append(newchild.__el.el);
      }
    } else if (parent) {
      // this mean this parent not have children before
      // [!] we should add element first from cached json DOM then delete from real dom in html
      Brex.findChildHyber(oldDOM, _parent__Index, function(_index, _get, _set) {
        _get.push(newchild);
        _set(_get);
      });
      parent.__el.el.append(newchild.__el.el);
    }
  }
  // [*] type 4 remove child or child exist in old DOM and not exist in new DOM
  if (oldChild && newchild == null && Ctype == "old") {
    // [!] we should remove element first from cached json DOM then delete from real dom in html
    Brex.findChildHyber(oldDOM, ___Index, function(_index, _get, _set) {
      _get.splice(_index, 1);
      _set(_get);
    }); // true will delete a child after find it immititly
    oldChild.__el.el.remove();
  }
};

Brex.hasChild = (el, child) => {
  var found = false;
  if (!el || !child) return null;
  if (el.children) {
    for (var i in el.children) {
      if (el.children[i] === child) {
        var found = true;
        break;
      }
    }
  }
  return found;
};

Brex.analysisDOM = (oldDOM, newDOM, AppID, ViraulRealDOMStructure) => {
  // element using new state -> updates innertext, children, attrs
  // element replace element -> using replaceChild
  // element replace component or opposide -> using replaceChild
  // element add
  // element remove

  /**
   * @function analysisDOM this functions analysis dom for updating it and replace|remove old dom
   * @param {json} oldDOM old dom bind with old state
   * @param {json} newDOM new dom bind with new state
   * @param {string} AppID id of a component
   * @param {HTML} ViraulRealDOMStructure a real viraul dom but not insert in body just using it for replace old dom with new dom with real dom
   */

  /**
   * we check a two type of old & new Dom
   * to updates children and remoce unused elements in new state!
   */

  var children = Brex.findChild(newDOM, "*");
  var _children = Brex.findChild(oldDOM, "*");
  for (var i in _children) {
    // matchingDom mean -> see changes in this old & new child and update it :D
    Brex.matchingDOM(
      null,
      _children[i],
      oldDOM,
      newDOM,
      AppID,
      ViraulRealDOMStructure,
      "old"
    );
  }

  for (var i in children) {
    // matchingDom mean -> see changes in this old & new child and update it :D
    Brex.matchingDOM(
      children[i],
      null,
      oldDOM,
      newDOM,
      AppID,
      ViraulRealDOMStructure,
      "new"
    );
  }
};
Brex.cloneHashArray = clone => {
  if (typeof clone == "object") {
    var copy = {};
    for (var i in clone) {
      copy[i] = clone[i];
    }
    return copy;
  }
};

Brex.ComponentsCaching = {}; // component Caching
App.extensionsCachingFunctions.push(function() {
  // this function called from SetState in core.js when core.js finsh rebuild a apps need to rebuilding
  // and we here after this, we recall a function component to rebuild a components need to reload but
  // we reload at @component-lib-style
  var AppID = this.AppID;
  var app = window.Brex.ComponentsCaching[AppID];
  var fn = app.child.fn;
  var state = Brex.ConvertMapToHash(App.IDs[AppID].state);
  var shouldComponentUpdate = app.child.objState.shouldComponentUpdate;
  var componentWillUpdate = app.child.objState.componentWillUpdate;
  var componentDidUpdate = app.child.objState.componentDidUpdate;
  var updatePermission = true;

  if (shouldComponentUpdate) {
    updatePermission = shouldComponentUpdate.call(app.child.objState);
  }

  if (!updatePermission) return;

  if (componentWillUpdate) {
    componentWillUpdate.call(app.child.objState);
  }

  var obj = {
    AppID: AppID,
    state: state,
    useStateLastKey: 0, // unique key for useState function + will
    useState: function(value) {
      this.useStateLastKey = this.useStateLastKey + 1; // uncrease one for unique
      return componentUseState(
        value,
        this.useStateLastKey,
        AppID,
        this.isReady
      );
    },
    STATE: App.IDs[AppID].state,
    setState: newState => App.IDs[AppID].state.setState(newState), // function for update state
    componentWillMount: null,
    componentDidMount: null,
    shouldComponentUpdate: null,
    componentWillUpdate: null,
    componentDidUpdate: null,
    isReady: true // component is ready to return all element;
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
  var RealDOMStructure = Brex.build(CompoReady, false);

  Brex.analysisDOM(app, CompoReady, AppID, RealDOMStructure);

  if (componentDidUpdate) {
    componentDidUpdate.call(app.child.objState);
  }
});

Brex.build = (list, withCaching = true) => {
  // info about this function and his work!
  // before component compile, Component Function send a real element of component to append children of this component in it
  // and Component Function make registration for this component in App.js|Core.js
  // build make big process for children and component
  // he take info of component and send creating children of this component
  // if normal child will add it dirct to a main component element
  // or if a component child will send a info of this child.component to same Brex.build
  // but before this will append child.component.element to children of parent component.element to arraying in a tree element

  // caching a Real function component to recycle it in setState and changing values
  // [!] we set full list info in caching
  if (withCaching) {
    Brex.ComponentsCaching[list.child["appID"]] = list;
  }

  // [!] we set list of info for child dirctly
  list = list.child;

  var mainApp = list.app;

  var mianAppID = list.appID;

  var objState = list.objState;

  var _context = list.context.child.children; // here we get children of main element

  var _children = []; // compiled children | ready children for append to a [root element | main element]

  var AppInstallNow = mianAppID;

  var ComponentNeedRenderingChildren = [];

  for (var _c = 0; _c < _context.length; _c++) {
    var ctxt = _context[_c];

    var childType = ctxt.type;

    var childProps = ctxt.child;

    var childParent = ctxt.parent == undefined ? mainApp : ctxt.parent;

    var parent__Index = list.__Index;

    var __OwnIndex = parent__Index + `_${_c}`;

    if (!ctxt.__Index) {
      ctxt.__Index = __OwnIndex; // give element a unqie index
    } else {
      __OwnIndex = ctxt.__Index;
    }

    if (!ctxt.parent__Index) {
      ctxt.parent__Index = parent__Index;
    }

    if (!ctxt.parent) {
      ctxt.parent = mainApp;
    }

    if (!ctxt.__Index_In_Parent_Children) {
      ctxt.__Index_In_Parent_Children = `${_c}`; // give element a unqie index
    }

    if (childType == "child-style") {
      /**
       * [!] here we should write note to help you understand from where the index come
       * [!] frist in any component we make loop and give index by help from loop index
       * [*] like
       * [*] Componenent => 0
       * [*]  Child => (loop give me -> 0 ) i add component index + loop give me 0 to give child this index
       * [?] but we have problem how can i give child of child his index
       * [*] before children add to loop array Brex._Child function give his index by add his parent index + _ + loop give me index
       * [*] and now child have own index without use a main loop
       */

      var child = Brex._Child(childProps, mianAppID, childParent, __OwnIndex);

      ctxt.__el = child; // inject element to his own json struction return => {el, parent, children, ...}

      var childChildren = child.children;

      for (var v in childChildren) {
        _context.push(childChildren[v]);
        // for remove a pushed child because this child is already child
        // and have parent and we push it in _context to add it in the loop
        childChildren[v].onceUseForLoop = true;
      }

      _children.push(child);
    } else if (childType == "component-style") {
      ctxt.child.__el = {
        el: childProps.app,
        parent: childParent,
        children: childChildren
      }; // inject element to his own json struction
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
    Brex.build(ComponentNeedRenderingChildren[cm]);
  }

  // [!] remove an extra children add for testing under a same loop and not use any more
  for (var _once = 0; _once < _context.length; _once++) {
    if (
      _context[_once] &&
      _context[_once].onceUseForLoop &&
      _context[_once].onceUseForLoop == true
    ) {
      delete _context[_once].onceUseForLoop;
      _context.splice(_once, 1);
      _once = 0; // reset and start again
    }
  }

  // * We call a componentDidMount function after return to transform the json DOM to real DOM
  if (objState.componentDidMount) {
    objState.componentDidMount.call(objState);
  }

  return mainApp;
};
Brex._Child = (child, AppID, parent, __OwnIndex) => {
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
        // give it some functions like Setstate to reloading a new state with new ui building
        div.addEventListener(event, evt =>
          child.events[event].call({
            nativeEvent: evt,
            AppID: AppID, // App ID in system
            state: Brex.ConvertMapToHash(App.IDs[AppID].state), // Hash type
            setState: newState => App.IDs[AppID].state.setState(newState), // function for update state
            STATE: App.IDs[AppID].state // Map type
          })
        );
      }
    }
    for (var c in child.children) {
      child.children[c].parent__Index = __OwnIndex;
      child.children[c].__Index = __OwnIndex + "_" + c;
      child.children[c].__Index_In_Parent_Children = `${c}`;
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
Brex.ConvertMapToHash = map => {
  var hash = {};
  map.forEach((v, i) => {
    hash[i] = v;
  });
  return hash;
};
Brex.prototype.registration = (appID, objState, e) => {
  // we registration here to make code faster than old version.
  // this help to see html better pure than old.
  var e = e == undefined ? document.querySelector(`#${appID}`) : e;
  var app = App.create(e);

  var MapData = new Map();
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
      useStateLastKey: 0,
      useState: function(value) {
        this.useStateLastKey = this.useStateLastKey + 1; // uncrease one for unique
        return componentUseState(
          value,
          this.useStateLastKey,
          appID,
          this.isReady
        );
      },
      setState: newState => App.IDs[appID].state.setState(newState), // function for update state
      state: props, // exports props from parent components add to local component state :D 2 in 1
      componentWillMount: null,
      componentDidMount: null,
      shouldComponentUpdate: null,
      componentWillUpdate: null,
      componentDidUpdate: null,
      isReady: false
    };
    // creating a new component to as core working with;
    var app = document.createElement("div");

    app.setAttribute("permission", "app");

    app.setAttribute("autoAppState", "true"); // give it a free and auto

    app.id = appID;

    // ! we call registration for first time create a base of app in the App.iDs system
    Brex.prototype.registration(appID, [], app); // registraion for this component in app core!

    Brex.InstallingFnID = appID; // this for global his compoenent id for using in other function ! i think it's bad idea
    // but it's i just way in mind now for fix this problem i think should improve this part

    // ! return elemants array & date, this is first time call component function for get a component lifecycle functions
    var context = fn.call(obj);

    // * We call a componentWillMount function before return to transform the json DOM to real DOM
    if (obj.componentWillMount) {
      obj.componentWillMount.call(obj);
    }
    obj.isReady = true; // Component is ready to render a view function | ui
    var context = fn.call(obj); // ? return elemants array

    Brex.prototype.registration(appID, obj, app); // registraion for this component in app core!

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
  if (!child.type) child.type = "DIV"; // default type of child!
  if (!child.children) child.children = []; // no child
  if (!child.events) child.events = []; // no child
  return {
    type: "child-style",
    child: child
  };
}
/**
 *
 * create native element work with a library
 * @param {Array} props
 */
function createNativeElement(props) {
  return function(_props) {
    return {
      type: "child-style",
      child: {
        ..._props,
        ...props
      }
    };
  };
}

function componentUseState(value, key, appId, isReady) {
  var id = "varUserState_" + key;

  var _set = v => {
    if (!isReady) return;

    var keysNeedToSetState = {};

    keysNeedToSetState[id] = v;

    App.IDs[appId].state.setState(keysNeedToSetState);
  };

  var _get = App.IDs[appId].state.get(id);

  if (_get) return [_get, _set]; // return a exist value -> return set - get

  App.IDs[appId].state.set(id, value); // not exist -> create a new id with a new value

  _get = value; // _get = new value;

  return [_get, _set]; // return set - get
}
