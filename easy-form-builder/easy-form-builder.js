/*
###########################
Initialization
###########################
*/

//Global initialization function
function initialize_easy_form_builder(container,load) {
	easy_form_builders[efb_global_id] = new easy_form_builder(efb_global_id,load); //Create new easy form builder object and store inside instances array
	easy_form_builders[efb_global_id].initialize(container); //Run instance initialization
	efb_global_id++; //Increment instance index
}
//Instance object
function easy_form_builder(efb_global_id,load) {
	this.unique_id = efb_global_id;
	this.elem = null;
	this.elem_pos = null;
	this.load_form = null;
	this.active_element = null;
	this.pages = (load === null ? [null] : load); //form pages
	this.active_page = 0; //active page
}
//Instance object intialization function
easy_form_builder.prototype = {
	constructor: easy_form_builder,
	initialize: function(container) {
		this.elem = document.getElementById(container);
		this.elem.innerHTML = '';
		/*
		> Template Layout
		- Object passed to "efb_createLayout" on initialization
		- HTML is appended to the element referenced by id in function "initialize_easy_form_builder"
		*/
		var pages_group = [{
			tag: 'button',
			type: 'button',
			class_name: 'btn btn-sm btn-default',
			text: 'Load Page'
		}];
		for (var i=0; i<this.pages.length; i++) {
			pages_group.push({
				tag: 'button',
				type: 'button',
				class_name: 'btn btn-sm btn-primary',
				id: '__'+this.unique_id,
				text: i+1,
				functions: [
					{
						call: 'click',
						action: function() {
							readAction(this);
						}
					}
				],
				children: [
					{
						tag: 'input',
						type: 'hidden',
						name: 'action',
						value: 'loadPage'
					},
					{
						tag: 'input',
						type: 'hidden',
						name: 'data',
						value: i
					}
				]
			});
		}
		efb_createLayout(this.elem,[
			{
				tag: 'div',
				id: 'efb_instance_'+this.unique_id,
				class_name: 'easy_form_builder',
				children: [
					{
						tag: 'div',
						id: 'efb_toolbar_'+this.unique_id,
						class_name: 'efb_tool_bar',
						children: [
							{
								tag: 'div',
								class_name: 'row',
								children: [
									{
										tag: 'div',
										class_name: 'col-sm-6',
										children: null
									},
									{
										tag: 'div',
										class_name: 'col-sm-6',
										style: 'text-align:right',
										children: [
											{
												tag: 'div',
												class_name: 'btn-group btn-group-sm',
												style: 'margin-right:20px;',
												children: pages_group
											},
											{
												tag: 'button',
												type: 'button',
												class_name: 'btn btn-sm btn-info',
												id: '__'+this.unique_id,
												text: 'Add',
												functions: [
													{
														call: 'click',
														action: function() {
															readAction(this);
														}
													}
												],
												children: [
													{
														tag: 'input',
														type: 'hidden',
														name: 'action',
														value: 'addPage'
													},
													{
														tag: 'input',
														type: 'hidden',
														name: 'data',
														value: i
													}
												]
											},
											{
												tag: 'button',
												type: 'button',
												class_name: 'btn btn-sm btn-danger',
												id: '__'+this.unique_id,
												text: 'Remove',
												functions: [
													{
														call: 'click',
														action: function() {
															readAction(this);
														}
													}
												],
												children: [
													{
														tag: 'input',
														type: 'hidden',
														name: 'action',
														value: 'removePage'
													},
													{
														tag: 'input',
														type: 'hidden',
														name: 'data',
														value: i
													}
												]
											},
											{
												tag: 'button',
												type: 'button',
												class_name: 'btn btn-sm btn-success',
												id: '__'+this.unique_id,
												text: 'Save',
												functions: [
													{
														call: 'click',
														action: function() {
															readAction(this);
														}
													}
												],
												children: [
													{
														tag: 'input',
														type: 'hidden',
														name: 'action',
														value: 'savePage'
													},
													{
														tag: 'input',
														type: 'hidden',
														name: 'data',
														value: i
													}
												]
											}
										]
									}
								]
							}
						]
					},
					{
						tag: 'div',
						id: 'efb_slate_'+this.unique_id,
						class_name: 'efb_slate',
						functions: [
							{
								call: 'contextmenu',
								action: function(event) {
									efb_createMenu(event);
									event.preventDefault();
								}
							}
						],
						children: this.pages[this.active_page]
					}
				]
			}
		]);
	}
}

