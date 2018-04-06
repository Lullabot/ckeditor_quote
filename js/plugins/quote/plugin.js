/**
 * @file
 * Plugin to insert a quote with text and author.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

(function ($) {
  // Register the plugin within the editor.
  CKEDITOR.plugins.add('quote', {
    lang: 'en',

    // Register the icons.
    icons: 'quote',

    // The plugin initialization logic goes inside this method.
    init: function (editor) {
      var lang = editor.lang.quote;

      // Define an editor command that opens our dialog.
      editor.addCommand('quote', new CKEDITOR.dialogCommand('quoteDialog'));

      // Create a toolbar button that executes the above command.
      editor.ui.addButton('quote', {

        // The text part of the button (if available) and tooptip.
        label: lang.buttonTitle,

        // The command to execute on click.
        command: 'quote',

        // The button placement in the toolbar (toolbar group name).
        toolbar: 'insert',

        // The path to the icon.
        icon: this.path + 'icons/quote.png'
      });

      if (editor.contextMenu) {
        editor.addMenuGroup('quoteGroup');
        editor.addMenuItem('quoteItem', {
          label: lang.menuItemTitle,
          icon: this.path + 'icons/quote.png',
          command: 'quote',
          group: 'quoteGroup'
        });

        editor.contextMenu.addListener(function (element) {
          if (element.getAscendant('blockquote', true)) {
            return { blockquote: CKEDITOR.TRISTATE_OFF };
          }
        });
      }

      // Register our dialog file. this.path is the plugin folder path.
      CKEDITOR.dialog.add('quoteDialog', this.path + 'dialogs/quote.js');
    }
  });
})(jQuery);
