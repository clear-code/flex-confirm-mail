/* "The contents of this file are subject to the Mozilla Public Licenske
* Version 1.1 (the "License"); you may not use this file except in
* compliance with the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/
* 
* Software distributed under the License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
* License for the specific language governing rights and limitations
* under the License.
* 
* The Original Code is confirm-address.
* 
* The Initial Developers of the Original Code are kentaro.matsumae and Meatian.
* Portions created by Initial Developers are 
* Copyright (C) 2007-2011 the Initial Developer.All Rights Reserved.
* 
* Contributor(s): tanabec
*/ 

var Cc = Components.classes;
var Ci = Components.interfaces;

var { prefs } = Components.utils.import('resource://confirm-mail-modules/lib/prefs.js', {});
function getPref(name, defaultValue) {
	var value = prefs.getPref(name);
	return value === null ? defaultValue : value;
}

class ListBox {
	constructor(listbox, prefKey) {
		this.listbox = listbox;
		this.prefKey = prefKey;

		const values = this.values;
		if (values.length > 0) {
			for (let value of values) {
				value = value.trim();
				if (!value)
					continue;
				this.addItem(value);
			}
		}
		else {
			prefs.setPref(this.prefKey, "");
			this.addItem("");
		}

		this.onKeyDown = this.onKeyDown.bind(this);

		listbox.addEventListener("keydown", this.onKeyDown, true);
		listbox.addEventListener("dblclick", event => this.edit(event));
	}

	onKeyDown(event) {
		const item = this.listbox.selectedItem || this.listbox.querySelector("richlistitem.editing");
		if (!item)
			return;
		switch (event.key) {
			case "Escape":
				item.field.setAttribute("value", item.field.value = item.getAttribute("value"));
			case "Enter":
			case "F2":
				if (!item.classList.contains("editing")) {
					this.edit(event);
				}
				else {
					item.field.onDetermined();
				}
				event.stopImmediatePropagation();
				event.preventDefault();
				return false;
			case "Delete":
				item.clear();
				return false;
		}
	}

	addItem(value) {
		const item = this.listbox.appendItem(value || "", value || "");

		item.field = item.appendChild(document.createXULElement("textbox"));
		item.field.setAttribute("flex", 1);
		item.field.setAttribute("value", item.field.value = value || "");
		item.field.onDetermined = () => {
			let value = item.field.value.trim();
			console.log("[add/edit?] " + value + "\n");
			if (!value) {
				item.clear();
				return;
			}
			if (value != item.getAttribute("value")) {
				const values = this.values;
				console.log("[add/edit?] check duplication: ", values, values.indexOf(value));
				if (values.includes(value)) {
					item.clear();
					return;
				}
				console.log("[add/edit!] " + value + "\n");
				item.setAttribute("value", value);
				item.firstChild.setAttribute("value", value);
			}
			item.classList.remove("editing");
			this.save();
		};
		item.field.addEventListener("blur", item.field.onDetermined, true);

		item.deleteButton = item.appendChild(document.createXULElement("toolbarbutton"));
		item.deleteButton.setAttribute("label", "×");

		item.clear = () => {
			item.setAttribute("value", "");
			item.firstChild.setAttribute("value", "");
			item.classList.remove("editing");
			if (this.listbox.childNodes.length > 1)
				this.removeItem(item);
			this.save();
		};
		item.deleteButton.addEventListener("command", () => {
			item.clear();
		});

		return item;
	}

	removeItem(item) {
		item.field.removeEventListener("blur", item.field.onDetermined, true);
		this.listbox.selectedItem = item.nextSibling || item.previousSibling;
		this.listbox.removeChild(item);
	}

	get values() {
		return getPref(this.prefKey, "")
			.trim()
			.split(/[,\s\|;]+/)
			.filter(value => !!value);
	}

	save() {
		const values = Array.from(this.listbox.childNodes, item => item.getAttribute("value").trim());
		prefs.setPref(this.prefKey, values.filter(value => !!value).join(" "));
	}

	enterEdit(item) {
		item.classList.add("editing");
		item.field.setAttribute("value", item.field.value = item.getAttribute("value"));
		item.field.select();
		item.field.focus();
	}

	add(event) {
		if (this.listbox.lastChild.getAttribute("value") != "")
			this.listbox.selectedItem = this.addItem("");
		this.enterEdit(this.listbox.selectedItem);
	}

	edit(event) {
		this.enterEdit(this.listbox.selectedItem);
	}
}

var internalDomains;
var exceptionalDomains;
var exceptionalSuffixes;

function startup() {
	internalDomains = new ListBox(document.getElementById("group-list"), CA_CONST.INTERNAL_DOMAINS);
	exceptionalDomains = new ListBox(document.getElementById("exceptional-domains"), CA_CONST.EXCEPTIONAL_DOMAINS);
	exceptionalSuffixes = new ListBox(document.getElementById("exceptional-suffixes"), CA_CONST.EXCEPTIONAL_SUFFIXES);

	for (const element of document.querySelectorAll("[preference]")) {
		const key = element.getAttribute("preference");
		const value = getPref(key);
		if (element.localName == "checkbox") {
			element.checked = !!value;
			element.addEventListener("command", () => {
				prefs.setPref(key, element.checked);
			});
		}
		else {
			element.value = value;
			element.addEventListener("change", () => {
				prefs.setPref(key, typeof value == "number" ? parseInt(element.value) : String(element.value));
			});
		}
	}

	//init checkbox [countdown]
	var cdBox = document.getElementById("countdown");
	var cdTimeBox = document.getElementById("countdown-time");

	cdBox.addEventListener('command',
		function(event){
			cdTimeBox.disabled = !cdBox.checked;
		},
		true);

	var isCountDown = getPref(CA_CONST.ENABLE_COUNTDOWN);
	if(isCountDown == null || isCountDown == false){
		cdBox.checked = false;
		cdTimeBox.disabled = true;
	}else{
		cdBox.checked = true;
		cdTimeBox.disable = false;
	}

	if (getPref(CA_CONST.COUNT_DOWN_ALLOW_SKIP_ALWAYS))
		document.getElementById("countdownAllowSkip").hidden = true;

	if (getPref(CA_CONST.ALLOW_CHECK_ALL_INTERNALS_ALWAYS))
		document.getElementById("allowCheckAll.yourDomains").hidden = true;

	if (getPref(CA_CONST.ALLOW_CHECK_ALL_EXTERNALS_ALWAYS))
		document.getElementById("allowCheckAll.otherDomains").hidden = true;

	if (getPref(CA_CONST.ALLOW_CHECK_ALL_ATTACHMENTS_ALWAYS))
		document.getElementById("allowCheckAll.fileNames").hidden = true;

	if (getPref(CA_CONST.REQUIRE_CHECK_BODY_ALWAYS))
		document.getElementById("requireCheckBody").hidden = true;

	if (getPref(CA_CONST.HIGHLIGHT_UNMATCHED_DOMAINS_ALWAYS))
		document.getElementById("highlightUnmatchedDomains").hidden = true;

	if (getPref(CA_CONST.LARGE_FONT_SIZE_FOR_ADDRESSES_ALWAYS))
		document.getElementById("largeFontSizeForAddresses").hidden = true;

	if(getPref(CA_CONST.ALWAYS_LARGE_DIALOG_ALWAYS))
		document.getElementById("alwaysLargeDialog").hidden = true;
}
