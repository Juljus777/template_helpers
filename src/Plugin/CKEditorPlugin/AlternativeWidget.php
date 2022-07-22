<?php

namespace Drupal\ckeditor_alternative_widgets\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "CKEditor alternative widgets" plugin.
 *
 * @CKEditorPlugin(
 *   id = "ckeditor_alternative_widgets",
 *   label = @Translation("CKEditor Alternative Widgets"),
 *   module = "ckeditor_alternative_widgets"
 * )
 */

class AlternativeWidget extends CKEditorPluginBase {

  /**
   * @inheritDoc
   */
  public function getButtons()
  {
    return [
      'ckeditor_alternative_widgets' => [
        'label' => t('CKEditor Alternative Widgets'),
        'image' => $this->getLibraryPath() . '/icons/ckeditor_alternative_widgets.png',
      ]
    ];
  }

  /**
   * @inheritDoc
   */
  public function getFile()
  {
    return $this->getLibraryPath() . '/plugin.js';
  }

  /**
   * @inheritDoc
   */
  public function getConfig(Editor $editor)
  {
    return [];
  }

  public static function getLibraryPath()
  {
    return
      \Drupal::service('extension.list.module')->getPath('ckeditor_alternative_widgets') .
      '/js/plugins/ckeditor_alternative_widgets';
  }
}
