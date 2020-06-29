/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

import Configs from '/extlib/Configs.js';
import * as Constants from './constants.js';

export const configs = new Configs({
  confirmationMode: Constants.CONFIRMATION_MODE_ALWAYS,
  internalDomains: [],

  exceptionalDomainsHighlightMode: Constants.EXCEPTIONAL_HIGHLIGHT_MODE_ALWAYS,
  exceptionalDomainsConfirmationMode: Constants.EXCEPTIONAL_CONFIRMATION_MODE_ALWAYS,
  exceptionalDomains: [],
  exceptionalDomainsSource: Constants.SOURCE_CONFIG,
  exceptionalDomainsFile: '',

  exceptionalSuffixesConfirm: true,
  exceptionalSuffixes: [],
  exceptionalSuffixesSource: Constants.SOURCE_CONFIG,
  exceptionalSuffixesFile: '',

  confirmOnlyInternals: true,
  confirmMultipleRecipientDomains: false,
  minRecipientsCount: 0,
  overrideDelay: 0,
  overrideDelayTimes: 0,

  exceptionalDomainDialogTitle: '',
  exceptionalDomainDialogMessage: '',
  exceptionalSuffixDialogTitle: '',
  exceptionalSuffixDialogMessage: '',
  confirmMultipleRecipientDomainsDialogTitle: '',
  confirmMultipleRecipientDomainsDialogMessage: '',

  allowCheckAllInternalDomains: true,
  allowCheckAllOtherDomains: false,
  allowCheckAllFileNames: false,
  requireCheckSubject: false,
  requireCheckBody: false,
  requireReinputAttachmentNames: false,
  highlightUnmatchedDomains: false,
  largeFontSizeForAddresses: false,
  alwaysLargeDialog: false,
  alwaysLargeDialogMinWidth: 680,
  emphasizeTopMessage: false,
  topMessage: '',
  emphasizeRecipientType: false,

  showCountdown: false,
  countdownTime: 5,
  countdownAllowSkip: true,

  configsVersion: 0,
  debug: false
}, {
  localKeys: [
    'configsVersion',
    'debug'
  ]
});