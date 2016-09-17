<?php
/**
 * chunks transport file for Structures extra
 *
 * Copyright 2016 by donShakespeare,treigh 
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
  'name' => 'st.lector_importWrapper_tpl',
  'description' => 'Template used by Structures to wrap content that has MODX comment tag, [[-TB-MARKER]]. Use the import tool or use Manager resource url parameter &autoImport. This chunk is sample using the  Markdown block/structure.',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[1]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.lector_importwrapper_tpl.chunk.html'));

$chunks[2] = $modx->newObject('modChunk');
$chunks[2]->fromArray(array (
  'id' => 2,
  'property_preprocess' => false,
  'name' => 'st.lector_structures',
  'description' => 'New blocks and their respective triggers for your content. To hide this panel in sidebar, give it the name: hidden, in the Template Properties, sidebar_tab_title',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[2]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.lector_structures.chunk.html'));

$chunks[3] = $modx->newObject('modChunk');
$chunks[3]->fromArray(array (
  'id' => 3,
  'property_preprocess' => false,
  'name' => 'st.lector_importMarker_tpl',
  'description' => 'Structures uses this template to break content into blocks/structures. Existing Content must have MODX comment tag [[-TB-MARKER]] to use the import tool or to use Manager resource url this parameter &autoImport',
  'properties' => 
  array (
  ),
), '', true, true);
$chunks[3]->setContent(file_get_contents($sources['source_core'] . '/elements/chunks/st.lector_importmarker_tpl.chunk.html'));

return $chunks;
