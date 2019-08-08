Rax = Class || Function
/**
 * Rax is function/class for registration/inject state to Rax-app
 * ! it's require for root component
 */
Component = Class || Function
/**
 * if function/class for creating a app sturction for make it ready to core.js understant it and 
 * work with it
 * it's able to export and import component in root component
 * and have a great tools including it soon! 
 */
View = Class || Function
/**
 * it's function for filtering children and pushing it to Class\Functoin(Component)
 */
Child = Class || Function
/**
 * it's Class/Function for creating div for add text to child component to redering it to top parent
 */
typeof Child
/**
 * type 1
    * Child({
        *  type: 'div' -> default
                * !important
                you can select a type but will break a default style
                and if you wanna to use a state virable in innerText or innerHTML on element
                you should insert this virable in <code></code> element or using child function and select a type: code
                and put a virable or text inner it    
        *  text: 'Hello world',
        *  children: [],
    * })
 * 
 * type 2
 * (nameImportComponent) 
 *
 * type 3
 * a function child 
    * function ( ) {
        *  console.log(this.state);
        * console.log(this.AppID);
        * return [
            * 'Hello world', // type 0 low level child redern but work fine here 
            * (nameImportComponent), // type 2
            * Child({text : 'function type child class'}, true) // type 3
        * ]
    * }
 * ! this type should return a array and in this array will has elements or component render init
 */