/*
###########################
Global Variables
###########################
*/

/*
> EFB Instances
*/
var efb_global_id = 1;
var easy_form_builders = [];

/*
> Menu Options
	- Object key is used to reference its menu options (array of objects)
	- Each object in the array is a new menu item
	- Object properties are:
		- "text"					Menu item's innerHTML
		- "action"				Javascript function to reference onclick ("efb_" is prepended to the function name)
		- "to_state"			Onclick, open another menu by object key reference
		- "return_state"	Offer a "previous menu" option, reference by object key
		- "data"					Allows the passing of any data to the "action" function
*/
var efb_menu_options = {
	efb_slate: [
		{
			text: '+ Row',
			action: 'createRow',
			to_state: null,
			return_state: null,
			data: null
		}
	],
	efb_row: [
		{
			text: 'Push Row',
			action: 'pushRow',
			to_state: null,
			return_state: null,
			data: null
		},
		{
			text: '+ Column',
			action: 'createColumns',
			to_state: null,
			return_state: 'efb_row',
			data: null
		},
		{
			text: 'Delete',
			action: 'removeSelf',
			to_state: null,
			return_state: null,
			data: null
		}
	],
	efb_col: [
		{
			text: '+ Row',
			action: 'createRow',
			to_state: null,
			return_state: null,
			data: null
		},
		{
			text: '+ Text',
			action: 'createTextBox',
			to_state: null,
			return_state: 'efb_col',
			data: null
		},
		{
			text: '+ Form Object',
			action: null,
			to_state: 'input_menu',
			return_state: 'efb_col',
			data: null
		},
		{
			text: 'Delete',
			action: 'removeSelf',
			to_state: null,
			return_state: null,
			data: null
		},
		{
			text: 'Delete Row',
			action: 'removeParent',
			to_state: null,
			return_state: null,
			data: null
		}
	],
	input_menu: [
		{
			text: 'Text',
			action: 'createInput',
			to_state: null,
			return_state: 'efb_col',
			data: 'text'
		},
		{
			text: 'Textarea',
			action: 'createInput',
			to_state: null,
			return_state: 'efb_col',
			data: 'textarea'
		},
		{
			text: 'Checkbox',
			action: 'createInput',
			to_state: null,
			return_state: 'efb_col',
			data: 'checkbox'
		},
		{
			text: 'Radio',
			action: 'createInput',
			to_state: null,
			return_state: 'efb_col',
			data: 'radio'
		},
		{
			text: 'Select',
			action: 'createInput',
			to_state: null,
			return_state: 'efb_col',
			data: 'select'
		}
	],
	'efb_input': [
		{
			text: 'Delete',
			action: 'removeSelf',
			to_state: null,
			return_state: null,
			data: null
		}
	],
	'efb_textbox': [
		{
			text: 'Delete',
			action: 'removeSelf',
			to_state: null,
			return_state: null,
			data: null
		}
	]
}

/*
###########################
Data Functions
###########################
*/

//Make first letter of words in setence uppercase
function efb_to_title(s) {
	var w = s.split(' ');
	for (var i=0; i<w.length; i++) {
		w[i] = w[i].charAt(0).toUpperCase()+w[i].slice(1);
	}
	return w.join(' ');
}

//Get instance from element id
function efb_get_instance(elem) {
	return parseInt(elem.id.split('_')[2]);
}

