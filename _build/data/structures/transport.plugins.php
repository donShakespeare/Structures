<?php
/**
 * plugins transport file for Structures extra
 *
 * Copyright 2016 by donShakespeare 
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
/* @var xPDOObject[] $plugins */


$plugins = array();

$plugins[1] = $modx->newObject('modPlugin');
$plugins[1]->fromArray(array (
  'id' => 1,
  'property_preprocess' => false,
  'name' => 'Structures',
  'description' => 'Structures Plugin fires on OnDocFormPrerender and only when said Resource has a MODX Template attached to $tvForCMRspecificity in this case "Structures" TV',
  'properties' => 
  array (
  ),
  'disabled' => false,
), '', true, true);
$plugins[1]->setContent(file_get_contents($sources['source_core'] . '/elements/plugins/structures.plugin.php'));

return $plugins;
