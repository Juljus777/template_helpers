<?php

namespace Drupal\template_helpers\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "Template Helpers" plugin.
 *
 * @CKEditorPlugin(
 *   id = "template_helpers",
 *   label = @Translation("CKEditor Template Helpers"),
 *   module = "template_helpers"
 * )
 */

class TemplateHelper extends CKEditorPluginBase {

  /**
   * @inheritDoc
   */
  public function getButtons()
  {
    return [
      'template_helpers' => [
        'label' => t('CKEditor Template Helpers'),
        'image' => $this->getLibraryPath() . '/icons/template_helpers.png',
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
      \Drupal::service('extension.list.module')->getPath('template_helpers') .
      '/js/plugins/template_helpers';
  }
}
