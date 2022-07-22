(function ($, drupalSettings) {

  CKEDITOR.plugins.add('template_helpers', {
    icons: 'template_helpers',
  })

  CKEDITOR.on('instanceReady', function (evt) {
    let {editor} = evt;

    editor.on('afterInsertHtml', function () {
      modifyAlternativeWidgetDeletion(editor);
    })
    editor.on('dataReady', function () {
      modifyAlternativeWidgetDeletion(editor);
    })

    // Defined in ckeditor_config.js
    const widgetDefinitions = drupalSettings.ckeditor_alternative_widgets.widgetDefinitions;

    /**
     * modifyAlternativeWidgetDeletion()
     *
     * Modifies when a template gets deleted, by making it dependent on its child elements.
     * Dependencies are defined in widgetDefinitions[]
     *
     * Used for templates that need their UX to be improved in the editor.
     * This should only be used with templates that can't be handled by widgets API.
     *
     * For example if you need to create a widget that uses the "add media library" widget,
     * and you want users to be able to always add images through the "insert media library" dialog.
     *
     * Currently, this can't be done without breaking the markup since widgets are immutable, only
     * their contents or data can be changed and since the media library widget doesn't
     * enable users to update selected media through "add media library" dialog then
     * a workaround is needed to manage that.
     *
     * @param editor
     *
     */

    function modifyAlternativeWidgetDeletion(editor) {
      let $iframeContent = $('.cke_wysiwyg_frame').contents();
      $iframeContent.unbind();

      widgetDefinitions.forEach(widget => {
        let $renderedWidget = $iframeContent.find(widget.widgetContainer);
        $renderedWidget.each(function () {
          setDataAttributes($(this), widget.name, $iframeContent);
        })
        $iframeContent.keyup(function (evt) {
          if (evt.keyCode === 46 || evt.keyCode === 8 || evt.keyCode === CKEDITOR.CTRL + 88) {
            let activeElement = editor.document.findOne('[data-is-selected="true"]');
            if (activeElement && activeElement.data('widget-name') === widget.name) {
              let editableNodesArray = setupEditableNodes(widget.editables, activeElement);
              let hasContent = validateContentExistence(editableNodesArray);
              if (!hasContent) {
                editor.document.find('[data-is-selected="true"]').getItem(0).$.remove();
              }
            }
          }
        })
      })
    }

    /**
     * setDataAttributes()
     *
     * Sets neccessary data attribute on custom widgets.
     *
     * @param element
     * @param widgetName
     * @param context
     */

    function setDataAttributes(element, widgetName, context) {
      element.attr('data-is-selected', false).attr('data-widget-name', widgetName);
      element.on('click', function (evt) {
        evt.stopPropagation();
        context.find(`[data-is-selected="true"]`).attr('data-is-selected', false);
        element.attr('data-is-selected', true);
      })
    }

    /**
     * setupEditableNodes()
     *
     * Attaches the "type" defined in widgetDefinitions[] editable on to
     * the jquery object, so it could be later used in validation.
     *
     * @param editables
     * @param activeElement
     * @returns []
     *
     */

    function setupEditableNodes(editables, activeElement) {
      let editableNodesArray = [];
      editables.forEach((editable) => {
        let renderedEditableNodes = activeElement.find(editable.selector);
        if (renderedEditableNodes) {
          renderedEditableNodes = renderedEditableNodes.toArray();
          renderedEditableNodes.forEach(node => {
            node.type = editable.type;
          })
          editableNodesArray.push(...renderedEditableNodes);
        }
      })
      return editableNodesArray;
    }

    /**
     * validateContentExistence()
     *
     * Checks if the whole widget has any content,
     * if it finds some it returns right away.
     *
     * @param nodesArray
     * @returns {boolean}
     */

    function validateContentExistence(nodesArray) {
      let hasContent = true;
      if (nodesArray.length === 0) return false;
      for (let node of nodesArray) {
        if (node.type === "string") {
          if ($(node.$).text().length) {
            hasContent = true;
            break;
          }
        }
        if (node.type === "media-library-image") {
          if ($(node.$).find('img').length !== 0) {
            hasContent = true;
            break;
          }
        }
        hasContent = false;
      }
      return hasContent;
    }

    modifyAlternativeWidgetDeletion(editor);
  })
})(jQuery, drupalSettings)



