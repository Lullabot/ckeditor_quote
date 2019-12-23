/**
 * @file
 * The quote dialog definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add('quoteDialog', function (editor) {
  var lang = editor.lang.quote;

  return {

    // Basic properties of the dialog window: title, minimum size.
    title: lang.dialogTitle,
    minWidth: 400,
    minHeight: 200,

    // Dialog window contents definition.
    contents: [
    {
      // Definition of the Basic Settings dialog tab (page).
      id: 'tab-basic',
      label: 'Basic Settings',

      // The tab contents.
      elements: [
      {
        // Quote text input field.
        type: 'textarea',
        id: 'text',
        label: lang.dialogQuoteText,

        // Validation checking whether the field is not empty.
        validate: CKEDITOR.dialog.validate.notEmpty(lang.dialogQuoteTextNotEmpty),

        // Called by the main setupContent call on dialog initialization.
        setup: function (element) {
          var paragraphs = element.find('p');
          if (paragraphs.count() > 0) {
            var quote = paragraphs.getItem(0).getText();
            for (var i = 1; i < paragraphs.count(); i++) {
              quote += '\n' + paragraphs.getItem(i).getText();
            }
            this.setValue(quote);
          }
          else {
            // It is a common blockquote without <p>.
            this.setValue(element.getText());
          }
        },

        // Called by the main commitContent call on dialog confirmation.
        commit: function (element) {
          // Clear element HTML.
          element.setHtml('');

          // Set a <p> for each line.
          var lines = this.getValue().split(/\r\n|\r|\n/g);
          for (var i = 0; i < lines.length; i++) {
            var p = editor.document.createElement('p');
            p.setText(lines[i]);
            element.append(p);
          }
        }
      },
      {
        // Quote author input field.
        type: 'text',
        id: 'author',
        label: lang.dialogQuoteAuthor,

        // Called by the main setupContent call on dialog initialization.
        setup: function (element) {
          var authorElem = element.findOne('footer');
          if (authorElem !== null) {
            this.setValue(authorElem.getText());
          }
        },

        // Called by the main commitContent call on dialog confirmation.
        commit: function (element) {
          var authorElem = element.findOne('footer');
          if (authorElem === null) {
            if (this.getValue() !== '') {
              authorElem = editor.document.createElement('footer');
              element.append(authorElem);
              authorElem.setAttribute('class', 'author');
              authorElem.setText(this.getValue());
            }
          }
          else {
            if (this.getValue() !== '') {
              authorElem.setAttribute('class', 'author');
              authorElem.setText(this.getValue());
            }
            else {
              // Author has been removed, remove authorElem.
              authorElem.remove();
            }
          }
        }
      }
      ]
    }
    ],

    // Invoked when the dialog is loaded.
    onShow: function () {

      // Get the selection in the editor.
      var selection = editor.getSelection();

      // Get the element at the start of the selection.
      var element = selection.getStartElement();

      // Get the authorElem element closest to the selection, if any.
      if (element) {
        element = element.getAscendant('blockquote', true);
      }

      // Create a new <authorElem> element if it does not exist.
      if (!element || element.getName() !== 'blockquote') {
        element = editor.document.createElement('blockquote');
        // Flag the insertion mode for later use.
        this.insertMode = true;
      }
      else {
        this.insertMode = false;
      }

      // Store the reference to the <authorElem> element in an internal property, for later use.
      this.element = element;

      // Invoke the setup methods of all dialog elements, so they can load the element attributes.
      if (!this.insertMode) {
        this.setupContent(this.element);
      }
    },

    // This method is invoked once a user clicks the OK button, confirming the dialog.
    onOk: function () {

      // The context of this function is the dialog object itself.
      // http://docs.ckeditor.com/#!/api/CKEDITOR.dialog
      var dialog = this;

      var blockquote = this.element;

      // Invoke the commit methods of all dialog elements, so the <blockquote> element gets modified.
      this.commitContent(blockquote);

      // Finally, in if insert mode, inserts the element at the editor caret position.
      if (this.insertMode) {
        editor.insertElement(blockquote);
      }
    }
  };
});
