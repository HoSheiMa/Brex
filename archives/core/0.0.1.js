// core.js file
// core of Rex library
//version : 0.0.1
window.App = window.Rev = {
	IDs : {

	},
	focus_app : null,
	returnNewId:function () {
		for (;;) {
			r = `id_` + Math.floor(Math.random() * 99999999)
			if (this.IDs[r] == undefined) break;
		}
		return r;
	},

	create: function (el) {
		id = el.id;

		this.focus_app = id;

		this.IDs[id] = {
			el: el,
			findNew: false,
			template: [],
			templateAttr:[],
			state: new Map(),
			recycle: null,
			rebuilding: [],
			rebuildingAttr:[],
		};

		return this;
	},
	state: function (state) {
		if (this.focus_app != null) {
			this.IDs[id]['state'] = state; 
		}

		return this.IDs[this.focus_app]['state'];
	},
	recycle: function (fn) {
		if (this.focus_app != null) {
			this.IDs[id]['recycle'] = fn; 
		}		
	},
	reloadingAttr:  async function (eIndex, e, index) {
		state = this.IDs[index]['state'];

	
		arrAttr = e.getAttributeNames()

		
		re = /(\$\w+)/gim
		re1 = /\s*?\{\{(\s*?(.*)\s*?(==|>|<|<=|>=|===)\s*?(.*)\s*?\n?\?\s*?\n?(([^\0]+)?)\n?\s*?:\s*?\n?(([^\0]+)?))\n?\s*?\}\}\s*?/gim
		// {{ 1 == 1 ? <span>False</span> : <span>True</span> }}

		
		for (attr in arrAttr) {
			readyText = [];
			
			// make sure is neet rebuilding
			if (this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] == undefined) {
				this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] = true;
			} 
			// make sure is neet rebuilding
			if (this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] == false) {
				return;
			} 
			
			z = e.getAttribute(arrAttr[attr]);
			// make sure has temple => 
			if (this.IDs[index].templateAttr[`${eIndex}_${attr}`] == undefined) {
				this.IDs[index].templateAttr[`${eIndex}_${attr}`] =  e.getAttribute(arrAttr[attr]);
			} else {
				z = this.IDs[index].templateAttr[`${eIndex}_${attr}`]; // reset all information from template;
			}

			z = z.split(/{{&&}}|{{&amp;&amp;}}/);

			for (i in z) {
				
				t = z[i];

				styles = {
					s1: false,
					s2: false,
				}
				
				VirableArr = t.match(re);

				
				
				if (VirableArr != null) {

					styles.s1 = true;
					
					for (i in VirableArr) {
						
					key =  (VirableArr[i]).split('$')[1];
						
					
					newValue = (this.IDs[index]['state']).get(key);
					
					// console.log(t,VirableArr[i], key);

					t = t.replace( /{{(\$\w+)}}/gim, newValue);


					
					// console.log(App.IDs.id905238920.state, App.IDs.id905238920.olderState)
					
				}
				// console.log(readyText);
			}
			if ((t).match(re1) != null){

				t = t.replace(/\s+/gim, ' '); // remove extra spaces

				styles.s2 = true;

				match = re1.exec(t);

				contationValue = eval(match[1]);

				// console.log(contationValue);

				t = contationValue;

				// console.log(t);
				
		}
	
		if (t.match(/{{(JS|js|javascript|JAVASCRIPT|code|CODE)/im) != null) {
			t = t.replace(/^\s*?{{(JS|js|javascript|JAVASCRIPT|code|CODE)?\s*?|\s*?}}\s*?$/gim, '');


			while ((/::(?<virableName>.*?)::/gim).exec(t) != null) {
				
				VirableName =(((/::(?<virableName>.*?)::/gim).exec(t)).groups.virableName).replace('$', '');

				VirableNameRe = "::"+ ((/::(?<virableName>.*?)::/gim).exec(t)).groups.virableName + "::";

				t = t.replace((VirableNameRe), `App.IDs.${index}.state.get('${VirableName}')`);
				
			}
		




			t = eval(t);

			t = t.join('')

			// readyText = [];

		}
		if (arrAttr[attr] == "include"){

			var url = z[i];

			var Contxt = await this.LoadFromUrl(url).then(d => {
				// console.log(d)
				return d;
			});

			e.innerHTML = Contxt;

			// console.log(e);

			
		}
		
	}
	
		e.setAttribute(arrAttr[attr], readyText.length == 0 ? t : readyText.join(' '));
		if (arrAttr[attr] == 'include') {
			// if this element just for includes other {comp} we should remove all information of it in app recycling
			console.log(eIndex)
			e.removeAttribute('include');
			delete this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`];
			delete this.IDs[index].templateAttr[`${eIndex}_${attr}`];
		}

		
		this.IDs[index].rebuildingAttr[`${eIndex}_${attr}`] = false;
		
		
	}
	// App.building()

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
	reloadingText : async function  (eIndex, e, index) {

		

		state = this.IDs[index]['state'];
		
		// make sure is neet rebuilding
		if (this.IDs[index].rebuilding[eIndex] == undefined) {
			this.IDs[index].rebuilding[eIndex] = true;
		} 
		// make sure is neet rebuilding
		if (this.IDs[index].rebuilding[eIndex] == false) {
			return;
		} 

		eText = e.innerHTML;
		// make sure has temple => 
		if (this.IDs[index].template[`${eIndex}`] == undefined) {
			this.IDs[index].template[`${eIndex}`] =  eText;
		} else {
			eText = this.IDs[index].template[`${eIndex}`]; // reset all information from template;
		}
		readyText = [];
		
		z = eText.split(/{{&&}}|{{&amp;&amp;}}/);
		
		re = /(\$\w+)/gim
		re1 = /\s*?\{\{(\s*?(.*)\s*?(==|>|<|<=|>=|===)\s*?(.*)\s*?\n?\?\s*?\n?(([^\0]+)?)\n?\s*?:\s*?\n?(([^\0]+)?))\n?\s*?\}\}\s*?/gim
		// {{ 1 == 1 ? <span>False</span> : <span>True</span> }}

		
		
		
		
		for (i in z) {
			
			t = z[i];

			styles = {
				s1: false,
				s2: false,
			}
			
			VirableArr = t.match(re);

			
			
			if (VirableArr != null) {

				styles.s1 = true;
				
				for (i in VirableArr) {
					
				key =  (VirableArr[i]).split('$')[1];
					
				
				newValue = (this.IDs[index]['state']).get(key);
				
				// console.log(t,VirableArr[i], key);

				t = t.replace( /{{(\$\w+)}}/gim, newValue);


				
				// console.log(App.IDs.id905238920.state, App.IDs.id905238920.olderState)
				
			}
			// console.log(readyText);
		} 
		if ((t).match(re1) != null){

				t = t.replace(/\s+/gim, ' '); // remove extra spaces

				styles.s2 = true;

				match = re1.exec(t);

				contationValue = eval(match[1]);

				// console.log(contationValue);

				t = contationValue;

				// console.log(t);
				
		}
	
		if (t.match(/{{(JS|js|javascript|JAVASCRIPT|code|CODE)/im) != null) {
			t = t.replace(/^\s*?{{(JS|js|javascript|JAVASCRIPT|code|CODE)?\s*?|\s*?}}\s*?$/gim, '');


			while ((/::(?<virableName>.*?)::/gim).exec(t) != null) {
				
				VirableName =(((/::(?<virableName>.*?)::/gim).exec(t)).groups.virableName).replace('$', '');

				VirableNameRe = "::"+ ((/::(?<virableName>.*?)::/gim).exec(t)).groups.virableName + "::";

				t = t.replace((VirableNameRe), `App.IDs.${index}.state.get('${VirableName}')`);
				
			}
		




			t = eval(t);

			t = t.join('')

			// readyText = [];

		}


		readyText.push(t);

	}
	// t = t.replace(/{{&&}}|{{&amp;&amp;}}/, '');
		// console.log(readyText)
		e.innerHTML =  readyText.length == 0 ? t : readyText.join(' ');
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
	setState: function () {
		for (i in this.IDs[id].rebuilding) {
			this.IDs[id].rebuilding[i] = true; // give compile permission to rebuilding all elements
		}
		for (i in this.IDs[id].rebuildingAttr) {
			this.IDs[id].rebuildingAttr[i] = true; // give compile permission to rebuilding all elements
		}
		  
	  },
	stateMangment: function(id, oldState, newState) {

		if (this.arraysEqual(oldState, newState) == true) {
			// console.log('true', id, oldState, newState)
			return oldState || newState;
		}
		// console.log(this.IDs[id].rebuilding)
	
		this.setState();

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

		arr = document.querySelectorAll("[permission='app'][autoAppState]");

		for (ar in arr) {
			
			if (ar == "length" || ar == "__proto__") return;
			
			if (arr[ar].id == "") {
				// give it one id once time or if you put one thit's great
				arr[ar].id = "app_id_" + Math.floor( Math.random() * 99999990999);
			}

			if (App.IDs[arr[ar].id] != undefined) return; // to not reload or recreate static app :D
			
			var App1 = App.create(arr[ar]);

			state = App1.state(new Map([]));

			App1.recycle(
				function (State) {
					return State;
				}
			)
		}
		

	},
	building: async function () {

		// low app level not neet to make state and codes we helper it to make his code esay, simple, fast
		this.SimpleAutoApp();
		for (id in this.IDs) {

			el = this.IDs[id]['el'];

			// if this app is simple app we return all elements in app becouse it not have any script
			body = el.getAttribute('autoAppState') != null ? el : el.children[1];

			// for if state chaning back in recycle function !
			if (this.IDs[id].recycle != null) {
				state = this.copyMap(this.IDs[id]['state']);
				recycleState = this.copyMap(this.IDs[id]['state']);
				recycleState = this.IDs[id].recycle(recycleState);
				
				this.IDs[id]['state'] = this.stateMangment(
					id,
					state,
					recycleState
					);
					
				}

				
				await this.forEachElementInApp(body, [], id);
				// render end
				console.log('reder end');
				// this.building();

		}
	},
	// AppElements : [],
	forEachElementInApp(e, parentIndexs, appId) {
		// console.log(e);
		for (var i in e.children) {
			if (i == 'length' ||
				i == 'item' ||
				i == "namedItem") {
					return;
				}
			// 	console.log([i])
			// if (e.children[i] == undefined) return; 
	
			parentIndexsCopy = parentIndexs.concat();
	
			parentIndexsCopy.push(i)
			// if Code => this need go to c
			// if not return as normal element
			// compile attr works with all element in app-body
			// this.AppElements.push({ id: parentIndexsCopy.join('_'),  el: e.children[i]})
			if (e.children[i].tagName == "CODE") {
				// console.log('Code', parentIndexsCopy);
				this.reloadingText(
					parentIndexsCopy.join('_'),
					e.children[i],
					appId,
				);
			} else {
				this.reloadingAttr(
					parentIndexsCopy.join('_'),
					e.children[i],
					appId,
				)
			}
			if ((e.children[i]).getAttribute('permission') != null && (e.children[i]).getAttribute('permission') == "app") return; // this element bind with other app skip it, to make it use her state
			// console.log(e.children[i].id, parentIndexsCopy)
			this.forEachElementInApp(e.children[i], parentIndexsCopy, appId);
	
		
		}
		

	}
}
// setInterval(() => App.building(),1000);

