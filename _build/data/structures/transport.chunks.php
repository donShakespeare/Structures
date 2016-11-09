<?php
/**
 * chunks transport file for Structures extra
 *
 * Copyright 2016 by donShakespeare 
 * Created on 09-08-2016
 *
 * @package structures
 * @subpackage build
 */

if (! function_exists('stripPhpTags')) {
    function stripPhpTags($filename) {
        $o = file_get_contents($filename);
        $o = str_replace('<' . '?' . 'php', '', $o);
        $o = str_replace('?>', '', $o);
        $o = trim($o);
        return $o;
    }
}
/* @var $modx modX */
/* @var $sources array */
/* @var xPDOObject[] $chunks */


$chunks = array();

$chunks[1] = $modx->newObject('modChunk');
$chunks[1]->fromArray(array (
  'id' => 1,
  'property_preprocess' => false,
  'name' => 'st.ace_mirror_config',
  'description' => 'Editor settings for Ace or CodeMirror(coming soon)',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[1]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.ace_mirror_config.chunk.html'));

$chunks[2] = $modx->newObject('modChunk');
$chunks[2]->fromArray(array (
  'id' => 2,
  'property_preprocess' => false,
  'name' => 'st.help_howto',
  'description' => 'Info that goes into modal triggered by Structures Help button',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[2]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.help_howto.chunk.html'));

$chunks[3] = $modx->newObject('modChunk');
$chunks[3]->fromArray(array (
  'id' => 3,
  'property_preprocess' => false,
  'name' => 'st.tinymce_config',
  'description' => 'Editor settings: Without this chunk no editing is possible.',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[3]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.tinymce_config.chunk.html'));

$chunks[4] = $modx->newObject('modChunk');
$chunks[4]->fromArray(array (
  'id' => 4,
  'property_preprocess' => false,
  'name' => 'st.save_buttons',
  'description' => 'Buttons that appear next to MODX Save/Duplicate buttons',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[4]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.save_buttons.chunk.html'));

$chunks[5] = $modx->newObject('modChunk');
$chunks[5]->fromArray(array (
  'id' => 5,
  'property_preprocess' => false,
  'name' => 'st.importWrapper_tpl',
  'description' => 'Template used by Structures to wrap content that has MODX comment tag, [[-STRUCTURES]]. Use the import tool or use Manager resource url parameter &autoImport. This chunk is sample using the  Markdown block/structure.',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[5]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.importwrapper_tpl.chunk.html'));

$chunks[6] = $modx->newObject('modChunk');
$chunks[6]->fromArray(array (
  'id' => 6,
  'property_preprocess' => false,
  'name' => 'st.importMarker_tpl',
  'description' => 'Structures uses this template to break content into blocks/structures. Existing Content must have MODX comment tag [[-STRUCTURES]] to use the import tool or to use Manager resource url this parameter &autoImport',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[6]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.importmarker_tpl.chunk.html'));

$chunks[7] = $modx->newObject('modChunk');
$chunks[7]->fromArray(array (
  'id' => 7,
  'property_preprocess' => false,
  'name' => 'st.structures',
  'description' => 'New blocks and their respective triggers for your content. To hide this panel in sidebar, give it the name: hidden, in the Template Properties, sidebar_tab_title',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[7]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.structures.chunk.html'));

return $chunks;
