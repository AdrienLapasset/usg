<?php

# require helpers class so we can use rglob
require_once './app/helpers.inc.php';
# include any php files which sit in the app folder
foreach(Helpers::rglob('./app/**.inc.php') as $include) include_once $include;

# in PHP/5.3.0 they added a requisite for setting a default timezone, this should be handled via the php.ini, but as we cannot rely on this, we have to set a default timezone ourselves
if(function_exists('date_default_timezone_set')) date_default_timezone_set('Australia/Melbourne');

# Overwrite the request URI as it comes through incorrectly as a call to this page
$_SERVER['REQUEST_URI'] = '';

preg_match('/http:\/\/[^\/]+\/(.*)\/$/', $_SERVER['HTTP_REFERER'], $matches);
$route = isset($matches[1]) ? $matches[1] : 'index';
$file_path = Helpers::url_to_file_path($route);
$page = new Page($route);

# return a 404 if a matching folder doesn't exist
if(!file_exists($file_path)) throw new Exception('404');

# register global for the path to the page which is currently being viewed
global $current_page_file_path;
$current_page_file_path = $file_path;

# create new page object
$page = new Page($route);


echo TemplateParser::parse($page->data, file_get_contents('.'.str_replace('_html', '.html', key($_GET))));


?>