//Get data from element's hidden inputs
function efb_get_data(elem) {
	var data = {};
	for (var i=0; i<elem.children.length; i++) {
		if (elem.children[i].type == 'hidden') {
			data[elem.children[i].name] = elem.children[i].value;
		}
	}
	return data;
}

//Take array of objects and run past pre-defined element attributes to create element and append to "output"
function efb_createLayout(output,layout) {
	for (var i=0; i<layout.length; i++) {
		var elem = document.createElement(layout[i].tag);
		if (typeof layout[i].id !== 'undefined' && layout[i].id !== null) {
			elem.id = layout[i].id;
		}
		if (typeof layout[i].class_name !== 'undefined' && layout[i].class_name !== null) {
			elem.className = layout[i].class_name;
		}
		if (typeof layout[i].style !== 'undefined' && layout[i].style !== null) {
			elem.style.cssText = layout[i].style;
		}
		if (typeof layout[i].text !== 'undefined' && layout[i].text !== null) {
			elem.innerHTML = layout[i].text;
		}
		if (typeof layout[i].type !== 'undefined' && layout[i].type !== null) {
			elem.type = layout[i].type;
		}
		if (typeof layout[i].name !== 'undefined' && layout[i].name !== null) {
			elem.name = layout[i].name;
		}
		if (typeof layout[i].value !== 'undefined' && layout[i].value !== null) {
			elem.value = layout[i].value;
		}
		if (typeof layout[i].checked !== 'undefined' && layout[i].checked == true) {
			elem.checked = true;
		}
		if (typeof layout[i].selected !== 'undefined' && layout[i].selected == true) {
			elem.selected = true;
		}
		if (typeof layout[i].placeholder !== 'undefined' && layout[i].placeholder !== null) {
			elem.placeholder = layout[i].placeholder;
		}
		if (typeof layout[i].functions !== 'undefined' && layout[i].functions !== null) {
			for (var i2=0; i2<layout[i].functions.length; i2++) {
				elem.addEventListener(layout[i].functions[i2].call,layout[i].functions[i2].action);
			}
		}
		if (typeof layout[i].children !== 'undefined' && layout[i].children !== null) {
			efb_createLayout(elem,layout[i].children);
		}
		output.appendChild(elem);
	}
	return output;
}

//Create object from HTML element
function efb_createObjectFromElement(elem) {
	var obj = {
		tag: elem.tagName,
		class_name: elem.className,
		id: elem.id, 
		style: elem.cssText,
		text: null,
		type: elem.type,
		name: elem.name,
		value: elem.value,
		checked: elem.checked,
		selected: elem.selected,
		placeholder: elem.placeholder,
		children: []
	};
	return obj;
}
//Create object from element and its children than can be passed back into "efb_createLayout"
function efb_structureSave(elem) {
	var c = elem.children;
	var obj = efb_createObjectFromElement(elem);
	for (var i=0; i<c.length; i++) {
		obj.children.push(efb_structureSave(c[i]));
	}
	if (obj.children.length === 0) {
		obj.text = elem.innerHTML;
	}
	return obj;
}

/*
> Read Generic Action
- Call functions based on hidden input variables
*/
function readAction(elem) {
	var instance = efb_get_instance(elem);
	var states = efb_get_data(elem);
	if (typeof states.action !== 'undefined' && states.action != '') {
		window['efb_'+states.action](elem,instance,states);
	} else if (typeof states.to_state !== 'undefined' && states.to_state != '') {
		efb_setMenu(instance,efb_getMenuOptions(states.to_state,instance),states);
	} else if (typeof states.return_state !== 'undefined' && states.return_state != '') {
		var reference = states.return_state;
		states.return_state = null;
		efb_setMenu(instance,efb_getMenuOptions(reference,instance),states);
	}
}

