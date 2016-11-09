<?php
if($input){
    $content = $input;
    $content = $modx->newObject('modChunk')->process(null, $content);
    if($options == "markdown"){
        if (!class_exists('\Michelf\Markdown')) {
            require_once MODX_ASSETS_PATH . 'components/structures/markdown/Michelf/Markdown.inc.php';
        }
        $content = \Michelf\Markdown::defaultTransform($content);
    }
    elseif($options == "parsedown"){
        require_once MODX_ASSETS_PATH . 'components/structures/markdown/parsedown/Parsedown.php';
        $Parsedown = new Parsedown();
        $content = $Parsedown->text($content);
    }
    elseif($options == "parsedownExtra"){
        require_once MODX_ASSETS_PATH . 'components/structures/markdown/parsedown/Parsedown.php';
        require_once MODX_ASSETS_PATH . 'components/structures/markdown/parsedown/ParsedownExtra.php';
        $ParsedownExtra = new ParsedownExtra();
        $content = $ParsedownExtra->text($content);
    }
    else{ //default state (switchd from Parsedown - quite blows things up - silly goose!!!)
        $options = "markdownE";
        if (!class_exists('\Michelf\MarkdownExtra')) {
            require_once MODX_ASSETS_PATH . 'components/structures/markdown/Michelf/MarkdownExtra.inc.php';
        }
        $content = \Michelf\MarkdownExtra::defaultTransform($content);
    }

    $patterns = array(  // highly rustic and silly, this method. Change to proper PHP HTMLdocument
        "/tb-nested-wrapper/",
        "/tb-nested-yes/",
        "/tb-nested-no/",
        "/tb-wrapper-tlb /",
        "/ tb-wrapper-tlb/",
        "/tb-wrapper-tlb/",
        "/tb-tiny-.. /",
        "/ tb-tiny-../",
        "/tb-tiny-../",
        "/tb-unwrap /",
        "/ tb-unwrap/"
    );
    $rep  = array(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    );
    $content = str_replace('[*[', '&#91;&#91;', $content);
    $content  = preg_replace($patterns, $rep, $content);
    return $content;
}