<?php
/**
 * Properties file for Structures-Lector template
 *
 * Copyright 2016 by donShakespeare,treigh 
 * Created on 09-07-2016
 *
 * @package structures
 * @subpackage build
 */




$properties = array (
  'customPset' => 
  array (
    'name' => 'customPset',
    'desc' => 'Takes DEFAULT or name of a PropertySet. A template namesake pset is automatically used, or else DEFAULT  will ignite the default properties of current Template. This setting is ONLY useful when set in Template Default Properties - NOT Custom Property Set Properties. ',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'default',
    'lexicon' => NULL,
    'area' => '0. Main',
  ),
  'showDebugInfo' => 
  array (
    'name' => 'showDebugInfo',
    'desc' => 'Display a detailed log of Structure Settings in the sidebar of the Manager Resource',
    'type' => 'combo-boolean',
    'options' => 
    array (
    ),
    'value' => true,
    'lexicon' => NULL,
    'area' => '0. Main',
  ),
  'autoImport' => 
  array (
    'name' => 'autoImport',
    'desc' => 'EXPERIMENTAL: your existing content (no need for [[-TB-MARKER]] or [[-TB-MARKER-SINGLE]] placeholders, will be structured according to your importWrapper and importMarker chunks. Please turn this OFF when you are done auto importing.',
    'type' => 'combo-boolean',
    'options' => 
    array (
    ),
    'value' => false,
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'autoImportDemandMarkers' => 
  array (
    'name' => 'autoImportDemandMarkers',
    'desc' => 'EXPERIMENTAL: content will not be imported/converted without it containing at least [[-TB-MARKER]] or [[-TB-MARKER-SINGLE]]',
    'type' => 'combo-boolean',
    'options' => 
    array (
    ),
    'value' => true,
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'autoImportSave' => 
  array (
    'name' => 'autoImportSave',
    'desc' => 'EXPERIMENTAL: autoImport will save the resource when it is done. Please turn this OFF IMMEDIATELY you are done auto importing.',
    'type' => 'combo-boolean',
    'options' => 
    array (
    ),
    'value' => false,
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'pureContent' => 
  array (
    'name' => 'pureContent',
    'desc' => 'Use Pure Content mode if your content is either pure Markdown(which includes HTML) or pure Rich Text(excluding MD). Your content WILL NOT be wrapped at all by any markup. [[-TB-MARKER]] will be inserted in the case of multiple structures.',
    'type' => 'list',
    'options' => 
    array (
      0 => 
      array (
        'text' => 'Rich Text (fc: full content)',
        'value' => 'fc',
        'name' => 'Rich Text (fc: full content)',
      ),
      1 => 
      array (
        'text' => 'Markdown(md)',
        'value' => 'md',
        'name' => 'Markdown(md)',
      ),
      2 => 
      array (
        'text' => 'Syntax Highlighted MD Code (rc: raw code)',
        'value' => 'rc',
        'name' => 'Syntax Highlighted MD Code (rc: raw code)',
      ),
      3 => 
      array (
        'text' => 'Disabled',
        'value' => '',
        'name' => 'Disabled',
      ),
    ),
    'value' => '',
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'ace_mirror_init_chunk' => 
  array (
    'name' => 'ace_mirror_init_chunk',
    'desc' => 'Chunk to run CE (Code Editor)',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.ace_mirror_config',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'all_structures_chunk' => 
  array (
    'name' => 'all_structures_chunk',
    'desc' => 'Store all your predefined structures (blocks / HTML snippets)',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.lector_structures',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'content_wrapper_chunk' => 
  array (
    'name' => 'content_wrapper_chunk',
    'desc' => 'Wrapper tpl chunk for displaying resource content. Necessary placeholders: +tinyBlocksMainWrapperId, +tinyBlocksRowsWrapperClass, +content',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.wrapper_tpl',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'help_howto' => 
  array (
    'name' => 'help_howto',
    'desc' => 'Some help goes far.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.help_howto',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'import_marker_chunk' => 
  array (
    'name' => 'import_marker_chunk',
    'desc' => 'To import existing content into Structures simply add this parameter to your resource url: &autoImport. import_marker_chunk will replace this MODX comment tag [[-TB-MARKER]] in your content. Please see your block_reel_chunk (st.snippets_base) for HTML guide',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.lector_importMarker_tpl',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'import_wrapper_chunk' => 
  array (
    'name' => 'import_wrapper_chunk',
    'desc' => 'To import existing content, simply add to the resource manager url this parameter &autoImport',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.lector_importWrapper_tpl',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'manager_misc_buttons_chunk' => 
  array (
    'name' => 'manager_misc_buttons_chunk',
    'desc' => 'Add or remove buttons next to Manager save button. Richtext, Markdown and Code Editors...',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.save_buttons',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'tinymce_init_chunk' => 
  array (
    'name' => 'tinymce_init_chunk',
    'desc' => 'Without this chunk NOTHING is editable. TinyMCE powerful API caters for all the sorts of editors used by tinyBlocks.js',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.tinymce_config',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'content_tab_title' => 
  array (
    'name' => 'content_tab_title',
    'desc' => 'The tab title for resource content area',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'Content',
    'lexicon' => NULL,
    'area' => '3. Tab Text',
  ),
  'sidebar_tab_title' => 
  array (
    'name' => 'sidebar_tab_title',
    'desc' => 'The sidebar tab title - which will be first in line. To hide this panel set the name to: hidden ',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'Structures',
    'lexicon' => NULL,
    'area' => '3. Tab Text',
  ),
  'CDN_Ace' => 
  array (
    'name' => 'CDN_Ace',
    'desc' => 'Leave empty to disable Syntax Highlighter Editor (Ace)....Default: https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'manager_css_function_file' => 
  array (
    'name' => 'manager_css_function_file',
    'desc' => 'This CSS file is necessary for fundamental functionality. Designed by treigh!',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/css/mgr.css',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'manager_css_override_file' => 
  array (
    'name' => 'manager_css_override_file',
    'desc' => 'Use this to override anything you want.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/css/mgr.override.css',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'manager_css_richtext' => 
  array (
    'name' => 'manager_css_richtext',
    'desc' => 'Enclose your frontend CSS properly so that you see/preview exactly as your site, as you edit in the Rich Text Structure.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/css/mgr.richtext.css',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'tinyblocks_js_file' => 
  array (
    'name' => 'tinyblocks_js_file',
    'desc' => 'Powered by tinyBlocks.js!',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/js/tinyBlocks.js',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'tinymce_donshakepeare_plugins_file' => 
  array (
    'name' => 'tinymce_donshakepeare_plugins_file',
    'desc' => 'A compressed and preloaded pack of donshakepeare-beautifully-handcrafted TinyMCE  plugins. No need to call said plugins in TinyMCE init.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/js/tinymce_plugins.min.js',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'duplicateBlockClass' => 
  array (
    'name' => 'duplicateBlockClass',
    'desc' => 'Class to style duplicated row',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-duplicate',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'hiddenBlockClass' => 
  array (
    'name' => 'hiddenBlockClass',
    'desc' => 'Used to style and hide Blocks',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-hidden',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'minBlockClass' => 
  array (
    'name' => 'minBlockClass',
    'desc' => 'EXPERIMENTAL: Used for sub inset blocks',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-shrink',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'newBlockClass' => 
  array (
    'name' => 'newBlockClass',
    'desc' => 'Used to style newly added Blocks',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-new-block',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'originalSourceId' => 
  array (
    'name' => 'originalSourceId',
    'desc' => 'Use this to specify the origin of content feed. Must be the content of a live Textarea. For now, only content field (textarea#ta) of MODX Manager resource is supported.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'ta',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'rowClass' => 
  array (
    'name' => 'rowClass',
    'desc' => 'If you want to style Stuctures\' Rows, add your own class. Rows are the top level elements in your blocks_reel_chunk markup.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-row',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'rowTempHolderClass' => 
  array (
    'name' => 'rowTempHolderClass',
    'desc' => 'Each Block/Row will be wrapped with div.tinyBlocksRowTempHolderClass. Add classes if you want.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-outer',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'rowsWrapperClass' => 
  array (
    'name' => 'rowsWrapperClass',
    'desc' => 'Used to identify the container of all the main structure/blocks/rows',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-container-fluid',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
  'shrinkClass' => 
  array (
    'name' => 'shrinkClass',
    'desc' => 'When a Block is dragged/duplicated or before-inserted, all Blocks are immediately shrunk. Add class to style shrinkage.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st-shrink',
    'lexicon' => NULL,
    'area' => '5. Class names used in mgr CSS file',
  ),
);

return $properties;

