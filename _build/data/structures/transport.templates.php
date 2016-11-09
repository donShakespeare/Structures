<?php
/**
 * templates transport file for Structures extra
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
/* @var xPDOObject[] $templates */


$templates = array();

$templates[1] = $modx->newObject('modTemplate');
$templates[1]->fromArray(array (
  'id' => 1,
  'property_preprocess' => true,
  'templatename' => 'Structures',
  'description' => 'To use your own template, attach the Structures TV to your template. Load this template\'s default properties into yours directly or via psets and voila! OR, just duplicate this template. Done! Remember, you can use a property set as well.',
  'icon' => 'icon-th',
  'template_type' => 0,
), '', true, true);
$templates[1]->setContent(file_get_contents($sources['source_core'] . '/elements/templates/structures.template.html'));


$properties = include $sources['data'].'properties/properties.structures.template.php';
$templates[1]->setProperties($properties);
unset($properties);

return $templates;
