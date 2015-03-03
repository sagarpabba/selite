/** ide-extension.js ensure that 'Insert New Command' or 'Insert New Comment' inserts any spaces based on indentation of the previous command. However, on pressing TAB Firefox would select the whole field; when user would start typing the name of the new command, it would replace those leading spaces. Following prevents that: it moves the editing cursor to the end of 'Command' (or 'Comment') field.
So, if there is an existing command/comment with indentation, pressing TAB moves the editing cursor to the end space prefix, and it selects the rest of the command or comment. That facilitates replacing the command/comment when user starts typing, while keeping the existing indentation.
Similarly when the user clicks Shift+TAB at command's Target (textbox), which moves focus to Command.
*/
"use strict";
var indentedText= /^(\s+)/;

function selectRightFromIndent( event ) {
    var action=document.getElementById('commandAction');
    var match= indentedText.exec( action.value );
    if( match ) {
        event.preventDefault();
        action.focus();
        action.setSelectionRange( match[1].length, action.value.length );
    }
}

// Following two functions handle when the user navigates to Command detail (wide) input by TAB and Shift+TAB. These functions select (highlight) the part of the existing command right of indentation , so that when the user starts to type, typing replaces the existing command while preserving the indentation.

// When the user navigates to Command detail input from the tree by hitting TAB.
function onKeyPress(event) {
    if( event.keyCode===KeyEvent.DOM_VK_TAB ) {
        selectRightFromIndent( event );
    }
}

// When the user navigates to Command detail (wide) input from Target detail (wide) input by hitting Shift+TAB. This doesn't handle Shift+TAB from 'Log' to Comment - there was no easy way to do it through XUL or XBL.
function onKeyPressWithShift(event) {
    if( event.keyCode===KeyEvent.DOM_VK_TAB && event.shiftKey ) {
        selectRightFromIndent( event );
    }
}