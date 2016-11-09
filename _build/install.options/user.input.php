<?php

/**
 * Script to interact with user during Structures package install
 *
 * Copyright 2016 by donShakespeare,treigh 
 * Created on 09-07-2016
 *
 * Structures is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * Structures is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Structures; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package structures
 */

/**
 * Description: Script to interact with user during Structures package install
 * @package structures
 * @subpackage build
 */

/* The return value from this script should be an HTML form (minus the
 * <form> tags and submit button) in a single string.
 *
 * The form will be shown to the user during install
 *
 * This example presents an HTML form to the user with two input fields
 * (you can have as many as you like).
 *
 * The user's entries in the form's input field(s) will be available
 * in any php resolvers with $modx->getOption('field_name', $options, 'default_value').
 *
 * You can use the value(s) to set system settings, snippet properties,
 * chunk content, etc. based on the user's preferences.
 *
 * One common use is to use a checkbox and ask the
 * user if they would like to install a resource for your
 * component (usually used only on install, not upgrade).
 */

/* This is an example. Modify it to meet your needs.
 * The user's input would be available in a resolver like this:
 *
 * $changeSiteName = (! empty($modx->getOption('change_sitename', $options, ''));
 * $siteName = $modx->getOption('sitename', $options, '').
 *
 * */

$output = '<h4 style="text-align: center;">Structures<br /><br /> <span style="display: block; font-size: 12px;">You are about to redefine the way you handle content in MODX<br /><br /></span></h4>
<hr />
<h4>1. Create a new resource and attach Structures Template to it</h4>
<br />
<h4>2. Or use your own Template: duplicate Structures Template so that you have all the Template Default properties</h4>
<br />
<h4>3. If you already have your own Template, simply attach Structures hidden TV to it, and create a PropertySet anywhere in MODX. Done!</h4>
<br>
<h4>4. If you use RichText, don\'t forget to configure the editor first. Or just stick with Markdown :)</h4>
<br>
<h4>5. Use <a href="https://modx.com/extras/package/exportelementproperties" target="_blank">ExportElementProperties</a> to better handle your properties</h4>
<br>
<h4>Visit Structures <a href="https://github.com/donShakespeare/Structures/" target="_blank">on Github</a></h4>
';

return $output;