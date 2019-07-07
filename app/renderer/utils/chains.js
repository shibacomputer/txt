/* Common event pathways for Txt.
 */

module.exports = {
  documentNew: [
    { name: 'event:check', modifier: { name: 'askToSave', args: { editorHasChanges: true } } },
    { name: 'doc:new' }
  ],

  documentOpen: [
    { name: 'event:dialog:show', modal: { type: 'open' } },
    { name: 'event:check', modifier: { name: 'askToSave', args: { editorHasChanges: true } } },
    { name: 'doc:read' },
    { name: 'doc:update'}
  ],

  documentSaveChanges: [
    { name: 'event:check', modifier: { name: 'askForSavePath',  args: { documentHasPath: false } } },
    { name: 'doc:write' }
  ],

  documentRevert: [
    { name: 'event:dialog:show', modal: { type: 'willRevert', strings: [ 'doc.title'] } },
    { name: 'doc:revert' }
  ],

  documentSaveChangesAsNew: [
    { name: 'event:dialog:show', modal: { type: 'saveNew' } },
    { name: 'doc:write' }
  ],

  // TODO Better events thing
  authorGenerateNew: [
    { name: 'author:create' },
    { name: 'event:check', modifier: { name: 'keychainStorePassphrase',  args: { usesKeychain: true } } },
    { name: 'author:save' },
    { name: 'author:load' }
  ],

  keychainStorePassphrase: [
    { name: 'author:save:passphrase' }
  ],

  authorExport: [
    { name: 'event:dialog:show', modal: { type: 'authorExport', strings: [ 'author.name' ] } },
    { name: 'author:export' }
  ],

  authorImport: [
    { name: 'event:dialog:show', modal: { type: 'authorImport' } },
    { name: 'author:read' },
    { name: 'author:save' },
    { name: 'author:load' }
  ],

  askToDeleteAuthor: [
    { name: 'event:dialog:show', modal: { type: 'askToDeleteAuthor', strings: [ 'author.name' ] } },
    { name: 'author:delete' }
  ],

  deleteAuthor: [
    { name: 'author:delete' }
  ],

  windowClose: [
    { name: 'event:check', modifier: { name: 'askToSave', args: { editorHasChanges: true } } },
    { name: 'event:window:close' }
  ],

  askToSave: [
    { name: 'event:dialog:show', modal: { type: 'hasChanges', strings: [ 'doc.title' ] }, modifier: { name: 'documentSaveChanges' } }
  ],

  askForSavePath: [
    { name: 'event:dialog:show', modal: { type: 'saveNew' } }
  ],

  modalShowPreferences: [
    { name: 'event:dialog:show', modal: { type: 'modal', resource: 'prefs' } }
  ],

  modalClosePreferences: [
    { name: 'event:check', modifier: { name: 'failPassphraseCheck', args: {  canUnlock: false } } },
    { name: 'event:check', modifier: { name: 'hasPreferenceChange', args: { preferencesHaveChanges: true } } },
    { name: 'event:dialog:close' }
  ]
}