/*
###########################
Toolbar Functions
###########################
*/
//Load Page
function efb_loadPage(elem,instance,states) {
	easy_form_builders[instance].active_page = states.data;
	easy_form_builders[instance].initialize(easy_form_builders[instance].elem.id);
}
//Save Page
function efb_savePage(elem,instance,states) {
	efb_closeMenu(instance);
	easy_form_builders[instance].pages[easy_form_builders[instance].active_page] = efb_saveMenu(instance);
}
//Add Page
function efb_addPage(elem,instance,states) {
	easy_form_builders[instance].pages.push(null);
	easy_form_builders[instance].active_page = easy_form_builders[instance].pages.length-1;
	easy_form_builders[instance].initialize(easy_form_builders[instance].elem.id);
}
//Remove Page
function efb_removePage(elem,instance,states) {
	if (easy_form_builders[instance].pages.length > 1) {
		easy_form_builders[instance].pages.splice(easy_form_builders[instance].active_page,1);
		easy_form_builders[instance].active_page = 0;
		easy_form_builders[instance].initialize(easy_form_builders[instance].elem.id);
	}
}

/*
###########################
Menu Functions
###########################
*/

/*
> Create Menu
- Function called from "contextmenu" event listener in "Template Layout"
- EFB menu option object key must be the first class name to reference "efb_menu_options"
*/
function efb_createMenu(event) {
	var elem = event.path[0]; 
	if (typeof efb_menu_options[elem.className.split(' ')[0]] === 'undefined') { //if element is not a menu option, either find one or stop
		while (elem.className != 'easy_form_builder') {
			elem = elem.parentNode;
			if (typeof efb_menu_options[elem.className.split(' ')[0]] !== 'undefined') {
				break;
			}
		}
	}
	var instance = efb_get_instance(elem);
	efb_closeMenu(instance); //Close previous menu
	easy_form_builders[instance].active_element = elem; //Get current EFB object and set the active element
	if (easy_form_builders[instance].elem_pos === null) {
		var pos_elem = easy_form_builders[instance].elem.children[0];
		easy_form_builders[instance].elem_pos = {
			left: pos_elem.offsetLeft,
			top: pos_elem.offsetTop
		}
	}
	var efb_menu_toolbar_height = document.getElementById('efb_toolbar_'+instance).offsetHeight;
	//Append menu HTML to instance slate
	efb_createLayout(document.getElementById('efb_slate_'+instance),[
		{
			tag: 'div',
			id: 'efb_menu_'+instance,
			class_name: 'efb_menu',
			style: 'left:'+(event.pageX-easy_form_builders[instance].elem_pos.left-2)+'px;top:'+(event.pageY-efb_menu_toolbar_height-easy_form_builders[instance].elem_pos.top-2)+'px;', //-2 account for borders
			children: efb_getMenuOptions(elem.className.split(' ')[0],instance)
		}
	]);
}

/*
> Set Menu Items
- Used for setting menu items after the menu has been created
- Allows for menu states to be read before creating menu, this allows for the "return_state" property to work
*/
function efb_setMenu(instance,list,states) {
	efb_clearMenu(instance);
	if (states.return_state !== null) {
		list.unshift({
			tag: 'div',
			class_name: 'efb_previous_menu',
			id: '__'+instance,
			text: 'Previous Menu',
			functions: [
				{
					call: 'click',
					action: function() {
						readAction(this);
					}
				}
			],
			children: [
				{ tag: 'input', type: 'hidden', name: 'return_state', value: states.return_state },
			]
		});
	}
	efb_createLayout(document.getElementById('efb_menu_'+instance),list);
}

/*
> Create Menu Item
- Take the menu option objects from "efb_menu_options" referenced by the its object key and create menu elements
*/
function efb_getMenuOptions(reference,instance) {
	var actions = efb_menu_options[reference];
	var options = [];
	for (var i=0; i<actions.length; i++) {
		options.push({
			tag: 'div',
			id: '__'+instance,
			class_name: 'efb_menu_item',
			text: actions[i].text,
			functions: [
				{
					call: 'click',
					action: function() {
						readAction(this);
					}
				}
			],
			children: [
				{ tag: 'input', type: 'hidden', name: 'action', value: actions[i].action },
				{ tag: 'input', type: 'hidden', name: 'to_state', value: actions[i].to_state },
				{ tag: 'input', type: 'hidden', name: 'return_state', value: actions[i].return_state },
				{ tag: 'input', type: 'hidden', name: 'data', value: actions[i].data }
			]
		});
	}
	return options;
}

