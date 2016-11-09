<?php
/**
 * snippets transport file for Structures extra
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
/* @var xPDOObject[] $snippets */


$snippets = array();

$snippets[1] = $modx->newObject('modSnippet');
$snippets[1]->fromArray(array (
  'id' => 1,
  'property_preprocess' => false,
  'name' => 'Structures',
  'description' => 'Used to parse Markdown, and to perform other cosmetic cleanups. Usage [[*content:Structures]]... It can take these options :Structures=markdown or :Structures=markdownE(default) or :Structures=parsedown or :Structures=parsedownE',
  'properties' => 
  array (
  ),
), '', true, true);
$snippets[1]->setContent(file_get_contents($sources['source_core'] . '/elements/snippets/structures.snippet.php'));

return $snippets;
