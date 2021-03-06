// core.js file
// core of Brex library
// core.js created at 2019, 7
// version : 0.0.3
window.App = {
	permission: {
		reloadingAttr: true,
		reloadingText: true,
		stateFilterFunctions: true,
	},
	regax : {
		s1_found : /{{(\$(?<key>\w+))}}/gim,
		s2_found : /\s*?\{\{(\s*?(.*)\s*?(==|>|<|<=|>=|===|!=|!==)\s*?(.*)\s*?\n?\?\s*?\n?(([^\0]+)?)\n?\s*?:\s*?\n?(([^\0]+)?))\n?\s*?\}\}\s*?/gim,
		split_between_codes: /{{&&}}|{{&amp;&amp;}}/,
		s3_found: /{{(JS|js|javascript|JAVASCRIPT|code|CODE)/im,
		s3_replace_brackets: /^\s*?{{(JS|js|javascript|JAVASCRIPT|code|CODE)\s*?|\s*?}}\s*?$/gim,
		s3_get_virable_key: /\{\{(\?)(?<virableName>.*?)\}\}/gim,
		getIndexOfChild: /(_?(((?!_).)*))$/gm
	},
	IDs : {},
	focus_app : null,
	extensionsCachingFunctions: [],
	extensions: function (AppID, KeysNeedReload) {
		if (this.extensionsCachingFunctions.length == 0) return;
		for (var i in this.extensionsCachingFunctions) {
			(this.extensionsCachingFunctions[i]).call({
				AppID: AppID,
				KeysNeedReload: KeysNeedReload,
			})
		}
	},
	returnNewId:function () {
		for (;;) {
			var r = `id_` + Math.floor(Math.random() * 99999999)
			if (this.IDs[r] == undefined) break;
		}
		return r;
	},
	ElementsUsingVirable: [], // this elements will be able to set in it a code and attrs code and will compile like greate
	create: function (el) {
		var id = el.id;

		this.focus_app = id;

		if (!this.IDs[id]) { // ! for not create more than once and delete a old data !
			this.IDs[id] = {
				el: el,
				template: [],
				templateAttr:[],
				state: new Map(),
				recycle: null,
				rebuilding: [],
				rebuildingAttr:[],
				virableListenIn: [],
			};
		}

		return this;
	},
	stateFilterFunctions: function (state, appIndex) {
		state.forEach(function (value, key) {
			if (typeof(value) == "function") {
				state.set(key, function () {

					var StateNow = App.IDs[appIndex].state;
					
					var args = {state : StateNow, AppId: appIndex};
					// console.log(arguments)
					// for (var i in arguments) {
					// 	args[i] = arguments[i];
					// }

					value.apply(args, arguments);
				});
			}
		});
		
		/*
			we inject 'AppID' or component id to using it 
			in other functions and you can using it in any
			html tags code and in any function in state
			it's public, pro :D 
			note: don't chaning it to don't break component state
			and recycle
		*/
		state.set('AppID', appIndex);
		return state;
	},
	state: function (state) {
		if (this.permission.stateFilterFunctions == true) {
			var state = this.stateFilterFunctions(state, this.focus_app);
		}
		if (this.focus_app != null) {
			this.IDs[this.focus_app]['state'] = state; 
		}

		return this.IDs[this.focus_app]['state'];
	},
	recycle: function (fn) {
		if (this.focus_app != null) {
			this.IDs[this.focus_app]['recycle'] = fn; 
		}		
	},
	injectShareVirableComponents: function ({el, attrs}) {
		
		// filter element not using or useless
		var attrs_filtered = [];
		attrs.map((d) => {
			if (d[0] == "$") {
				attrs_filtered.push(d);
			}
		});
		
		// inject now a attr of parent to child
		for (var i in attrs_filtered) {
			var attrName = attrs_filtered[i];
			var attrValue = el.getAttribute(attrName);
			
			// filter syntax of attrName 
			// we replace $ to sharedvirable_ becaouse javascript 
			// not allow to set attr has this letters or marks!
			// bad! :{
			attrName = attrName.replace('$', 'sharedvirable_');
			
			// console.log(attrs_filtered[i], attrName, attrValue, el)

			el.firstElementChild.setAttribute(attrName, attrValue);

			el.removeAttribute(attrs_filtered[i]); // remove virable from include element 
		}
	},
	injectSharedVirableFromAppTag: function ({el, id}) {

		attrs = el.getAttributeNames();

		for (var i in attrs) {
			if ((attrs[i]).includes('sharedvirable_')) {
				var attr_name = attrs[i];
				var attr = el.getAttribute(attr_name);
				attr_name_in_state = attr_name.replace("sharedvirable_", '');
				if (attr.includes('App.IDs')) {
					(this.IDs[id]['state']).set(attr_name_in_state, eval(attr))
				} else {
					(this.IDs[id]['state']).set(attr_name_in_state, attr)
				}
			} 
		}


	},
	reloadingAttr:  function (eIndex, e, index) {
		// var state = this.IDs[index]['state'];
		// console.log(eIndex, e, index)
		var arrAttr = e.getAttributeNames()
		// console.log(arrAttr);
		
		for (var attr in arrAttr) {
			var readyText = [];
			
			// make sure is neet rebuilding
			if (this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] == undefined) {
				this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] = true;
			} 
			// make sure is neet rebuilding
			if (this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] == false) {
				return;
			} 
			
			var z = e.getAttribute(arrAttr[attr]);
			// make sure has temple => 
			if (this.IDs[index].templateAttr[`${eIndex}_${attr}`] == undefined) {
				this.IDs[index].templateAttr[`${eIndex}_${attr}`] =  e.getAttribute(arrAttr[attr]);
			} else {
				z = this.IDs[index].templateAttr[`${eIndex}_${attr}`]; // reset all information from template;
			}

			z = z.split(this.regax.split_between_codes);

			for (var i in z) {
				
				var t = z[i];

		
				var VirableArr = t.match(this.regax.s1_found);

				
				
				if (VirableArr != null) {


					for (var ic in VirableArr) {
						
					var key =   this.regax.s1_found.exec(VirableArr[ic]).groups.key;
						
					
					newValue = (this.IDs[index]['state']).get(key);
					
					// console.log(t,VirableArr[i], key);

					t = t.replace( /{{(\$\w+)}}/gim, newValue);


					
					// console.log(App.IDs.id905238920.state, App.IDs.id905238920.olderState)
					
				}
				// console.log(readyText);
			}
			if ((t).match(this.regax.s2_found) != null){


				t = t.replace(/\s+/gim, ' '); // remove extra spaces

				match = this.regax.s2_found.exec(t);

				contationValue = eval(match[1]);

				// console.log(contationValue);

				t = contationValue;

				// console.log(t);
				
		}
	
		if (t.match(this.regax.s3_found) != null) {
			

			t = t.replace(this.regax.s3_replace_brackets, '');

			var VirableName;
			while (VirableName = (this.regax.s3_get_virable_key).exec(t)) {
				
				VirableName = VirableName.replace('$', '');

				var VirableNameRe = "{{$"+ (VirableName).groups.virableName + "}}";

				t = t.replace((VirableNameRe), `App.IDs.${index}.state.get('${VirableName}')`);
				
			}

			t = eval(t);

			t = t.join('')

			// readyText = [];

		}
		// remove from version 0.0.4
		// if (arrAttr[attr] == "include"){
		// 	var url = e.getAttribute(arrAttr[attr]);
		// 	// console.log(url);

		// 	var Contxt = await this.LoadFromUrl(url).then(d => {
		// 		// console.log(d)
		// 		return d;
		// 	});
		// 	e.innerHTML = Contxt;

		// 	// now we have new app component insert this element 
		// 	// okey, now what, 
		// 	// we have single app in single include component
		// 	// then we need to get and inject it by new shared virable 
		// 	// okey how, we can inject virable to children components 
		// 	// how, we set at div or element has a "app" premission  
		// 	// and set at it a virable with some syntax
		// 	// syntax : $nameVirable="{{?$NameVirable_Instate}}"
		// 	//![You can using functions or objects or values(int, str, floot, bool)]
		// 	// or $nameVirable="Value" => (Value => Typeof => STRING)
		// 	// ![this way not using with functions or objects]
		// 	// then we using values to inject to state child componet 
		// 	// note, we skip any attr not has $ at frist of attr name
		// 	// this give you some space to using a normal attr like [class, id, etc]
		// 	this.injectShareVirableComponents({
		// 		el: e,
		// 		attrs: arrAttr,
		// 	});

			
		// }
		
	}
	
	e.setAttribute(arrAttr[attr], readyText.length == 0 ? t : readyText.join(' '))
		if (arrAttr[attr] == 'include') {
			// if this element just for includes other {comp} we should remove all information of it in app recycling
			// console.log(`${eIndex}_${attr}`)
			e.removeAttribute('include');
			delete this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`];
			delete this.IDs[index].templateAttr[`${eIndex}_${attr}`];
			// include attr not need a false to reloading system becaouse is used for once time and disapperd after that :D
			// break;
			return;
		}

		
		this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] = false;
		
		
	}
	return this;

	},
	LoadFromUrl: function (url)  {
		var req = new XMLHttpRequest();

		req.open('GET', url);

		req.send();
		
		return new Promise(resolve =>  {
				req.onloadend = (d) => {
				if (req.status == 200) {
					 resolve(req.responseText);
				}
			}
		})
	},
	CloneNodeList: function (list) {
		NodeList.prototype.forEach = Array.prototype.forEach;
		var cloneList = [];
		list.forEach(function(item){
			var cln = item.cloneNode(true);
			cloneList.push(cln);
		});
		return cloneList;
	},
	basedInDocument: function (el) {
		// this function use for checking if this element in a real DOM
		while (el.parentElement != null) {
			if (el.parentElement == document.body) {
				return true;
			}
			el = el.parentElement; // for check parent of 
		} // if loop break will return false mean element not in real DOM
		return false;
	},
	reloadingText : function  (eIndex, e, index) {

		if (this.basedInDocument(e) == false) {
			e.remove(); // remove element not have parent in DOM tree!
			return; // because this not a real element in a tree widgets|elements
		}
		// make sure is need rebuilding
		if (this.IDs[index].rebuilding[eIndex] == undefined) {
			this.IDs[index].rebuilding[eIndex] = true;
		} 
		// make sure is neet rebuilding
		if (this.IDs[index].rebuilding[eIndex] == false) {
			return;
		}
		// !importent
		// we use childNodes for get a real innerText for a element not get a child text
		// this make sence for controll a all text of element and not parents element make effect or make
		// a trouble thing in children innertext
		// debugger
		var eText = this.CloneNodeList(e.childNodes);
		

		if (this.IDs[index].virableListenIn[eIndex]) {
			this.IDs[index].virableListenIn[eIndex] = [];
		}

		// make sure has template => 
		if (this.IDs[index].template[`${eIndex}`] == undefined) {
			this.IDs[index].template[`${eIndex}`] =  this.CloneNodeList(eText);
		} else {
			eText = this.CloneNodeList(this.IDs[index].template[`${eIndex}`]); // reset all information from template;
		}
		var RealTextCompiled = [] // finnly text wil render
		var VirableUsedInThisCode = [];

		for (var et in eText) {
			if (et == "length" || et == "item" || et == "entries" || et == "values" || et == "keys" || et == "forEach") continue

			if (eText[et].nodeType == 1) {
				RealTextCompiled.push(
					eText[et],
				); // this mean a child and this not will compile by parent will compiled himself
				continue;
			}
			var readyText = []; // ready text of this childnode will render to a realtextcompiled
			
			var z = ((eText[et]).nodeValue).split(this.regax.split_between_codes); // split text
			
			
			
			
			for (var i in z) {
				
				var t = z[i];
				
				styles = {
					s1: false,
					s2: false,
				}
				
				VirableArr = t.match(this.regax.s1_found);
				
				
				
				if (VirableArr != null) {

					
					for (var ic in VirableArr) {
						
						var key =  this.regax.s1_found.exec(VirableArr[ic]).groups.key;
						
						VirableUsedInThisCode.push(key);	
						
						var newValue = (this.IDs[index]['state']).get(key);
						
						// console.log(t,VirableArr[i], key);
						
						
						t = t.replace( /{{(\$\w+)}}/gim, newValue);

						
						
						// console.log(App.IDs.id905238920.state, App.IDs.id905238920.olderState)
						
					}
					// console.log(readyText);
				} 
			if ((t).match(this.regax.s2_found) != null){
				
				
				// this not using any virable convert value becoase the prevaides lines replace all virable in {{$name}}
				
				t = t.replace(/\s+/gim, ' '); // remove extra spaces
				
				
				match = this.regax.s2_found.exec(t);
				
				contationValue = eval(match[1]);
				
				// console.log(contationValue);
				
				t = contationValue;
				
				// console.log(t);
				
			}
		
			if (t.match(this.regax.s3_found) != null) {
				
				t = t.replace(this.regax.s3_replace_brackets, '');
				
				var VirableName;
				while (VirableName = (this.regax.s3_get_virable_key).exec(t)) {
					
					//   var VirableName=(this.regax.s3_get_virable_key).exec(t);
					
					VirableName = (VirableName).groups.virableName.replace('$', '');
					
					VirableUsedInThisCode.push(VirableName); // key;
					
					var VirableNameRe = "{{?$"+ VirableName + "}}";
					
					t = t.replace((VirableNameRe), `App.IDs.${index}.state.get('${VirableName}')`);
					
				}

				// this line replace any {{\$Brex\.this\.Element\.eIndex}} to a real tree number of element
				// to help @component.js to find and controlling state
				t = t.replace(/{{\$Brex\.this\.Element\.eIndex}}/gmi, eIndex);
				
				t = eval(t);
				
				// t = t.join('') skip from version 0.3
				
				
				// readyText = [];
				
			}
			
			if (typeof t == "object") {
				for (var ib in t) {
					readyText.push(t[ib]);
				} 
			} else {
				readyText.push(t);
			}
		
		}
		RealTextCompiled.push(readyText);
		// if t or text is object will push it in html or not readyText will push
	}
		// console.log(RealTextCompiled, VirableUsedInThisCode);
		// debugger
		// here we replace all element inner html (nodeText,elementNode) with a new values and new state and new compiled code
		
			e.innerHTML = ''; // clear html in element
			for (rtc in RealTextCompiled){ // for real text compiled
				// debugger
				if (typeof RealTextCompiled[rtc] == 'string') { // if this is string add to innerhtml
					e.innerHTML += RealTextCompiled[rtc];
					
				} else if (typeof RealTextCompiled[rtc] == 'object' && (RealTextCompiled[rtc]).ELEMENT_NODE != 1) { // to know if he object not element 
					// some times with a child function style return a object, and this object contains text, and elements, and we check it and if text add or child append to a element 
					for (rtc_in_object in RealTextCompiled[rtc]) {
						if (typeof RealTextCompiled[rtc][rtc_in_object] == 'object' && (RealTextCompiled[rtc][rtc_in_object]).ELEMENT_NODE == 1) { // to know if is a elment or object
							e.appendChild(RealTextCompiled[rtc][rtc_in_object])
						} else {	
							e.innerHTML += (RealTextCompiled[rtc][rtc_in_object]);				
						}
					}
				}else if ( typeof RealTextCompiled[rtc] == 'object' && (RealTextCompiled[rtc]).ELEMENT_NODE == 1){ // if element append to the element
					e.appendChild(RealTextCompiled[rtc])
				}
			}
		// we make concat a array here because some times child function style inject a virables to VirableUsedInThisCode
		this.IDs[index].virableListenIn[eIndex] = VirableUsedInThisCode.concat(this.IDs[index].virableListenIn[eIndex]); // for caching virable listen in this element code
		this.IDs[index].rebuilding[eIndex] = false;
		return this;


	},
	 arraysEqual: function (a, b) {
		 
		if (a == null || b == null) return false;

		if ((a).size != (b).size) return false;

		for (var [key, value] of a.entries()) {

		  if (typeof(a.get(key)) == "function" || typeof(b.get(key)) == "function") {
			  continue;
		  }
		  if (a.get(key) !== b.get(key)) return false;
		
		}
		return true;
	  },
	setState: function (id, VarsNameNeetSetState) {
		var elementNeedSetState = [];

		/*
			we rebuild just element have virable changed values
			and to do that we checking if this element in using this 
			virable and if using it we will rebuilding it again if not 
			we skip it and not chaning anything in it.
		*/

		for (var u in this.IDs[id].virableListenIn) {
			for (var ui in VarsNameNeetSetState) {
				if ((this.IDs[id].virableListenIn[u]).includes(VarsNameNeetSetState[ui])) {
					elementNeedSetState.push(u);
				}
			}
		 }
		//  console.log(elementNeedSetState);
		for (var i in elementNeedSetState) {
			this.IDs[id].rebuilding[elementNeedSetState[i]] = true; // give compile permission to rebuilding all elements
			// this.IDs[id].rebuilding = []
			for (var ii in this.IDs[id].rebuilding) {
				if (elementNeedSetState[i] == ii) continue;
				var rgx = new RegExp(`^${elementNeedSetState[i]}`);
				// console.log('parent: ', elementNeedSetState[i] , 'child :', ii);
				if ((ii).match(rgx) != null) {
					// console.log('parent : ', elementNeedSetState[i], 'child : ', ii, 'stuties :success', );
					this.IDs[id].rebuilding[ii] = true; // give compile permission to rebuilding all elements
				}
			}
			// for (var ii in this.IDs[id].rebuildingAttr) {
			// 	if (i == ii) continue;
			// 	var rgx = new RegExp(`^${i}`);
			// 	console.log('parent: ', i , 'child :', ii);
			// 	if ((ii).match(rgx) != null) {
			// 		console.log('parent : ', i, 'child : ', ii, 'stuties :success', );
			// 		this.IDs[id].rebuildingAttr[ii] = true; // give compile permission to rebuilding all elements
			// 	}
			// }


		}
		// for (var i in this.IDs[id].rebuildingAttr) {
		// 	// console.log(this.IDs[id].rebuildingAttr)
		// 	this.IDs[id].rebuildingAttr[i] = true; // give compile permission to rebuilding all elements
		// }
		
		this.IDs[id].rebuildingAttr = []
		  
	  },
	stateMangment: function(id, oldState, newState) {

		if (this.arraysEqual(oldState, newState) == true) {
			// console.log('true', id, oldState, newState)
			return oldState || newState;
		}
		// console.log(this.IDs[id].rebuilding)
	
		this.setState(id);

		return newState;
		
	},
	copyMap : function (oldMap) {
		var newMap = new Map();
		for (var i of oldMap.keys()){
			newMap.set(i, oldMap.get(i));
		}
		return newMap;
	},
	SimpleAutoApp : function () {

		var arr = document.querySelectorAll("[permission='app'][autoAppState]");

		for (var ar in arr) {
			
			if (ar == "length" || ar == "__proto__") return;
			
			if (arr[ar].id == "") {
				// give it one id once time or if you put one thit's great
				arr[ar].id = "app_id_" + Math.floor( Math.random() * 99999990999);
			}

			if (App.IDs[arr[ar].id] != undefined) continue; // to not reload or recreate static app :D
			
			var App1 = App.create(arr[ar]);

			var state = App1.state(new Map([]));

			App1.recycle(
				function (State) {
					return State;
				}
			) // removed from this version to improve it 
		}
		

	},
	IsNeedRebuild: function () {

		var NeedRebuilding = false;

		var parent_elements = document.querySelectorAll('[permission="app"]');
		for (var p in parent_elements) {
			if (
				p == "length" ||
				p == "item" ||
				p == "namedItem" ||
				p == "entries" ||
				p == "forEach" ||
				p == "keys" || 
				p == "values") continue;
		
			var elements = (parent_elements[p]).getElementsByTagName('*');
		
			for (var i in elements) {
				if (i == "length" || i == "item" || i == "namedItem" || p == "entries") continue;
				// we have more one way to know if this element
				// need a rebuild to compelete a life or not 
				var element = elements[i];

				if (element == undefined) {
					continue;
				}

				

				var re = this.regax.s1_found
				var re1 = this.regax.s2_found
				var re2 = this.regax.s3_found

					
				if (
					element.getAttribute('include') != null || 
					element.innerHTML.match(re) != null ||
					element.innerHTML.match(re1) != null ||
					element.innerHTML.match(re2) != null
					) {
					// 	console.log(
					// 		element.getAttribute('include') != null,
					// element.innerHTML.match(re) != null ,
					// element.innerHTML.match(re1) != null,
					// element.innerHTML.match(re2) != null,
					// element
					// 	)
					NeedRebuilding = true;
					// console.log(this.IDs[(parent_elements[p]).id].rebuildingAttr)
					/**-
					 * we restart a rebuildAttr to [] to if restarting a forloop
					 * with include method will have a cached and this cached will restart
					 * and this will not able to building a element.
					 */
					// if (this.IDs[(parent_elements[p]).id] != undefined) {
					// 	this.IDs[(parent_elements[p]).id].rebuildingAttr = [];
					// }
					break;
				}

			}
		}
		return NeedRebuilding;

	},
	AppElements : [],
	building:  function () {

		// low app level not neet to make state and codes we helper it to make his code esay, simple, fast
		// debugger
		this.SimpleAutoApp();
		var id;
		for (id in this.IDs) {

			var el = this.IDs[id]['el'];

			// if this app is simple app we return all elements in app becouse it not have any script
			var body = el.getAttribute('autoAppState') != null ? el : el.children[1];

			// import a shared virable from parents components
			this.injectSharedVirableFromAppTag({
				el: el,
				id: id,
			});

			// for if state chaning back in recycle function !
			if (this.IDs[id].recycle != null) {
				var state = this.copyMap(this.IDs[id]['state']);
				var recycleState = this.copyMap(this.IDs[id]['state']);
				var recycleState = this.IDs[id].recycle(recycleState);
				
				this.IDs[id]['state'] = this.stateMangment(
					id,
					state,
					recycleState
					);
					
				}
				// delete old element or anything else;
				this.AppElements = [];
				this.forEachElementInApp(body, [], id);
				this.compileElements(id);

			
				
			}
			/**
				* this function just for check if some component need to 
				* building or some apps or elements neet help to complete 
				* a building view of his self
			 */
			var d = this.IsNeedRebuild();
				
			// debugger	
			if (d) {
				console.log('need Building')
				this.building();
			} else {
				// console.log('no', d)
			}
	},
	forEachElementInApp: function (e, parentIndexs, appId) {
		/**
		 * why we using this function and we can by esay way
		 * get all element by e.getElementsByTagName('*')
		 * we using this way to get element index in deffrants parents 
		 * and using this index for id elements in others proccessing 
		 */
		if (e == undefined) return;
		for (var i in e.children) {
			if (i == 'length' ||
				i == 'item' ||
				i == "namedItem") {
					return;
				}
			// console.log(e.children[i]);
	
			var parentIndexsCopy = parentIndexs.concat();
	
			parentIndexsCopy.push(i)
			// if Code => this need go to c
			// if not return as normal element
			// compile attr works with all element in app-body
			var elId = parentIndexsCopy.join('_');
			
			// this element bind with other app skip it, to make it use his state
			if ((e.children[i]).getAttribute('permission') != null && (e.children[i]).getAttribute('permission') == "app") continue;
			
			// make loop to ger each child in each parent ;
			this.AppElements.push({ 'id': elId,  'el': e.children[i]});
			
			this.forEachElementInApp(e.children[i], parentIndexsCopy, appId);

		}
	},
	compileElements:  function (appId) {

		
			var localCachedAppElements = (this.AppElements).concat();
			for (var i in localCachedAppElements) {
				

				var el = localCachedAppElements[i]['el'];
				var elId = localCachedAppElements[i]['id'];



				if (App.permission.reloadingText == true) {
					// code version 0.0.3 will check and compile all elements not except a CODE elements :D Good News
					this.reloadingText(
						elId,
						el,
						appId,
						);
				}
			if (App.permission.reloadingAttr == true) {
				this.reloadingAttr(
					elId,
					el,
					appId,
					)
				}
		// console.log('2')

				
		}
		// console.log('3')


	}
}

/** 
 * setState is function calling to rebuild values in elements in same App system :D 
 * to use it we using in functions in state app.
*/

Map.prototype.setState =
/**
 * @example
 * newValueOfX = true;
 * this.setState({
 * 	x: newValueOfX
 * })
 * @param {object} updates 
 */
function (updates)  {
	var AppID = this.get('AppID');
	var keysNeedToSetState = [];
	for (var i in updates) {
		key = i;
		keysNeedToSetState.push(key);
		value = updates[i];
		this.set(key, value);
	}
	App.setState(AppID, keysNeedToSetState);
	App.extensions(AppID, keysNeedToSetState);
	App.building();
}


setInterval( function () {
	/**
	 * this function just for check if some component need to 
	 * building or some apps or elements neet help to complete 
	 * a building view of his self
	 */
	// var d = App.IsNeedRebuild();
	// if (d) {
	// 	console.log('need Building')
	// 	await App.building();
	// 	console.log('builded')
	// } else {
	// 	// console.log('no', d)
	// }

	// check if apps is exist or lost elements or else
	// becaouse some times element reloading and lost a his app 
	// and this app still cached in main App and this take more
	// data size and useless and speedless for works with this
	// big data !!
	for (var i in App.IDs) {
		var id = i;

		var el = document.querySelector(`#${id}`);

		if (el == null) {
			delete App.IDs[id];
		}
	}
	
}, 1000);


