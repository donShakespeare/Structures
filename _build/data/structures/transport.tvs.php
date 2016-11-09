<?php
/**
 * templateVars transport file for Structures extra
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
/* @var xPDOObject[] $templateVars */


$templateVars = array();

$templateVars[1] = $modx->newObject('modTemplateVar');
$templateVars[1]->fromArray(array (
  'id' => 1,
  'property_preprocess' => false,
  'type' => 'hidden',
  'name' => 'Structures',
  'caption' => 'StructuresCMR',
  'description' => 'Structures Plugin fires on OnDocFormPrerender and only when said Resource has a MODX Template attached to this hidden TV.',
  'elements' => '',
  'rank' => 0,
  'display' => 'default',
  'default_text' => '',
  'properties' => 
  array (
  ),
  'input_properties' => 
  array (
    'allowBlank' => 'true',
  ),
  'output_properties' => 
  array (
  ),
), '', true, true);
return $templateVars;