//Clear menu
function efb_clearMenu(instance) {
	var menu = document.getElementById('efb_menu_'+instance);
	if (menu !== null) {
		menu.innerHTML = '';
	}
}
//Close menu
function efb_closeMenu(instance) {
	var menu = document.getElementById('efb_menu_'+instance);
	if (menu !== null) {
		menu.remove();
	}
}

/*
###########################
Inner Menu Functions
###########################
*/

//Create row element
function efb_createRow(elem,instance) {
	efb_createLayout(easy_form_builders[instance].active_element,[
		{
			tag: 'div',
			id: '__'+instance,
			class_name: 'efb_row row'
		}
	]);
	efb_closeMenu(instance);
}

//Push new row under current row parent
function efb_pushRow(elem,instance) {
	efb_createLayout(easy_form_builders[instance].active_element.parentNode,[
		{
			tag: 'div',
			id: '__'+instance,
			class_name: 'efb_row row'
		}
	]);
	efb_closeMenu(instance);
}

//Create column menu
function efb_createColumns(elem,instance,states) {
	var create_widths = '';
	for (var i=1; i<=12; i++) {
		create_widths += '<button class="btn btn-sm btn-warning" onclick="efb_setColumns('+i+','+instance+')">'+i+'</button>';
	}
	efb_setMenu(instance,[
		{
			tag: 'div',
			class_name: 'efb_menu_slate',
			id: '__'+instance,
			text: '<div class="efb_menu_head">Column Width</div> <div class="btn-group">'+create_widths+'</div>'
		}
	],states);
}
//Get value from column menu and append "sized" column to the active row
function efb_setColumns(value,instance) {
	efb_createLayout(easy_form_builders[instance].active_element,[
		{
			tag: 'div',
			id: '__'+instance,
			class_name: 'efb_col col-sm-'+value
		}
	]);
	efb_closeMenu(instance);
}

//Create text box menu
function efb_createTextBox(elem,instance,states) {
	efb_setMenu(instance,[
		{
			tag: 'div',
			class_name: 'efb_menu_head',
			text: 'Create Text Box'
		},
		{
			tag: 'div',
			class_name: 'efb_menu_slate',
			id: '__'+instance,
			children: [
				{
					tag: 'textarea',
					class_name: 'form-control',
					style: 'min-width:300px;min-height:400px;',
				},
				{
					tag: 'input',
					type: 'button',
					value: 'Create',
					id: '__'+instance,
					class_name: 'btn btn-sm btn-info',
					functions: [
						{
							call: 'click',
							action: function() {
								efb_setTextBox(this);
							}
						}
					]
				}
			]
		}
	],states);
}
//Append text box value to active column
function efb_setTextBox(elem) {
	var instance = elem.id.split('_')[2];
	var data = elem.parentNode.children[0].value;
	efb_createLayout(easy_form_builders[instance].active_element,[
		{
			tag: 'div',
			id: '__'+instance,
			class_name: 'efb_textbox',
			text: data
		}
	]);
	efb_closeMenu(instance);
}

