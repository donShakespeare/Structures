<?php
/**
 * templates transport file for Structures extra
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
/* @var xPDOObject[] $templates */


$templates = array();

$templates[1] = $modx->newObject('modTemplate');
$templates[1]->fromArray(array (
  'id' => 1,
  'property_preprocess' => true,
  'templatename' => 'Structures-Slate',
  'description' => 'Lord Slate is a powerful and responsive documentation template adapted for MODX. To use your own template, attach the StructuresCMR TV to your template. Load this template\'s default properties into yours and voila! OR, just duplicate this template. Done!',
  'icon' => 'icon-th',
  'template_type' => 0,
), '', true, true);
$templates[1]->setContent(file_get_contents(MODX_BASE_PATH . 'assets/components/structures/themes/slate/template.html'));


$properties = include $sources['data'].'properties/properties.structures-slate.template.php';
$templates[1]->setProperties($properties);
unset($properties);

$templates[2] = $modx->newObject('modTemplate');
$templates[2]->fromArray(array (
  'id' => 2,
  'property_preprocess' => true,
  'templatename' => 'Structures-Lector',
  'description' => 'A responsive two-column documentation template for Structures. To use your own template, attach the StructuresCMR TV to your template. Load the default properties of Lector into yours and voila! OR, just duplicate this template. Done!',
  'icon' => 'icon-th',
  'template_type' => 0,
), '', true, true);
$templates[2]->setContent(file_get_contents($sources['source_core'] . '/elements/templates/structures-lector.template.html'));


$properties = include $sources['data'].'properties/properties.structures-lector.template.php';
$templates[2]->setProperties($properties);
unset($properties);

return $templates;
