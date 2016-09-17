<?php
/**
 * chunks transport file for Structures extra
 *
 * Copyright 2016 by donShakespeare,treigh 
 * Created on 09-07-2016
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
  'name' => 'st.lector_snippets_base',
  'description' => 'If you are not using pureContent, then you\'ll need to wrap your content with any markup. Classname tb-wrapper-tlb must be applied to the top-level-block; and tb-tiny-md or whatever you have setup in your editor chunk: st.lector_tinymce_config',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[1]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.lector_snippets_base.chunk.html'));

$chunks[2] = $modx->newObject('modChunk');
$chunks[2]->fromArray(array (
  'id' => 2,
  'property_preprocess' => false,
  'name' => 'st.ace_mirror_config',
  'description' => 'Editor settings for Ace or CodeMirror(coming soon)',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[2]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.ace_mirror_config.chunk.html'));

$chunks[3] = $modx->newObject('modChunk');
$chunks[3]->fromArray(array (
  'id' => 3,
  'property_preprocess' => false,
  'name' => 'st.help_howto',
  'description' => 'Info that goes into modal triggered by Structures Help button',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[3]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.help_howto.chunk.html'));

$chunks[4] = $modx->newObject('modChunk');
$chunks[4]->fromArray(array (
  'id' => 4,
  'property_preprocess' => false,
  'name' => 'st.lector_importWrapper_tpl',
  'description' => 'Template used by Structures to wrap content that has MODX comment tag, [[-TB-MARKER]]. Use the import tool or use Manager resource url parameter &autoImport. This chunk is sample using the  Markdown block/structure.',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[4]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.lector_importwrapper_tpl.chunk.html'));

$chunks[5] = $modx->newObject('modChunk');
$chunks[5]->fromArray(array (
  'id' => 5,
  'property_preprocess' => false,
  'name' => 'st.lector_snippets_launcher',
  'description' => 'Tree buttons used to insert new blocks/structures into your content from st.lector_snippets_base',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[5]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.lector_snippets_launcher.chunk.html'));

$chunks[6] = $modx->newObject('modChunk');
$chunks[6]->fromArray(array (
  'id' => 6,
  'property_preprocess' => false,
  'name' => 'st.lector_importMarker_tpl',
  'description' => 'Structures uses this template to break content into blocks/structures. Existing Content must have MODX comment tag [[-TB-MARKER]] to use the import tool or to use Manager resource url this parameter &autoImport',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[6]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.lector_importmarker_tpl.chunk.html'));

$chunks[7] = $modx->newObject('modChunk');
$chunks[7]->fromArray(array (
  'id' => 7,
  'property_preprocess' => false,
  'name' => 'st.tinymce_config',
  'description' => 'Editor settings: Without this chunk no editing is possible.',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[7]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.tinymce_config.chunk.html'));

$chunks[8] = $modx->newObject('modChunk');
$chunks[8]->fromArray(array (
  'id' => 8,
  'property_preprocess' => false,
  'name' => 'st.wrapper_tpl',
  'description' => 'Wrapper to set the environment of Structures in the Manager',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[8]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.wrapper_tpl.chunk.html'));

$chunks[9] = $modx->newObject('modChunk');
$chunks[9]->fromArray(array (
  'id' => 9,
  'property_preprocess' => false,
  'name' => 'st.slate_snippets_launcher',
  'description' => 'Tree buttons used to insert new blocks/structures into your content from st.snippets_base',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[9]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.slate_snippets_launcher.chunk.html'));

$chunks[10] = $modx->newObject('modChunk');
$chunks[10]->fromArray(array (
  'id' => 10,
  'property_preprocess' => false,
  'name' => 'st.save_buttons',
  'description' => 'Buttons that appear next to MODX Save/Duplicate buttons',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[10]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.save_buttons.chunk.html'));

$chunks[11] = $modx->newObject('modChunk');
$chunks[11]->fromArray(array (
  'id' => 11,
  'property_preprocess' => false,
  'name' => 'st.slate_snippets_base',
  'description' => 'If you are not using pureContent, then you\'ll need to wrap your content with any markup. Classname tb-wrapper-tlb must be applied to the top-level-block; and tb-tiny-md or whatever you have setup in your editor chunk: st.tinymce_config',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[11]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.slate_snippets_base.chunk.html'));

$chunks[12] = $modx->newObject('modChunk');
$chunks[12]->fromArray(array (
  'id' => 12,
  'property_preprocess' => false,
  'name' => 'st.slate_importWrapper_tpl',
  'description' => 'Template used by Structures to wrap content that has MODX comment tag, [[-TB-MARKER]]. Use the import tool or use Manager resource url parameter &autoImport. This chunk is sample using the  Markdown block/structure.',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[12]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.slate_importwrapper_tpl.chunk.html'));

$chunks[13] = $modx->newObject('modChunk');
$chunks[13]->fromArray(array (
  'id' => 13,
  'property_preprocess' => false,
  'name' => 'st.slate_importMarker_tpl',
  'description' => 'Structures uses this template to break content into blocks/structures. Existing Content must have MODX comment tag [[-TB-MARKER]] to use the import tool or to use Manager resource url this parameter &autoImport',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[13]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.slate_importmarker_tpl.chunk.html'));

return $chunks;
