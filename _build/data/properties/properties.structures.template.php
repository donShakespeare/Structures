<?php
/**
 * Properties file for Structures template
 *
 * Copyright 2016 by donShakespeare 
 * Created on 11-08-2016
 *
 * @package structures
 * @subpackage build
 */




$properties = array (
  'StructuresCustomPset' => 
  array (
    'name' => 'StructuresCustomPset',
    'desc' => 'Takes the word: default (for Default Properties of Template). Or name of a PropertySet. Note: A PropertySet with same name as that of a Structures Template is automatically used. This setting is ONLY useful when set in Template Default Properties - NOT Custom Property Set Properties. Also, MODX tags in properties will not be parsed if using PSETS.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'default',
    'lexicon' => NULL,
    'area' => '0. Main',
  ),
  'standByStructure' => 
  array (
    'name' => 'standByStructure',
    'desc' => 'Structures will use any HTML value here to replace the st.help_howto chunk that fills Structures content area when empty ... e.g div class=tb-wrapper-tlb tb-tiny-fc data-tb-title=Default>start typing ... /div. Please enclose class names and other attrs with quotes',
    'type' => 'textarea',
    'options' => 
    array (
    ),
    'value' => '',
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'randomTips' => 
  array (
    'name' => 'randomTips',
    'desc' => 'Useful tips that appear/cycle at pageload. To disable, leave empty. Use || as delimiter.',
    'type' => 'textarea',
    'options' => 
    array (
    ),
    'value' => '',
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'pureContent' => 
  array (
    'name' => 'pureContent',
    'desc' => 'Use Pure Content mode if your content is either pure Markdown(which includes HTML) or pure Rich Text(excluding MD). Your content WILL NOT be wrapped at all by any markup. [[-STRUCTURES]] will be inserted in only the case of multiple structures. PureContent will not support Titles for Structures.',
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
  'autoImportDemandMarkers' => 
  array (
    'name' => 'autoImportDemandMarkers',
    'desc' => 'EXPERIMENTAL: content will not be imported/converted without it containing at least [[-STRUCTURES]] or [[-STRUCTURES-SINGLE]]',
    'type' => 'combo-boolean',
    'options' => 
    array (
    ),
    'value' => true,
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'autoImport' => 
  array (
    'name' => 'autoImport',
    'desc' => 'EXPERIMENTAL: your existing content (no need for [[-STRUCTURES]] or [[-STRUCTURES-SINGLE]] placeholders, will be structured according to your importWrapper and importMarker chunks. Please turn this OFF when you are done auto importing.',
    'type' => 'combo-boolean',
    'options' => 
    array (
    ),
    'value' => false,
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental',
  ),
  'structuresTV_ids' => 
  array (
    'name' => 'structuresTV_ids',
    'desc' => 'Comma-separated list of ids of TVs to bind to Structures. Two Modes: 1) 12,13,14,15 ... 2) 12*richtext, 13*markdown, 14*markdown, 15*richtext ... Supported TV xtypes: Textarea, Text, Hidden.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '',
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental TVS',
  ),
  'defaultGalleryTVid' => 
  array (
    'name' => 'defaultGalleryTVid',
    'desc' => 'TV id for default Resource Gallery.',
    'type' => 'numberfield',
    'options' => 
    array (
    ),
    'value' => '',
    'lexicon' => NULL,
    'area' => '1. Advanced and Experimental TVS',
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
  'import_wrapper_chunk' => 
  array (
    'name' => 'import_wrapper_chunk',
    'desc' => 'To import existing content, simply add to the resource manager url this parameter &autoImport',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.importWrapper_tpl',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'import_marker_chunk' => 
  array (
    'name' => 'import_marker_chunk',
    'desc' => 'To import existing content into Structures simply add this parameter to your resource url: &autoImport. import_marker_chunk will replace this MODX comment tag [[-STRUCTURES]] in your content. Please see your block_reel_chunk (st.snippets_base) for HTML guide',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.importMarker_tpl',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'help_howto_chunk' => 
  array (
    'name' => 'help_howto_chunk',
    'desc' => 'This chunk will show when there is no content in the resource. Can also be accessed via keyboard shrct. standByStructure, when it has value, will replace this chunk.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.help_howto',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
  ),
  'all_structures_chunk' => 
  array (
    'name' => 'all_structures_chunk',
    'desc' => 'Store all your predefined structures (blocks / HTML snippets). MODX tags will not be processed for good reasons.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'st.structures',
    'lexicon' => NULL,
    'area' => '2. Manager Chunks Used by Template',
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
  'sidebar_tab_title' => 
  array (
    'name' => 'sidebar_tab_title',
    'desc' => 'The tab title for Structures Tree. Set to hidden or empty to hide this panel. All your structures will still be available via shortcuts and dropdown menus.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'Structures',
    'lexicon' => NULL,
    'area' => '3. Tab Text',
  ),
  'content_tab_title' => 
  array (
    'name' => 'content_tab_title',
    'desc' => 'The tab title for resource content area. Set to hidden or empty to use default MODX content area.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => 'Content',
    'lexicon' => NULL,
    'area' => '3. Tab Text',
  ),
  'manager_js' => 
  array (
    'name' => 'manager_js',
    'desc' => 'Powered by tinyBlocks.js and TinyJSONGallery.js et al. Compile your own and even add other JS to tweak your resource. If MODX tags are not being processed, please enter correct value.',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/js/structures_all.min.js',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'manager_css' => 
  array (
    'name' => 'manager_css',
    'desc' => 'This CSS file is necessary for fundamental functionality. It is compressed from source',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/css/structures_all.min.css',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'donshakepeare_tinymce_js_plugins' => 
  array (
    'name' => 'donshakepeare_tinymce_js_plugins',
    'desc' => 'A compressed and preloaded pack of donshakepeare-beautifully-handcrafted TinyMCE plugins. No need to call said plugins in TinyMCE init. Compile yours from my github.com/donShakespeare',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/js/donshakespeare_plugins.min.js',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
  ),
  'TinyMCE_skin_url' => 
  array (
    'name' => 'TinyMCE_skin_url',
    'desc' => 'Skin used through out Structures... http://skin.tinymce.com/ Build your own here from scratch or edit an existing skin by drag\'n\'dropping the skin.json',
    'type' => 'textfield',
    'options' => 
    array (
    ),
    'value' => '[[++assets_url]]components/structures/tinymceskins/hamlet',
    'lexicon' => NULL,
    'area' => '4. Structures File Urls',
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
);

return $properties;