//Input Objecy
function efb_form_object() {
	this.fields = [
		['label','text'],
		['name','text'],
		['class','text'],
		['id','text'],
		['style','text']
	];
}
//Extend classes for specific input types
function efb_input_text() { //Text
	efb_form_object.apply(this);
	this.fields.push(['value','text']);
	this.fields.push(['placeholder','text']);
	this.mask = '<input type="text" name="[name]" id="[id]" class="[class]" style="[style]" value="[value]" placeholder="[placeholder]" />';
}
function efb_input_select() { //Select
	efb_form_object.apply(this);
	this.fields.push(['options','multiple_text']);
	this.mask = '<select name="[name]" id="[id]" class="[class]" style="[style]">[options]</select>';
}
function efb_input_checkbox() { //Checkbox
	efb_form_object.apply(this);
	this.fields.push(['value','text']);
	this.fields.push(['checked','checkbox']);
	this.mask = '<input type="checkbox" name="[name]" id="[id]" class="[class]" style="[style]" value="[value]" />';
}
function efb_input_radio() { //Radio
	efb_form_object.apply(this);
	this.fields.push(['value','text']);
	this.fields.push(['selected','checkbox']);
	this.mask = '<input type="radio" name="[name]" id="[id]" class="[class]" style="[style]" value="[value]" />';
}
function efb_input_textarea() { //Textarea
	efb_form_object.apply(this);
	this.fields.push(['value','text']);
	this.mask = '<textarea name="[name]" id="[id]" class="[class]" style="[style]">[value]</textarea>';
}
/*
> Create Input Menu Form
- Creates a form from the type of input selected, referenced by fields in "Input Object"
*/
function efb_createInput(elem,instance,states) {
	var input = new window['efb_input_'+states.data]();
	var print_name = efb_to_title(states.data);
	var fields = [];
	fields.push({
		tag: 'div',
		class_name: 'efb_menu_slate',
		children: [
			{
				tag: 'div',
				class_name: 'efb_menu_head',
				text: 'Create '+print_name+' Input',
			},
			{
				tag: 'input',
				type: 'hidden',
				name: 'mask',
				value: encodeURIComponent(input.mask)
			},
			{
				tag: 'div',
				children: efb_generateRequestFields(input.fields)
			},
			{
				tag: 'div',
				style: 'text-align:right;',
				children: [
					{
						tag: 'input',
						id: '__'+instance,
						type: 'button',
						value: 'Create',
						class_name: 'btn btn-sm btn-primary',
						functions: [
							{
								call: 'click',
								action: function() {
									efb_insertInput(this);
								}
							}
						]
					}
				]
			}
		]
	});
	efb_setMenu(instance,fields,states);
}

