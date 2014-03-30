/*  Copyright 2013, 2014 Peter Kehl
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";
// Following is a namespace-like object in the global scope.
var Drupal= {};

(function() {
    // @TODO Doc
    // I suggest that you load this file via SeLite Bootstrap (Selenium IDE > Options > Options > SeLite Bootstrap > Selenium Core extension).
    // If you don't, but you load this file as a Core extension file
    // via Selenium IDE > Options > Options > 'Selenium Core extensions' instead, then
    // you need to uncomment the following statements, along with the enclosing part of if(..)

    // Components.utils.import( 'chrome://selite-misc/content/SeLiteMisc.js' );
    // var loadedOddTimes= SeLiteMisc.nonXpiCoreExtensionsLoadedOddTimes['doDrupalUsers'] || false;
    // if( loadedOddTimes ) { // Ignore the first load, because Se IDE somehow discards that Selenium.prototype

    // Do not pre-load any data here. SeLiteData.getStorageFromSettings() doesn't connect to SQLite,
    // until you open/save a test suite. That's because it needs to know the test suite folder
    // in order to resolve Settings field here. Test suite folder is not known when this is loaded,
    // however SeLiteData.getStorageFromSettings() sets a handler via SeLiteSettings.addTestSuiteFolderChangeHandler().
    // Once you open/save a test suite, storage object will get updated automatically and it will open an SQLite connection.
        var console= Components.utils.import("resource://gre/modules/devtools/Console.jsm", {}).console;
        
        var commonSettings= SeLiteSettings.loadFromJavascript( 'extensions.selite-settings.common' );
        commonSettings.getField( 'roles' ).addKeys( ['admin', 'editor', 'contributor'] );
        
        SeLiteSettings.setTestDbKeeper( 
            new SeLiteSettings.TestDbKeeper.Columns( {
                users: {
                    key: 'name',
                    columns: ['name', 'pass']
                }
            })
        );

        var storage= SeLiteData.getStorageFromSettings();
        var db= new SeLiteData.Db( storage );

        Drupal.tables= {};
        
        Drupal.tables.users= new SeLiteData.Table( {
           db:  db,
           name: 'users',
           columns: ['uid', 'name'/*login*/, 'pass', 'mail', 'theme', 'signature', 'signature_format',
               'created', 'access', 'login', // timestamps in seconds since Epoch
               'status', 'timezone', 'language', 'picture', 'init', 'data'
           ],
           primary: 'uid' // However, for purpose of matching users I usually use name
        });
        
        Drupal.formulas= {};
        Drupal.formulas.users= new SeLiteData.RecordSetFormula( {
            table: Drupal.tables.users,
            columns: new SeLiteData.Settable().set( Drupal.tables.users.name/* same as 'users'*/, SeLiteData.RecordSetFormula.ALL_FIELDS )
        });

        Drupal.tables.node= new SeLiteData.Table( {
           db:  db,
           name: 'node',
           columns: ['nid', 'vid', 'type', 'language', 'title', 'uid', 'status',
               'created', 'changed',
               'comment', 'promote', 'sticky', 'tnid', 'translate'
           ],
           primary: 'nid'
        });
        
        Drupal.tables.field_data_body= new SeLiteData.Table( {
            db: db,
            name: 'field_data_body',
            columns: ['entity_type', 'bundle', 'deleted', 'entity_id', 'revision_id', 'language', 'delta', 'body_value', 'body_sumary', 'body_format'],
            primary: '@TODO group of columns'
        });
        
        // Can't use: return selenium.browserbot.getCurrentWindow().location.href
        // - it's only available when implementing Selenese
        /** Get node ID of the current page, if applicable.
         *  @param {Window} window It must be passed from your test case.
         *  @return {(number|null)} ID of the node, or null.
         * */
        Drupal.currentPageNodeId= function currentPageNodeId(window) {
            var href= window.location.href;
            var match= href.match( /\/?q=node\/([0-9]+)/ );
            if( match ) {
                return match[1];
            }
            return null;
        };
    // }
    // SeLiteMisc.nonXpiCoreExtensionsLoadedOddTimes['doDrupalUsers']= !loadedOddTimes;
})();