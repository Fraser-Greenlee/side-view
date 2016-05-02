/*
				
	side view line
				
<div style="position: relative;">
	<pre class=" CodeMirror-line " style="text-indent: -32px; padding-left: 36px;">
		<span style="padding-right: 0.1px;">
			<span class="cm-tab" role="presentation" cm-text="	">    </span>
			<span class="cm-tab" role="presentation" cm-text="	">    </span>
			<span class="cm-def">QuickOpen</span>
			&nbsp; &nbsp; &nbsp;  
			<span class="cm-operator">=</span>
			
			<span class="cm-variable">brackets</span>
			.
			<span class="cm-property">getModule</span>
			(<span class="cm-string">'search/QuickOpen'</span>)
			 ,
		</span>
	</pre>
</div>

	Sample line
				
<div style="position: relative;">
	<div class="CodeMirror-gutter-wrapper" style="left: -42px;">
		<div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 19px;">8</div>
		<div class="CodeMirror-gutter-elt" style="left: 34px; width: 8px;">
			<div class="CodeMirror-foldgutter-blank"></div>
		</div>
	</div>
	<pre class=" CodeMirror-line " style="text-indent: -32px; padding-left: 36px;">
		<span style="padding-right: 0.1px;">
			<span class="cm-tab" role="presentation" cm-text="	">    </span>
			<span class="cm-tab" role="presentation" cm-text="	">    </span>
			<span class="cm-def">QuickOpen</span>
			&nbsp; &nbsp; &nbsp;  
			<span class="cm-operator">=</span>
			
			<span class="cm-variable">brackets</span>
			.
			<span class="cm-property">getModule</span>
			(<span class="cm-string">'search/QuickOpen'</span>)
			 ,
		</span>
	</pre>
</div>

measure,

<div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 19px;">8</div><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; --

*/

define(function (require, exports, module) {
	"use strict";
	
	var ExtensionUtils   = brackets.getModule("utils/ExtensionUtils"),
		CommandManager   = brackets.getModule("command/CommandManager"),
		EditorManager    = brackets.getModule("editor/EditorManager"),
		AppInit          = brackets.getModule('utils/AppInit'),
		QuickOpen        = brackets.getModule('search/QuickOpen'),
		DocumentManager  = brackets.getModule('document/DocumentManager'),
		hinter;
	
	function Hinter (editor) {
		if (!editor) {throw 'keychecker initialize error: editor is needed.'}
		// bind editor, init hintList and some other stuff about editor
		this.init(editor);
	}
	Hinter.prototype.init = function (editor) {
		if (!editor) {throw 'keychecker initialize error: editor is missing.'}
		this.editor = editor;
	}
	Hinter.prototype.keyPressHandler = function(bracketsEvent, editor, keyboardEvent) {
		// run on keypress
		//console.log('k: '+keyboardEvent.keyCode)
		//	refresh doc
	}
	
	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
	
	function activeEditorChangeHandler (bracketsEvent, focusedEditor, lostEditor) {
		
		var curOpenFile = DocumentManager.getCurrentDocument().file;
		DocumentManager.getDocumentText(curOpenFile).done(
			function(text) {
				var al = [
					'<div id="extscrollmessure" style="position: relative;"><pre class=" CodeMirror-line " style="text-indent: -32px; padding-left: 1px;"><div id="side-view-scrollbar"></div><span style="padding-right: 0.1px;">',
					'</span></pre></div>'
				]
				$('#ext-side-view').html(al[0]+'<br>'+escapeHtml(text)+al[1]);
				var isDragging = false;
				$('#extscrollmessure')
					.mousedown(function(e) { isDragging = true; extsidescrollclick(e); })
					.mousemove(function(e) { if(isDragging) { extsidescrollclick(e); } })
					.mouseup(function(e) { isDragging = false; });
				extsideviewscroll();
			}
		);
		$('.CodeMirror-scroll').scroll(function() { extsideviewscroll(); });
		
		if (lostEditor) {
			lostEditor.off = lostEditor.off || $(lostEditor).off;
			if(hinter){
				lostEditor.off("keypress",  hinter.keyPressHandler.bind(hinter));
			}
		}
		if (focusedEditor) {
			focusedEditor.on = focusedEditor.on || $(focusedEditor).on;
			if (!hinter) {
				hinter = new Hinter(focusedEditor);
			} else {
				hinter.init(focusedEditor);
			}
			focusedEditor.on("keypress", hinter.keyPressHandler.bind(hinter));
		}
	}
	
	AppInit.appReady(function () {
		// Instantly initialize extension after being installed.
		//Note:
		//The editor instance would be null at the moment when Brackets starts
		var editor = EditorManager.getCurrentFullEditor();
		if(editor){
			activeEditorChangeHandler(null, editor, null);
		}
		
		EditorManager.on = EditorManager.on || $(EditorManager).on;
		EditorManager.on('activeEditorChange', activeEditorChangeHandler);
	});
	
	ExtensionUtils.loadStyleSheet(module, "main.css");
	
	$('.content').append('<div id="ext-side-view"></div>');
	$('#editor-holder').css('width','82%');
	
	function extsidescrollclick(e) {
		var h = e.clientY - 130;
		$('.CodeMirror  .CodeMirror-scroll').filter(':not(.CodeMirror[style*="display: none;"]  .CodeMirror-scroll)').scrollTop(542*h/205);
		if (h < 0) { h = 0; }
		if (h > $('#extscrollmessure').height() - 230) { h = $('#extscrollmessure').height() - 230; }
		$('#side-view-scrollbar').css('top',h+'px');
	}
	
	function extsideviewscroll() {
		$('#side-view-scrollbar').css('top',(205*$('.CodeMirror  .CodeMirror-scroll').filter(':not(.CodeMirror[style*="display: none;"]  .CodeMirror-scroll)').scrollTop())/542+'px');
	}
});