/*
> Create Inputs From Fields
- Takes an array of fields to create fields for data entry
- Each array element is an array, index 0 being the input name and title, index 1 being the type of input
- Select elements must be defined by type "multiple_text" in index 1
*/
function efb_generateRequestFields(fields) {
	var elems = [];
	for (var i=0; i<fields.length; i++) {
		if (fields[i][1] == 'multiple_text') {
			elems.push(
				{
					tag: 'div',
					class_name: 'efb_menu_head',
					text: 'Select Options'
				},
				{
					tag: 'div',
					class_name: 'row',
					children: [
						{
							tag: 'div',
							class_name: 'col-sm-12',
							children: [
								{
									tag: 'input',
									type: 'button',
									class_name: 'btn btn-sm btn-info',
									value: '+ New Option',
									functions: [
										{
											call: 'click',
											action: function() {
												efb_createNewOption(this, [{
													tag: 'div',
													class_name: 'col-sm-12',
													children: [
														{
															tag: 'div',
															class_name: 'row',
															children: [
																{
																	tag: 'div',
																	class_name: 'col-sm-5',
																	children: [
																		{
																			tag: 'input',
																			type: 'text',
																			name: 'select_text',
																			class_name: 'form-control',
																			placeholder: 'Text'
																		}
																	]
																},
																{
																	tag: 'div',
																	class_name: 'col-sm-6',
																	children: [
																		{
																			tag: 'input',
																			type: 'text',
																			name: 'select_value',
																			class_name: 'form-control',
																			placeholder: 'Value'
																		}
																	]
																},
																{
																	tag: 'div',
																	class_name: 'col-sm-1',
																	children: [
																		{
																			tag: 'input',
																			type: 'button',
																			class_name: 'btn btn-sm btn-danger',
																			value: '\u02DF',
																			functions: [
																				{
																					call: 'click',
																					action: function() {
																						efb_removeSelectOption(this);
																					}
																				}
																			]
																		}
																	]
																}
															]
														}
													]
												}]);
											}
										}
									]
								}
							]
						},
						{
							tag: 'div',
							class_name: 'col-sm-12',
							children: [
								{
									tag: 'div',
									class_name: 'row',
									children: [
										{
											tag: 'div',
											class_name: 'col-sm-5',
											children: [
												{
													tag: 'input',
													type: 'text',
													name: 'select_text',
													class_name: 'form-control',
													placeholder: 'Text'
												}
											]
										},
										{
											tag: 'div',
											class_name: 'col-sm-6',
											children: [
												{
													tag: 'input',
													type: 'text',
													name: 'select_value',
													class_name: 'form-control',
													placeholder: 'Value'
												}
											]
										},
										{
											tag: 'div',
											class_name: 'col-sm-1',
											children: [
												{
													tag: 'input',
													type: 'button',
													class_name: 'btn btn-sm btn-danger',
													value: '\u02DF',
													functions: [
														{
															call: 'click',
															action: function() {
																efb_removeSelectOption(this);
															}
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				}
			);
		} else {
			elems.push({
				tag: 'div',
				class_name: 'row',
				children: [
					{
						tag: 'div',
						class_name: 'col-sm-4',
						children:[
							{
								tag: 'strong',
								text: efb_to_title(fields[i][0])
							}
						]
					},
					{
						tag: 'div',
						class_name: 'col-sm-8',
						children:[
							{
								tag: 'input',
								name: fields[i][0],
								type: fields[i][1],
								class_name: 'form-control'
							}
						]
					}
				]
			});
		}
	}
	return elems;
}	

/*
> Append Created Input
- Takes variables from input menu created in "efb_createInput" and generates input element
*/
function efb_insertInput(elem) {
	var instance = efb_get_instance(elem);
	var data = [];
	var mask = '';
	var options = [[],[]];
	var print_options = '';
	var elems = document.getElementById('efb_menu_'+instance).getElementsByTagName('input');
	for (var i=0; i<elems.length; i++) {
		if (elems[i].name == 'mask') {
			var mask = decodeURIComponent(elems[i].value);
		} else if (elems[i].name == 'label') {
			mask = '<label><div>'+elems[i].value+'</div>'+mask+'</label>';
		} else if (elems[i].name == 'select_text') {
			options[0].push(elems[i].value);
		} else if (elems[i].name == 'select_value') {
			options[1].push(elems[i].value);
		} else if (elems[i].name != '') {
			data.push([elems[i].name,elems[i].value]);
		}
	}
	for (var i=0; i<data.length; i++) {
		mask = mask.replace('['+data[i][0]+']',data[i][1]);
	}
	if (options[0].length > 0) {
		for (var i=0; i<options[0].length; i++) {
			print_options += '<option value="'+options[1][i]+'">'+options[0][i]+'</option>';
		}
		mask = mask.replace('[options]',print_options);
	}
	easy_form_builders[instance].active_element.innerHTML += '<div id="__'+instance+'" class="efb_input">'+mask+'</div>';
	efb_closeMenu(instance);
}

//Create new select option from "multiple_text" field
function efb_createNewOption(elem,data) {
	efb_createLayout(elem.parentNode.parentNode,data);
}

//Remove selected option from "multiple_text" field
function efb_removeSelectOption(elem) {
	elem.parentNode.parentNode.remove();
}

//Remove self
function efb_removeSelf(elem,instance) {
	easy_form_builders[instance].active_element.remove();
	efb_closeMenu(instance);
}

//Remove parent
function efb_removeParent(elem,instance) {
	easy_form_builders[instance].active_element.parentNode.remove();
	efb_closeMenu(instance);
}

/*
###########################
Save Current Menu
###########################
*/

//Save current menu
function efb_saveMenu(instance) {
	return efb_structureSave(document.getElementById('efb_slate_'+instance)).children;
}